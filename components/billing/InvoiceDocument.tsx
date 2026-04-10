import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 12,
    fontFamily: "Helvetica",
    color: "#111827",
  },
  title: {
    fontSize: 22,
    marginBottom: 8,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 24,
    color: "#4b5563",
  },
  section: {
    marginBottom: 18,
    padding: 16,
    border: "1 solid #e5e7eb",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: "#6b7280",
  },
  value: {
    fontWeight: 600,
  },
});

export const InvoiceDocument = ({
  payment,
  userName,
}: {
  payment: {
    amount: number;
    createdAt: Date;
    currency: string;
    description: string | null;
    id: string;
    razorpayOrderId: string;
    razorpayPaymentId: string | null;
    status: string;
  };
  userName: string;
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Ministry of Shorthand Invoice</Text>
        <Text style={styles.subtitle}>Generated for billing records and student reference.</Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Invoice ID</Text>
            <Text style={styles.value}>{payment.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Student</Text>
            <Text style={styles.value}>{userName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>
              {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(payment.createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{payment.description ?? "Platform payment"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.value}>
              {payment.currency} {payment.amount}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{payment.status}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Razorpay Order ID</Text>
            <Text style={styles.value}>{payment.razorpayOrderId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Razorpay Payment ID</Text>
            <Text style={styles.value}>{payment.razorpayPaymentId ?? "Pending"}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
