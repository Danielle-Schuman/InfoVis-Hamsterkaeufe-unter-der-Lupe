let checkedFilters = 0;
let filteredCountries = {
                            deutschland: false,
                            österreich: false,
                            china: false,
                            usa: false,
                            italien: false,
                            russland: false,
                            südafrika: false,
                            australien: false,
                            brasilien: false
                        };
let currentSliderValue = weeks[0];
let countries = ["deutschland", "china", "usa", "österreich", "brasilien", "australien", "italien", "südafrika", "russland"];
let countries2 = ["deutschland", "china", "usa", "österreich", "brasilien", "australien", "südafrika", "russland"];

let COLORSCHEME = {deutschland: "#88CCEE",
                        china: "#44AA99",
                        usa: "#117733",
                        österreich: "#332288",
                        brasilien: "#DDCC77",
                        australien: "#999933",
                        italien: "#CC6677",
                        südafrika: "#882255",
                        russland: "#AA4499"};

let isPlayingID;
let justStarted = false;


// when country is a Stringvalue
function getColorForCountry(countryName) {
    switch(countryName) {
        case "deutschland":
            return COLORSCHEME.deutschland;
        case "china":
            return COLORSCHEME.china;
        case "usa":
            return COLORSCHEME.usa;
        case "österreich":
            return COLORSCHEME.österreich;
        case "brasilien":
            return COLORSCHEME.brasilien;
        case "australien":
            return COLORSCHEME.australien;
        case "italien":
            return COLORSCHEME.italien;
        case "südafrika":
            return COLORSCHEME.südafrika;
        case "russland":
            return COLORSCHEME.russland;
    }
}

// when country is a Stringvalue
function getFilterConfigForCountry(countryName) {
    switch(countryName) {
        case "deutschland":
            return filteredCountries.deutschland;
        case "china":
            return filteredCountries.china;
        case "usa":
            return filteredCountries.usa;
        case "österreich":
            return filteredCountries.österreich;
        case "brasilien":
            return filteredCountries.brasilien;
        case "australien":
            return filteredCountries.australien;
        case "italien":
            return filteredCountries.italien;
        case "südafrika":
            return filteredCountries.südafrika;
        case "russland":
            return filteredCountries.russland;
    }
}

function main(importedData) {
    drawSpiderChart(importedData);
    drawSlider();
    document.getElementById("spider-chart").style.display = 'none';

    drawBubbleChart(prepareDataForScatterplot(importedData));

    drawZoomBubbleChart(prepareDataForScatterplot(importedData));
    document.getElementById("zoom-bubble-chart").style.display= 'none';
}

importData(main);


function onCheckboxClicked(container) {
    let filterButton = document.getElementById("filter-button");
    let checkbox = container.children[0];
    let country = checkbox.name;
    let legendbox = d3.select("#legend");

	if (checkbox.checked == true) {
        checkbox.checked = false;
        saveFilterConfiguration(country, false);
        filterSpiderChart(country, false);
        filterBubbleChartForCountry(country);
        checkedFilters--;
	} else {
        checkbox.checked = true;
        saveFilterConfiguration(country, true);
        filterSpiderChart(country, true);
        filterBubbleChartForCountry(country);
        checkedFilters++;
        if (checkedFilters == 1) {
            // hide all other countries in bubblechart - we are in filter mode now!
            for(var i = 0; i < countries.length; i++) {
                if (country != countries[i] && countries[i] != "italien") {
                    filterBubbleChartForCountry(countries[i]);
                }
            }
        }
    }
    if (checkedFilters <= 0) {
        // disable filter button
        onFilterToggleClicked(filterButton);
        hideSpiderChart();
        legendbox.style("opacity", 0.5);
    } else {
        showSpiderChart();
        legendbox.style("opacity", 1);
    }
}

function saveFilterConfiguration(country, config) {
    switch(country) {
        case "deutschland":
            filteredCountries.deutschland = config;
            return;
        case "china":
            filteredCountries.china = config;
            return;
        case "usa":
            filteredCountries.usa = config;
            return;
        case "österreich":
            filteredCountries.österreich = config;
            return;
        case "brasilien":
            filteredCountries.brasilien = config;
            return;
        case "australien":
            filteredCountries.australien = config;
            return;
        case "italien":
            filteredCountries.italien = config;
            return;
        case "südafrika":
            filteredCountries.südafrika = config;
            return;
        case "russland":
            filteredCountries.russland = config;
            return;
    }
}

// filter per country - show = true --> show country data, show = false --> hide country data
function filterSpiderChart(country, showValue) {
    let selectedWeek = d3.timeSunday.count(d3.timeYear(currentSliderValue), currentSliderValue);
    let path = document.getElementById(country + "-" + selectedWeek);

    if (showValue == true) {
        path.setAttribute("opacity", 1);
    } else {
        if (country != "italien") path.setAttribute("opacity", 0);
    }
}

// filter per country: show or hide country data
function filterBubbleChartForCountry(country) {
    updateBubblesAndLines(currentSliderValue, country);
    updateZoomBubblesAndLines(currentSliderValue, country);
}

function showSpiderChart() {
    document.getElementById("spider-chart").style.display = 'block';
    document.getElementById("placeholder").style.display = 'none';
    document.getElementById("filter-button").disabled = false;
    document.getElementById("filter-button").classList.add("enabled");
}

function hideSpiderChart() {
    document.getElementById("spider-chart").style.display = 'none';
    document.getElementById("placeholder").style.display = 'block';
    document.getElementById("filter-button").disabled = true;
    document.getElementById("filter-button").classList.remove("enabled");
}

function showBubbleChart() {
    document.getElementById("bubble-chart").style.display = 'block';
    document.getElementById("zoom-bubble-chart").style.display = 'none'; 
}

function showZoomBubbleChart() {
    document.getElementById("zoom-bubble-chart").style.display = 'block';
    document.getElementById("bubble-chart").style.display = 'none';
}

function onZoomToggleClicked(toggle){
    let toggleLabel = document.getElementById("zoom-toggle-label");
    let icon = document.getElementById("zoom-icon");

    if (toggle.checked == true){
        showZoomBubbleChart();
        toggleLabel.innerText = "Ansicht verkleinern";
        icon.innerText = "zoom_out";
    }if (toggle.checked == false){
        showBubbleChart();
        toggleLabel.innerText = "Ansicht vergrößern";
        icon.innerText = "zoom_in";
    }
}

function onZoomToggleHover(toggle, entering) {
    let zoomInOverlay = document.getElementById("zoom-in-overlay");
    let zoomOutOverlay = document.getElementById("zoom-out-overlay");

    if (entering == true) {
        zoomInOverlay.style.opacity = 1;
        zoomOutOverlay.style.opacity = 1;
        zoomInOverlay.style.display = 'flex';
        zoomOutOverlay.style.display = 'flex';
    } else {
        zoomInOverlay.style.opacity = 0;
        zoomOutOverlay.style.opacity = 0;
        zoomInOverlay.style.display = 'none';
        zoomOutOverlay.style.display = 'none';
    }
}


function onPlayButtonClicked(button) {
    if (button.classList.contains("active")) {
        button.classList.remove("active");
        clearInterval(isPlayingID);
    } else {
        button.classList.add("active");
        justStarted = true;
        isPlayingID = setInterval(play, 500, button);
    }
}

function play(button){
    var isCurrentValue = (element) => (element.getFullYear() === currentSliderValue.getFullYear() && element.getMonth() === currentSliderValue.getMonth() && element.getDate() === currentSliderValue.getDate());
    var i = weeks.findIndex(isCurrentValue);
    if(i === -1){
        // Should never happen
        alert("Error: Date value in play function not found! Please reload the website!");
        console.log(currentSliderValue);
    }
    // If it's the last value of the year
    if(i === (weeks.length - 1)){
        // If we started playing at this time value, reset slider to start of year and continue playing
        if(justStarted) {
            let position = weeks[0];
            var g = d3.select("#slider-time>svg>g");
            g.call(sliderTimeGlobal.value(position));
            // necessary because of bug in d3-simple-slider's value function that thinkers with value when assigning it
            currentSliderValue = position;
            justStarted = false;
        // else we just ended playing here -> stop playing
        }else{
            button.classList.remove("active");
            clearInterval(isPlayingID);
        }
    // otherwise continue playing anyway
    } else {
        let position = weeks[i + 1];
        var g = d3.select("#slider-time>svg>g");
        g.call(sliderTimeGlobal.value(position));
        // necessary because of bug in d3-simple-slider's value function that thinkers with value when assigning it
        currentSliderValue = position;
        justStarted = false;
    }
}


function onSliderToggleClicked(toggle){
    let bubblechart = document.getElementById("bubble-chart");
    let zoombubblechart = document.getElementById("zoom-bubble-chart");
    let toggleLabel = document.getElementById("progress-toggle-label");
    
    if (toggle.checked == true) {
        // Verlauf ausblenden
        toggleLabel.innerText = "Verlauf ausblenden";
    } else {
        // Verlauf einblenden
        toggleLabel.innerText = "Verlauf einblenden";
    }

    // bubbles und linien bis auf die länderbubble am Ende ein-bzw. ausblenden lassen
    updateBubblesAndLines(currentSliderValue, "deutschland");
    updateBubblesAndLines(currentSliderValue, "österreich");
    updateBubblesAndLines(currentSliderValue, "russland");

    updateBubblesAndLines(currentSliderValue, "usa");
    updateBubblesAndLines(currentSliderValue, "china");
    updateBubblesAndLines(currentSliderValue, "brasilien");

    updateBubblesAndLines(currentSliderValue, "australien");
    updateBubblesAndLines(currentSliderValue, "südafrika");

    updateZoomBubblesAndLines(currentSliderValue, "deutschland");
    updateZoomBubblesAndLines(currentSliderValue, "österreich");
    updateZoomBubblesAndLines(currentSliderValue, "russland");

    updateZoomBubblesAndLines(currentSliderValue, "usa");
    updateZoomBubblesAndLines(currentSliderValue, "china");
    updateZoomBubblesAndLines(currentSliderValue, "brasilien");

    updateZoomBubblesAndLines(currentSliderValue, "australien");
    updateZoomBubblesAndLines(currentSliderValue, "südafrika");
}

function onFilterToggleClicked(button) {
    if (button.classList.contains("enabled")) {
        button.classList.remove("enabled");
        button.disabled = true;
    }
    uncheckAllFilters();
    // stop filtering bubblechart (aka scatterplot)
    for(var i = 0; i < countries.length; i++) {
        if (countries[i] != "italien") {
            saveFilterConfiguration(countries[i], false);
            filterBubbleChartForCountry(countries[i]);
        }
    }
    hideSpiderChart();
}

function uncheckAllFilters() {
    // uncheck all filters and hide spiderchart
    let filterWrapper = document.getElementById("filter-wrapper");
    let filters = filterWrapper.children;

    /* uncheck all 8 filters */
    for (var i = 0; i <= 8; i++) {
        filters[i].children[0].checked = false;
    }

    checkedFilters = 0;

    countries.forEach(country => {
        filterSpiderChart(country, false);
    });
}

function showtooltip(d, i, nodes) {
    let tooltip = document.getElementById("tooltip");
    let tooltipText = document.getElementById("tooltip-text");
    let toolTipInfo = document.getElementById("tooltip-info");
console.log("tooltip");
    // show only tooltip for visible bubbles
    if (d.target.style.opacity == 0) return;

    // show info that the data could deviate from reality
    if (i.canDeviateFromActualValue == true) {
        toolTipInfo.style.display = 'flex';
    } else {
        toolTipInfo.style.display = 'none';
    }

    let incidence = (Math.round(i.incidencevalue * 100) / 100).toFixed(2);
    let product = (Math.round(i.productvalueAverage * 100) / 100).toFixed(2);

    tooltipText.innerHTML = "Inzidenzwert: " + incidence + "<br />" + "Konsumwert: " + product + "%";
    tooltip.style.display = "block";
    tooltip.style.left = (d.screenX-60) + "px";
    tooltip.style.top = (d.screenY-60) + "px";
    
}

function hidetooltip(d){
    var tooltip = document.getElementById("tooltip");
    tooltip.style.display = "none";
}
