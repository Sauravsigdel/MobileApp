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
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";

// Helper to get auth header
const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {activeTab === "home" && <HomeTab />}
        {activeTab === "students" && <StudentsTab />}
        {activeTab === "teachers" && <TeachersTab />}
        {activeTab === "events" && <EventsTab />}
        {activeTab === "settings" && <SettingsTab router={router} />}
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          { key: "home", label: "Dashboard", icon: "🏠" },
          { key: "students", label: "Students", icon: "👥" },
          { key: "teachers", label: "Teachers", icon: "👨‍🏫" },
          { key: "events", label: "Events", icon: "📅" },
          { key: "settings", label: "Settings", icon: "⚙️" },
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
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const headers = await getAuthHeader();

        // Get admin info
        const meRes = await axios.get(`${API_URL}/api/auth/me`, { headers });
        setAdminName(meRes.data.name);

        // Get students
        const studentsRes = await axios.get(`${API_URL}/api/students`, {
          headers,
        });
        setStudentCount(studentsRes.data.length);

        // Get teachers
        // We'll count users with role teacher for now
        setTeacherCount(0);
      } catch (error: any) {
        console.log("Error loading admin data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#1a3a6b" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>{adminName || "Administrator"}</Text>
          <Text style={styles.badge}>Spring Term 2026</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {adminName ? adminName.charAt(0).toUpperCase() : "A"}
          </Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        {[
          {
            val: studentCount.toString(),
            label: "Students",
            bg: "#e6f1fb",
            color: "#185fa5",
          },
          {
            val: teacherCount.toString(),
            label: "Teachers",
            bg: "#eaf3de",
            color: "#3b6d11",
          },
          {
            val: "91.4%",
            label: "Attendance",
            bg: "#faeeda",
            color: "#854f0b",
          },
          { val: "78%", label: "Fees paid", bg: "#eeedfe", color: "#534ab7" },
        ].map((m, i) => (
          <View key={i} style={[styles.metricCard, { backgroundColor: m.bg }]}>
            <Text style={[styles.metricVal, { color: m.color }]}>{m.val}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fee Collection Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>$84,200 collected</Text>
            <Text style={styles.progressPct}>78%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "78%" }]} />
          </View>
          <Text style={styles.progressTarget}>Target: $108,000</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {[
          {
            title: "Mid-term examinations",
            date: "Mar 20 – Mar 27",
            color: "#3266ad",
            badge: "Exam",
            badgeStyle: "badgeExam",
          },
          {
            title: "Science fair submissions",
            date: "Mar 28",
            color: "#d4ab44",
            badge: "Deadline",
            badgeStyle: "badgeDeadline",
          },
          {
            title: "Parent-teacher conference",
            date: "Apr 4",
            color: "#3b6d11",
            badge: "Event",
            badgeStyle: "badgeEvent",
          },
          {
            title: "Fee payment deadline",
            date: "Apr 10",
            color: "#e24b4a",
            badge: "Finance",
            badgeStyle: "badgeFinance",
          },
        ].map((ev, i) => (
          <View key={i} style={styles.evItem}>
            <View style={[styles.evStripe, { backgroundColor: ev.color }]} />
            <View style={styles.evInfo}>
              <Text style={styles.evTitle}>{ev.title}</Text>
              <Text style={styles.evDate}>{ev.date}</Text>
            </View>
            <Text style={styles[ev.badgeStyle as keyof typeof styles] as any}>
              {ev.badge}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function StudentsTab() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const headers = await getAuthHeader();
        const res = await axios.get(`${API_URL}/api/students`, { headers });
        setStudents(res.data);
      } catch (error: any) {
        Alert.alert("Error", "Could not load students");
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.user.name.toLowerCase().includes(search.toLowerCase()) ||
      s.class.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#1a3a6b" />
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Students</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or class..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
      />
      <Text style={styles.resultCount}>{filtered.length} students found</Text>
      {filtered.length === 0 ? (
        <Text style={styles.emptyText}>No students registered yet.</Text>
      ) : (
        filtered.map((s, i) => (
          <View key={i} style={styles.studentRow}>
            <View
              style={[styles.studentAvatar, { backgroundColor: "#e6f1fb" }]}
            >
              <Text style={[styles.studentInitials, { color: "#185fa5" }]}>
                {s.user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{s.user.name}</Text>
              <Text style={styles.studentClass}>
                {s.class} · Roll {s.rollNo}
              </Text>
            </View>
            <Text style={styles.badgeActive}>Active</Text>
          </View>
        ))
      )}
      <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.addBtnText}>+ Add New Student</Text>
      </TouchableOpacity>
    </View>
  );
}

function TeachersTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Teachers</Text>
      {[
        {
          initials: "SS",
          name: "Mr. Sharma",
          subject: "Physics",
          classes: "Gr 9, 10, 11",
          bg: "#e6f1fb",
          fg: "#185fa5",
        },
        {
          initials: "MC",
          name: "Ms. Chen",
          subject: "English",
          classes: "Gr 10, 11",
          bg: "#eaf3de",
          fg: "#3b6d11",
        },
        {
          initials: "DO",
          name: "Dr. Okonkwo",
          subject: "Chemistry",
          classes: "Gr 10, 12",
          bg: "#faeeda",
          fg: "#854f0b",
        },
        {
          initials: "RS",
          name: "Mr. Singh",
          subject: "Mathematics",
          classes: "Gr 9, 10, 11",
          bg: "#faece7",
          fg: "#993c1d",
        },
        {
          initials: "SP",
          name: "Ms. Patel",
          subject: "History",
          classes: "Gr 10, 11, 12",
          bg: "#eeedfe",
          fg: "#534ab7",
        },
      ].map((t, i) => (
        <View key={i} style={styles.teacherRow}>
          <View style={[styles.teacherAvatar, { backgroundColor: t.bg }]}>
            <Text style={[styles.teacherInitials, { color: t.fg }]}>
              {t.initials}
            </Text>
          </View>
          <View style={styles.teacherInfo}>
            <Text style={styles.teacherName}>{t.name}</Text>
            <Text style={styles.teacherSubject}>{t.subject}</Text>
            <Text style={styles.teacherClasses}>{t.classes}</Text>
          </View>
          <TouchableOpacity style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.addBtnText}>+ Add New Teacher</Text>
      </TouchableOpacity>
    </View>
  );
}

function EventsTab() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>School Events</Text>
      {[
        {
          title: "Mid-term examinations",
          date: "Mar 20 – Mar 27",
          type: "Exam",
          color: "#3266ad",
          bg: "#e6f1fb",
        },
        {
          title: "Science fair",
          date: "Mar 28",
          type: "Event",
          color: "#3b6d11",
          bg: "#eaf3de",
        },
        {
          title: "Parent-teacher conference",
          date: "Apr 4",
          type: "Event",
          color: "#3b6d11",
          bg: "#eaf3de",
        },
        {
          title: "Fee payment deadline",
          date: "Apr 10",
          type: "Finance",
          color: "#e24b4a",
          bg: "#fcebeb",
        },
        {
          title: "Summer term begins",
          date: "Apr 14",
          type: "Academic",
          color: "#534ab7",
          bg: "#eeedfe",
        },
      ].map((ev, i) => (
        <View key={i} style={styles.evCard}>
          <View style={[styles.evTypeBar, { backgroundColor: ev.color }]} />
          <View style={styles.evCardInfo}>
            <Text style={styles.evCardTitle}>{ev.title}</Text>
            <Text style={styles.evCardDate}>{ev.date}</Text>
          </View>
          <View style={[styles.evTypeBadge, { backgroundColor: ev.bg }]}>
            <Text style={[styles.evTypeBadgeText, { color: ev.color }]}>
              {ev.type}
            </Text>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => setShowForm(!showForm)}
      >
        <Text style={styles.addBtnText}>
          {showForm ? "Cancel" : "+ Add New Event"}
        </Text>
      </TouchableOpacity>

      {showForm && (
        <View style={styles.formBox}>
          <Text style={styles.formLabel}>Event title</Text>
          <TextInput
            style={styles.formInput}
            placeholder="e.g. Sports Day"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />
          <Text style={styles.formLabel}>Date</Text>
          <TextInput
            style={styles.formInput}
            placeholder="e.g. Apr 20, 2026"
            placeholderTextColor="#999"
            value={date}
            onChangeText={setDate}
          />
          {saved && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>
                Event added and all users notified!
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: "#1a3a6b" }]}
            onPress={() => {
              setSaved(true);
              setShowForm(false);
              setTitle("");
              setDate("");
              setTimeout(() => setSaved(false), 3000);
            }}
          >
            <Text style={[styles.addBtnText, { color: "#fff" }]}>
              Save and Notify All
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {saved && (
        <View style={styles.successBox}>
          <Text style={styles.successText}>
            Event added and all users notified!
          </Text>
        </View>
      )}
    </View>
  );
}

function SettingsTab({ router }: { router: any }) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/" as any);
  };

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Settings</Text>

      <Text style={styles.settingsGroup}>School Information</Text>
      {[
        { label: "School name", value: "Springfield Academy" },
        { label: "Current term", value: "Spring 2026" },
        { label: "Academic year", value: "2025 – 2026" },
      ].map((item, i) => (
        <View key={i} style={styles.settingsRow}>
          <Text style={styles.settingsLabel}>{item.label}</Text>
          <Text style={styles.settingsValue}>{item.value}</Text>
        </View>
      ))}

      <Text style={styles.settingsGroup}>User Management</Text>
      {[
        { label: "Manage students", icon: "👥" },
        { label: "Manage teachers", icon: "👨‍🏫" },
        { label: "Manage parents", icon: "👨‍👩‍👧" },
        { label: "Role permissions", icon: "🔐" },
      ].map((item, i) => (
        <TouchableOpacity key={i} style={styles.settingsItem}>
          <Text style={styles.settingsItemIcon}>{item.icon}</Text>
          <Text style={styles.settingsItemLabel}>{item.label}</Text>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.settingsGroup}>System</Text>
      {[
        { label: "Notifications", icon: "🔔" },
        { label: "Data backup", icon: "💾" },
        { label: "Academic calendar", icon: "📅" },
        { label: "Fee structure", icon: "💰" },
      ].map((item, i) => (
        <TouchableOpacity key={i} style={styles.settingsItem}>
          <Text style={styles.settingsItemIcon}>{item.icon}</Text>
          <Text style={styles.settingsItemLabel}>{item.label}</Text>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>Log Out</Text>
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
    backgroundColor: "#1a3a6b",
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
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, padding: 16 },
  metricCard: {
    width: "47%",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  metricVal: { fontSize: 22, fontWeight: "bold" },
  metricLabel: { fontSize: 11, color: "#666", marginTop: 3 },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  progressCard: { backgroundColor: "#fff", borderRadius: 12, padding: 14 },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: { fontSize: 13, color: "#666" },
  progressPct: { fontSize: 13, fontWeight: "bold", color: "#3b6d11" },
  progressBar: { height: 8, backgroundColor: "#f0f0f0", borderRadius: 4 },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: "#3b6d11" },
  progressTarget: {
    fontSize: 11,
    color: "#999",
    marginTop: 6,
    textAlign: "right",
  },
  evItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  evStripe: { width: 4, height: 36, borderRadius: 2 },
  evInfo: { flex: 1 },
  evTitle: { fontSize: 13, fontWeight: "600", color: "#333" },
  evDate: { fontSize: 11, color: "#999", marginTop: 2 },
  badgeExam: {
    fontSize: 10,
    backgroundColor: "#e6f1fb",
    color: "#185fa5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeDeadline: {
    fontSize: 10,
    backgroundColor: "#faeeda",
    color: "#854f0b",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeEvent: {
    fontSize: 10,
    backgroundColor: "#eaf3de",
    color: "#3b6d11",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeFinance: {
    fontSize: 10,
    backgroundColor: "#fcebeb",
    color: "#a32d2d",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  studentRow: {
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
  navLabelActive: { color: "#1a3a6b", fontWeight: "600" },
  navDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#1a3a6b" },
  tabContent: { padding: 16, paddingBottom: 40 },
  tabTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a3a6b",
    marginBottom: 14,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  resultCount: { fontSize: 11, color: "#999", marginBottom: 10 },
  badgeActive: {
    fontSize: 10,
    backgroundColor: "#eaf3de",
    color: "#3b6d11",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeInactive: {
    fontSize: 10,
    backgroundColor: "#fcebeb",
    color: "#a32d2d",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  addBtn: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 12,
  },
  addBtnText: { color: "#1a3a6b", fontSize: 14, fontWeight: "bold" },
  teacherRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  teacherAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  teacherInitials: { fontSize: 14, fontWeight: "bold" },
  teacherInfo: { flex: 1 },
  teacherName: { fontSize: 13, fontWeight: "600", color: "#333" },
  teacherSubject: { fontSize: 12, color: "#666", marginTop: 1 },
  teacherClasses: { fontSize: 11, color: "#999", marginTop: 1 },
  viewBtn: {
    borderWidth: 1,
    borderColor: "#1a3a6b",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  viewBtnText: { fontSize: 12, color: "#1a3a6b", fontWeight: "600" },
  evCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  evTypeBar: { width: 4, height: 40, borderRadius: 2 },
  evCardInfo: { flex: 1 },
  evCardTitle: { fontSize: 13, fontWeight: "600", color: "#333" },
  evCardDate: { fontSize: 11, color: "#999", marginTop: 2 },
  evTypeBadge: { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  evTypeBadgeText: { fontSize: 10, fontWeight: "600" },
  formBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
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
  settingsGroup: {
    fontSize: 11,
    fontWeight: "600",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 8,
  },
  settingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  settingsLabel: { fontSize: 13, color: "#666" },
  settingsValue: { fontSize: 13, fontWeight: "600", color: "#333" },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  settingsItemIcon: { fontSize: 18 },
  settingsItemLabel: { flex: 1, fontSize: 13, color: "#333" },
  settingsArrow: { fontSize: 18, color: "#999" },
  logoutBtn: {
    backgroundColor: "#fcebeb",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 24,
  },
  logoutBtnText: { color: "#a32d2d", fontSize: 14, fontWeight: "bold" },
});
