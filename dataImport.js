/* Function to import data from "Data_Infovis.xlsx - VerbraucherDaten.csv" and "7-Tages-Inzidenz.csv".
To be called with function or array of functions that take result of dataimport as argument
e.g.: importProductData([function1, function2])
where function1(data) and function2(data) are signatures of functions.
Result will have format {Landname1: {Produktname1: [{productvalue: Produkt-Wert, time: Zeitstempel Mittwoch, KW: Kalenderwoche "KWX", incidencevalue: Inzidenzwert},
{...}, ...], Produktname2: [...]}, Landname2: {...}}
This data can be used directly for the Spiderplot. For the scatterplot, call prepareDataForScatterplot(data) on result afterwards.
*/
function importData(targetFunctionArray){
    d3.text("https://raw.githubusercontent.com/Danielle-Schuman/InfoVis-Hamsterkaeufe-unter-der-Lupe/main/Data_Infovis.xlsx%20-%20VerbraucherDaten.csv")
        .then(function(productData){
            d3.text("https://raw.githubusercontent.com/Danielle-Schuman/InfoVis-Hamsterkaeufe-unter-der-Lupe/main/7-Tages-Inzidenz.csv")
                .then(function(incidenceData) {
                    // bring productData into nice object format
                    var result = parseProductData(productData);
                    //add incidenceData to result
                    result = parseIncidenceData(incidenceData, result);
                    // if targetfunction(s) are defined, pass result (i.e. object with all data) to targetfunction(s),
                    // display error message in console otherwise
                    returnResult(targetFunctionArray, result);
                });
        });
}

/* Function that parses data from "Data_Infovis.xlsx - VerbraucherDaten.csv"
into format {Landname1: {Produktname1: [{productvalue: Produkt-Wert, canDeviateFromActualValue: true / false,
time: Zeitstempel Mittwoch, KW: Kalenderwoche "KWX", incidencevalue: Inzidenz-Wert}, {...}, ...], Produktname2: [...]}, Landname2: {...}}
*/
function parseProductData(data){
    var array = d3.csvParseRows(data); // array with unparsed data from csv
    var result = {}; // result of dataimport
    // Target-Format: {Landname1: {Produktname1: [{productvalue: Produkt-Wert, canDeviateFromActualValue: true / false, time: Zeitstempel Mittwoch, KW: Kalenderwoche "KWX"}, ...], Produktname2: [...]}, Landname2: {...}}
    var lastCountry = null; // country for which data is currently being collected
    var row = null; // row of csv-array currently being parsed
    var label = null; // first column of csv-row
    var dates = []; // dates of wednesdays, where we have weekly data
    var weeks = []; // calender weeks KWX
    var i = 0; //counting variable for for-loop
    var sumValues = 0; // sum of values of a week for averaging
    var average = 0; // average of weekly data
    var valueBefore = 0; // value before missing values in array
    var iBefore = 0; // position of valueBefore in array
    var valueMissing = []; // array to store which values were missing
    var anyValuesMissing = false; // used to determine if any values in a certain week a missing

    //loop over unparsed data to parse it
    for (var rowNr = 0; rowNr < array.length; rowNr++) {
        row = array[rowNr];
        label = row[0];
        if (label === "") { // row is empty or contains weeks / dates
            if(row[1].includes("KW")){ // contains weeks
                if (!weeks.length) { // if array "dates" is empty
                    // load dates of wednesdays into array "dates"
                    for (var weekNr = 1; weekNr < row.length; weekNr = weekNr + 7) {
                        weeks[i] = row[weekNr];
                        i++;
                    }
                    i = 0;
                }
            } else if (row[1].includes("20")) { // contains dates
                if (!dates.length) { // if array "dates" is empty
                    // load dates of wednesdays into array "dates"
                    for (var dateNr = 3; dateNr < row.length; dateNr = dateNr + 7) {
                        dates[i] = new Date(row[dateNr]);
                        i++;
                    }
                    i = 0;
                }
            } // else: is empty
        } else if (label.includes("Tag")) { // row contains daily data
            // Take name of product (without "Tag")
            label = label.split(" ")[0];
            // Enter data of product averaged by week along with respective weekly timestamps
            // into result as array of objects
            result[lastCountry][label] = [];
            if (dates.length && weeks.length) {
                // for first week, we always only have 5 datapoints, because year starts on wednesday
                // we do not have missing datapoints in this part
                // calculate average
                sumValues = 0; // make sure this is zero, and does not contain data from older rows
                for(var nFirstWeek = 3; nFirstWeek < 8; nFirstWeek++){
                    sumValues += parseFloat(row[nFirstWeek].replace(",", "."));
                }
                average = sumValues / 5;
                // enter data into result
                result[lastCountry][label][0] = {
                    'productvalue': average,
                    'canDeviateFromActualValue': true,
                    'time': dates[0],
                    'KW': weeks[0]
                };
                // for the rest of the dataset
                // here we sometimes have missing datapoints -> linear interpolation
                // (apart from last week, which always contains all datapoints)
                // step 1: cast all values to float and replace all missing values using linear interpolation
                // in the rest of the row
                i = 8; // position in row
                valueMissing = []; // array to store which values were missing (emptied in case it still contains data from older rows
                while(i < row.length) {
                    while (i < row.length && !(row[i] === "")) {
                        if(!(typeof row[i] === 'number')) {
                            row[i] = parseFloat(row[i].replace(",", "."));
                        }
                        i++;
                        valueMissing.push(false);
                    }
                    if (row[i] === "") { // row is empty, i is still < row.length
                        valueBefore = row[i - 1]; // value before missing values
                        iBefore = i - 1; // position with last non-missing value
                        while (row[i] === "") {
                            i++;
                            valueMissing.push(true);
                        }
                        // cast value after missing values to float, i is now the position of the first non-missing value
                        row[i] = parseFloat(row[i].replace(",", "."));
                        for (var missingValue = iBefore + 1; missingValue < i; missingValue++) {
                            // linear interpolation, as found at https://de.wikipedia.org/wiki/Interpolation_%28Mathematik%29
                            row[missingValue] = (valueBefore * ((i - missingValue) / (i - iBefore))) + (row[i] * ((missingValue - iBefore) / (i - iBefore)));
                        }
                    }
                }
                // step 2: Calculate the average product-data-value in a week, as well as if there are missing values
                // in this week, and enter all the data into the result-object
                i = 8; // position in row, reset
                while(i < row.length){
                    // calculate average for every week and determine whether this week contained any missing values
                    sumValues = 0; // reset sum for calculating average
                    anyValuesMissing = false;
                    for (var n = 0; n < 7; n++) {
                        sumValues += row[i];
                        anyValuesMissing = anyValuesMissing || valueMissing [i - 8];
                        i += 1;
                    }
                    average = sumValues / 7;
                    // enter data into result
                    result[lastCountry][label][((i-8)/7)] = {
                        'productvalue': average,
                        'canDeviateFromActualValue': anyValuesMissing,
                        'time': dates[((i-8)/7)],
                        'KW': weeks[((i-8)/7)]
                    };
                }
            }
        } else if (!label.includes("Woche")) { // row contains name of land
            // remember name of country
            lastCountry = label;
            // make entry for country in result
            result[lastCountry] = {};
        }
    }
    return result;
}

/* Function that parses data from "7-Tages-Inzidenz.csv" by taking resultDataStructure of format
 {Landname1: {Produktname1: [{productvalue: Produkt-Wert, canDeviateFromActualValue: true / false, time: Zeitstempel Mittwoch, KW: Kalenderwoche "KWX"},
{...}, ...], Produktname2: [...]}, Landname2: {...}}
and adding the data to create target-format
{Landname1: {Produktname1: [{productvalue: Produkt-Wert, canDeviateFromActualValue: true / false, time: Zeitstempel Mittwoch, KW: Kalenderwoche "KWX", incidencevalue: Inzidenz-Wert},
{...}, ...], Produktname2: [...]}, Landname2: {...}}
*/
function parseIncidenceData(data, resultDataStructure){
    var array = d3.dsvFormat(";").parseRows(data); // array with unparsed data from csv
    var row = null; // row of csv-array currently being parsed
    var labelCountry = null; // first column of csv-row that contains country
    var country = null; // representation of country in resultDataStructure
    //loop over unparsed data to parse it
    for(var rowNr = 1; rowNr < array.length; rowNr++){
        row = array[rowNr];
        labelCountry = row[0];
        country = resultDataStructure[labelCountry]
        for(var product in country){
            for(var i = 0; i < country[product].length; i++){
                // add incidencevalue of the country in this week to every product of the country
                country[product][i]['incidencevalue'] = parseFloat(row[i+1]);
            }
        }
    }
    return resultDataStructure;
}


/* If targetfunction(s) are defined, pass result (i.e. object with productdata to targetfunction(s),
display error message in console otherwise */
function returnResult(targetFunctionArray, result){
    if (!(typeof targetFunctionArray === 'undefined')) {
        if (typeof targetFunctionArray === 'object') {
            for (var func = 0; func < targetFunctionArray.length; func++) {
                targetFunctionArray[func](result);
            }
        } else if (typeof targetFunctionArray === 'function') {
            targetFunctionArray(result);
        } else {
            console.log("Type of targetFunctionArray not recognised! Please specify function or array of functions as argument to importProductData().")
        }
    } else {
        console.log("targetFunctionArray undefined! Please specify array with targetFunction(s) as argument to importProductData().")
    }
}

/* Function that takes data of the format
{Landname1: {Produktname1: [{productvalue: Produkt-Wert, canDeviateFromActualValue: true / false, time: Zeitstempel Mittwoch, KW: Kalenderwoche "KWX", incidencevalue: Inzidenzwert},
{...}, ...], Produktname2: [...]}, Landname2: {...}}
(i.e. the format from importdata) and calculates an average of the productvalues for all products of one country
and whether there is a possibility of deviation from actual data in one week, returning resulting data in the format
{Landname1: [{productvalueAverage: Durchschnitt Produkt-Werte, canDeviateFromActualValue: true / false over all products, time: Zeitstempel Mittwoch, KW: Kalenderwoche "KWX", incidencevalue: Inzidenzwert},
    {...}, ...], Landname2: [...], ...}
*/
function prepareDataForScatterplot(data){
    var arrayForThisWeek = []; // "container" array to collect all different productvalues for one week
    var deviationsForThisWeek = []; // "container" array to collect all different possible deviations from actual value for one week
    var amountOfWeeks = 53; // amount of calender weeks in our data
    var result = {}; // new data-object to be returned
    var sum = 0; // "container" for calculating sum of arrayForThisWeek
    var average = 0; // "container" for calculating average of arrayForThisWeek
    var anyDeviation = false; // "container" for checking whether any item of deviationsForThisWeek is true
    // loop over countries in data
    for(var country in data){
        // create an array for each country
        result[country] = []
        // loop over weeks
        for(var weekNr = 0; weekNr < amountOfWeeks; weekNr++){
            // put all the productvalues of all products for this country and week in the arrayForThisWeek
            for(var product in data[country]){
                arrayForThisWeek.push(data[country][product][weekNr]['productvalue']);
                deviationsForThisWeek.push(data[country][product][weekNr]['canDeviateFromActualValue']);
            }
            // calculate the average of all values in the arrayForThisWeek
            // and whether any item in deviationsForThisWeek is true
            for(var i = 0; i < arrayForThisWeek.length; i++){ // deviationsForThisWeek has same length as arrayForThisWeek
                sum += arrayForThisWeek[i];
                anyDeviation = anyDeviation || deviationsForThisWeek[i];
            }
            average = sum / arrayForThisWeek.length;
            // enter this, along with the other values that are the same for all products,
            // into the result at the position for this country and week
            result[country][weekNr] = {
                'productvalueAverage': average,
                'canDeviateFromActualValue': anyDeviation,
                'time': Object.values(data[country])[0][weekNr]['time'],
                'KW': Object.values(data[country])[0][weekNr]['KW'],
                'incidencevalue': Object.values(data[country])[0][weekNr]['incidencevalue']
            }
            // reset the "container" variables in order to use them for the next week
            arrayForThisWeek = [];
            sum = 0;
            average = 0;
            deviationsForThisWeek = [];
            anyDeviation = false;
        }
    }
    return result;
}