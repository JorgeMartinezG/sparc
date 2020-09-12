import React from "react";
import { CHART_LABELS, HAZARD_PARAMS } from "../config.js";

const getChartData = (summary_json, field, colorsMap) => {
  // Create a new array of data for chart.
  const items = Object.keys(colorsMap);
  const datasets = items.map((i) => {
    return {
      data: summary_json[field][i].by_month,
      type: "bar",
      stack: field,
      label: i,
      backgroundColor: colorsMap[i],
    };
  });

  const chartData = {
    labels: CHART_LABELS,
    datasets: datasets,
  };

  return { data: chartData };
};

export const processHazard = (hazard, geojson, summary, month) => {
  const { bpColors, colorsMap, field } = HAZARD_PARAMS[hazard];
  const admin2Values = summary.admin2;

  // Remove repeated values.
  const breakpoints = [...new Set(summary.all.breakpoints.natural)];

  const processedFeatures = geojson.features.map((f) => {
    const values = admin2Values[f.properties.admin2_code];
    if (values === undefined) {
      const properties = {
        ...f.properties,
        color: bpColors[0],
        value: 0,
      };
      return { ...f, properties: properties };
    }

    let month_idx = month;
    if (month === null) {
      month_idx = 0;
    }

    // Get the probability class associated.
    const probClassValue = Object.keys(values[field]).map((c) => {
      return values[field][c].by_month[month_idx];
    });

    /*
    const computedValue = parseInt(
      probClassValue.reduce((a, b) => a + b, 0) / probClassValue.length
    );
    */
    const computedValue = Math.min(
      Math.max(...probClassValue),
      breakpoints[breakpoints.length - 1]
    );

    // Assign color according to breakpoint.
    const idx = breakpoints.findIndex((e) => e >= computedValue);

    const properties = {
      ...f.properties,
      color: bpColors[idx],
      value: computedValue,
    };

    return { ...f, properties: properties };
  });

  const filtered = processedFeatures.filter((f) => f !== null);

  const geom = {
    type: "FeatureCollection",
    features: filtered,
  };

  const chartData = getChartData(summary, field, colorsMap);

  // Generate data for legend.

  const legendData = breakpoints.map((b, i) => {
    let val = b.toString();
    if (i > 0) {
      val = `${breakpoints[i - 1].toString()} - ${b.toString()}`;
    }

    return { range: val, color: bpColors[i] };
  });

  return {
    geom: geom,
    chartData: chartData,
    legendData: legendData,
  };
};

export const CycloneHazard = () => {
  return (
    <div>
      <p className="mb3">
        The chart above displays the number of people living in cyclone-prone
        areas, who may potentially be exposed to cyclone per month. The
        different colours indicate the probability of those people being
        affected; the darker the shade, the more likely that they will be
        affected as shown below.
      </p>
      <ul>
        <li>1 - 10% Less than 1 event every 20 years.</li>
        <li>
          10 - 20% Between 1 event every 20 years to 1 event every 18 years.
        </li>
        <li>
          20 - 30% Between 1 event every 18 years to 1 event every 16 years.
        </li>
        <li>
          30 - 40% Between 1 event every 16 years to 1 event every 14 years.
        </li>
        <li>
          40 - 50% Between 1 event every 14 years to 1 event every 12 years.
        </li>
        <li>
          50 - 60% Between 1 event every 12 years to 1 event every 10 years.
        </li>
        <li>
          60 - 70% Between 1 event every 10 years to 1 event every 8 years.
        </li>
        <li>
          70 - 80% Between 1 event every 8 years to 1 event every 6 years.
        </li>
        <li>
          80 - 90% Between 1 event every 6 years to 1 event every 4 years.
        </li>
        <li>90 - 100% More than 1 event every 4 years.</li>
      </ul>

      <p>
        You can choose to display only certain levels of probability by toggling
        the interactive legend under the chart: click on a probability class
        once to turn it off, click it again to turn it back on.
      </p>
    </div>
  );
};

export const DroughtHazard = () => {
  return (
    <div>
      <p>
        The chart above displays the number of people living in drought-prone
        areas, who may potentially be exposed to drought per month. The
        different colours indicate the probability of those people being
        affected; the darker the shade, the more likely that they will be
        affected as shown below.
      </p>

      <ul>
        <li>1 - 5% Less than 1 event every 20 years.</li>
        <li>
          5 - 10% Between 1 event every 20 years to 1 event every 10 years.
        </li>
        <li>
          10 - 20% Between 1 event every 10 years to 1 event every 5 years.
        </li>
        <li>20 - 100% More than 1 event every 5 years.</li>
      </ul>

      <p>
        You can choose to display only certain levels of probability by toggling
        the interactive legend under the chart: click on a probability class
        once to turn it off, click it again to turn it back on.
      </p>
    </div>
  );
};

export const LandslideHazard = () => {
  return (
    <div>
      <p className="f6">
        The chart above displays the number of people living in landslide-prone
        areas, who may potentially be exposed to landslide per month. The
        different colours indicate the probability of those people being
        affected; the darker the shade, the more likely that they will be
        affected. You can choose to display only certain levels of probability
        by toggling the interactive legend under the chart: click on a
        probability class once to turn it off, click it again to turn it back
        on.
      </p>
    </div>
  );
};

export const FloodHazard = () => {
  return (
    <div>
      <p className="mb3">
        The chart above displays the number of people living in flood-prone
        areas, who may potentially be exposed to flood per month. The different
        colours indicate the probability expressed as or “return period” (rp) of
        those people being affected. The darker the shade, the more likely that
        they will be affected, as shown below.
      </p>
      <ul>
        <li>
          <strong>Rp25:</strong> 1 event in 25 years; Probability of occurrence
          in any given year (4% chance).
        </li>
        <li>
          <strong>Rp100:</strong> 1 event in 100 years; Probability of
          occurrence in any given year (1% chance)
        </li>
        <li>
          <strong>Rp1000:</strong> 1 event in 1000 years; Probability of
          occurrence in any given year (0.1% chance)
        </li>
      </ul>
      <p className="mt3">
        These recurrence intervals give the estimated time interval between
        events of a similar size or intensity, and the greater the magnitude of
        the flood event the less chance of occurrence and viceversa. You can
        choose to display only certain levels of probability by toggling the
        interactive legend under the chart: click on a probability class once to
        turn it off, click it again to turn it back on.
      </p>
    </div>
  );
};
