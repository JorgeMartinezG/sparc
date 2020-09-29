import { HAZARD_PARAMS, LAYERS } from "../config.js";
import { addLayer } from "./utils.js";

const createLegend = (breakpoints, bpColors, symbolizer, title) => {
  // Generate data for legend.
  const intl = new Intl.NumberFormat("en-US", {
    style: "decimal",
    notation: "compact",
  });

  const arrayValues = breakpoints.map((b, i) => {
    let val = intl.format(b);
    if (i > 0) {
      val = `${intl.format(breakpoints[i - 1])}/${intl.format(b)}`;
    }

    return { range: val, color: bpColors[i] };
  });

  const range = symbolizer.metadata.range;
  const description = symbolizer.description;

  return { arrayValues, range, description, title };
};

const addLayerGeojson = (searchState) => {
  switch (searchState.layer.id) {
    case "popatrisk":
      return addLayerPopAtRisk(searchState);
    default:
      return addLayerContext(searchState);
  }
};

const addLayerWMS = (layer, map) => {
  const params = new URLSearchParams({
    version: layer.wms.version,
    format: layer.wms.format,
    service: "WMS",
    layers: layer.wms.layers[0],
    request: "GetMap",
    transparent: "true",
    width: "256",
    height: "256",
    srs: "EPSG:3857",
  });

  const source = {
    type: "raster",
    // use the tiles option to specify a WMS tile source URL
    // https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/
    tiles: [`${layer.wms.url}?bbox={bbox-epsg-3857}&${params}`],
    tileSize: 256,
  };

  const mapLayer = {
    id: LAYERS.WMS,
    type: "raster",
    source: source,
    paint: {},
  };

  return { geom: mapLayer, legend: null };
};

export const handleLayer = (searchState, map) => {
  const { layer } = searchState;
  if (layer === null) {
    return null;
  }

  let layerData = null;
  if (layer.type === "geojson") {
    layerData = addLayerGeojson(searchState);
    addLayer(layerData.geom, map);
  }
  if (layer.type === "WMS") {
    layerData = addLayerWMS(layer);

    Object.values(LAYERS).forEach((v) => {
      if (map.getLayer(v)) {
        map.removeLayer(v);
        map.removeSource(v);
      }
    });

    map.addLayer(layerData.geom);
  }

  return layerData;
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

const getMapStyles = (layer, summary) => {
  const symbolizer = layer.carto.styles[0].symbolizers.filter(
    (s) => s.id === "default"
  )[0];

  let breakpoints = null;

  if (layer.id === "context_ldi") {
    breakpoints = Array.from({ length: 9 }, (_, i) => i + 1);
  } else {
    const breakpointStr = symbolizer.dynamic.options.breakpoints
      .split("_")
      .slice(1)
      .join("_");
    breakpoints = [...new Set(summary.all.breakpoints[breakpointStr])];
  }

  return { breakpoints, symbolizer };
};

const addLayerContext = (searchState) => {
  const { geojson, context_summary, layer } = searchState;
  const { breakpoints, symbolizer } = getMapStyles(layer, context_summary);
  const { classes, attribute } = symbolizer.dynamic.options;

  let bpColors = classes
    .map((c) => c.color)
    .map((c) => {
      if (c.startsWith("#")) return c;
      return rgbToHex(c);
    });

  // Add no change for vegetation loss and gain layers.
  if (
    ["context_positive_change", "context_negative_change"].includes(layer.id)
  ) {
    bpColors.unshift("#AAAAAA");
  }

  const processedFeatures = geojson.features.map((f) => {
    const val = f.properties[attribute];
    const idx = Math.max(
      0,
      breakpoints.findIndex((e) => e >= val)
    );

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

  const legend = createLegend(breakpoints, bpColors, symbolizer, layer.title);

  return { geom: geom, legend: legend };
};

const addLayerPopAtRisk = (searchState) => {
  const { summary, geojson, hazard, month, layer } = searchState;
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

  const legend = createLegend(breakpoints, bpColors, symbolizer, layer.title);

  return { geom: geom, legend: legend };
};
