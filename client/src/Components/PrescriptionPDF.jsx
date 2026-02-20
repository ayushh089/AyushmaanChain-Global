import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  header: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    textDecoration: "underline",
  },
  section: { marginBottom: 10 },
  infoBlock: {
    marginBottom: 10,
    padding: 10,
    border: "1 solid black",
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: { fontWeight: "bold" },
  signature: { width: 120, height: 60, marginTop: 10 },
  line: { borderBottom: "1 solid black", marginVertical: 5 },
  prescriptionHeader: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  medicineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottom: "1 solid #ccc",
  },
});

const PrescriptionPDF = ({ details }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Fortis Escort</Text>

      {/* Patient & Doctor Info */}
      <View style={styles.infoBlock}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Patient Name:</Text>
            <Text>{details.patientName || "N/A"}</Text>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.label}>Patient ID:</Text>
            <Text>{details.patientId}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Doctor Name:</Text>
            <Text>{details.doctorName || "N/A"}</Text>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.label}>Doctor ID:</Text>
            <Text>{details.doctorId}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text>{new Date(details.timestamp).toLocaleDateString()}</Text>
        </View>
      </View>

      <Text style={styles.line}></Text>

      {/* Prescription Details */}
      <Text style={styles.prescriptionHeader}>Prescribed Medicines:</Text>
      {details.medicines.map((med, index) => (
        <View key={index} style={styles.medicineRow}>
          <Text> {med.name}</Text>
          <Text>Dosage: {med.dosage}</Text>
          <Text>Freq: {med.frequency}</Text>
          <Text>Duration: {med.duration}</Text>
        </View>
      ))}

      <Text style={styles.line}></Text>

      {/* Digital Signature */}
      <View style={styles.section}>
        <Text style={styles.label}>Digital Signature / Hash:</Text>
        <Text>{details.signature}</Text>
        {details.signatureImage && (
          <Image src={details.signatureImage} style={styles.signature} />
        )}
      </View>
    </Page>
  </Document>
);

export default PrescriptionPDF;
