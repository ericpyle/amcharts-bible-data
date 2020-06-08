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

let chapterWordPosition = 0;
function addPseudoDateData(verseData, index, array) {
  if (verseData.verse === "1") {
    chapterWordPosition = 0;
  } else {
    const prevVerseData = array[index - 1];
    chapterWordPosition += prevVerseData.verseWordCount;
  }
  const date = new Date(verseData.bibleTextPosition);
  const chapterWordPositionEnd = chapterWordPosition + verseData.verseWordCount;
  return {...verseData, date, chapterWordPosition, chapterWordPositionEnd };
}

const datedVersesData = versesData.map(addPseudoDateData); // .filter(v => v.book === "Genesis" || v.book === "Exodus")
chart.data = datedVersesData;

// Create axes
const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.grid.template.location = 0.5;
dateAxis.renderer.labels.template.location = 0.5;
dateAxis.renderer.grid.template.location = 0;
dateAxis.minZoomCount = 5;

dateAxis.renderer.labels.template.disabled = true;
// dateAxis.renderer.labels.template.dy = 40;
// dateAxis.renderer.labels.template.rotation = -45;
// dateAxis.renderer.labels.template.verticalCenter = "top";
// dateAxis.renderer.labels.template.horizontalCenter = "left";
dateAxis.cursorTooltipEnabled = false;

dateAxis.groupData = true;
// dateAxis.groupCount = 350;

function createSingleValueGridLine(valueAxis, value, label, labelIndex) {
  const range = valueAxis.axisRanges.create();
  range.date = value;
  range.grid.stroke = am4core.color("#396478");
  range.grid.strokeWidth = 2;
  range.grid.strokeOpacity = 1;
  range.label.inside = false;
  range.label.text = label;
  range.label.fill = range.grid.stroke;
  range.label.paddingTop = (labelIndex % 11) * 20;
  range.label.paddingLeft = 0;
  // range.label.y = -50;
  // range.label.x = -50;
  // range.label.truncate = true;
  // range.label.maxWidth = 100;
  // range.label.location = 0.001;
  // range.label.y = 100;
  // range.label.align = "right";
  // range.label.verticalCenter = "bottom";
  // range.label.paddingTop = 40;
  range.label.horizontalCenter = "left";
  // range.label.fontWeight = "bolder";
}
let indexOfLabel = 0;
datedVersesData.filter(v => v.chapter === "1" && v.verse === "1").forEach(v => createSingleValueGridLine(dateAxis, v.date, v.book, indexOfLabel++));

const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.cursorTooltipEnabled = false;

// Create series
const series = chart.series.push(new am4charts.CandlestickSeries());
series.dataFields.dateX = "date";
series.dataFields.valueY = "chapterWordPositionEnd"; // "close";
series.dataFields.openValueY = "chapterWordPosition"; // "open";
series.dataFields.lowValueY = "chapterWordPosition"; // "low";
series.dataFields.highValueY = "chapterWordPositionEnd"; // "high";

/*
series.dataFields.valueY = "chapterWordPosition";
series.dataFields.dateX = "date";
*/
series.name = "Verses";
series.groupFields.valueY = "max";
series.groupFields.openValueY = "min";
series.groupFields.lowValueY = "min";
series.groupFields.highValueY = "max";

// Create scrollbars
chart.scrollbarX = new am4core.Scrollbar();
// chart.scrollbarY = new am4core.Scrollbar();

chart.cursor = new am4charts.XYCursor();
chart.cursor.xAxis = dateAxis;
chart.cursor.fullWidthLineX = true;
chart.cursor.lineX.strokeWidth = 0;
chart.cursor.lineX.fill = am4core.color("#8F3985");
chart.cursor.lineX.fillOpacity = 0.1;
chart.cursor.lineY.disabled = true;
chart.cursor.behavior = "zoomX";

const info = chart.plotContainer.createChild(am4core.Container);
info.width = am4core.percent(100);
info.x = 10;
info.y = 10;
info.padding(10, 10, 10, 10);
info.background.fill = am4core.color("#000");
info.background.fillOpacity = 0.1;
info.layout = "grid";

// Create labels
function createBCVLabel(postFix) {
  const bookLabel = info.createChild(am4core.Label);
  bookLabel.id = `bcv${postFix}`;
  bookLabel.wrap = true;
  bookLabel.width = am4core.percent(90);
  /*
  valueLabel.minWidth = 50;
  valueLabel.marginRight = 30;
  valueLabel.fontWeight = "bolder";
  valueLabel.wrap = true;
  valueLabel.maxWidth = 600;
  */
}

chart.cursor.events.on("hidden", function(ev) {
  var range = ev.target.xRange;
  if (range) {
    const dataItemStart = dateAxis.getSeriesDataItem(
      series,
      dateAxis.toAxisPosition(range.start),
      true
    );
    const dataItemEnd = dateAxis.getSeriesDataItem(
      series,
      dateAxis.toAxisPosition(range.end),
      true
    );
    if (dataItemStart.groupDataItems && dataItemStart.groupDataItems.length > 1) {
      updateValues(dataItemStart.groupDataItems[0], '-start', false);
    } else {
      updateValues(dataItemStart, '-start', false);
    }
    updateValues(dataItemEnd, '-end', false);
    return;
  }
  if (xPositionSelectStarted) {
    const dataItemStart = dateAxis.getSeriesDataItem(series,
      dateAxis.toAxisPosition(xPositionSelectStarted), true);
    if (dataItemStart.groupDataItems && dataItemStart.groupDataItems.length > 1) {
      updateValues(dataItemStart.groupDataItems[0], '-start', false);
      updateValues(dataItemStart.groupDataItems[dataItemStart.groupDataItems.length - 1], '-end', false);
    } else {
      updateValues(dataItemStart, '-start', false);
      updateValues(dataItemStart, '-end', true);
    }
    return;
  }

  
});

let xPositionSelectStarted = null;
chart.cursor.events.on("selectstarted", function(ev) {
  xPositionSelectStarted = ev.target.xPosition;
  xPositionSelectEnded = null;
});

let xPositionSelectEnded = null;
chart.cursor.events.on("selectended", function(ev) {
  if (ev.target.xPosition !== xPositionSelectStarted) {
    xPositionSelectStarted = null;
    // console.log({ selectended: ev.target.xPosition });
  }
  xPositionSelectEnded = ev.target.xPosition;
});

// Set up cursor's events to update the label
chart.cursor.events.on("cursorpositionchanged", function(ev) {
  // console.log({ cursorpositionchanged: ev.target.xPosition });
  if (chart.cursor.isHiding || chart.cursor.isHidden) {
    return;
  }
  if (ev.target.xPosition === xPositionSelectEnded &&
    xPositionSelectStarted !== xPositionSelectEnded) {
    return;
  }
  const xPosStart = xPositionSelectStarted || chart.cursor.xPosition;
  const dataItemStarted = dateAxis.getSeriesDataItem(
    series,
    dateAxis.toAxisPosition(xPosStart),
    true
  );
  const dataItemEnded = !xPositionSelectStarted ? dataItemStarted :
    dateAxis.getSeriesDataItem(
      series,
      dateAxis.toAxisPosition(chart.cursor.xPosition),
      true
    );
  // dataItemStarted.groupDataItems[0]
  if (dataItemStarted.groupDataItems && dataItemStarted.groupDataItems.length > 1) {
    updateValues(dataItemStarted.groupDataItems[0], '-start', false);
  } else {
    updateValues(dataItemStarted, '-start', false);
  }
  if (dataItemEnded !== dataItemStarted &&
    dataItemEnded.groupDataItems && dataItemEnded.groupDataItems.length > 1) {
    updateValues(dataItemEnded.groupDataItems[0], '-end', false);
  } else {
    updateValues(dataItemEnded, '-end', true);
  }
});

// Updates values
function updateValues(dataItem, postFix, disabled) {
  let label = chart.map.getKey(`bcv${postFix}`);
  if (!label) {
    createBCVLabel('-start');
    createBCVLabel('-end');
    label = chart.map.getKey(`bcv${postFix}`);
  }
  const { book, chapter, verse, text } = dataItem.dataContext;
  label.disabled = disabled;
  if (!disabled) {
    label.text = `(${book} ${chapter}:${verse}) ${text}`;
  }
  console.log({ postFix, disabled, labelText: label.text, labelDisabled: label.disabled });
  /*
  if (dataItem.droppedFromOpen) {
    label.fill = series.dropFromOpenState.properties.fill;
  }
  else {
    label.fill = series.riseFromOpenState.properties.fill;
  }
  */
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