import React, { useRef, useEffect, useState, useContext } from "react";

import LogoEmblem from "./assets/wfp-logo-emblem-white.svg";
import { iconSearch, iconMenu } from "@wfp/icons";
import { Icon } from "@wfp/ui";
import mapboxgl from "mapbox-gl";

import { Modal, Button, Loading } from "@wfp/ui";
import Select from "react-select";
import bbox from "@turf/bbox";

import "./assets/style.scss";
import "@wfp/ui/assets/css/styles.min.css";

const API_URL = "http://sparc.wfp.org/api/data/";
const StateContext = React.createContext();

mapboxgl.accessToken =
  "pk.eyJ1Ijoiam9yZ2VtYXJ0aW5lemciLCJhIjoiY2p4OTU2OGxyMHNhejN6bzFycG15bnE4diJ9.WKKXi8wO5onqMhfwvE6sIQ";

const addLayer = (layerName, data, map) => {
  const options = {
    "fill-color": "#fff",
    "fill-outline-color": "#00f",
    "fill-opacity": 0.5,
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

const getGeom = async (map, country) => {
  const resp = await fetch(
    `${API_URL}country/${country}/dataset/context/${country}_NHR_ContextLayers.json`
  );
  const json = await resp.json();
  addLayer("country", json, map);
};

const SearchMenu = ({ trigger }) => {
  const { search, searchState, setState, map } = useContext(StateContext);

  const getData = () => {
    setState((p) => {
      return { ...p, loading: true };
    });

    getGeom(map, searchState.country.value).then(() => {
      setState((p) => {
        return { ...p, loading: false };
      });
    });
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      height: "34px",
      "min-height": "34px",
    }),
  };

  return (
    <div ref={trigger} className="pt2 bg-light-gray search">
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
      <p className="white ttu b f3">sparc</p>
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
  return (
    <div
      ref={sidebarRef}
      className="w-30 bg-near-white shadow-2 sidebar absolute z-2 mv3 "
    >
      <Header />
    </div>
  );
};

const Icons = ({ sidebarRef }) => {
  return (
    <Icon
      className="ml2 h2 shadow-2 w2 absolute z-3 left-0 mt3 pa2 br-100 bg-light-gray ba1"
      icon={iconMenu}
      onClick={() => sidebarRef.current.classList.toggle("dn")}
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

  const [searchState, setState] = useState({
    country: null,
    hazard: null,
    loading: false,
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
