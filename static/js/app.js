// function buildCharts(sample) {
//     d3.json("/samples/" + sample).then(function(data) {
//         // @TODO: Use `d3.json` to fetch the sample data for the plots
//         // var country = data.otu_ids 
        // var sample_values = data.sample_values
        // var otu_labels = data.otu_labels
        // // @TODO: Build a Bubble Chart using the sample data
d3.csv("winemag-data-130k-v2.csv", function (data) {
    //console.log(data);
            

    var Bubble_data = [{
        x: data.price,
        y: data.points,
        type: "scatter",
        mode: "markers",
        text: data.variety,
        marker: {
        color: "red",
        size: data.price,
        }

    }];
    console.log(Bubble_data);
     var layout = {
         margin: {t: 0, l: 0},
         xaxis: {title: "Wine Reviews"}
     }

    Plotly.newPlot("bubble", Bubble_data , layout);


    // @TODO: Build a Pie Chart
    var pie_data =[{
        labels : data.province,
        values : data.points,
        hovertext : data.variety,
        type : "pie"
    }] 
    // var layout = {margin: { t: 0, l: 0}}

    Plotly.newPlot("pie", pie_data, layout);
});   