import React from "react";
import { Button } from "@wfp/ui";

import LogoEmblem from "./assets/wfp-logo-emblem-white.svg";
import { iconSearch } from "@wfp/icons";
import { Modal } from "@wfp/ui";

import "./assets/style.scss";
import "@wfp/ui/assets/css/styles.min.css";

const About = () => {
  return (
    <div className="tr ph2 pv1">
      <p className="white f6 b link pointer dim">About</p>
      <Modal open={true} passiveModal={true}>
        <p className="wfp--modal-content__text">Nothing to see here</p>
      </Modal>
    </div>
  );
};

const Nav = () => {
  return (
    <div className="white f6 b">
      <Button icon={iconSearch}>Search</Button>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="flex items-center w-100 justify-center pv2">
      <img className="h3 w3 mr3" src={LogoEmblem} />
      <p className="white ttu b f3">sparc</p>
    </div>
  );
};

const Header = () => {
  return (
    <div className="w-20 bg-primary">
      <About />
      <Logo />
      <Nav />
    </div>
  );
};

const Sidebar = () => {
  return <Header />;
};

const App = () => {
  return (
    <div className="vh-100">
      <Sidebar />
    </div>
  );
};

export default App;
