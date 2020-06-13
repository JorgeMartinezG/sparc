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
    bpColors: ["#F6BDC0", "#F1959B", "#F07470", "#EA4C46", "#DC1C13"],
    colorsMap: {
      low: "#1d4877",
      medium: "#fbb021",
      high: "#f68838",
      very_high: "#ee3e32",
    },
    field: "prob_class",
  },
  flood: {
    bpColors: ["#74D7FB", "#56C3E4", "#2CB4DD", "#1D8DAF", "#1D8DAF"],
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
