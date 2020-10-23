import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export const PdfPrint = ({ map, legend }) => {
  const mapImg = map.getCanvas().toDataURL("image/jpeg");
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.section}>
          <Image
            src={mapImg}
            style={{ width: "100%", height: "100%", position: "relative" }}
          />
          <Image
            src={legend}
            style={{
              width: "30%",
              height: "10%",
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
