// src/screens/driver/QRScannerScreen.jsx
import { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator
} from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";
import api from "../../services/api";

export default function QRScannerScreen({ navigation }) {
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleValidate = async (qrCode) => {
    setLoading(true);
    try {
      const res = await api.post("/tickets/validate", { qrCode });
      setResult({ success: true, message: res.data.message, ticket: res.data.ticket });
    } catch (error) {
      setResult({
        success: false,
        message: error.response?.data?.message || "Invalid ticket"
      });
    } finally {
      setLoading(false);
    }
  };

  const simulateScan = () => {
    setScanned(true);
    const fakeQR = "BL-TEST-QR-001";
    handleValidate(fakeQR);
  };

  const reset = () => {
    setScanned(false);
    setResult(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>QR Scanner</Text>
        <Text style={styles.subtitle}>Scan passenger ticket to validate</Text>
      </View>

      <View style={styles.scanArea}>
        {!scanned ? (
          <>
            <View style={styles.qrBox}>
              <Text style={styles.qrIcon}>📷</Text>
              <Text style={styles.qrText}>Point camera at passenger QR code</Text>
            </View>
            <TouchableOpacity style={styles.scanBtn} onPress={simulateScan}>
              <Text style={styles.scanBtnText}>🔍 SIMULATE SCAN</Text>
            </TouchableOpacity>
            <Text style={styles.hint}>
              Note: Camera QR scanning requires a development build.{"\n"}
              Use simulate scan to test the validation flow.
            </Text>
          </>
        ) : loading ? (
          <View style={styles.resultBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.validatingText}>Validating ticket...</Text>
          </View>
        ) : result ? (
          <View style={[styles.resultBox,
            { backgroundColor: result.success ? "#E8F8EE" : "#FFF0F0" }]}>
            <Text style={styles.resultIcon}>{result.success ? "✅" : "❌"}</Text>
            <Text style={[styles.resultTitle,
              { color: result.success ? COLORS.success : COLORS.danger }]}>
              {result.success ? "Valid Ticket!" : "Invalid Ticket"}
            </Text>
            <Text style={styles.resultMessage}>{result.message}</Text>
            {result.ticket && (
              <View style={styles.ticketInfo}>
                <Text style={styles.ticketDetail}>
                  👤 {result.ticket.booking?.passenger?.name}
                </Text>
                <Text style={styles.ticketDetail}>
                  🚌 {result.ticket.booking?.schedule?.route?.fromStation?.city} →{" "}
                  {result.ticket.booking?.schedule?.route?.toStation?.city}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.resetBtn} onPress={reset}>
              <Text style={styles.resetBtnText}>Scan Another</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: {
    backgroundColor: COLORS.secondary, paddingTop: 60,
    paddingBottom: SPACING.lg, paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  backText: { color: COLORS.primary, fontSize: 15, fontWeight: "600", marginBottom: SPACING.sm },
  title: { fontSize: 22, fontWeight: "900", color: COLORS.white },
  subtitle: { fontSize: 13, color: COLORS.textOnDark, marginTop: 4 },
  scanArea: { flex: 1, padding: SPACING.lg, justifyContent: "center" },
  qrBox: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.card,
    padding: SPACING.xl, alignItems: "center", marginBottom: SPACING.lg,
    borderWidth: 2, borderColor: COLORS.border, borderStyle: "dashed",
  },
  qrIcon: { fontSize: 64, marginBottom: SPACING.md },
  qrText: { fontSize: 14, color: COLORS.textMuted, textAlign: "center" },
  scanBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.button,
    paddingVertical: 16, alignItems: "center", marginBottom: SPACING.md,
  },
  scanBtnText: { color: COLORS.white, fontWeight: "800", fontSize: 14, letterSpacing: 0.5 },
  hint: { fontSize: 12, color: COLORS.textMuted, textAlign: "center", lineHeight: 18 },
  resultBox: {
    borderRadius: RADIUS.card, padding: SPACING.xl, alignItems: "center",
  },
  resultIcon: { fontSize: 56, marginBottom: SPACING.md },
  resultTitle: { fontSize: 22, fontWeight: "900", marginBottom: SPACING.sm },
  resultMessage: { fontSize: 14, color: COLORS.textMuted, textAlign: "center", marginBottom: SPACING.md },
  ticketInfo: { width: "100%", backgroundColor: COLORS.white, borderRadius: RADIUS.card, padding: SPACING.md, marginBottom: SPACING.md },
  ticketDetail: { fontSize: 14, color: COLORS.text, marginBottom: 4, fontWeight: "600" },
  validatingText: { color: COLORS.textMuted, marginTop: SPACING.md, fontSize: 15 },
  resetBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.button,
    paddingVertical: 14, paddingHorizontal: 32,
  },
  resetBtnText: { color: COLORS.white, fontWeight: "700", fontSize: 14 },
});