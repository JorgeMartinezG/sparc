import React from "react";
import { Document, Page, View, Image, Text } from "@react-pdf/renderer";

// Create styles
export const PdfPrint = ({ map, legend, chart, text }) => {
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
