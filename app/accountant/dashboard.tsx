import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export default function AccountantDashboard() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {activeTab === "home" && <HomeTab />}
        {activeTab === "students" && <StudentsTab />}
        {activeTab === "add" && <AddFeeTab />}
        {activeTab === "notify" && <NotifyTab />}
        {activeTab === "reports" && <ReportsTab />}
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          { key: "home", label: "Overview", icon: "🏠" },
          { key: "students", label: "Students", icon: "👥" },
          { key: "add", label: "Add Fee", icon: "➕" },
          { key: "notify", label: "Notify", icon: "📨" },
          { key: "reports", label: "Reports", icon: "📊" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.navItem}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={styles.navIcon}>{tab.icon}</Text>
            <Text
              style={[
                styles.navLabel,
                activeTab === tab.key && styles.navLabelActive,
              ]}
            >
              {tab.label}
            </Text>
            {activeTab === tab.key && <View style={styles.navDot} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function HomeTab() {
  const [fees, setFees] = useState<any[]>([]);
  const [accountantName, setAccountantName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const headers = await getAuthHeader();

        const meRes = await axios.get(`${API_URL}/api/auth/me`, { headers });
        setAccountantName(meRes.data.name);

        const feesRes = await axios.get(`${API_URL}/api/fees`, { headers });
        setFees(feesRes.data);
      } catch (error: any) {
        console.log("Error loading accountant data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalCollected = fees
    .filter((f) => f.status === "paid")
    .reduce((sum, f) => sum + f.amount, 0);
  const totalOutstanding = fees
    .filter((f) => f.status !== "paid")
    .reduce((sum, f) => sum + f.amount, 0);
  const totalOverdue = fees
    .filter((f) => f.status === "overdue")
    .reduce((sum, f) => sum + f.amount, 0);

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#0f6e56" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>{accountantName || "Finance Admin"}</Text>
          <Text style={styles.badge}>Accountant · Spring Term 2026</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {accountantName ? accountantName.charAt(0).toUpperCase() : "FA"}
          </Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={[styles.metric, { backgroundColor: "#eaf3de" }]}>
          <Text style={[styles.metricVal, { color: "#3b6d11" }]}>
            ${totalCollected.toFixed(0)}
          </Text>
          <Text style={styles.metricLabel}>Collected</Text>
        </View>
        <View style={[styles.metric, { backgroundColor: "#fcebeb" }]}>
          <Text style={[styles.metricVal, { color: "#a32d2d" }]}>
            ${totalOutstanding.toFixed(0)}
          </Text>
          <Text style={styles.metricLabel}>Outstanding</Text>
        </View>
      </View>
      <View style={[styles.metrics, { marginTop: 0 }]}>
        <View style={[styles.metric, { backgroundColor: "#fcebeb" }]}>
          <Text style={[styles.metricVal, { color: "#a32d2d" }]}>
            ${totalOverdue.toFixed(0)}
          </Text>
          <Text style={styles.metricLabel}>Overdue</Text>
        </View>
        <View style={[styles.metric, { backgroundColor: "#e6f1fb" }]}>
          <Text style={[styles.metricVal, { color: "#185fa5" }]}>
            {fees.length}
          </Text>
          <Text style={styles.metricLabel}>Total Records</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Fee Records</Text>
        {fees.length === 0 ? (
          <Text style={styles.emptyText}>No fee records yet.</Text>
        ) : (
          fees.slice(0, 4).map((f, i) => (
            <View key={i} style={styles.actItem}>
              <View
                style={[
                  styles.actDot,
                  {
                    backgroundColor:
                      f.status === "paid"
                        ? "#3b6d11"
                        : f.status === "overdue"
                          ? "#e24b4a"
                          : "#854f0b",
                  },
                ]}
              />
              <View style={styles.actInfo}>
                <Text style={styles.actTitle}>
                  {f.feeType} — {f.student?.user?.name || "Student"}
                </Text>
                <Text style={styles.actSub}>
                  ${f.amount} · {f.status} ·{" "}
                  {new Date(f.createdAt).toDateString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

function StudentsTab() {
  const [students, setStudents] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const headers = await getAuthHeader();
        const studentsRes = await axios.get(`${API_URL}/api/students`, {
          headers,
        });
        setStudents(studentsRes.data);
        const feesRes = await axios.get(`${API_URL}/api/fees`, { headers });
        setFees(feesRes.data);
      } catch (error: any) {
        Alert.alert("Error", "Could not load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#0f6e56" />
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Student Fee Records</Text>
      {students.length === 0 ? (
        <Text style={styles.emptyText}>No students yet.</Text>
      ) : (
        students.map((s, i) => {
          const studentFees = fees.filter((f) => f.studentId === s.id);
          const totalOwed = studentFees.reduce((sum, f) => sum + f.amount, 0);
          const hasPaid = studentFees.every((f) => f.status === "paid");
          const hasOverdue = studentFees.some((f) => f.status === "overdue");
          const status =
            studentFees.length === 0
              ? "none"
              : hasPaid
                ? "paid"
                : hasOverdue
                  ? "overdue"
                  : "partial";

          return (
            <View key={i} style={styles.feeRow}>
              <View
                style={[styles.studentAvatar, { backgroundColor: "#e6f1fb" }]}
              >
                <Text style={[styles.studentInitials, { color: "#185fa5" }]}>
                  {s.user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{s.user.name}</Text>
                <Text style={styles.studentClass}>{s.class}</Text>
              </View>
              <Text style={[styles.feeAmt, { color: "#333" }]}>
                ${totalOwed}
              </Text>
              <Text
                style={
                  status === "paid"
                    ? styles.badgePaid
                    : status === "overdue"
                      ? styles.badgeOverdue
                      : styles.badgePartial
                }
              >
                {status === "none"
                  ? "No fees"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </View>
          );
        })
      )}
    </View>
  );
}

function AddFeeTab() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [feeType, setFeeType] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const headers = await getAuthHeader();
        const res = await axios.get(`${API_URL}/api/students`, { headers });
        setStudents(res.data);
      } catch (error: any) {
        console.log("Error loading students:", error.message);
      }
    };
    loadStudents();
  }, []);

  const handleAddFee = async () => {
    if (!selectedStudent || !feeType || !amount) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      const headers = await getAuthHeader();
      await axios.post(
        `${API_URL}/api/fees`,
        {
          studentId: Number(selectedStudent),
          amount: Number(amount),
          feeType,
          status: "overdue",
          dueDate: new Date().toISOString(),
          note,
        },
        { headers },
      );
      setSaved(true);
      setSelectedStudent("");
      setFeeType("");
      setAmount("");
      setNote("");
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      Alert.alert("Error", "Could not add fee");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Add Fee to Student</Text>

      <Text style={styles.formLabel}>Select Student</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 8 }}
      >
        {students.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[
              styles.feeTypePill,
              selectedStudent === String(s.id) && styles.feeTypePillActive,
            ]}
            onPress={() => setSelectedStudent(String(s.id))}
          >
            <Text
              style={[
                styles.feeTypePillText,
                selectedStudent === String(s.id) &&
                  styles.feeTypePillTextActive,
              ]}
            >
              {s.user.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.formLabel}>Fee type</Text>
      <View style={styles.feeTypeRow}>
        {["Tuition", "Lab fee", "Library", "Sports", "Fine", "Other"].map(
          (type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.feeTypePill,
                feeType === type && styles.feeTypePillActive,
              ]}
              onPress={() => setFeeType(type)}
            >
              <Text
                style={[
                  styles.feeTypePillText,
                  feeType === type && styles.feeTypePillTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>

      <Text style={styles.formLabel}>Amount ($)</Text>
      <TextInput
        style={styles.formInput}
        placeholder="0.00"
        placeholderTextColor="#999"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={styles.formLabel}>Note (optional)</Text>
      <TextInput
        style={[styles.formInput, { height: 80, textAlignVertical: "top" }]}
        placeholder="e.g. Spring term 2026"
        placeholderTextColor="#999"
        value={note}
        onChangeText={setNote}
        multiline
      />

      {saved && (
        <View style={styles.successBox}>
          <Text style={styles.successText}>Fee added successfully!</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleAddFee}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveBtnText}>Add Fee</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

function NotifyTab() {
  const [sent, setSent] = useState(false);
  const [target, setTarget] = useState("overdue");
  const [type, setType] = useState("reminder");

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Send Notification</Text>

      <Text style={styles.formLabel}>Send to</Text>
      {[
        { key: "overdue", label: "All overdue students" },
        { key: "pending", label: "All pending students" },
        { key: "all", label: "Entire school" },
      ].map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[
            styles.radioRow,
            target === item.key && styles.radioRowActive,
          ]}
          onPress={() => setTarget(item.key)}
        >
          <View
            style={[
              styles.radioCircle,
              target === item.key && styles.radioCircleActive,
            ]}
          />
          <Text style={styles.radioLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      <Text style={[styles.formLabel, { marginTop: 14 }]}>
        Notification type
      </Text>
      {[
        { key: "reminder", label: "Payment reminder" },
        { key: "overdue", label: "Overdue notice" },
        { key: "confirm", label: "Payment confirmation" },
        { key: "new", label: "New fee added" },
      ].map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[styles.radioRow, type === item.key && styles.radioRowActive]}
          onPress={() => setType(item.key)}
        >
          <View
            style={[
              styles.radioCircle,
              type === item.key && styles.radioCircleActive,
            ]}
          />
          <Text style={styles.radioLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      {sent && (
        <View style={styles.successBox}>
          <Text style={styles.successText}>
            Notifications sent successfully!
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => {
          setSent(true);
          setTimeout(() => setSent(false), 3000);
        }}
      >
        <Text style={styles.saveBtnText}>Send Notification</Text>
      </TouchableOpacity>
    </View>
  );
}

function ReportsTab() {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFees = async () => {
      try {
        const headers = await getAuthHeader();
        const res = await axios.get(`${API_URL}/api/fees`, { headers });
        setFees(res.data);
      } catch (error: any) {
        console.log("Error loading fees:", error.message);
      } finally {
        setLoading(false);
      }
    };
    loadFees();
  }, []);

  const totalCollected = fees
    .filter((f) => f.status === "paid")
    .reduce((sum, f) => sum + f.amount, 0);
  const totalOutstanding = fees
    .filter((f) => f.status !== "paid")
    .reduce((sum, f) => sum + f.amount, 0);
  const totalOverdue = fees
    .filter((f) => f.status === "overdue")
    .reduce((sum, f) => sum + f.amount, 0);
  const total = totalCollected + totalOutstanding;
  const pct = total > 0 ? Math.round((totalCollected / total) * 100) : 0;

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#0f6e56" />
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Financial Reports</Text>

      <View style={styles.reportCard}>
        <Text style={styles.reportTitle}>Spring Term 2026</Text>
        <View style={styles.reportRow}>
          <Text style={styles.reportLabel}>Total Records</Text>
          <Text style={styles.reportVal}>{fees.length}</Text>
        </View>
        <View style={styles.reportRow}>
          <Text style={styles.reportLabel}>Collected</Text>
          <Text style={[styles.reportVal, { color: "#3b6d11" }]}>
            ${totalCollected.toFixed(0)}
          </Text>
        </View>
        <View style={styles.reportRow}>
          <Text style={styles.reportLabel}>Outstanding</Text>
          <Text style={[styles.reportVal, { color: "#854f0b" }]}>
            ${totalOutstanding.toFixed(0)}
          </Text>
        </View>
        <View style={styles.reportRow}>
          <Text style={styles.reportLabel}>Overdue</Text>
          <Text style={[styles.reportVal, { color: "#a32d2d" }]}>
            ${totalOverdue.toFixed(0)}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${pct}%`, backgroundColor: "#3b6d11" },
            ]}
          />
        </View>
        <Text style={styles.reportPct}>{pct}% collected</Text>
      </View>

      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveBtnText}>Export Report (PDF)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },
  content: { flex: 1 },
  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: { marginTop: 12, fontSize: 13, color: "#999" },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 13,
    marginTop: 20,
  },
  header: {
    backgroundColor: "#0f6e56",
    padding: 24,
    paddingTop: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: { fontSize: 13, color: "rgba(255,255,255,0.7)" },
  name: { fontSize: 22, fontWeight: "bold", color: "#fff", marginTop: 2 },
  badge: { fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  metrics: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  metric: { flex: 1, borderRadius: 10, padding: 12, alignItems: "center" },
  metricVal: { fontSize: 16, fontWeight: "bold" },
  metricLabel: { fontSize: 10, color: "#666", marginTop: 2 },
  section: { padding: 16 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  actItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
    alignItems: "center",
  },
  actDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  actInfo: { flex: 1 },
  actTitle: { fontSize: 12, fontWeight: "600", color: "#333" },
  actSub: { fontSize: 11, color: "#999", marginTop: 2 },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
    paddingBottom: 20,
    paddingTop: 10,
  },
  navItem: { flex: 1, alignItems: "center", gap: 3 },
  navIcon: { fontSize: 18 },
  navLabel: { fontSize: 9, color: "#999" },
  navLabelActive: { color: "#0f6e56", fontWeight: "600" },
  navDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#0f6e56" },
  tabContent: { padding: 16, paddingBottom: 40 },
  tabTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f6e56",
    marginBottom: 14,
  },
  feeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  studentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  studentInitials: { fontSize: 12, fontWeight: "bold" },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 13, fontWeight: "600", color: "#333" },
  studentClass: { fontSize: 11, color: "#999", marginTop: 1 },
  feeAmt: { fontSize: 13, fontWeight: "bold" },
  badgePaid: {
    fontSize: 10,
    backgroundColor: "#eaf3de",
    color: "#3b6d11",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeOverdue: {
    fontSize: 10,
    backgroundColor: "#fcebeb",
    color: "#a32d2d",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgePartial: {
    fontSize: 10,
    backgroundColor: "#faeeda",
    color: "#854f0b",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 6,
    marginTop: 12,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fafafa",
  },
  feeTypeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  feeTypePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },
  feeTypePillActive: { backgroundColor: "#0f6e56", borderColor: "#0f6e56" },
  feeTypePillText: { fontSize: 12, color: "#666" },
  feeTypePillTextActive: { color: "#fff", fontWeight: "600" },
  successBox: {
    backgroundColor: "#eaf3de",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  successText: {
    color: "#3b6d11",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  saveBtn: {
    backgroundColor: "#0f6e56",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 16,
  },
  saveBtnText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  radioRowActive: { borderColor: "#0f6e56", backgroundColor: "#f0faf6" },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  radioCircleActive: { borderColor: "#0f6e56", backgroundColor: "#0f6e56" },
  radioLabel: { fontSize: 13, color: "#333" },
  reportCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  reportRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  reportLabel: { fontSize: 13, color: "#666" },
  reportVal: { fontSize: 13, fontWeight: "600", color: "#333" },
  progressBar: {
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    marginTop: 8,
  },
  progressFill: { height: 6, borderRadius: 3 },
  reportPct: {
    fontSize: 11,
    color: "#3b6d11",
    marginTop: 6,
    textAlign: "right",
  },
});
