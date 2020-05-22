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
const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.grid.template.location = 0.5;
dateAxis.renderer.labels.template.location = 0.5;
dateAxis.renderer.grid.template.location = 0;
dateAxis.minZoomCount = 5;

dateAxis.renderer.labels.template.disabled = true;
dateAxis.renderer.labels.template.rotation = 270;
dateAxis.renderer.labels.template.verticalCenter = "top";
dateAxis.renderer.labels.template.horizontalCenter = "left";
dateAxis.cursorTooltipEnabled = false;

function createSingleValueGridLine(valueAxis, value, label) {
  const range = valueAxis.axisRanges.create();
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

const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.cursorTooltipEnabled = false;

// Create series
const series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.valueY = "textLength";
series.dataFields.dateX = "date";
series.name = "Verses";

// Create scrollbars
chart.scrollbarX = new am4core.Scrollbar();
chart.scrollbarY = new am4core.Scrollbar();

chart.cursor = new am4charts.XYCursor();

const info = chart.plotContainer.createChild(am4core.Container);
info.width = am4core.percent(100);
info.height = am4core.percent(20);
info.x = 10;
info.y = 10;
info.padding(10, 10, 10, 10);
info.background.fill = am4core.color("#000");
info.background.fillOpacity = 0.1;
info.layout = "grid";

// Create labels
function createLabel(field, title) {
  const titleLabel = info.createChild(am4core.Label);
  titleLabel.text = title + ":";
  titleLabel.marginRight = 5;
  titleLabel.minWidth = 60;

  const valueLabel = info.createChild(am4core.Label);
  valueLabel.id = field;
  valueLabel.text = "-";
  valueLabel.minWidth = 50;
  valueLabel.marginRight = 30;
  valueLabel.fontWeight = "bolder";
  valueLabel.wrap = true;
  valueLabel.maxWidth = 600;
}

createLabel("book", "Book");
createLabel("chapter", "Chapter");
createLabel("verse", "Verse");
createLabel("text", "Text")

// Set up cursor's events to update the label
chart.cursor.events.on("cursorpositionchanged", function(ev) {
  const dataItem = dateAxis.getSeriesDataItem(
    series,
    dateAxis.toAxisPosition(chart.cursor.xPosition),
    true
  );
  updateValues(dataItem);
});

// Updates values
function updateValues(dataItem) {
  am4core.array.each(["book", "chapter", "verse", "text"], function(key) {
    const label = chart.map.getKey(key);
    if (!dataItem)
      return;
    const text = dataItem.dataContext[key];
    label.text = text;
    if (dataItem.droppedFromOpen) {
      label.fill = series.dropFromOpenState.properties.fill;
    }
    else {
      label.fill = series.riseFromOpenState.properties.fill;
    }
  });
}

/*
series.events.on("hidden", updateTooltipText);
series.events.on("shown", updateTooltipText);
*/

/* Add a single tooltip to first series */
/*
var tooltipText = `[bold]YEAR {categoryX}[/]
----
Cars: {cars}
Motorcycles: {motorcycles}
Bicycles: {bicycles}`;
*/
/*
series.tooltip.pointerOrientation = "vertical";
series.tooltipText = "";

series.adapter.add('tooltipText', (text, target) => {
  const data = target.tooltipDataItem.dataContext;
  return `[bold]${data.book} ${data.chapter}:${data.verse}[/]\n${data.text}`;
});
*/

/*
dateAxis.adapter.add("getTooltipText", (text, target) => {
  const data = target.tooltipDataItem.dataContext;
  return `[bold]${data.book} ${data.chapter}:${data.verse}[/]`;
 });
 */
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