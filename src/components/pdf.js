import React from "react";
import { Document, Page, View, Image } from "@react-pdf/renderer";

// Create styles
export const PdfPrint = ({ map, legend }) => {
  const mapImg = map.getCanvas().toDataURL("image/jpeg");
  return (
    <Document>
      <Page size="A4" orientation="landscape">
        <View>
          <Image
            src={mapImg}
            style={{ width: "100%", height: "100%", position: "relative" }}
          />
          <Image
            src={legend}
            style={{
              width: "33%",
              height: "17%",
              position: "absolute",
              right: "2%",
              bottom: "2%",
            }}
          />
        </View>
      </Page>
    </Document>
  );
};
