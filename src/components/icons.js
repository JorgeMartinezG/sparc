import React, { useContext } from "react";
import { iconMenu, iconPrintGlyph } from "@wfp/icons";
import { pdf } from "@react-pdf/renderer";
import { Icon } from "@wfp/ui";
import { PdfPrint } from "./pdf.js";
import { StateContext } from "../App.js";
import { saveAs } from "file-saver";

const PdfRenderer = () => {
  const { map } = useContext(StateContext);

  return (
    <Icon
      style={{ top: "4.5em" }}
      className="ml2 h2 shadow-2 w2 pa2 br-100 bg-light-gray ba1 z-4 absolute"
      icon={iconPrintGlyph}
      onClick={async () => {
        const doc = <PdfPrint map={map} />;
        const asPdf = pdf(doc);
        const blob = await asPdf.toBlob();
        saveAs(blob, "document.pdf");
      }}
    />
  );
};

export const Icons = ({ sidebarRef }) => {
  const { searchState } = useContext(StateContext);
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

      {searchState.status === "SUCCESS" ? <PdfRenderer /> : null}
    </div>
  );
};
