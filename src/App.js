import React, { useRef, useEffect, useState } from "react";

import LogoEmblem from "./assets/wfp-logo-emblem-white.svg";
import { iconSearch } from "@wfp/icons";
import { Icon } from "@wfp/ui";
import mapboxgl from "mapbox-gl";

import { Modal } from "@wfp/ui";

import "./assets/style.scss";
import "@wfp/ui/assets/css/styles.min.css";

mapboxgl.accessToken =
  "pk.eyJ1Ijoiam9yZ2VtYXJ0aW5lemciLCJhIjoiY2p4OTU2OGxyMHNhejN6bzFycG15bnE4diJ9.WKKXi8wO5onqMhfwvE6sIQ";

const SearchMenu = ({ trigger }) => {
  return (
    <div ref={trigger} className="bg-gray search">
      AAAAA
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
    <div className="w-20 bg-interactive-01 absolute left-0">
      <About />
      <Logo />
      <Nav />
    </div>
  );
};

const Sidebar = () => {
  return <Header />;
};

const Viewer = () => {
  const mapRef = React.useRef();
  const [map, setMap] = useState(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/light-v9",
      center: [0, 0],
      zoom: 2,
    });

    setMap(map);
  }, []);

  return (
    <div ref={mapRef} className="bg-light-gray vh-100 relative">
      <Sidebar />
    </div>
  );
};

const App = () => {
  return <Viewer />;
};

export default App;
