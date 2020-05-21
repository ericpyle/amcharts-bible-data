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

function addPseudoDateData(verseData) {
  const date = new Date(verseData.bibleWordPosition);
  return {...verseData, date };
}

const datedVersesData = versesData.filter(v => v.book === "Genesis").map(addPseudoDateData);
chart.data = datedVersesData;

// Create axes
var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.grid.template.location = 0.5;
dateAxis.renderer.labels.template.location = 0.5;
dateAxis.renderer.grid.template.location = 0;
dateAxis.minZoomCount = 5;

dateAxis.renderer.labels.template.disabled = true;
dateAxis.renderer.labels.template.rotation = 270;
dateAxis.renderer.labels.template.verticalCenter = "top";
dateAxis.renderer.labels.template.horizontalCenter = "left";

function createSingleValueGridLine(valueAxis, value, label) {
  var range = valueAxis.axisRanges.create();
  range.date = value;
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

datedVersesData.filter(v => v.chapter === "1" && v.verse === "1").forEach(v => createSingleValueGridLine(dateAxis, v.date, v.book));

var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
var series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.valueY = "textLength";
series.dataFields.dateX = "date";
series.name = "Verses";

// Create scrollbars
chart.scrollbarX = new am4core.Scrollbar();
chart.scrollbarY = new am4core.Scrollbar();

chart.cursor = new am4charts.XYCursor();

/*
// Add data
chart.data = [{
  "date": new Date(2018, 3, 20),
  "value": 90
}, {
  "date": new Date(2018, 3, 21),
  "value": 102
}, {
  "date": new Date(2018, 3, 27),
  "value": 65
}];
*/