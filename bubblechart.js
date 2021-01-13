var bubbleData = [];
var globalBubbleX, globalBubbleY;

function drawBubbleChart(importedData){

var margin = {top: 10, right: 20, bottom: 70, left: 70},
    screenWidth = window.innerWidth,
    screenHeight = window.innerHeight,
    width = 0.66*screenWidth - margin.left - margin.right,
    height = 0.6*screenHeight - margin.top - margin.bottom;
    innerwidth = width - margin.left -margin.right;
    innerheight = height - margin.top + 10;

    var svg = d3.select("#bubble-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //Hintergrund
    var background= svg.append("rect")
        .attr("id","backgroundRect")
        .attr("width","94.4%")
        .attr("height","90.1%")
        .attr("x",0)
        .attr("y",0)
        .attr("fill","#FFFFFF")



    // Daten
    /*
    var data = [{x:20, y:700, z: 10, c: "Deutschland"}, {x:90, y:350, z: 10, c: "Italien"}, {x:52, y:140, z: 10, c: "USA"},
        {x:50, y:535, z: 10,  c: "China"}, {x:80, y:835, z: 10,  c: "Australien"}, {x:90, y:635, z: 10,  c: "Österreich"}, {x:20, y:435, z: 10,  c: "Russland"},
        {x:15, y:335, z: 10,  c: "Südafrika"}, {x:150, y:125, z: 10,  c: "Brasilien"}];
    */

   //let data = [{x:10, y:100}, {x:15, y:300}, {x:35, y:540}, {x:50, y:260}, {x:76, y:410}, {x:99, y:670},
    //{x:120, y:710}, {x:130, y:840}, {x:144, y:700}, {x:180, y:970}, {x:203, y:810}];

    // OLD - RANDOM DATA GENERATION FOR DUMMY DATA
    /*var data = [];

    for(var i = 0; i < weeks.length; i++) {
        data.push({x: i*3, y: Math.random() * 200, time: weeks[i]})
    }*/

    // give global access to our data
    // Data Structure: {productvalueAverage: Durchschnitt Produkt-Werte, time: Zeitstempel Mittwoch, KW: Kalenderwoche "KWX", incidencevalue: Inzidenzwert}
    bubbleData = importedData;
    //bubbleData = data;

    // x-Achse
    var x = d3.scaleLinear()
        .domain([0, 571])
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")") //Axe unten
        .attr("class", "axisGray")
        .call(d3.axisBottom(x));

    // x-Achse Label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width - 500)
        .attr("y", height + margin.top + 40)
        .attr("font-weight", "bold")
        .attr("font-size", "12px")
        .attr("fill", "gray")
        .attr("font-family", "sans-serif")
        .text("7-Tage-Inzidenz-Wert");

    // y-Achse
    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([ height, 0]);
    svg.append("g")
        .attr("class", "axisGray")
        .call(d3.axisLeft(y));

    // y-Achse Label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", -margin.top-160)
        .attr("font-weight", "bold")
        .attr("font-size", "12px")
        .attr("fill", "gray")
        .attr("font-family", "sans-serif")
        .text("Konsum (pro Kopf)")

    // share bubble axes globally
    globalBubbleX = x;
    globalBubbleY = y;
      
    //Grid
    var xAxisGrid = d3.axisBottom(x)
        .tickSize(-innerheight)
        .tickFormat('')
        .ticks(10);

    svg.append('g')
        .attr('class', 'x axis-grid')
        .attr('transform', 'translate(0,' + innerheight + ')')
        .call(xAxisGrid);

    var ticks = d3.selectAll(".axis-grid .tick");

    ticks.each(function(_, i) {
        if (i == 0) {
          d3.select(this).attr("display", "none");
        }
    });

    //Bubble-Göße
    /*
    var z = d3.scaleLinear()
        .domain([0, 50])
        .range([ 0, 60]);*/

    //Hover Funktion, um Name des Landes sehen zu können
    var tooltip = d3.select("#bubble-chart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white");

    var showTooltip = function(d) {
        tooltip
            .transition()
            .duration(50)
        tooltip
            .style("opacity", 1)
            .html("Inzidenzwert: " + d.incidencevalue + "<br />" + "Konsumwert: " + d.productvalueAverage)
            .style("position", "absolute")
            .style("left", (d.screenX + 60) + "px")
            .style("top", (d.screenY + 60) + "px")
    }

    var moveTooltip = function(d) {
        tooltip
            .style("position", "absolute")
            .style("left", (d.screenX + 60) + "px")
            .style("top", (d.screenY + 60) + "px")
    }
    
    var hideTooltip = function(d) {
        tooltip
            .transition()
            .style("opacity", 0)
    }

    // verlaufslinie zeichnen
    drawBubblesAndLineForCountryAndCountryData("deutschland", bubbleData.deutschland);
    drawBubblesAndLineForCountryAndCountryData("österreich", bubbleData.österreich);
    drawBubblesAndLineForCountryAndCountryData("brasilien", bubbleData.brazilien);

    drawBubblesAndLineForCountryAndCountryData("russland", bubbleData.russland);
    drawBubblesAndLineForCountryAndCountryData("china", bubbleData.china);
    drawBubblesAndLineForCountryAndCountryData("usa", bubbleData.usa);

    drawBubblesAndLineForCountryAndCountryData("südafrika", bubbleData.südafrika);
    drawBubblesAndLineForCountryAndCountryData("australien", bubbleData.australien);


    // alle bubbles bis auf die erste sollen ausgeblendet sein am Anfang
    hideAllBubblesExceptTheLastForCountryAndData("deutschland", bubbleData.deutschland);
    hideAllBubblesExceptTheLastForCountryAndData("österreich", bubbleData.österreich);
    hideAllBubblesExceptTheLastForCountryAndData("brasilien", bubbleData.brazilien);

    hideAllBubblesExceptTheLastForCountryAndData("russland", bubbleData.russland);
    hideAllBubblesExceptTheLastForCountryAndData("china", bubbleData.china);
    hideAllBubblesExceptTheLastForCountryAndData("usa", bubbleData.usa);

    hideAllBubblesExceptTheLastForCountryAndData("südafrika", bubbleData.südafrika);
    hideAllBubblesExceptTheLastForCountryAndData("australien", bubbleData.australien);

      // alle verlaufslinien sollen ausgeblendet sein am Anfang
    d3.selectAll("#bubble-chart .bubblechart-verlaufslinie").each(function(_, i) {
        d3.select(this).style("opacity", 0);
    });

    function drawBubblesAndLineForCountryAndCountryData(country, data) {
        // data = data for specific country
        for (var i = 1; i < data.length; i++) {
            svg.append("line")
                .datum(data[i])
                .style("stroke", getColorForCountry(country))
                .style("fill", "none")
                .style("stroke-width", "2px")
                .attr("x1", x(data[i - 1].incidencevalue))
                .attr("y1", y(data[i - 1].productvalueAverage))
                .attr("x2", x(data[i].incidencevalue))
                .attr("y2", y(data[i].productvalueAverage))
                .node().classList.add("bubblechart-verlaufslinie", "verlaufslinie-" + country);
        }

        // flaggen zeichnen
        svg.append('svg:pattern')
            .attr('id', 'flag-' + country)
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 24)
            .attr('height', 24)
            .append('svg:image')
            .attr('xlink:href', 'flags/' + country + '.png')
            .attr("x", -8)
            .attr("y", -8)
            .attr("width", 40)
            .attr("height", 40);


        // hier werden die bubbles gezeichnet
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", country)
            .attr("cx", function (d) { return x(d.incidencevalue); })
            .attr("cy", function (d) { return y(d.productvalueAverage); })
            .attr("r", 6)
            //.style("fill", function (d) { return c(d.c); } )
            .style("fill", getColorForCountry(country))
            //.style("opacity", "0.7")
            .attr("stroke", "white")
            .style("stroke-width", "1px")
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip);
    }

    function hideAllBubblesExceptTheLastForCountryAndData(country, countryData) {
        let hidden = 0;
        // select all bubbles of the current country
        d3.selectAll("#bubble-chart svg g g circle." + country).each(function (_, i) {
            let currentBubble = d3.select(this);
            let bubbleTime = currentBubble.datum().time;
            let currentBubbleWeek = parseInt(currentBubble.datum().KW.substring(2));
    
            // hide all bubbles except the first one and give it a flag
            if (currentBubbleWeek == 1) {
                currentBubble.style("opacity", 1);
                currentBubble.style("fill", "url(#flag-" + country + ")");
                currentBubble.attr("r", 12);
            }
            if (currentBubbleWeek > 1) {
                currentBubble.style("opacity", 0);
                hidden++;
            }
        });
    }
}

function triggerBubbleChartChangeAndDrawLines() {
    // TODO for playbutton
}