//Function to populate the graph when an option is made
// ====================================================
function optionChanged(e){
  // console.log(e);
    d3.select("#scatter1").html("");
    d3.select("#barchart").html("");
    //buildGraph("ALL");
    buildGraph(e);
    buildTable(e);
}

//Import Data from Flask app(URL)
//================================
var URL = `/data`; 
  d3.json(URL).then(function(Data, error) {
    if (error) throw error;
    data = JSON.parse(Data)
    // console.log(data);
    var addresses = data.map(d => d.province + ', ' + d.country);
    // console.log(addresses); 
   // buildGraph("ALL");
    nearbyEventsMap(addresses);
    });

//Function to populate the table
// ==============================
function buildTable(country){
  if (country == "ALL"){
    var filterData =  data;
    //console.log(filterData);
  }
  else {
    var filterData =  data.filter(d => d.country == country);
    //console.log(filterData);
  }

  var tbody = d3.select("tbody");
  tbody.html("");
  filterData.forEach((country) => {
    var row = tbody.append("tr");
    Object.entries(country).forEach(([key, value]) => {
    var cell = row.append("td");
     cell.text(value);
    });
  });  
};


//Function to build three visualizations
// ==============================

function buildGraph(country){
// filtering the country graph
  if (country == "ALL"){
    var filterData =  data;
    // console.log(filterData);
  }
  else {
    var filterData =  data.filter(d => d.country == country);
    // console.log(filterData);
  }
 
//Canvas set up (SVG area)
var svgWidth = 1100;
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
  
   // Parse Data/Cast as numbers
    // ==============================
    filterData.forEach(function(d) {
        d.price = +d.price;
        d.points = +d.points;
        console.log(d.winery);
        
    });

    // reate scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(filterData, d => d.price)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([78, d3.max(filterData, d => d.points)])
      .range([height, 0]);

    //Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis)
      
    chartGroup.append("g")
      .call(leftAxis)

    // Color definition
    //const colorValue = d => d.points;
    //const colorScale = d3.scaleOrdinal()
    var colors = d3.scaleLinear()
    //.domain(d3.ticks(0, 50, 11))
    .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598", 
    "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);
		  
    //Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(filterData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.price))
    .attr("cy", d => yLinearScale(d.points))
    .attr("r", "5")
    .attr("fill", "red")
    .attr("opacity", ".5");

    //Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      //.offset([80,-60])
      .html(function(d) {
        return (`${d.country}<br>Winery: ${d.winery}<br>Price:$ ${d.price}<br>Points: ${d.points}`);
      });

    //Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    //Create event listeners to display and hide the tooltip
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

      chartGroup.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top / 2))
      .attr("text-align", "center")  
      .style("font-size", "16px") 
      .text("Wine Rating vs. Price");
    
// Graph 2  in id #scatter2
// ==============================
// Select body, append SVG area to it, and set the dimensions
//colors = d3.scale.category20()

var tsvg = d3.select("#barchart")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var tableGroup = tsvg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  function TopValues(arrayData){
    arrayData.sort(function(a,b) {
      return d3.descending(a.points, b.points);
    });
    return arrayData.slice(0,20);
  }
  
  bar_pareto = TopValues(filterData);
  console.log(bar_pareto);

  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
  var xBandScale = d3.scaleBand()
    .domain(bar_pareto.map(d => d.winery))
    .range([0, width])
    .padding(0.1);

  // Create a linear scale for the vertical axis.
  var tyLinearScale = d3.scaleLinear()
  .domain([0, d3.max(bar_pareto, d => d.points)])
    .range([height, 0]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var tbottomAxis = d3.axisBottom(xBandScale);
  var tleftAxis = d3.axisLeft(tyLinearScale).ticks(5);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  tableGroup.append("g")
    .call(tleftAxis);

    tableGroup.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height})`)
      .call(tbottomAxis)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("transform", "rotate(-65)");
  
  // function to pareto top 20 values      


  // Create one SVG rectangle per piece of tvData
  // Use the linear and band scales to position each rectangle within the chart
  var tablesGroup = tableGroup.selectAll(".bar")
  .data(bar_pareto)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xBandScale(d.winery))
    .attr("y", d => yLinearScale(d.points))
    .attr("width", xBandScale.bandwidth())
    .attr("height", d => height - yLinearScale(d.points))
    .attr("fill","lightblue");
    

    // Step 6: Initialize tool tip of the scatter plot 
    // ==============================
    var table_toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80,-60])
      .html(function(d) {
        return (`${d.country}<br>Province: ${d.province}<br>Price: ${d.price}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    tableGroup.call(table_toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    tablesGroup.on("mouseover", function(data) {
      table_toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        table_toolTip.hide(data);
      });

    // Create axes labelse
    tableGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 30)
      .attr("x", 0 - (height/ 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Points");

      tableGroup.append("text")
      .attr("transform", `translate(${width / 2},${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Winery")

      tableGroup.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-align", "center")  
        .style("font-size", "16px") 
        .text("Top Rated Wineries");
    
}

 //  Google Maps 
 var map;
 // Nearby Events with Google Maps
 window.nearbyEventsMap = (provinces) => {
 
   // Create a marker and set its position.
   initMap();
   const geocoder = new google.maps.Geocoder()
 
  //  console.log(provinces)
   for ( x in provinces) {
       const location = provinces[x]
 
       geocoder.geocode({
           address: location
       }, function (results, status) {
           if (status === 'OK') {
               const result = results[0].geometry.location
               const lat = result.lat()
               const lng = result.lng()
               const latLng = {
                   lat,
                   lng
               }
              //  console.log(latLng);
               return new google.maps.Marker({
                   map: map,
                   position: latLng
               })
           }
       })
   }
 }  

 function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
     center: {lat: 40.9040349, lng: 9.516764500000022},
     zoom: 2
   });
  }
 

 function init() {
  // Grab a reference to the dropdown select element
   var selector = d3.select("#selDataset");

  // Use the list of countries to populate the select options
     d3.json("/data").then((country) => {
      //  console.log(typeof(country))
       country = JSON.parse(country);
       console.log(typeof(country))
       console.log(country)
       country.forEach((sample) => {
         selector
      //      .append("option")
      //      .text(sample)
            .property("value", sample);
       });

    // Use the first sample from the list to build the initial plots
    buildGraph("ALL");
    buildTable("ALL");
    });
 };

// // Initialize the dashboard
init();


  