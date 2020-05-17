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

let data = [];
let visits = 10;
for (let i = 1; i < 1000; i++) {
  visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
  data.push({ x: i, value: visits });
}

const sampleData = [
  {
      "book": "Genesis",
      "chapter": "1",
      "verse": "1",
      "bookPosition": 0,
      "verseWordCount": 10,
      "text": "In the beginning God created the heaven and the earth.",
      "textLength": 54,
      "bibleWordPosition": 0,
      "bibleTextPosition": 0
  },
  {
      "book": "Genesis",
      "chapter": "1",
      "verse": "2",
      "bookPosition": 10,
      "verseWordCount": 29,
      "text": "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
      "textLength": 142,
      "bibleWordPosition": 10,
      "bibleTextPosition": 54
  },
  {
      "book": "Genesis",
      "chapter": "1",
      "verse": "3",
      "bookPosition": 39,
      "verseWordCount": 11,
      "text": "And God said, Let there be light: and there was light.",
      "textLength": 54,
      "bibleWordPosition": 39,
      "bibleTextPosition": 196
  }
];

console.log(versesData);
chart.data = versesData;

let xAxis = chart.xAxes.push(new am4charts.ValueAxis());
xAxis.renderer.grid.template.location = 0;
xAxis.minZoomCount = 5;

xAxis.renderer.labels.template.rotation = 270;
xAxis.renderer.labels.template.verticalCenter = "middle";
xAxis.renderer.labels.template.horizontalCenter = "left";

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

versesData.filter(v => v.chapter === "1" && v.verse === "1").forEach(v => createSingleValueGridLine(xAxis, v.bibleTextPosition, v.book));

// this makes the data to be grouped
// xAxis.groupData = true;
// xAxis.groupCount = 500;

let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

let series = chart.series.push(new am4charts.LineSeries());
series.dataFields.valueX = "bibleTextPosition";
series.dataFields.valueY = "textLength";
series.tooltipText = "{text}";
series.tooltip.pointerOrientation = "vertical";
series.tooltip.background.fillOpacity = 0.5;

chart.cursor = new am4charts.XYCursor();
chart.cursor.xAxis = xAxis;

let scrollbarX = new am4core.Scrollbar();
scrollbarX.marginBottom = 20;
chart.scrollbarX = scrollbarX;