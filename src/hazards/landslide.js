import React from "react";
import { CHART_LABELS } from "../config.js";
import { Bar } from "react-chartjs-2";

const colorsMap = {
  low: "#1d4877",
  medium: "#fbb021",
  high: "#f68838",
  very_high: "#ee3e32",
};

const bpColors = ["#F6BDC0", "#F1959B", "#F07470", "#EA4C46", "#DC1C13"];

const getChartDataLandslide = (summary_json, country) => {
  // Create a new array of data for chart.
  const items = Object.keys(colorsMap);
  const datasets = items.map((i) => {
    return {
      data: summary_json.prob_class[i].by_month,
      type: "bar",
      stack: "prob_class",
      label: i,
      backgroundColor: colorsMap[i],
    };
  });

  const chartData = {
    labels: CHART_LABELS,
    datasets: datasets,
  };

  return { type: "LANDSLIDE", data: chartData, country: country };
};

export const processLandsLide = (geojson, summary_json, country) => {
  const admin2Values = summary_json.admin2;

  // Remove repeated values.
  const breakpoints = [...new Set(summary_json.all.breakpoints.natural)];

  const processedFeatures = geojson.features.map((f) => {
    const values = admin2Values[f.properties.admin2_code];
    if (values === undefined) {
      return null;
    }

    // Get the probability class associated.
    const probClassValue = Object.keys(values.prob_class).map((c) => {
      return values.prob_class[c].by_month[0]; // TODO: Change according to month.
    });

    const sumValue = probClassValue.reduce((a, b) => a + b, 0);

    // Assign color according to breakpoint.
    const idx = breakpoints.findIndex((e) => e > sumValue);

    const properties = {
      ...f.properties,
      color: bpColors[idx],
      value: sumValue,
    };

    return { ...f, properties: properties };
  });

  const filtered = processedFeatures.filter((f) => f !== null);

  const geom = {
    type: "FeatureCollection",
    features: filtered,
  };

  const chartData = getChartDataLandslide(summary_json, country);

  return { geom: geom, chartData: chartData };
};

export const LandslideHazard = ({ data, country }) => {
  const opts = {
    title: {
      position: "top",
      text: "Population at Risk by Month for " + country,
      display: true,
      fontSize: "16",
    },
    scales: {
      xAxes: [
        {
          ticks: {
            fontSize: 14,
          },
        },
      ],
    },
  };

  return (
    <div>
      <Bar data={data} options={opts} />;
      <div className="w-80 center">
        <p className="f6">
          The chart above displays the number of people living in
          landslide-prone areas, who may potentially be exposed to landslide per
          month. The different colours indicate the probability of those people
          being affected; the darker the shade, the more likely that they will
          be affected. You can choose to display only certain levels of
          probability by toggling the interactive legend under the chart: click
          on a probability class once to turn it off, click it again to turn it
          back on.
        </p>
      </div>
    </div>
  );
};
