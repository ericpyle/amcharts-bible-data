/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
// import * as versesData from './kjv-verses.json';

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

let chart = am4core.create("chartdiv", am4charts.XYChart);
chart.paddingRight = 20;

let data = [];
let visits = 10;
for (let i = 1; i < 1000; i++) {
  visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
  data.push({ x: i, value: visits });
}

chart.data = data;

let xAxis = chart.xAxes.push(new am4charts.ValueAxis());
xAxis.renderer.grid.template.location = 0;
xAxis.minZoomCount = 5;


// this makes the data to be grouped
xAxis.groupData = true;
xAxis.groupCount = 500;

let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

let series = chart.series.push(new am4charts.LineSeries());
series.dataFields.valueX = "x";
series.dataFields.valueY = "value";
series.tooltipText = "{valueY}";
series.tooltip.pointerOrientation = "vertical";
series.tooltip.background.fillOpacity = 0.5;

chart.cursor = new am4charts.XYCursor();
chart.cursor.xAxis = xAxis;

let scrollbarX = new am4core.Scrollbar();
scrollbarX.marginBottom = 20;
chart.scrollbarX = scrollbarX;