let features = ["Desinfektionsmittel","Handcreme","Nudeln","Toilettenpapier","Bier","Flüssigseife"];

// helper function for drawing lines of a path
let line = d3.line()
.x(d => d.x)
.y(d => d.y);

let spider_svg_size = window.innerHeight/2;
let radialScale = d3.scaleLinear()
	.domain([0,100])
	.range([0,0.4*spider_svg_size]);

let imported_spider_data = [];
let prepared_spider_data = [];

function drawSpiderChart(importedData) {

    imported_spider_data = importedData;

    let screenWidth = window.innerWidth,
        screenHeight = window.innerHeight;

    let svg = d3.select("#spider-chart").append("svg")
	.attr("width", 0.27*screenWidth)
	.attr("height", 0.5*screenHeight);

    let ticks = [20,40,60,80,100];

    // draw circular tick-lines
    ticks.forEach(t =>
	    svg.append("circle")
	    .attr("cx", spider_svg_size/2)
	    .attr("cy", spider_svg_size/2)
	    .attr("fill", "none")
	    .attr("stroke", "gray")
	    .attr("r", radialScale(t))
    );

    ticks.forEach(t =>
        svg.append("text")
        .attr("x", spider_svg_size/2 + 5)
        .attr("y", spider_svg_size/2 - radialScale(t))
        .text(t.toString())
    );

    // draw circular oriented axes and their labels
    for (var i = 0; i < features.length; i++) {
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        let line_coordinate = angleToCoordinate(angle, 100);
        let label_coordinate = angleToCoordinate(angle, 115);

        //draw axis line
        svg.append("line")
        .attr("x1", spider_svg_size/2)
        .attr("y1", spider_svg_size/2)
        .attr("x2", line_coordinate.x)
        .attr("y2", line_coordinate.y)
        .attr("stroke","black");

        //draw axis label
        svg.append("text")
        .attr("x", label_coordinate.x)
        .attr("y", label_coordinate.y)
        .text(ft_name);
    }

    for (var i = 0; i < 53; i++) {
        countries2.forEach(c => drawSpiderPathForCountryForGivenTimeSlot(c, i));
    }
}

// kwIndex = {0..52}, 0 = KW1
function drawSpiderPathForCountryForGivenTimeSlot(country, kwIndex) {
    // extract data for given country and time
    let currentDataOfCountry = getDataForCountry(country);
    
    let bier = currentDataOfCountry.Bier;
    let desinfektionsmittel = currentDataOfCountry.Desinfektionsmittel;
    let seife = currentDataOfCountry.Flüssigseife;
    let nudeln = currentDataOfCountry.Nudeln;
    let handcreme = currentDataOfCountry.Handcreme;
    let toilettenpapier = currentDataOfCountry.Toilettenpapier;

    let productDataPointForCurrentCountryAndWeek = {};

    // parse data into format {product1: value1, product2: value2, ...}
    productDataPointForCurrentCountryAndWeek["Bier"] = bier[kwIndex].productvalue;
    productDataPointForCurrentCountryAndWeek["Desinfektionsmittel"] = desinfektionsmittel[kwIndex].productvalue;
    productDataPointForCurrentCountryAndWeek["Flüssigseife"] = seife[kwIndex].productvalue;
    productDataPointForCurrentCountryAndWeek["Nudeln"] = nudeln[kwIndex].productvalue;
    productDataPointForCurrentCountryAndWeek["Handcreme"] = handcreme[kwIndex].productvalue;
    productDataPointForCurrentCountryAndWeek["Toilettenpapier"] = toilettenpapier[kwIndex].productvalue;

    // calculate coordinates for all products for this country and timeslot
    let d = productDataPointForCurrentCountryAndWeek;
    let coordinates = getPathCoordinates(d);
    coordinates.push(coordinates[0]);

    let svg = d3.select("#spider-chart svg");

    //draw the path element
    let path = svg.append("path")
    .datum(coordinates)
    .attr("id", country + "-" + kwIndex)
    .attr("d",line)
    .attr("stroke-width", 2)
    .attr("stroke", getColorForCountry(country))
    .attr("fill", getColorForCountry(country))
    .attr("stroke-opacity", 1)
    .attr("fill-opacity", 0.5)
    .attr("opacity", 0)
    .node().classList.add("spiderchart-plot", "spiderchart-plot-" + country + "-kw-" + (kwIndex+1));

}

function getDataForCountry(country) {
    let selectedCountryData = false;

    switch(country) {
        case "deutschland":
            selectedCountryData = imported_spider_data.deutschland;
            break;
        case "china":
            selectedCountryData = imported_spider_data.china;
            break;
        case "usa":
            selectedCountryData = imported_spider_data.usa;
            break;
        case "österreich":
            selectedCountryData = imported_spider_data.österreich;
            break;
        case "brasilien":
            selectedCountryData = imported_spider_data.brazilien;
            break;
        case "australien":
            selectedCountryData = imported_spider_data.australien;
            break;
        case "italien":
            selectedCountryData = imported_spider_data.italien;
            break;
        case "südafrika":
            selectedCountryData = imported_spider_data.südafrika;
            break;
        case "russland":
            selectedCountryData = imported_spider_data.russland;
            break;
    }
    return selectedCountryData;
}

// calculates path coordinates according to current data point
function getPathCoordinates(data_point){
    let coordinates = [];
    for (var i = 0; i < features.length; i++){
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
    }
    return coordinates;
}

// transforms angle of product axis and current value of product into carthesian coordinates for the svg
function angleToCoordinate(angle, value) {
	let x = Math.cos(angle) * radialScale(value);
	let y = Math.sin(angle) * radialScale(value);
	return {"x": (spider_svg_size/2) + x, "y": (spider_svg_size/2) - y};
}