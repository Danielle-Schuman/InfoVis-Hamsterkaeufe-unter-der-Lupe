var domain = [new Date(2020, 0, 1), new Date(2021, 0, 3)];
var weeks = d3.timeWeek.range(domain[0], domain[domain.length-1]);
var sliderTimeGlobal;

function drawSlider() {
  //var domain = [new Date(2019, 9, 1), new Date(2020, 9, 30)];
  var width = window.innerWidth*0.5;
  //var weeks = d3.timeWeek.range(domain[0], domain[domain.length-1]);
  var greenColor = "#99ed83";

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
        updateBubblesAndLines(val, "deutschland");
        updateBubblesAndLines(val, "österreich");
        updateBubblesAndLines(val, "russland");

        updateBubblesAndLines(val, "usa");
        updateBubblesAndLines(val, "china");
        updateBubblesAndLines(val, "brasilien");

        updateBubblesAndLines(val, "australien");
        updateBubblesAndLines(val, "südafrika");

        updateZoomBubblesAndLines(val, "deutschland");
        updateZoomBubblesAndLines(val, "österreich");
        updateZoomBubblesAndLines(val, "russland");

        updateZoomBubblesAndLines(val, "usa");
        updateZoomBubblesAndLines(val, "china");
        updateZoomBubblesAndLines(val, "brasilien");

        updateZoomBubblesAndLines(val, "australien");
        updateZoomBubblesAndLines(val, "südafrika");
        currentSliderValue = val;

        updateSpiderChart();
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

    // der slider nüps :) (also der Punkt, den man draggt)
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

    sliderTimeGlobal = sliderTime;
      /* end of function drawSlider */
}

// updates Scatterplot (aka Bubblechart) according to slider-value, selection of filters and toggle-position
function updateBubblesAndLines(currentSliderValue, country) {
  let bubblesOfCountry = d3.selectAll("#bubble-chart svg g g circle." + country);
  let allLinesOfCountry = d3.selectAll('#bubble-chart .verlaufslinie-' + country);

  let bubblesVisibleForCountry = 0;
  let toggle = document.getElementById("slider-toggle-input");
  let selectedWeek = d3.timeSunday.count(d3.timeYear(currentSliderValue), currentSliderValue);

  // if filtermode active and country not filtered -> country not to be shown
  if (checkedFilters > 0 && getFilterConfigForCountry(country) === false) {
    // make bubbles invisible
    bubblesOfCountry.each(function (_, i) {
      let currentBubble = d3.select(this);
      currentBubble.style("opacity", 0);
    });
    // make lines invisible
    allLinesOfCountry.each(function (_, i) {
      let currentLine = d3.select(this);
      currentLine.style("opacity", 0);
    });

  }else{ // filtermode not active or country not filtered -> show appropriate bubbles & lines
    // update bubble visibility
    bubblesOfCountry.each(function (_, i) {
      let currentBubble = d3.select(this);
      let bubbleTime = currentBubble.datum().time;
      let bubbleWeek = d3.timeSunday.count(d3.timeYear(bubbleTime), bubbleTime);

      // is bubble for point in time indicated by slider -> needs flag & is always visible
      if (bubbleWeek === selectedWeek) {
        currentBubble.style("fill", "url(#flag-" + country + ")");
        currentBubble.style("stroke-width", 3);
        currentBubble.attr("r", 12);
        currentBubble.style("opacity", 1);
        // if product value can deviate from actual, use pSBC library function to make color 30% lighter
        currentBubble.style("stroke", function (d) { if(d.canDeviateFromActualValue){ return pSBC(0.3, getColorForCountry(country)); }else{ return getColorForCountry(country); } });
        // count up number of visible bubbles for lines later
        bubblesVisibleForCountry++;

      // is before point in time indicated by slider -> is only to be shown when toggle indicates that Verlauf is to be shown
      } else if(bubbleWeek < selectedWeek){
        // show if toggle indicates that Verlauf is to be shown
        if(toggle.checked) {
          // make bubbles visible and set fill etc.
          currentBubble.style("opacity", 1);
          currentBubble.attr("r", 6);
          currentBubble.style("stroke", "white");
          currentBubble.style("stroke-width", 1);
          // if product value can deviate from actual, use pSBC library function to make color 30% lighter
          currentBubble.style("fill", function (d) {
            if (d.canDeviateFromActualValue) {
              return pSBC(0.3, getColorForCountry(country));
            } else {
              return getColorForCountry(country);
            }
          });
          // count up number of visible bubbles for lines later
          bubblesVisibleForCountry++;
        // if toggle indicates that Verlauf is not to be shown
        } else{
          // make bubble invisible
          currentBubble.style("opacity", 0);
        }

      // is after point in time indicated by slider -> never visible
      } else {
        currentBubble.style("opacity", 0);
      }
    });

    // update lines visibility
    // if toggle indicates that Verlauf is to be shown
    if(toggle.checked){
      // make lines before time indicated by slider visible, and the rest invisible
        allLinesOfCountry.each(function (_, i) {
          let currentLine = d3.select(this);
          if(i < bubblesVisibleForCountry - 1) {
            currentLine.style("opacity", 1);
          }else{
            currentLine.style("opacity", 0);
          }
        });
    // if toggle indicates that Verlauf is not to be shown
    } else {
      // make all lines invisible
      allLinesOfCountry.each(function (_, i) {
        let currentLine = d3.select(this);
        currentLine.style("opacity", 0);
      });
    }
  }
}

//update ZoomBubbleChart
function updateZoomBubblesAndLines(currentSliderValue, country) {
  let bubblesOfCountry = d3.selectAll("#zoom-bubble-chart svg g g circle." + country);
  let allLinesOfCountry = d3.selectAll('#zoom-bubble-chart .verlaufslinie-' + country);

  let bubblesVisibleForCountry = 0;
  let toggle = document.getElementById("slider-toggle-input");
  let selectedWeek = d3.timeSunday.count(d3.timeYear(currentSliderValue), currentSliderValue);

  // if filtermode active and country not filtered -> country not to be shown
  if (checkedFilters > 0 && getFilterConfigForCountry(country) === false) {
    // make bubbles invisible
    bubblesOfCountry.each(function (_, i) {
      let currentBubble = d3.select(this);
      currentBubble.style("opacity", 0);
    });
    // make lines invisible
    allLinesOfCountry.each(function (_, i) {
      let currentLine = d3.select(this);
      currentLine.style("opacity", 0);
    });

  }else{ // filtermode not active or country not filtered -> show appropriate bubbles & lines
    // update bubble visibility
    bubblesOfCountry.each(function (_, i) {
      let currentBubble = d3.select(this);
      let bubbleTime = currentBubble.datum().time;
      let bubbleWeek = d3.timeSunday.count(d3.timeYear(bubbleTime), bubbleTime);

      // is bubble for point in time indicated by slider -> needs flag & is always visible
      if (bubbleWeek === selectedWeek) {
        currentBubble.style("fill", "url(#flag-z-" + country + ")");
        currentBubble.style("stroke-width", 3);
        currentBubble.attr("r", 12);
        currentBubble.style("opacity", 1);
        // if product value can deviate from actual, use pSBC library function to make color 30% lighter
        currentBubble.style("stroke", function (d) { if(d.canDeviateFromActualValue){ return pSBC(0.3, getColorForCountry(country)); }else{ return getColorForCountry(country); } });
        // count up number of visible bubbles for lines later
        bubblesVisibleForCountry++;

      // is before point in time indicated by slider -> is only to be shown when toggle indicates that Verlauf is to be shown
      } else if(bubbleWeek < selectedWeek){
        // show if toggle indicates that Verlauf is to be shown
        if(toggle.checked) {
          // make bubbles visible and set fill etc.
          currentBubble.style("opacity", 1);
          currentBubble.attr("r", 6);
          currentBubble.style("stroke", "white");
          currentBubble.style("stroke-width", 1);
          // if product value can deviate from actual, use pSBC library function to make color 30% lighter
          currentBubble.style("fill", function (d) {
            if (d.canDeviateFromActualValue) {
              return pSBC(0.3, getColorForCountry(country));
            } else {
              return getColorForCountry(country);
            }
          });
          // count up number of visible bubbles for lines later
          bubblesVisibleForCountry++;
        // if toggle indicates that Verlauf is not to be shown
        } else{
          // make bubble invisible
          currentBubble.style("opacity", 0);
        }

      // is after point in time indicated by slider -> never visible
      } else {
        currentBubble.style("opacity", 0);
      }
    });

    // update lines visibility
    // if toggle indicates that Verlauf is to be shown
    if(toggle.checked){
      // make lines before time indicated by slider visible, and the rest invisible
        allLinesOfCountry.each(function (_, i) {
          let currentLine = d3.select(this);
          if(i < bubblesVisibleForCountry - 1) {
            currentLine.style("opacity", 1);
          }else{
            currentLine.style("opacity", 0);
          }
        });
    // if toggle indicates that Verlauf is not to be shown
    } else {
      // make all lines invisible
      allLinesOfCountry.each(function (_, i) {
        let currentLine = d3.select(this);
        currentLine.style("opacity", 0);
      });
    }
  }
};


function updateSpiderChart() {
  let selectedWeek = d3.timeSunday.count(d3.timeYear(currentSliderValue), currentSliderValue);
  let currentlyVisibleCountries = [];

  countries2.forEach(c => {
    if(getFilterConfigForCountry(c)) currentlyVisibleCountries.push(c)
  });

  let spiderplot = d3.select("#spider-chart svg");
  let allPlots = spiderplot.selectAll(".spiderchart-plot");

  allPlots.each(function (_, i) {
    d3.select(this).attr("opacity", 0);
  });

  currentlyVisibleCountries.forEach(c => {
    document.getElementById(c + "-" + selectedWeek).setAttribute("opacity", 1);
  });
}
