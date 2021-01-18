export const API_URL = "https://sparc.wfp.org/api/";

export const LAYERS = {
  WMS: "WMS",
  GEOJSON: "GEOJSON",
};

const HOT = {
  version: 8,
  // "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
  glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
  sources: {
    "raster-tiles": {
      type: "raster",
      tiles: ["https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"],
      tileSize: 128,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright/">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: "simple-tiles",
      type: "raster",
      source: "raster-tiles",
      minzoom: 0,
      maxzoom: 22,
    },
  ],
};

export const BASEMAP_OPTIONS = [
  { label: "Bright", value: "bright-v9" },
  { label: "Satellite", value: "satellite-v9" },
  { label: "Humanitarian", value: HOT },
  { label: "Dark", value: "dark-v9" },
  { label: "Light", value: "light-v9" },
];

const DEFAULT_CHART_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const HAZARD_PARAMS = {
  drought: {
    bpColors: [
      "#b266b2",
      "#a64ca6",
      "#993299",
      "#8c198c",
      "#800080",
      "#730073",
      "#660066",
      "#590059",
      "#4c004c",
    ],
    colorsMap: {
      "1-5%": "#FFEDE0",
      "5-10%": "#F4A373",
      "10-20%": "#DC4551",
      "20-100%": "#8C1D1A",
    },
    field: "prob_class",
  },
  cyclone: {
    bpColors: [
      "#00e600",
      "#00cc00",
      "#00b300",
      "#009900",
      "#008000",
      "#006600",
      "#004c00",
      "#003300",
      "#001900",
    ],
    colorsMap: {
      "0.01-0.1": "#FFEDE0",
      "0.1-0.2": "#FAD59B",
      "0.2-0.3": "#F4A373",
      "0.3-0.4": "#F07461",
      "0.4-0.5": "#F08080",
      "0.5-0.6": "#CD5C5C",
      "0.6-0.7": "#CD5C5C",
      "0.7-0.8": "#DC4551",
      "0.8-0.9": "#B92A34",
      "0.9-1.0": "#8C1D1A",
    },
    field: "prob_class",
  },
  landslide: {
    bpColors: [
      "#ff4d4d",
      "#ff3333",
      "#ff1a1a",
      "#ff0000",
      "#e60000",
      "#cc0000",
      "#b30000",
    ],
    colorsMap: {
      low: "#FFEDE0",
      medium: "#F4A373",
      high: "#DC4551",
      very_high: "#8C1D1A",
    },
    field: "prob_class",
  },
  flood: {
    bpColors: [
      "#9999ff",
      "#7f7fff",
      "#6666ff",
      "#4c4cff",
      "#3232ff",
      "#1919ff",
      "#0000ff",
      "#0000e5",
      "#0000cc",
      "#0000b2",
      "#000099",
      "#00007f",
    ],
    colorsMap: {
      "25": "#FFEDE0",
      "50": "#FAD59B",
      "100": "#F4A373",
      "200": "#F07461",
      "500": "#DC4551",
      "1000": "#B92A34",
    },
    field: "rp",
  },
};

export const CHART_LABELS = DEFAULT_CHART_LABELS.map((i) => i.slice(0, 3));

export const MAPBOX_TOKEN =
  "pk.eyJ1Ijoiam9yZ2VtYXJ0aW5lemciLCJhIjoiY2p4OTU2OGxyMHNhejN6bzFycG15bnE4diJ9.WKKXi8wO5onqMhfwvE6sIQ";
