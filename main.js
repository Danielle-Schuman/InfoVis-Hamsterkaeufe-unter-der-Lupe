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

let COLORSCHEME = {deutschland: "#88CCEE",
                        china: "#44AA99",
                        usa: "#117733",
                        österreich: "#332288",
                        brasilien: "#DDCC77",
                        australien: "#999933",
                        italien: "#CC6677",
                        südafrika: "#882255",
                        russland: "#AA4499"};


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
    drawSpiderChart();
    drawSlider();
    document.getElementById("spider-chart").style.display = 'none';

    drawBubbleChart(prepareDataForScatterplot(importedData));
}

importData(main);


function onCheckboxClicked(container) {
    let filterButton = document.getElementById("filter-button");
    let checkbox = container.children[0];
    let country = checkbox.name;

	if (checkbox.checked == true) {
        checkbox.checked = false;
        filterSpiderChart(country, false);
        filterBubbleChartForCountry(country, false);
        saveFilterConfiguration(country, false);
        checkedFilters--;
	} else {
        checkbox.checked = true;
        filterSpiderChart(country, true);
        filterBubbleChartForCountry(country, true);
        saveFilterConfiguration(country, true);
        checkedFilters++;
        if (checkedFilters == 1) {
            // hide all other countries in bubblechart - we are in filter mode now!
            for(var i = 0; i < countries.length; i++) {
                if (country != countries[i] && countries[i] != "italien") {
                    filterBubbleChartForCountry(countries[i], false);
                }
            }
        }
    }
    if (checkedFilters <= 0) {
        // disable filter button
        onFilterToggleClicked(filterButton);
        hideSpiderChart();
    } else {
        showSpiderChart();
    }

    console.log("checkedFilters = " + checkedFilters);
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
    let path = document.getElementById(country);
    if (showValue == true) {
        path.setAttribute("opacity", 1);
    } else {
        path.setAttribute("opacity", 0);
    }
}

// filter per country - show = true --> show country data, show = false --> hide country data
function filterBubbleChartForCountry(country, showValue) {
    let bubblesOfCountry = d3.selectAll("#bubble-chart svg g g circle." + country);
    let allLinesOfCountry = d3.selectAll('#bubble-chart .verlaufslinie-' + country);
    let bubblesVisibleForCountry = 0;
    let toggle = document.getElementById("slider-toggle-input");
    let opacityValue = showValue == true ? 1 : 0;
    
    // bubbles ein oder ausblenden, wenn filter ein oder aus ist
    bubblesOfCountry.each(function (_, i) {
        let currentBubble = d3.select(this);
        let bubbleTime = currentBubble.datum().time;
        let sliderTime = currentSliderValue;
    
        if (bubbleTime.valueOf() <= sliderTime.valueOf()) {
            currentBubble.style("opacity", opacityValue);
            bubblesVisibleForCountry++;
        }
    });
    
    // linien ein/ausblenden, je nachdem ob Filter an oder aus
    allLinesOfCountry.each(function (_, i) {
        let currentLine = d3.select(this);
        let lineIndex = i;
    
        if (lineIndex < bubblesVisibleForCountry - 1) {
            if (toggle.checked == false) {
                currentLine.style("opacity", 0);
            }else {
                currentLine.style("opacity", opacityValue);
            }
        }
    });
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

function onPlayButtonClicked(button) {
    if (button.classList.contains("active")) {
        button.classList.remove("active");
        console.log("pause");
    } else {
        button.classList.add("active");
        console.log("play");
    }
    triggerBubbleChartChangeAndDrawLines();
}

function onSliderToggleClicked(toggle){
    let bubblechart = document.getElementById("bubble-chart");
    let toggleLabel = document.getElementById("progress-toggle-label");
    
    if (toggle.checked == true) {
        // Verlauf ausblenden
        toggleLabel.innerText = "Verlauf ausblenden";
    } else {
        // Verlauf einblenden
        toggleLabel.innerText = "Verlauf einblenden";
    }

    // bubbles und linien bis auf die länderbubble am Ende ein-bzw. ausblenden lassen
    updateBubblesAndLines(currentSliderValue, true, "deutschland");
    updateBubblesAndLines(currentSliderValue, true, "österreich");
    updateBubblesAndLines(currentSliderValue, true, "russland");

    updateBubblesAndLines(currentSliderValue, true, "usa");
    updateBubblesAndLines(currentSliderValue, true, "china");
    updateBubblesAndLines(currentSliderValue, true, "brasilien");

    updateBubblesAndLines(currentSliderValue, true, "australien");
    updateBubblesAndLines(currentSliderValue, true, "südafrika");
}

function onFilterToggleClicked(button) {
    if (button.classList.contains("enabled")) {
        button.classList.remove("enabled");
        button.disabled = true;
    }

    for(var i = 0; i < countries.length; i++) {
        if (countries[i] != "italien") {
            filterBubbleChartForCountry(countries[i], true);
        }
    }

    uncheckAllFilters();
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