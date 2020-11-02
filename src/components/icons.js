import React from "react";
import { iconMenu } from "@wfp/icons";
import { Icon } from "@wfp/ui";

export const Icons = ({ sidebarRef }) => {
  return (
    <div>
      <Icon
        className="ml2 h2 shadow-2 w2 absolute z-3 left-0 mt3 pa2 br-100 bg-light-gray ba1"
        icon={iconMenu}
        onClick={() =>
          ["dn", "flex", "flex-column"].map((i) => {
            sidebarRef.current.classList.toggle(i);
            return null;
          })
        }
      />
    </div>
  );
};
