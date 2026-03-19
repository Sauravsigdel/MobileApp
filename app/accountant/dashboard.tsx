import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { useState } from "react";

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
  return (
    <View>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>Finance Admin</Text>
          <Text style={styles.badge}>Accountant · Spring Term 2026</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>FA</Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={[styles.metric, { backgroundColor: "#eaf3de" }]}>
          <Text style={[styles.metricVal, { color: "#3b6d11" }]}>$84,200</Text>
          <Text style={styles.metricLabel}>Collected</Text>
        </View>
        <View style={[styles.metric, { backgroundColor: "#fcebeb" }]}>
          <Text style={[styles.metricVal, { color: "#a32d2d" }]}>$23,800</Text>
          <Text style={styles.metricLabel}>Outstanding</Text>
        </View>
      </View>
      <View style={[styles.metrics, { marginTop: 0 }]}>
        <View style={[styles.metric, { backgroundColor: "#fcebeb" }]}>
          <Text style={[styles.metricVal, { color: "#a32d2d" }]}>$9,400</Text>
          <Text style={styles.metricLabel}>Overdue</Text>
        </View>
        <View style={[styles.metric, { backgroundColor: "#e6f1fb" }]}>
          <Text style={[styles.metricVal, { color: "#185fa5" }]}>$12,600</Text>
          <Text style={styles.metricLabel}>This month</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {[
          {
            dot: "#3b6d11",
            title: "Payment received — Aisha Kumar",
            sub: "$2,400 · Spring term · Today",
          },
          {
            dot: "#e24b4a",
            title: "Overdue reminder sent — 38 students",
            sub: "Via email + in-app · Today",
          },
          {
            dot: "#854f0b",
            title: "Partial payment — James Miller",
            sub: "$900 of $1,800 · Mar 10",
          },
          {
            dot: "#3266ad",
            title: "Summer term fees published",
            sub: "All students notified · Mar 8",
          },
        ].map((item, i) => (
          <View key={i} style={styles.actItem}>
            <View style={[styles.actDot, { backgroundColor: item.dot }]} />
            <View style={styles.actInfo}>
              <Text style={styles.actTitle}>{item.title}</Text>
              <Text style={styles.actSub}>{item.sub}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function StudentsTab() {
  const students = [
    {
      initials: "RP",
      name: "Rohan Patel",
      class: "Grade 10-B",
      amount: "$1,800",
      status: "overdue",
      bg: "#fcebeb",
      fg: "#a32d2d",
    },
    {
      initials: "JM",
      name: "James Miller",
      class: "Grade 10-A",
      amount: "$900",
      status: "partial",
      bg: "#faeeda",
      fg: "#854f0b",
    },
    {
      initials: "AK",
      name: "Aisha Kumar",
      class: "Grade 10-A",
      amount: "$2,400",
      status: "paid",
      bg: "#eaf3de",
      fg: "#3b6d11",
    },
    {
      initials: "SN",
      name: "Sara Nguyen",
      class: "Grade 9-C",
      amount: "$2,400",
      status: "overdue",
      bg: "#fcebeb",
      fg: "#a32d2d",
    },
    {
      initials: "LT",
      name: "Liam Torres",
      class: "Grade 11-B",
      amount: "$2,400",
      status: "paid",
      bg: "#eaf3de",
      fg: "#3b6d11",
    },
    {
      initials: "MW",
      name: "Maya Wong",
      class: "Grade 9-C",
      amount: "$1,200",
      status: "partial",
      bg: "#faeeda",
      fg: "#854f0b",
    },
  ];

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Student Fee Records</Text>
      {students.map((s, i) => (
        <View key={i} style={styles.feeRow}>
          <View style={[styles.studentAvatar, { backgroundColor: s.bg }]}>
            <Text style={[styles.studentInitials, { color: s.fg }]}>
              {s.initials}
            </Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{s.name}</Text>
            <Text style={styles.studentClass}>{s.class}</Text>
          </View>
          <Text style={[styles.feeAmt, { color: s.fg }]}>{s.amount}</Text>
          <Text
            style={[
              styles.feeBadge,
              s.status === "paid"
                ? styles.badgePaid
                : s.status === "overdue"
                  ? styles.badgeOverdue
                  : styles.badgePartial,
            ]}
          >
            {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
          </Text>
        </View>
      ))}
    </View>
  );
}

function AddFeeTab() {
  const [student, setStudent] = useState("");
  const [feeType, setFeeType] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Add Fee to Student</Text>

      <Text style={styles.formLabel}>Student name</Text>
      <TextInput
        style={styles.formInput}
        placeholder="e.g. Rohan Patel"
        placeholderTextColor="#999"
        value={student}
        onChangeText={setStudent}
      />

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
          <Text style={styles.successText}>
            Fee added successfully! Student notified.
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }}
      >
        <Text style={styles.saveBtnText}>Add Fee and Notify Student</Text>
      </TouchableOpacity>

      <Text style={styles.tabTitle2}>Record Payment</Text>

      <Text style={styles.formLabel}>Student name</Text>
      <TextInput
        style={styles.formInput}
        placeholder="e.g. Rohan Patel"
        placeholderTextColor="#999"
      />

      <Text style={styles.formLabel}>Amount paid ($)</Text>
      <TextInput
        style={styles.formInput}
        placeholder="0.00"
        placeholderTextColor="#999"
        keyboardType="numeric"
      />

      <Text style={styles.formLabel}>Payment method</Text>
      <View style={styles.feeTypeRow}>
        {["Online", "Cash", "Cheque", "Bank"].map((method) => (
          <TouchableOpacity key={method} style={styles.feeTypePill}>
            <Text style={styles.feeTypePillText}>{method}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: "#0f6e56", marginTop: 12 }]}
      >
        <Text style={styles.saveBtnText}>Save and Send Receipt</Text>
      </TouchableOpacity>

      <Text style={styles.tabTitle2}>Apply Deduction / Waiver</Text>

      <Text style={styles.formLabel}>Student name</Text>
      <TextInput
        style={styles.formInput}
        placeholder="e.g. Sara Nguyen"
        placeholderTextColor="#999"
      />

      <Text style={styles.formLabel}>Deduction type</Text>
      <View style={styles.feeTypeRow}>
        {["Scholarship", "Sibling", "Merit", "Hardship", "Error"].map(
          (type) => (
            <TouchableOpacity key={type} style={styles.feeTypePill}>
              <Text style={styles.feeTypePillText}>{type}</Text>
            </TouchableOpacity>
          ),
        )}
      </View>

      <Text style={styles.formLabel}>Amount ($)</Text>
      <TextInput
        style={styles.formInput}
        placeholder="0.00"
        placeholderTextColor="#999"
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: "#a32d2d", marginTop: 12 }]}
      >
        <Text style={styles.saveBtnText}>Apply Deduction</Text>
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
        { key: "overdue", label: "All overdue students (38)" },
        { key: "pending", label: "All pending students (142)" },
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

      <Text style={[styles.formLabel, { marginTop: 14 }]}>
        Custom message (optional)
      </Text>
      <TextInput
        style={[styles.formInput, { height: 80, textAlignVertical: "top" }]}
        placeholder="Leave empty to use default template..."
        placeholderTextColor="#999"
        multiline
      />

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

      <Text style={styles.tabTitle2}>Notifications Sent</Text>
      {[
        {
          dot: "#e24b4a",
          title: "Overdue reminder — 38 students",
          time: "Today",
        },
        {
          dot: "#3b6d11",
          title: "Receipt — Aisha Kumar $2,400",
          time: "Mar 12",
        },
        { dot: "#854f0b", title: "Partial ack — James Miller", time: "Mar 10" },
        {
          dot: "#3266ad",
          title: "Summer fees published — all students",
          time: "Mar 8",
        },
      ].map((item, i) => (
        <View key={i} style={styles.actItem}>
          <View style={[styles.actDot, { backgroundColor: item.dot }]} />
          <View style={styles.actInfo}>
            <Text style={styles.actTitle}>{item.title}</Text>
            <Text style={styles.actSub}>{item.time}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function ReportsTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Financial Reports</Text>

      <View style={styles.reportCard}>
        <Text style={styles.reportTitle}>Spring Term 2026</Text>
        <View style={styles.reportRow}>
          <Text style={styles.reportLabel}>Target</Text>
          <Text style={styles.reportVal}>$108,000</Text>
        </View>
        <View style={styles.reportRow}>
          <Text style={styles.reportLabel}>Collected</Text>
          <Text style={[styles.reportVal, { color: "#3b6d11" }]}>$84,200</Text>
        </View>
        <View style={styles.reportRow}>
          <Text style={styles.reportLabel}>Outstanding</Text>
          <Text style={[styles.reportVal, { color: "#854f0b" }]}>$23,800</Text>
        </View>
        <View style={styles.reportRow}>
          <Text style={styles.reportLabel}>Overdue</Text>
          <Text style={[styles.reportVal, { color: "#a32d2d" }]}>$9,400</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: "78%", backgroundColor: "#3b6d11" },
            ]}
          />
        </View>
        <Text style={styles.reportPct}>78% collected</Text>
      </View>

      {["January", "February", "March"].map((month, i) => {
        const collected = [18400, 15200, 12600][i];
        const target = 36000;
        const pct = Math.round((collected / target) * 100);
        return (
          <View key={month} style={styles.monthRow}>
            <Text style={styles.monthName}>{month}</Text>
            <View style={styles.monthBar}>
              <View style={[styles.monthFill, { width: `${pct}%` }]} />
            </View>
            <Text style={styles.monthAmt}>
              ${(collected / 1000).toFixed(1)}k
            </Text>
          </View>
        );
      })}

      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveBtnText}>Export Report (PDF)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },
  content: { flex: 1 },
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
  tabTitle2: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0f6e56",
    marginTop: 24,
    marginBottom: 12,
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
  feeBadge: {
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgePaid: { backgroundColor: "#eaf3de", color: "#3b6d11" },
  badgeOverdue: { backgroundColor: "#fcebeb", color: "#a32d2d" },
  badgePartial: { backgroundColor: "#faeeda", color: "#854f0b" },
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
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  monthName: { fontSize: 12, color: "#666", width: 60 },
  monthBar: { flex: 1, height: 8, backgroundColor: "#f0f0f0", borderRadius: 4 },
  monthFill: { height: 8, backgroundColor: "#0f6e56", borderRadius: 4 },
  monthAmt: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    width: 40,
    textAlign: "right",
  },
});
