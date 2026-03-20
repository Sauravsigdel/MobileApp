import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
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

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {activeTab === "home" && <HomeTab />}
        {activeTab === "homework" && <HomeworkTab />}
        {activeTab === "calendar" && <CalendarTab />}
        {activeTab === "grades" && <GradesTab />}
        {activeTab === "chat" && <ChatTab />}
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          { key: "home", label: "Home", icon: "🏠" },
          { key: "homework", label: "Homework", icon: "📝" },
          { key: "calendar", label: "Calendar", icon: "📅" },
          { key: "grades", label: "Grades", icon: "📊" },
          { key: "chat", label: "Chat", icon: "💬" },
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
  const [studentName, setStudentName] = useState("");
  const [studentData, setStudentData] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const headers = await getAuthHeader();

        // Get student info
        const meRes = await axios.get(`${API_URL}/api/auth/me`, { headers });
        setStudentName(meRes.data.name);

        // Get student profile
        const profileRes = await axios.get(
          `${API_URL}/api/students/me/profile`,
          { headers },
        );
        setStudentData(profileRes.data);

        // Get assignments
        const assignRes = await axios.get(`${API_URL}/api/assignments`, {
          headers,
        });
        setAssignments(assignRes.data.slice(0, 3));

        // Get attendance
        if (profileRes.data?.id) {
          const attRes = await axios.get(
            `${API_URL}/api/attendance/student/${profileRes.data.id}`,
            { headers },
          );
          setAttendance(attRes.data);
        }
      } catch (error: any) {
        console.log("Error loading student data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate attendance percentage
  const attendancePct =
    attendance.length > 0
      ? Math.round(
          (attendance.filter((a) => a.status === "P").length /
            attendance.length) *
            100,
        )
      : 0;

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#1a3a6b" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>{studentName || "Student"}</Text>
          <Text style={styles.badge}>
            {studentData
              ? `${studentData.class} · Roll No. ${studentData.rollNo}`
              : "Student"}
          </Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {studentName ? studentName.charAt(0).toUpperCase() : "S"}
          </Text>
        </View>
      </View>

      <View style={styles.cards}>
        <View style={[styles.card, { backgroundColor: "#e6f1fb" }]}>
          <Text style={styles.cardVal}>{attendancePct}%</Text>
          <Text style={styles.cardLabel}>Attendance</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#eaf3de" }]}>
          <Text style={styles.cardVal}>{assignments.length}</Text>
          <Text style={styles.cardLabel}>Assignments</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#eaf3de" }]}>
          <Text style={styles.cardVal}>$0</Text>
          <Text style={styles.cardLabel}>Fee Balance</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Assignments</Text>
        {assignments.length === 0 ? (
          <Text style={styles.emptyText}>No assignments yet.</Text>
        ) : (
          assignments.map((a, i) => (
            <View key={i} style={styles.hwItem}>
              <View style={[styles.hwIcon, { backgroundColor: "#e6f1fb" }]}>
                <Text>📝</Text>
              </View>
              <View style={styles.hwInfo}>
                <Text style={styles.hwTitle}>{a.title}</Text>
                <Text style={styles.hwSub}>
                  {a.subject} · Due {new Date(a.dueDate).toDateString()}
                </Text>
              </View>
              <Text style={styles.badgeOk}>{a.class}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today&apos;s Schedule</Text>
        {[
          {
            time: "8:00 AM",
            subject: "Mathematics",
            room: "Room 201 · Mr. Singh",
            color: "#e6f1fb",
            textColor: "#185fa5",
          },
          {
            time: "9:30 AM",
            subject: "Physics",
            room: "Lab 3 · Mr. Sharma",
            color: "#eaf3de",
            textColor: "#3b6d11",
          },
          {
            time: "11:00 AM",
            subject: "English",
            room: "Room 105 · Ms. Chen",
            color: "#faeeda",
            textColor: "#854f0b",
          },
          {
            time: "1:30 PM",
            subject: "Chemistry",
            room: "Lab 1 · Dr. Okonkwo",
            color: "#faece7",
            textColor: "#993c1d",
          },
        ].map((item, i) => (
          <View key={i} style={styles.schedItem}>
            <Text style={styles.schedTime}>{item.time}</Text>
            <View style={[styles.schedBlock, { backgroundColor: item.color }]}>
              <Text style={[styles.schedSubject, { color: item.textColor }]}>
                {item.subject}
              </Text>
              <Text style={[styles.schedRoom, { color: item.textColor }]}>
                {item.room}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function HomeworkTab() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const headers = await getAuthHeader();
        const res = await axios.get(`${API_URL}/api/assignments`, { headers });
        setAssignments(res.data);
      } catch (error: any) {
        Alert.alert("Error", "Could not load assignments");
      } finally {
        setLoading(false);
      }
    };
    loadAssignments();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#1a3a6b" />
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Homework</Text>
      {assignments.length === 0 ? (
        <Text style={styles.emptyText}>No assignments yet.</Text>
      ) : (
        assignments.map((a, i) => (
          <View key={i} style={styles.hwCard}>
            <View style={styles.hwCardTop}>
              <Text style={styles.hwCardIcon}>📝</Text>
              <View style={styles.hwCardInfo}>
                <Text style={styles.hwCardSubject}>{a.subject}</Text>
                <Text style={styles.hwCardTitle}>{a.title}</Text>
                <Text style={styles.hwCardTeacher}>{a.class}</Text>
              </View>
              <Text style={styles.badgeOk}>
                {new Date(a.dueDate).toDateString()}
              </Text>
            </View>
            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>View & Submit</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
}

function CalendarTab() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);
  const events = [16, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28];

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>March 2026</Text>
      <View style={styles.calDays}>
        {days.map((d) => (
          <Text key={d} style={styles.calDayLabel}>
            {d}
          </Text>
        ))}
      </View>
      <View style={styles.calGrid}>
        {dates.map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.calCell, d === 16 && styles.calCellToday]}
          >
            <Text style={[styles.calDate, d === 16 && styles.calDateToday]}>
              {d}
            </Text>
            {events.includes(d) && <View style={styles.calDot} />}
          </TouchableOpacity>
        ))}
      </View>
      <Text
        style={[styles.sectionTitle, { marginHorizontal: 16, marginTop: 16 }]}
      >
        Upcoming
      </Text>
      {[
        { title: "Physics homework due", date: "Today", color: "#d4ab44" },
        { title: "English essay due", date: "Mar 18", color: "#d4ab44" },
        { title: "Mid-term exams begin", date: "Mar 20", color: "#3266ad" },
        { title: "Science fair", date: "Mar 28", color: "#3b6d11" },
      ].map((ev, i) => (
        <View key={i} style={styles.evItem}>
          <View style={[styles.evStripe, { backgroundColor: ev.color }]} />
          <View style={styles.evInfo}>
            <Text style={styles.evTitle}>{ev.title}</Text>
            <Text style={styles.evDate}>{ev.date}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function GradesTab() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const headers = await getAuthHeader();
        const profileRes = await axios.get(
          `${API_URL}/api/students/me/profile`,
          { headers },
        );
        if (profileRes.data?.id) {
          const attRes = await axios.get(
            `${API_URL}/api/attendance/student/${profileRes.data.id}`,
            { headers },
          );
          setAttendance(attRes.data);
        }
      } catch (error: any) {
        console.log("Error loading grades:", error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const subjects = [
    {
      icon: "➗",
      name: "Mathematics",
      teacher: "Mr. Singh",
      score: 100,
      grade: "A+",
      color: "#3266ad",
    },
    {
      icon: "⚛️",
      name: "Physics",
      teacher: "Mr. Sharma",
      score: 97,
      grade: "A+",
      color: "#3266ad",
    },
    {
      icon: "📖",
      name: "English",
      teacher: "Ms. Chen",
      score: 98,
      grade: "A+",
      color: "#3266ad",
    },
    {
      icon: "🧪",
      name: "Chemistry",
      teacher: "Dr. Okonkwo",
      score: 95,
      grade: "A",
      color: "#3b6d11",
    },
    {
      icon: "🌍",
      name: "History",
      teacher: "Ms. Patel",
      score: 100,
      grade: "A+",
      color: "#3266ad",
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#1a3a6b" />
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <View style={styles.gradeHeader}>
        <Text style={styles.gradeScore}>98.2%</Text>
        <Text style={styles.gradeGrade}>A+</Text>
        <Text style={styles.gradeRank}>Rank 1 of 42 · Top of class</Text>
        <Text style={styles.gradeAttendance}>
          Attendance:{" "}
          {attendance.length > 0
            ? `${Math.round((attendance.filter((a) => a.status === "P").length / attendance.length) * 100)}%`
            : "N/A"}
        </Text>
      </View>

      <Text style={styles.tabTitle}>Subject Breakdown</Text>
      {subjects.map((s, i) => (
        <View key={i} style={styles.subjectRow}>
          <Text style={styles.subjectIcon}>{s.icon}</Text>
          <View style={styles.subjectInfo}>
            <Text style={styles.subjectName}>{s.name}</Text>
            <Text style={styles.subjectTeacher}>{s.teacher}</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${s.score}%`, backgroundColor: s.color },
                ]}
              />
            </View>
          </View>
          <Text style={[styles.subjectScore, { color: "#3b6d11" }]}>
            {s.score}
          </Text>
          <View style={styles.gradeBadge}>
            <Text style={styles.gradeBadgeText}>{s.grade}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function ChatTab() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const headers = await getAuthHeader();
        const res = await axios.get(`${API_URL}/api/messages`, { headers });
        setMessages(res.data);
      } catch (error: any) {
        console.log("Error loading messages:", error.message);
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#1a3a6b" />
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Messages</Text>
      {messages.length === 0 ? (
        <Text style={styles.emptyText}>No messages yet.</Text>
      ) : (
        messages.map((m, i) => (
          <TouchableOpacity key={i} style={styles.chatItem}>
            <View style={[styles.chatAvatar, { backgroundColor: "#e6f1fb" }]}>
              <Text style={[styles.chatAvatarText, { color: "#185fa5" }]}>
                {m.sender.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{m.sender.name}</Text>
              <Text style={styles.chatPreview} numberOfLines={1}>
                {m.content}
              </Text>
            </View>
            <Text style={styles.chatTime}>
              {new Date(m.createdAt).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        ))
      )}
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
  cards: { flexDirection: "row", gap: 10, padding: 16 },
  card: { flex: 1, borderRadius: 10, padding: 12, alignItems: "center" },
  cardVal: { fontSize: 16, fontWeight: "bold", color: "#1a3a6b" },
  cardLabel: { fontSize: 10, color: "#666", marginTop: 2 },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  hwItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  hwIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  hwInfo: { flex: 1 },
  hwTitle: { fontSize: 12, fontWeight: "600", color: "#333" },
  hwSub: { fontSize: 11, color: "#999", marginTop: 2 },
  badgeOk: {
    fontSize: 10,
    backgroundColor: "#eaf3de",
    color: "#3b6d11",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  schedItem: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
    alignItems: "center",
  },
  schedTime: { fontSize: 10, color: "#999", width: 52, textAlign: "right" },
  schedBlock: { flex: 1, borderRadius: 8, padding: 10 },
  schedSubject: { fontSize: 12, fontWeight: "600" },
  schedRoom: { fontSize: 10, marginTop: 2, opacity: 0.8 },
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
  tabContent: { padding: 16 },
  tabTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a3a6b",
    marginBottom: 14,
  },
  hwCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  hwCardTop: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  hwCardIcon: { fontSize: 22 },
  hwCardInfo: { flex: 1 },
  hwCardSubject: { fontSize: 11, color: "#999" },
  hwCardTitle: { fontSize: 13, fontWeight: "600", color: "#333", marginTop: 2 },
  hwCardTeacher: { fontSize: 11, color: "#999", marginTop: 2 },
  submitBtn: {
    marginTop: 10,
    backgroundColor: "#1a3a6b",
    borderRadius: 8,
    padding: 9,
    alignItems: "center",
  },
  submitBtnText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  calDays: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 4 },
  calDayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
    color: "#999",
    fontWeight: "600",
  },
  calGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16 },
  calCell: {
    width: "14.28%",
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 8,
  },
  calCellToday: { backgroundColor: "#1a3a6b" },
  calDate: { fontSize: 13, color: "#333" },
  calDateToday: { color: "#fff", fontWeight: "bold" },
  calDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#3266ad",
    marginTop: 2,
  },
  evItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 10,
    alignItems: "center",
  },
  evStripe: { width: 4, height: 36, borderRadius: 2 },
  evInfo: { flex: 1 },
  evTitle: { fontSize: 13, fontWeight: "600", color: "#333" },
  evDate: { fontSize: 11, color: "#999", marginTop: 2 },
  gradeHeader: {
    backgroundColor: "#1a3a6b",
    padding: 24,
    alignItems: "center",
  },
  gradeScore: { fontSize: 48, fontWeight: "bold", color: "#fff" },
  gradeGrade: { fontSize: 24, color: "rgba(255,255,255,0.8)", marginTop: 4 },
  gradeRank: { fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 6 },
  gradeAttendance: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
  },
  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  subjectIcon: { fontSize: 20 },
  subjectInfo: { flex: 1 },
  subjectName: { fontSize: 13, fontWeight: "600", color: "#333" },
  subjectTeacher: { fontSize: 11, color: "#999", marginTop: 1 },
  progressBar: {
    height: 4,
    backgroundColor: "#f0f0f0",
    borderRadius: 2,
    marginTop: 6,
  },
  progressFill: { height: 4, borderRadius: 2 },
  subjectScore: { fontSize: 14, fontWeight: "bold" },
  gradeBadge: {
    backgroundColor: "#eaf3de",
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  gradeBadgeText: { fontSize: 11, color: "#3b6d11", fontWeight: "600" },
  chatItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
    alignItems: "center",
  },
  chatAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  chatAvatarText: { fontSize: 13, fontWeight: "bold" },
  chatInfo: { flex: 1 },
  chatName: { fontSize: 13, fontWeight: "600", color: "#333" },
  chatPreview: { fontSize: 11, color: "#999", marginTop: 2 },
  chatTime: { fontSize: 10, color: "#999" },
});
