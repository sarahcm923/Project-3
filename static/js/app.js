function optionChanged(e){
  $("select")
  .change(function(){
    buildGraph(this.value);
  });
}

// Import Data
var URL = `/data`; 
  d3.json(URL).then(function(Data, error) {
    if (error) throw error;
    data = JSON.parse(Data)
    console.log(data);
   // selectCountry = data.map(d=>d.country);
   // console.log(selectCountry);
  });

function buildGraph(country){
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
var svg = d3.select("#scatter1")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
   // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(d) {
        d.price = +d.price;
        d.points = +d.points;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.price)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([78, d3.max(data, d => d.points)])
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
    .attr("r", "5")
    .attr("fill", "orange")
    .attr("opacity", ".5");

    // // Create the variety for each circle
    // var circlesGroup = chartGroup.append("g")
    // .selectAll("text")
    // .data(data)
    // .enter().append("text")
    // .text(data => data.country)
    // .attr("text-anchor", "middle")
    // .attr("fill", "white")
    // .attr('font-size',12)
    // .attr("dx", d => xLinearScale(d.points))
    // .attr("dy", d => yLinearScale(d.price));
        
    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80,-60])
      .html(function(d) {
        return (`${d.country}<br>Price:$ ${d.price}<br>Points: ${d.points}`);
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


var svg = d3.select("#scatter2")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  

   // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(d) {
        d.price = +d.price;
        //data.points = +data.points;
    });

    
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.price)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([80, d3.max(data, d => d.variety)])
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
    .attr("cy", d => yLinearScale(d.variety))
    .attr("r", "20")
    .attr("fill", "red")
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
    .attr("dy", d => yLinearScale(d.variety));
        

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80,-60])
      .html(function(d) {
        return (`${d.country}<br>Province: ${d.province}Price: ${d.price}<br>Points: ${d.variety}`);
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


var svg = d3.select("#scatter3")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
// Import Data

   // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(d) {
        d.price = +d.price;
        //data.points = +data.points;
    });

    
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.price)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([80, d3.max(data, d => d.winery)])
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
    .attr("cy", d => yLinearScale(d.winery))
    .attr("r", "20")
    .attr("fill", "orange")
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
    .attr("dy", d => yLinearScale(d.winery));
        

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80,-60])
      .html(function(d) {
        return (`${d.country}<br>Price: ${d.price}<br>Points: ${d.winery}`);
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
    };


 function init() {
  // Grab a reference to the dropdown select element
   var selector = d3.select("#selDataset");

  // Use the list of countries to populate the select options
     d3.json("/data").then((country) => {
       console.log(typeof(country))
       country = JSON.parse(country);
       console.log(typeof(country))
       country.forEach((sample) => {
         selector
           .append("option")
           .text(sample)
           .property("value", sample);
       });

    // Use the first sample from the list to build the initial plots
     const firstSample = [0];
     buildGraph(firstSample);
     //buildMetadata(firstSample);
     });
 };

// function optionChanged(newSample) {
//   // Fetch new data each time a new sample is selected
//   buildGraph(newSample);
//  // buildMetadata(newSample);
// };

// // Initialize the dashboard
init();