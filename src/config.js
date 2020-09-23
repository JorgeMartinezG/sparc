export const API_URL = "http://sparc.wfp.org/api/";

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
      "1-5%": "#1d4877",
      "5-10%": "#fbb021",
      "10-20%": "#f68838",
      "20-100%": "#ee3e32",
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
      "0.01-0.1": "#ff4040",
      "0.1-0.2": "#000080",
      "0.2-0.3": "#6897bb",
      "0.3-0.4": "#101010",
      "0.4-0.5": "#8b0000",
      "0.5-0.6": "#0e2f44",
      "0.6-0.7": "#660066",
      "0.7-0.8": "#008000",
      "0.8-0.9": "#ffff00",
      "0.9-1.0": "#003366",
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
      low: "#1d4877",
      medium: "#fbb021",
      high: "#f68838",
      very_high: "#ee3e32",
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
      "25": "#DAF7A6",
      "50": "#FFC300",
      "100": "#FF5733 ",
      "200": "#C70039",
      "500": "#900C3F",
      "1000": "#581845",
    },
    field: "rp",
  },
};

export const CHART_LABELS = DEFAULT_CHART_LABELS.map((i) => i.slice(0, 3));

export const MAPBOX_TOKEN =
  "pk.eyJ1Ijoiam9yZ2VtYXJ0aW5lemciLCJhIjoiY2p4OTU2OGxyMHNhejN6bzFycG15bnE4diJ9.WKKXi8wO5onqMhfwvE6sIQ";
