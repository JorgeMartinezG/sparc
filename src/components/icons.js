import React, { useMemo } from "react";
import { iconMenu, iconPrintGlyph } from "@wfp/icons";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Icon } from "@wfp/ui";
import { PdfPrint } from "./pdf.js";

const MemoComponent = () => {
  return useMemo(
    () => (
      <PDFDownloadLink document={<PdfPrint />} fileName="somename.pdf">
        {({ blob, url, loading, error }) =>
          loading ? null : (
            <Icon
              className="ml2 h2 shadow-2 w2 pa2 br-100 bg-light-gray ba1"
              icon={iconPrintGlyph}
            />
          )
        }
      </PDFDownloadLink>
    ),
    []
  );
};

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

      <div style={{ top: "4.5em" }} className="z-4 absolute ">
        <MemoComponent />
      </div>
    </div>
  );
};
