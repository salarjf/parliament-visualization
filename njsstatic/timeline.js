
var seriesData = [ [], [], [] ];
var random = new Rickshaw.Fixtures.RandomData(150);
for (var i = 0; i < 70; i++) {
  random.addData(seriesData);
}
// instantiate our graph!
var graph = new Rickshaw.Graph( {
  element: document.getElementById("chart"),
  width: 960,
  height: 500,
  renderer: 'bar',
  series: [
    {
      color: "#c05020",
      data: seriesData[0],
    }, {
      color: "#30c020",
      data: seriesData[1],
    }, {
      color: "#6060c0",
      data: seriesData[2],
    }
  ]
} );
graph.render();
