// @TODO: YOUR CODE HERE!

// if (country != "all"){
//     buidGraph(country);
// }
// else{

// }

// function buildGraph(country){
var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 20,
  bottom: 80,
  left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
//var URL = `/samples/${sample}`; 
 // d3.json(URL).then(function(sample) {
   // console.log(sample);
var URL = `/data`; 
  d3.json(URL).then(function(data, error) {
    if (error) throw error;
    console.log(data);
    data.forEach(function(data) {
        data.price = +data.price;
        data.points = +data.points;
    } );
  

 
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    
      //data.abbr = data.abbr;
     
  
   
    
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.price)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([80, d3.max(data, d => d.points)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
   
    var leftAxis = d3.axisLeft(yLinearScale);
    
    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis)
      
    chartGroup.append("g")
      .call(leftAxis)
      
    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.price))
    .attr("cy", d => yLinearScale(d.points))
    .attr("r", "20")
    .attr("fill", "")
    .attr("opacity", ".5");

    // Create the variety for each circle
    var circlesGroup = chartGroup.append("g")
    .selectAll("text")
    .data(data)
    .enter().append("text")
    .text(data => data.country)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr('font-size',12)
    .attr("dx", d => xLinearScale(d.price))
    .attr("dy", d => yLinearScale(d.points));
        

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      //.offset([60,-60])
      .html(function(d) {
        return (`${d.country}<br>Price: ${d.price}<br>Points: ${d.points}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 30)
      .attr("x", 0 - (height/ 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Points");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Price");

  });
    
//};
