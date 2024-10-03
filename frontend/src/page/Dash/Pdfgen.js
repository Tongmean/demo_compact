import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font  } from '@react-pdf/renderer';
import logoPath from '../../Asset/LOGO_COMPACT.png';
import THSarabunNew from '../../Asset/THSarabunNew.ttf'; // Import the font file

Font.register({
    family: 'TH Sarabun New',
    src: THSarabunNew, // Path to the TH Sarabun New font file
  });
// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottom: '2px solid #007BFF',
    paddingBottom: 10,
  },
  logo: {
    width: 140, // Adjust the width to fit your design
    height: 45,  // Adjust the height to fit your design
  },
  titleContainer: {
    textAlign: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  section: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  field: {
    width: '30%', // Adjusted to keep fields evenly distributed
    border: '1px solid #007BFF',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#F0F8FF',
  },
  fieldLabel: {
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 5,
    fontSize: 10,
  },
  fieldValue: {
    fontSize: 16.5,
    color: '#333',
    fontFamily: 'TH Sarabun New', // Apply Thai font to values
  },
});

// Create PDF document
const Pdfgen = ({ rowPdf }) => (
  <Document>
    <Page style={styles.page} size="A4" orientation="landscape">
      {/* Header */}
      <View style={styles.header}>
        <Image src={logoPath} style={styles.logo} />  {/* Updated to include the logo */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Brake Linings</Text>
        </View>
        <Text>{/* Empty space for alignment purposes */}</Text>
      </View>

      {/* Fields Section */}
      <View style={styles.section}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>SKU CODE:</Text>
          <Text style={styles.fieldValue}>{rowPdf?.Code_Fg || '-'}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>SKU NAME:</Text>
          <Text style={styles.fieldValue}>{rowPdf?.Name_Fg || '-'}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>CODE:</Text>
          <Text style={styles.fieldValue}>{rowPdf?.Code || '-'}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>PART NO CUSTOMER:</Text>
          <Text style={styles.fieldValue}>{rowPdf?.OE_Part_No || '-'}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>PART NO:</Text>
          <Text style={styles.fieldValue}>{rowPdf?.Part_No || '-'}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>HOLE:</Text>
          <Text style={styles.fieldValue}>{rowPdf?.Num_Hole || '-'}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>MODEL:</Text>
          <Text style={styles.fieldValue}>{rowPdf?.Model || '-'}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>RIVET:</Text>
          <Text style={styles.fieldValue}>{rowPdf?.Rivet_No || '-'}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>DIMENSION:</Text>
          <Text style={styles.fieldValue}>{rowPdf?.Dimension || '-'}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>RIVET PER SET:</Text>
          <Text style={styles.fieldValue}>{rowPdf?.Num_Revit_Per_Set || '-'}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>PIECE PER SET:</Text>
          <Text style={styles.fieldValue}>{rowPdf?.Pcs_Per_Set || '-'}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>DRILL:</Text>
          <Text style={styles.fieldValue}>{rowPdf?.Status_Dr || '-'}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>BOX NO:</Text>
          <Text style={styles.fieldValue}>{rowPdf?.Box_No || '-'}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>BRAKE TYPE:</Text>
          <Text style={styles.fieldValue}>{rowPdf?.Type_Brake_Dr || '-'}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>NET WEIGHT:</Text>
          <Text style={styles.fieldValue}>{rowPdf?.weight || '-'}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default Pdfgen;
