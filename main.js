let checkedFilters = 0;

drawSpiderChart();
//drawSlider();
document.getElementById("spider-chart").style.display = 'none';

function onCheckboxClicked(container) {
    let checkbox = container.children[0];
	let path = document.getElementById(checkbox.name);
	if (checkbox.checked == true) {
        checkbox.checked = false;
        path.setAttribute("opacity", 0);
        checkedFilters--;
	} else {
        checkbox.checked = true;
        path.setAttribute("opacity", 1);
        checkedFilters++;
    }
    if (checkedFilters <= 0) {
        // hide spider chart
        document.getElementById("spider-chart").style.display = 'none';
        document.getElementById("placeholder").style.display = 'block';
        document.getElementById("filter-toggle").children[0].checked = false;
    } else {
        // show spider chart
        document.getElementById("spider-chart").style.display = 'block';
        document.getElementById("placeholder").style.display = 'none';
        document.getElementById("filter-toggle").children[0].checked = true;
    }

    console.log("checkedFilters = " + checkedFilters);
}

function onPlayButtonClicked(button) {
    if (button.innerHTML == "Play") {
        button.innerHTML = "Pause";
        button.classList.add("active");
    } else {
        button.innerHTML = "Play";
        button.classList.remove("active");
    }
}