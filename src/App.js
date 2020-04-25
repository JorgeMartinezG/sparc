import React from "react";
import { Button } from "@wfp/ui";
import { Breadcrumb, BreadcrumbItem, BreadcrumbHome } from "@wfp/ui";
import "./style.scss";

import "@wfp/ui/assets/css/styles.min.css";

const App = () => {
  return (
    <div className="container">
      <h1>hello</h1>
      <Breadcrumb>
        <BreadcrumbItem>
          <a href="/#">
            <BreadcrumbHome />
          </a>
        </BreadcrumbItem>
        <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
        <BreadcrumbItem disableLink>Breadcrumb 3</BreadcrumbItem>
        link
      </Breadcrumb>
    </div>
  );
};

export default App;
