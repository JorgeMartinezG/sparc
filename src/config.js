export const API_URL = "http://sparc.wfp.org/api/data/";

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
