import React from "react";
import { Button } from "@wfp/ui";
import { Breadcrumb, BreadcrumbItem, BreadcrumbHome } from "@wfp/ui";

import LogoEmblem from "./assets/wfp-logo-emblem-white.svg";

import "./assets/style.scss";
import "@wfp/ui/assets/css/styles.min.css";

const Sidebar = () => {
  return (
    <div className="w-25 h4 bg-primary">
      <img className="h3 w3" src={LogoEmblem} />
      <div></div>
    </div>
  );
};

const App = () => {
  return (
    <div className="vh-100">
      <Sidebar />
    </div>
  );
};

export default App;
