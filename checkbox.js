function checkbox() {

    var size = 30,
        x=0,
        y=0,
        rx=5,
        ry=5,
        mark=26,
        checked=false,
        clickEvent;

    function checkBox(selection) {

        var g = selection.append("g"),
            box = g.append("rect")
                .attr("width", size)
                .attr("height", size)
                .attr("x", x)
                .attr("y", y)
                .attr("rx", rx)
                .attr("ry", ry)
                .style({
                    "fill-opacity": 1,
                    "fill":"#EEEEEE"
                })

        //Data to represent the check mark
        var coordinates = [
            {x: x + (size / 8), y: y + (size / 2)},
            {x: x + (size / 2.2), y: (y + size) - (size / 4)},
            {x: (x + size) - (size / 6), y: (y + (size / 6))}
        ];

        var line = d3.svg.line()
            .x(function(d){ return d.x; })
            .y(function(d){ return d.y; })
            .interpolate("basic");

        var mark = g.append("path")
            .attr("d", line(coordinates))
            .style({
                "stroke-width" : mark,
                "stroke" : "gray",
                "fill" : "none",
                "opacity": (checked)? 1 : 0
            });

        g.on("click", function () {
            checked = !checked;
            mark.style("opacity", (checked)? 1 : 0);

            if(clickEvent)
                clickEvent();

            d3.event.stopPropagation();
        });

    }

    checkBox.size = function (val) {
        size = val;
        return checkBox;
    }

    checkBox.x = function (val) {
        x = val;
        return checkBox;
    }

    checkBox.y = function (val) {
        y = val;
        return checkBox;
    }

    checkBox.rx = function (val) {
        rx = val;
        return checkBox;
    }

    checkBox.ry = function (val) {
        ry = val;
        return checkBox;
    }

    checkBox.mark = function (val) {
        mark = val;
        return checkBox;
    }



    checkBox.checked = function (val) {

        if(val === undefined) {
            return checked;
        } else {
            checked = val;
            return checkBox;
        }
    }

    checkBox.clickEvent = function (val) {
        clickEvent = val;
        return checkBox;
    }

    return checkBox;
}