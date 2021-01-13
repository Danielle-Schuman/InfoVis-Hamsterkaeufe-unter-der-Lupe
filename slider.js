var domain = [new Date(2020, 0, 1), new Date(2021, 0, 3)];
var weeks = d3.timeWeek.range(domain[0], domain[domain.length-1]);

function drawSlider() {
  //var domain = [new Date(2019, 9, 1), new Date(2020, 9, 30)];
  var width = window.innerWidth*0.5;
  //var weeks = d3.timeWeek.range(domain[0], domain[domain.length-1]);
  var greenColor = "#99ed83";

  console.log("weeks: " + weeks.length);
  weeks.forEach(element => {
      console.log(element.toString());
  });


    var sliderTime = d3
      .sliderBottom()
      .min(weeks[0])
      .max(weeks[weeks.length-1])
      .step(1000 * 60 * 60 * 24 * 7)
      .width(width)
      .tickFormat(d3.timeFormat('%b (%Y), KW %V'))
      .ticks(weeks.length)
      .fill(greenColor)
      .default(weeks[0])
      .handle(
          d3
            .symbol()
            .type(d3.symbolCircle)
            .size(200)()
        )
      .on('onchange', val => {
        // hier werden die bubbles und verlaufslinien passend zum slider geupdatet - für jedes Land
        updateBubblesAndLines(val, false, "deutschland");
        updateBubblesAndLines(val, false, "österreich");
        updateBubblesAndLines(val, false, "russland");

        updateBubblesAndLines(val, false, "usa");
        updateBubblesAndLines(val, false, "china");
        updateBubblesAndLines(val, false, "brasilien");

        updateBubblesAndLines(val, false, "australien");
        updateBubblesAndLines(val, false, "südafrika");
        currentSliderValue = val;
        //console.log("slidervalue:" + currentSliderValue);
      });

    /* END OF onchange callback */

    // sliderValue1 ist der Wert, der links vom Slider steht
    var sliderValue1 = d3.select("div#slider-time")
      .append("div")
      .attr("class", "slider-values");

      sliderValue1
        .append("p")
        .text(d3.timeFormat('%B, %Y')(weeks[0]));
      sliderValue1
        .append("p")
        .text(d3.timeFormat('KW %V')(weeks[0]));

    var gTime = d3
      .select('div#slider-time')
      .append('svg')
      .attr('width', '60vw')
      .attr('height', 100)
      .append('g')
      .attr('transform', 'translate(30,30)');

    gTime.call(sliderTime);

    // sliderValue2 ist der Wert, der rechts vom Slider steht
    var sliderValue2 = d3.select("div#slider-time")
    .append("div")
    .attr("class", "slider-values");

    sliderValue2
      .append("p")
      .text(d3.timeFormat('%B, %Y')(weeks[weeks.length-1]));
    sliderValue2
      .append("p")
      .text(d3.timeFormat('KW %V')(weeks[weeks.length-1]));

    var ticks = d3.selectAll(".tick");

    ticks.each(function(_, i) {
        if (true) d3.select(this).select("text").remove();
        if (i%4 == 0) {
          d3.select(this).select("line").attr("y2", 10);
        }
    });

    // der slider nüps :)
    var handle = d3.select(".parameter-value");

    handle.append("circle")
      .attr("cx", handle.attr("x"))
      .attr("cy", handle.attr("y"))
      .attr("r", 12)
      .attr("fill", "#eeeeee")
      .attr("stroke", "#777777");

      handle.append("circle")
      .attr("cx", handle.attr("x"))
      .attr("cy", handle.attr("y"))
      .attr("r", 4)
      .attr("fill", greenColor)
      .attr("stroke", "#777777");

      var axis = d3.select(".axis")
        .attr("transform", "translate(0, 16)");

    d3.select("#slider-time svg g:nth-child(1)")
      .attr("transform", "translate(60,30)");
      /* end of function drawSlider */
}

function updateBubblesAndLines(currentSliderValue, toggled, country) {
  let bubblesOfCountry = d3.selectAll("#bubble-chart svg g g circle." + country);
  let allLinesOfCountry = d3.selectAll('#bubble-chart .verlaufslinie-' + country);
  let bubblesVisibleForCountry = 0;
  let toggle = document.getElementById("slider-toggle-input");

  // bubbles ein oder ausblenden
  bubblesOfCountry.each(function (_, i) {
    let currentBubble = d3.select(this);
    let bubbleTime = currentBubble.datum().time;
    let sliderTime = currentSliderValue;

    if (bubbleTime.valueOf() <= sliderTime.valueOf()) {
      currentBubble.style("opacity", 1);
      bubblesVisibleForCountry++;
      if (toggled == true) {
        if (toggle.checked == false && bubbleTime.valueOf() < sliderTime.valueOf()) currentBubble.style("opacity", 0); 
      }
    } else {
      currentBubble.style("opacity", 0);
    }
  });

  bubblesOfCountry.each(function (_, i) {
    let currentBubble = d3.select(this);
    if (i == bubblesVisibleForCountry - 1) {
      currentBubble.style("opacity", 1);
    }
    // if filtermode active and country not filtered
    if (checkedFilters > 0 && getFilterConfigForCountry(country) == false) {
      currentBubble.style("opacity", 0);
    }
  });

  // linien ein/ausblenden, je nachdem wie weit die bubbles angezeigt werden
  allLinesOfCountry.each(function (_, i) {
    let currentLine = d3.select(this);
    let lineIndex = i;

    if (lineIndex < bubblesVisibleForCountry - 1) {
      currentLine.style("opacity", 1);
      if (toggled == true) {
        if (toggle.checked == false) currentLine.style("opacity", 0); 
      }
    } else {
      currentLine.style("opacity", 0);
    }

    // if filtermode active and country not filtered
    if (checkedFilters > 0 && getFilterConfigForCountry(country) == false) {
      currentLine.style("opacity", 0);
    }
  });

  // raus falls im filter mode
  if (checkedFilters > 0 && getFilterConfigForCountry(country) == false) {
    return;
  }

  console.log("bubbles visible: " + bubblesVisibleForCountry + " for country: " + country);
  // wenn slider bewegt wird und verlauf ausgeblendet ist
  if (toggled == false && toggle.checked == false) {
    bubblesOfCountry.each(function (_, i) {
      let currentBubble = d3.select(this);

      if (i == bubblesVisibleForCountry - 1) {
        currentBubble.style("opacity", 1);
      } else {
        currentBubble.style("opacity", 0);
      }
    });

    allLinesOfCountry.each(function (_, i) {
      d3.select(this).style("opacity", 0);
    });
  }
  
  // bubble fill aktualisieren --> letzte Bubble kriegt flagge, alle anderen davor farbe
  bubblesOfCountry.each(function (_, i) {
    let currentBubble = d3.select(this);
    if (i == bubblesVisibleForCountry - 1) {
      currentBubble.style("fill", "url(#flag-" + country + ")");
      currentBubble.attr("r", 12);
    } else {
      currentBubble.style("fill", getColorForCountry(country));
      currentBubble.attr("r", 6);
    }
  });
}
