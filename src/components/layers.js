import { HAZARD_PARAMS } from "../config.js";
import { addLayer } from "./utils.js";

export const handleLayers = (layers, searchState, map) => {
  if (layers === null) {
    return;
  }

  return layers
    .map((l) => handleLayer(l, searchState, map))
    .filter((l) => l !== null);
};

const createLegend = (breakpoints, bpColors) => {
  // Generate data for legend.

  return breakpoints.map((b, i) => {
    let val = b.toString();
    if (i > 0) {
      val = `${breakpoints[i - 1].toString()} - ${b.toString()}`;
    }

    return { range: val, color: bpColors[i] };
  });
};

const addLayerGeojson = (layer, searchState) => {
  switch (layer.id) {
    case "popatrisk":
      return addLayerPopAtRisk(layer, searchState);
    case "context_mean_change":
      return addLayerContext(layer, searchState, "delta_mean");
    default:
      console.log("Layer Id not found");
  }
};

const handleLayer = (layer, searchState, map) => {
  let layerData = null;
  if (layer.type === "geojson") {
    layerData = addLayerGeojson(layer, searchState);
  }

  if (layerData === null) {
    return null;
  }

  addLayer(layer.id, layerData.geom, map);

  return layerData.legend;
};

const rgbToHex = (str) => {
  return (
    "#" +
    str
      .split("(")[1]
      .split(")")[0]
      .split(",")
      .map((l) => parseInt(l))
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

const getMapStyles = (layer, summary, filterValue) => {
  const symbolizer = layer.carto.styles
    .filter((s) => s.id === filterValue)[0]
    .symbolizers.filter((s) => s.id === "default")[0].dynamic.options;

  const breakpointStr = symbolizer.breakpoints.split("_").slice(1).join("_");

  const breakpoints = [...new Set(summary.all.breakpoints[breakpointStr])];

  let attribute = symbolizer.attribute;
  let classes = symbolizer.classes;

  if (filterValue === "default") {
    classes = symbolizer.colors.ramp;
    attribute = null;
  }

  return { breakpoints, classes, attribute };
};

const addLayerContext = (layer, searchState, filterValue) => {
  const { geojson, context_summary } = searchState;
  const { breakpoints, classes, attribute } = getMapStyles(
    layer,
    context_summary,
    filterValue
  );

  const bpColors = classes.map((c) => c.color).map((c) => rgbToHex(c));
  console.log(breakpoints);
  const processedFeatures = geojson.features.map((f) => {
    const val = f.properties[attribute];
    const idx = Math.max(0, breakpoints.findIndex((e) => e >= val) - 1);

    const properties = {
      ...f.properties,
      color: bpColors[idx],
      value: val,
    };

    return { ...f, properties: properties };
  });

  const geom = {
    type: "FeatureCollection",
    features: processedFeatures,
  };

  const legend = createLegend(breakpoints, bpColors);

  return { geom: geom, legend: legend };
};

const addLayerPopAtRisk = (layer, searchState) => {
  const { summary, geojson, hazard, month } = searchState;
  const { field } = HAZARD_PARAMS[hazard.value];

  const style = layer.carto.styles.filter((s) => s.id === "default")[0];
  const symbolizer = style.symbolizers.filter((s) => s.id === "default")[0];

  const breakpointStr = symbolizer.dynamic.options.breakpoints
    .split("_")
    .slice(1)
    .join("_");
  const bpColors = symbolizer.dynamic.options.colors.ramp;

  const breakpoints = [...new Set(summary.all.breakpoints[breakpointStr])];

  const processedFeatures = geojson.features.map((f) => {
    const values = summary.admin2[f.properties.admin2_code];
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

  const legend = createLegend(breakpoints, bpColors);

  return { geom: geom, legend: legend };
};
