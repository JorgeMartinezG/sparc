import React, { useRef, useEffect, useState, useContext } from "react";

import LogoEmblem from "./assets/wfp-logo-emblem-white.svg";
import { iconSearch, iconMenu } from "@wfp/icons";
import { Icon } from "@wfp/ui";
import mapboxgl from "mapbox-gl";

import { Modal, Button, Loading } from "@wfp/ui";
import Select from "react-select";
import bbox from "@turf/bbox";
import { Bar } from "react-chartjs-2";

import "./assets/style.scss";
import "@wfp/ui/assets/css/styles.min.css";

const API_URL = "http://sparc.wfp.org/api/data/";
const StateContext = React.createContext();
const CHART_LABELS = [
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

mapboxgl.accessToken =
  "pk.eyJ1Ijoiam9yZ2VtYXJ0aW5lemciLCJhIjoiY2p4OTU2OGxyMHNhejN6bzFycG15bnE4diJ9.WKKXi8wO5onqMhfwvE6sIQ";

const addLayer = (layerName, data, map) => {
  const options = {
    "fill-color": ["get", "prob_class"],
    "fill-opacity": 0.8,
  };

  if (map.getLayer(layerName)) {
    map.removeLayer(layerName);
  }
  if (map.getSource(layerName)) {
    map.removeSource(layerName);
  }

  map.fitBounds(bbox(data), { padding: 40 });
  map.addLayer({
    id: layerName,
    type: "fill",
    source: {
      type: "geojson",
      data: data,
    },
    paint: options,
  });
};

const processLandsLide = (geojson, summary_json, month) => {
  const admin2Values = summary_json.admin2;

  const colorsMap = {
    low: "#1d4877",
    medium: "#fbb021",
    high: "#f68838",
    very_high: "#ee3e32",
  };

  const processedFeatures = geojson.features.map((f) => {
    const values = admin2Values[f.properties.admin2_code];
    if (values !== undefined) {
      let prob_class = colorsMap["low"];

      // Get the probability class associated.
      Object.keys(values.prob_class).forEach((c) => {
        const sum = values.prob_class[c].by_month.reduce((a, b) => a + b, 0);
        if (sum !== 0) {
          prob_class = colorsMap[c];
        }
      });

      const properties = { ...f.properties, prob_class: prob_class };

      return { ...f, properties: properties };
    }
    return null;
  });

  const filtered = processedFeatures.filter((f) => f !== null);

  const geom = {
    type: "FeatureCollection",
    features: filtered,
  };

  // Create a new array of data for chart.
  const items = ["low", "medium", "high", "very_high"];
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

  return { geom: geom, chartData: chartData };
};

const processData = (hazard, geojson, summary_json) => {
  switch (hazard) {
    case "landslide":
      return processLandsLide(geojson, summary_json, 0);
    default:
      return null;
  }
};

const getGeom = async (map, country, hazard) => {
  // Get country geojson.
  const resp = await fetch(
    `${API_URL}country/${country}/dataset/context/${country}_NHR_ContextLayers.json`
  );
  const geojson = await resp.json();

  // Get data per admin2 code, per month, per category.
  const resp_summary = await fetch(
    `${API_URL}country/${country}/hazard/${hazard}/dataset/summary/${country}_NHR_PopAtRisk_${hazard}_Summary.json`
  );
  const summary_json = await resp_summary.json();

  const { geom, chartData } = processData(hazard, geojson, summary_json);

  addLayer("country", geom, map);

  return chartData;
};

const SearchMenu = ({ trigger }) => {
  const { search, searchState, setState, map } = useContext(StateContext);

  const getData = () => {
    setState((p) => {
      return { ...p, loading: true };
    });

    getGeom(map, searchState.country.value, searchState.hazard.value).then(
      (res) => {
        console.log(JSON.stringify(res));
        setState((p) => {
          return { ...p, loading: false, chartData: res };
        });
      }
    );
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      height: "34px",
      "min-height": "34px",
    }),
  };

  return (
    <div ref={trigger} className="pt2 bg-light-gray search is_open">
      <div className="w-70 center f7">
        <Select
          isClearable={true}
          placeholder="Search country"
          options={search.countries}
          value={searchState.country}
          styles={customStyles}
          onChange={(value) =>
            setState((p) => {
              return { ...p, country: value };
            })
          }
          className="mv2 gray"
          maxMenuHeight={150}
        />
        <Select
          isClearable={true}
          placeholder="Search hazard"
          options={search.hazards}
          value={searchState.hazard}
          styles={customStyles}
          onChange={(value) =>
            setState((p) => {
              return { ...p, hazard: value };
            })
          }
          className="mv2 gray"
        />
        <Button
          disabled={searchState.country === null}
          onClick={getData}
          kind="danger--primary"
        >
          Go!
        </Button>

        {searchState.loading === true ? <Loading /> : null}
      </div>
    </div>
  );
};

const SearchButton = ({ trigger }) => {
  const toggleSearch = () => {
    trigger.current.classList.toggle("is_open");
  };

  return (
    <div
      onClick={toggleSearch}
      className="pl2 pv2 hover-interactive-02 link pointer flex items-center w-25 tc"
    >
      <span>Search</span>
      <Icon className="ml2 fill-white h1 w1" icon={iconSearch} />
    </div>
  );
};

const Search = () => {
  const trigger = useRef();

  return (
    <div>
      <SearchButton trigger={trigger} />
      <SearchMenu trigger={trigger} />
    </div>
  );
};

const About = () => {
  return (
    <div className="tr ph2 pv1">
      <p className="white f6 b link pointer dim">About</p>
      <Modal open={false} passiveModal={true}>
        <p className="wfp--modal-content__text">Nothing to see here</p>
      </Modal>
    </div>
  );
};

const Nav = () => {
  return (
    <div className="white f6 b">
      <Search />
    </div>
  );
};

const Logo = () => {
  return (
    <div className="flex items-center w-100 justify-center pv2">
      <img alt="emblem" className="h3 w3 mr3" src={LogoEmblem} />
      <div>
        <p className="white ttu b f3 ma0 pa0">sparc</p>
        <p className="white b f5 mt0">Spatial Risk Calendar</p>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <div className="bg-interactive-01">
      <About />
      <Logo />
      <Nav />
    </div>
  );
};

const Sidebar = ({ sidebarRef }) => {
  const { searchState } = useContext(StateContext);

  let chart = null;
  if (searchState.chartData !== null) {
    chart = <Bar data={searchState.chartData} />;
  }

  return (
    <div
      ref={sidebarRef}
      className="w-30 bg-near-white shadow-2 sidebar absolute z-2 mv3 flex flex-column"
    >
      <Header />
      <div className="w-90 center overflow-y-hidden h-100"> {chart}</div>
    </div>
  );
};

const Icons = ({ sidebarRef }) => {
  return (
    <Icon
      className="ml2 h2 shadow-2 w2 absolute z-3 left-0 mt3 pa2 br-100 bg-light-gray ba1"
      icon={iconMenu}
      onClick={() =>
        ["dn", "flex", "flex-column"].map((i) => {
          sidebarRef.current.classList.toggle(i);
        })
      }
    />
  );
};

const fetchCountries = async (setSearch) => {
  const resp = await fetch(`${API_URL}/countries.json`);
  const jsonObj = await resp.json();

  const selectCountries = jsonObj.countries.map((o) => {
    return { label: o.dos.short, value: o.iso.alpha3 };
  });

  setSearch((s) => {
    return { ...s, countries: selectCountries };
  });
};

const fetchHazards = async (setSearch) => {
  const resp = await fetch(`${API_URL}/hazards.json`);
  const jsonObj = await resp.json();

  const selectHazards = jsonObj.hazards.map((o) => {
    return { label: o.title, value: o.id };
  });

  setSearch((s) => {
    return { ...s, hazards: selectHazards };
  });
};

const Viewer = () => {
  const mapRef = React.useRef();
  const sidebarRef = React.useRef();
  const [map, setMap] = useState(null);

  let config = {
    labels: [
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
    ],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        type: "bar",
        stack: "prob_class",
        label: "low",
        backgroundColor: "#1d4877",
      },
      {
        data: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        type: "bar",
        stack: "prob_class",
        label: "medium",
        backgroundColor: "#fbb021",
      },
      {
        data: [
          3880,
          3871,
          3867,
          3858,
          3858,
          3858,
          3507,
          3507,
          3858,
          3858,
          3858,
          3511,
        ],
        type: "bar",
        stack: "prob_class",
        label: "high",
        backgroundColor: "#f68838",
      },
      {
        data: [
          2581,
          2344,
          2259,
          1831,
          1717,
          1710,
          1352,
          1342,
          1709,
          1844,
          1975,
          2039,
        ],
        type: "bar",
        stack: "prob_class",
        label: "very_high",
        backgroundColor: "#ee3e32",
      },
    ],
  };

  const [searchState, setState] = useState({
    country: null,
    hazard: null,
    loading: false,
    chartData: config,
  });
  const [search, setSearch] = useState({ countries: null, hazards: null });

  useEffect(() => {
    fetchCountries(setSearch);
    fetchHazards(setSearch);
  }, []);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/light-v9",
      center: [0, 0],
      zoom: 2,
      attributionControl: false,
    });

    setMap(map);
  }, []);

  return (
    <StateContext.Provider
      value={{
        search: search,
        searchState: searchState,
        setState: setState,
        map: map,
      }}
    >
      <div ref={mapRef} className="vh-100 relative z-1">
        <Icons sidebarRef={sidebarRef} />
        <Sidebar sidebarRef={sidebarRef} />
      </div>
    </StateContext.Provider>
  );
};

const App = () => {
  return <Viewer />;
};

export default App;
