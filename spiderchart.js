let data = []; // dummy data
let features = ["Desinfektionsmittel","Hefe","Mehl","Toilettenpapier","Bier","Seife"];
let countries = ["deutschland", "china", "usa", "österreich", "brasilien", "australien", "italien", "südafrika", "russland"];
let colors = ['#88CCEE', '#44AA99', '#117733', '#332288', '#DDCC77', '#999933', '#CC6677', '#882255', '#AA4499'];
let svg_size = window.innerHeight/2;
let radialScale = d3.scaleLinear()
	.domain([0,10])
	.range([0,0.4*svg_size]);

//generate dummy data
for (var i = 0; i < 9; i++){
    var point = {}
    //each feature will be a random number from 1-9
    features.forEach(f => point[f] = 1 + Math.random() * 8);
    data.push(point);
}
console.log(data);

function drawSpiderChart() {
    let svg = d3.select("#spider-chart").append("svg")
	.attr("width", svg_size)
	.attr("height", svg_size);

let ticks = [2,4,6,8,10];

ticks.forEach(t =>
	svg.append("circle")
	.attr("cx", svg_size/2)
	.attr("cy", svg_size/2)
	.attr("fill", "none")
	.attr("stroke", "gray")
	.attr("r", radialScale(t))
);

ticks.forEach(t =>
	svg.append("text")
	.attr("x", svg_size/2 + 5)
	.attr("y", svg_size/2 - radialScale(t))
	.text(t.toString())
);

for (var i = 0; i < features.length; i++) {
    let ft_name = features[i];
    let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
    let line_coordinate = angleToCoordinate(angle, 10);
    let label_coordinate = angleToCoordinate(angle, 11.5);

    //draw axis line
    svg.append("line")
    .attr("x1", svg_size/2)
    .attr("y1", svg_size/2)
    .attr("x2", line_coordinate.x)
    .attr("y2", line_coordinate.y)
    .attr("stroke","black");

    //draw axis label
    svg.append("text")
    .attr("x", label_coordinate.x)
    .attr("y", label_coordinate.y)
    .text(ft_name);
}

let line = d3.line()
	.x(d => d.x)
	.y(d => d.y);

let paths = []

for (var i = 0; i < data.length; i ++){
    let d = data[i];
    let color = colors[i];
    let coordinates = getPathCoordinates(d);
    coordinates.push(coordinates[0]);

    //draw the path element
    let path = svg.append("path")
    .datum(coordinates)
    .attr("id", countries[i])
    .attr("d",line)
    .attr("stroke-width", 2)
    .attr("stroke", color)
    .attr("fill", color)
    .attr("stroke-opacity", 1)
    .attr("fill-opacity", 0.5);

    paths.push(path);
}

    countries.forEach(c => document.getElementById(c).setAttribute("opacity", 0));
}

function getPathCoordinates(data_point){
    let coordinates = [];
    for (var i = 0; i < features.length; i++){
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
    }
    return coordinates;
}

function angleToCoordinate(angle, value) {
	let x = Math.cos(angle) * radialScale(value);
	let y = Math.sin(angle) * radialScale(value);
	return {"x": (svg_size/2) + x, "y": (svg_size/2) - y};
}