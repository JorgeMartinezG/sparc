import React, { useContext } from "react";
import { iconPrintGlyph } from "@wfp/icons";
import { StateContext } from "../App.js";
import { Document, Page, View, Image, Text, pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { Icon } from "@wfp/ui";

const ElementToBlob = async (id) => {
  const elm = document.getElementById(id);
  const canvas = await html2canvas(elm, { dpi: 300 });
  const blob = canvas.toDataURL("image/jpeg");

  return blob;
};

export const PdfRenderer = () => {
  const { map } = useContext(StateContext);

  return (
    <Icon
      className="ml2 h2 shadow-1 w2 pa2 br-100 bg-tan ba1 link pointer"
      icon={iconPrintGlyph}
      description="Download generated pdf"
      onClick={async () => {
        const legend = await ElementToBlob("legend");
        const chart = await ElementToBlob("chart");
        const text = document.getElementById("description").innerText;

        const doc = (
          <PdfPrint map={map} legend={legend} chart={chart} text={text} />
        );
        const asPdf = pdf(doc);
        const blob = await asPdf.toBlob();
        saveAs(blob, "document.pdf");
      }}
    />
  );
};

// Create styles
const PdfPrint = ({ map, legend, chart, text }) => {
  const mapImg = map.getCanvas().toDataURL("image/jpeg");
  return (
    <Document>
      <Page size="A4" orientation="landscape">
        <View>
          <Image
            src={mapImg}
            style={{
              padding: "3%",
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          />
          <Image
            src={legend}
            style={{
              width: "33%",
              height: "17%",
              position: "absolute",
              right: "4%",
              bottom: "5%",
            }}
          />
        </View>
      </Page>
      <Page
        size="A4"
        orientation="portrait"
        style={{
          padding: 30,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Image src={chart} style={{ width: "50%", height: "50%" }} />
        <Text style={{ fontSize: 12, textAlign: "justify" }}>{text}</Text>
      </Page>
    </Document>
  );
};
