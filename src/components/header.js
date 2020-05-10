import React from "react";
import { Modal } from "@wfp/ui";
import LogoEmblem from "../assets/wfp-logo-emblem-white.svg";
import { Search } from "./search.js";

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

export const Header = () => {
  return (
    <div className="bg-interactive-01">
      <About />
      <Logo />
      <Nav />
    </div>
  );
};
