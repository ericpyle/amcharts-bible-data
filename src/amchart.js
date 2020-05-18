/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { default as versesData } from './kjv-verses.json';

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

let chart = am4core.create("chartdiv", am4charts.XYChart);
chart.paddingRight = 20;

/*
let data = [];
let visits = 10;
for (let i = 1; i < 1000; i++) {
  visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
  data.push({ x: i, value: visits });
}
*/

chart.data = versesData; //.filter(v => v.book === "Genesis");

var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "bibleTextPosition";
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.minGridDistance = 30;

/*
let xAxis = chart.xAxes.push(new am4charts.ValueAxis());
xAxis.renderer.grid.template.location = 0;
xAxis.minZoomCount = 5;

xAxis.renderer.labels.template.rotation = 270;
xAxis.renderer.labels.template.verticalCenter = "middle";
xAxis.renderer.labels.template.horizontalCenter = "left";
*/

categoryAxis.renderer.labels.template.rotation = 270;
categoryAxis.renderer.labels.template.verticalCenter = "middle";
categoryAxis.renderer.labels.template.horizontalCenter = "left";

function createSingleValueGridLine(valueAxis, value, label) {
  var range = valueAxis.axisRanges.create();
  range.value = value;
  range.grid.stroke = am4core.color("#396478");
  range.grid.strokeWidth = 2;
  range.grid.strokeOpacity = 1;
  range.label.inside = true;
  range.label.text = label;
  range.label.fill = range.grid.stroke;
  range.label.truncate = true;
  range.label.maxWidth = 100;
  range.label.location = 0.5;
  //range.label.align = "right";
  // range.label.verticalCenter = "bottom";
  // range.label.paddingTop = 40;
  // range.label.horizontalCenter = "middle";
  // range.label.fontWeight = "bolder";
}

versesData.filter(v => v.chapter === "1" && v.verse === "1").forEach(v => createSingleValueGridLine(categoryAxis, v.bibleTextPosition, v.book));

// this makes the data to be grouped
// xAxis.groupData = true;
// xAxis.groupCount = 500;

let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

let series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.valueY = "textLength";
series.dataFields.categoryX = "bibleTextPosition";
series.name = "Verse Length";
series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
series.columns.template.fillOpacity = .8;
// series.tooltipText = "{text}";
// series.tooltip.pointerOrientation = "vertical";
// series.tooltip.background.fillOpacity = 0.5;

var columnTemplate = series.columns.template;
columnTemplate.strokeWidth = 2;
columnTemplate.strokeOpacity = 1;

chart.cursor = new am4charts.XYCursor();
chart.cursor.xAxis = categoryAxis;

let scrollbarX = new am4core.Scrollbar();
scrollbarX.marginBottom = 20;
chart.scrollbarX = scrollbarX;