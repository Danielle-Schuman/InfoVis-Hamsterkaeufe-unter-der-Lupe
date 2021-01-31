function drawZoomBubbleChart(importedData){

    var margin = {top: 0.0077 * window.innerHeight, right: 0.0078 * window.innerWidth, bottom: 0.0616 * window.innerHeight, left: 0.03125 * window.innerWidth},
        screenWidth = window.innerWidth,
        screenHeight = window.innerHeight,
        width = 0.66*screenWidth - margin.left - margin.right,
        height = 0.6*screenHeight - margin.top - margin.bottom;
        innerwidth = width - margin.left -margin.right;
        innerheight = height;
    
        var svg = d3.select("#zoom-bubble-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("style", "overflow: visible")
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    
    
        //Hintergrund
        svg.append("rect")
            .attr("id","backgroundRect")
            .attr("width",width)
            .attr("height",height)
            .attr("x",0)
            .attr("y",0)
            .attr("fill","#FFFFFF")

        // give global access to our data
        // Data Structure: {productvalueAverage: Durchschnitt Produkt-Werte, time: Zeitstempel Mittwoch, KW: Kalenderwoche "KWX", incidencevalue: Inzidenzwert}
        bubbleData = importedData;
    
        // x-Achse
        var x = d3.scaleLinear()
            .domain([0, 200])
            .range([ 0, width ]);
        var xAxis = svg.append("g")
            .attr("transform", "translate(0," + height + ")") //Axe unten
            .attr("class", "axisGray")
            .call(d3.axisBottom(x));
    
        // x-Achse Label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", 0.52 * width)
            .attr("y", height + margin.top + (0.04 * screenHeight))
            .attr("font-weight", "bold")
            .attr("font-size", "0.9rem")
            .attr("fill", "gray")
            .attr("font-family", "sans-serif")
            .text("7-Tage-Inzidenz-Wert");

        // y-Achse
        var y = d3.scaleLinear()
            .domain([0, 50])
            .range([ height, 0]);
        var yAxis = svg.append("g")
            .attr("class", "axisGray")
            .call(d3.axisLeft(y));
    
        // y-Achse Label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 0.01*screenWidth)
            //.attr("x", -margin.top - 0.12364*screenHeight)
            .attr("x", -margin.top - 0.05*screenHeight)
            .attr("font-weight", "bold")
            .attr("font-size", "0.9rem")
            .attr("fill", "gray")
            .attr("font-family", "sans-serif")
            .text("Nichtverfügbarkeit von Produkten im Online-Handel in %")
    
        // share bubble axes globally
        globalBubbleX = x;
        globalBubbleY = y;
    
        globalxAxis = xAxis;
        globalyAxis = yAxis;
          
        //Grid
        var xAxisGrid = d3.axisBottom(x)
            .tickSize(-innerheight)
            .tickFormat('')
            .ticks(10);
    
        var xAxisGrid2 = svg.append('g')
            .attr('class', 'x axis-grid')
            .attr('transform', 'translate(0,' + innerheight + ')')
            .call(xAxisGrid);
    
        var ticks = d3.selectAll(".axis-grid .tick");
    
        ticks.each(function(_, i) {
            if (i == 0) {
              d3.select(this).attr("display", "none");
            }
        });
    
        globalAxisGrid = xAxisGrid;
        globalAxisGrid2 = xAxisGrid2;
    
    
        // verlaufslinien und bubbles zeichnen
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
        d3.selectAll("#zoom-bubble-chart .zoom-bubblechart-verlaufslinie").each(function(_, i) {
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
                    .node().classList.add("zoom-bubblechart-verlaufslinie", "verlaufslinie-" + country);
            }

            // draw dashed lines for incidence values > 180
            d3.selectAll("#zoom-bubble-chart .zoom-bubblechart-verlaufslinie").each(function(_, i) {
                let currentLine = d3.select(this);
                if (currentLine.attr("x2") >= 0.6*window.innerWidth) {
                    currentLine.style("stroke-dasharray", [5,5]);
                }
            });
    
            // flaggen zeichnen
            svg.append('svg:pattern')
                .attr('id', 'flag-z-' + country)
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
                .attr("stroke", "white")
                .style("stroke-width", "1px")
                // wenn Wert abweichen kann, benutze pSBC library-Funktion, um Farbe um 30% heller zu machen
                .style("fill", function (d) { if(d.canDeviateFromActualValue){ return pSBC(0.3, getColorForCountry(country)); }else{ return getColorForCountry(country); } })
                .on("mouseover", showtooltip)
                .on("mouseleave", hidetooltip);
    
        }
    
        function hideAllBubblesExceptTheLastForCountryAndData(country, countryData) {
            let hidden = 0;

            // select all bubbles of the current country
            d3.selectAll("#zoom-bubble-chart svg g g circle." + country).each(function (_, i) {
                let currentBubble = d3.select(this);
                let bubbleTime = currentBubble.datum().time;
                let currentBubbleWeek = parseInt(currentBubble.datum().KW.substring(2));
                
        
                // hide all bubbles except the first one and give it a flag
                if (currentBubbleWeek == 1) {
                    currentBubble.style("opacity", 1);
                    currentBubble.style("fill", "url(#flag-z-" + country + ")");
                    currentBubble.style("stroke-width", 3);
                    currentBubble.attr("r", 12);
                    // wenn Wert abweichen kann, benutze pSBC library-Funktion, um Farbe um 30% heller zu machen
                    currentBubble.style("stroke", function (d) { if(d.canDeviateFromActualValue){ return pSBC(0.3, getColorForCountry(country)); }else{ return getColorForCountry(country); } });
                }
                if (currentBubbleWeek > 1) {
                    currentBubble.style("opacity", 0);
                    hidden++;
                }
            });
        }
}