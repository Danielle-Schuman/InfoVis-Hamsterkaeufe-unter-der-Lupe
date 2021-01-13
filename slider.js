function drawSlider() {
    var sliderDummyData = d3.range(0, 13).map(function (m) {
        return new Date(2019, 7 + m, 1);
    });

    var sliderStep = d3
        .sliderBottom()
        .min(d3.min(sliderDummyData))
        .max(d3.max(sliderDummyData))
        .width(500)
        .tickFormat(d3.timeFormat('%b %Y'))
        .ticks(13)
        .tickValues(sliderDummyData)
        .step(1000 * 60 * 60 * 24 * 30)
        .default(sliderDummyData[0])
        .fill("#99ed83")
        .handle(
            d3
                .symbol()
                .type(d3.symbolCircle)
                .size(300)()
        );

    var gSliderStep = d3
        .select('div#slider-step')
        .append('svg')
        .attr('width', window.screen.width/2)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)');

    gSliderStep.call(sliderStep);
}
