import React from "react";
import { Button } from "@wfp/ui";
import { Breadcrumb, BreadcrumbItem, BreadcrumbHome } from "@wfp/ui";

import "@wfp/ui/assets/css/styles.min.css";

const App = () => {
  return (
    <div>
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
