import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState } from "react";

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {activeTab === "home" && <HomeTab />}
        {activeTab === "attendance" && <AttendanceTab />}
        {activeTab === "assignments" && <AssignmentsTab />}
        {activeTab === "grades" && <GradesTab />}
        {activeTab === "chat" && <ChatTab />}
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          { key: "home", label: "Home", icon: "🏠" },
          { key: "attendance", label: "Attendance", icon: "✅" },
          { key: "assignments", label: "Assignments", icon: "📝" },
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
  return (
    <View>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>Mr. Sharma</Text>
          <Text style={styles.badge}>Physics Teacher · Grade 10-A</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>SS</Text>
        </View>
      </View>

      <View style={styles.cards}>
        <View style={[styles.card, { backgroundColor: "#e6f1fb" }]}>
          <Text style={styles.cardVal}>42</Text>
          <Text style={styles.cardLabel}>Students</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#eaf3de" }]}>
          <Text style={styles.cardVal}>91%</Text>
          <Text style={styles.cardLabel}>Attendance</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#faeeda" }]}>
          <Text style={styles.cardVal}>5</Text>
          <Text style={styles.cardLabel}>Pending</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today&apos;s Classes</Text>
        {[
          {
            time: "9:30 AM",
            class: "Grade 10-A",
            subject: "Physics",
            room: "Lab 3",
            status: "pending",
            students: 42,
          },
          {
            time: "11:00 AM",
            class: "Grade 11-B",
            subject: "Physics",
            room: "Room 204",
            status: "done",
            students: 38,
          },
          {
            time: "2:00 PM",
            class: "Grade 9-C",
            subject: "Physics",
            room: "Lab 2",
            status: "upcoming",
            students: 40,
          },
        ].map((item, i) => (
          <View key={i} style={styles.classItem}>
            <View
              style={[
                styles.colorBar,
                {
                  backgroundColor:
                    item.status === "done"
                      ? "#3b6d11"
                      : item.status === "pending"
                        ? "#d4ab44"
                        : "#3266ad",
                },
              ]}
            />
            <View style={styles.classInfo}>
              <Text style={styles.className}>
                {item.class} — {item.subject}
              </Text>
              <Text style={styles.classTime}>
                {item.time} · {item.room} · {item.students} students
              </Text>
            </View>
            <Text
              style={
                item.status === "done"
                  ? styles.badgeDone
                  : item.status === "pending"
                    ? styles.badgePending
                    : styles.badgeUpcoming
              }
            >
              {item.status === "done"
                ? "Done"
                : item.status === "pending"
                  ? "Mark now"
                  : "Upcoming"}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pending Submissions</Text>
        {[
          {
            subject: "Wave mechanics problems",
            class: "Grade 10-A",
            submitted: 28,
            total: 42,
          },
          {
            subject: "Optics worksheet",
            class: "Grade 11-B",
            submitted: 35,
            total: 38,
          },
        ].map((item, i) => (
          <View key={i} style={styles.submItem}>
            <View style={styles.submInfo}>
              <Text style={styles.submTitle}>{item.subject}</Text>
              <Text style={styles.submSub}>
                {item.class} · {item.submitted} of {item.total} submitted
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(item.submitted / item.total) * 100}%` },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function AttendanceTab() {
  const [attendance, setAttendance] = useState<Record<string, string>>({
    "1": "P",
    "2": "P",
    "3": "L",
    "4": "A",
    "5": "P",
    "6": "P",
  });

  const students = [
    {
      id: "1",
      name: "Aisha Kumar",
      roll: "14",
      bg: "#e6f1fb",
      fg: "#185fa5",
      initials: "AK",
    },
    {
      id: "2",
      name: "Liam Torres",
      roll: "22",
      bg: "#eaf3de",
      fg: "#3b6d11",
      initials: "LT",
    },
    {
      id: "3",
      name: "Maya Wong",
      roll: "08",
      bg: "#faeeda",
      fg: "#854f0b",
      initials: "MW",
    },
    {
      id: "4",
      name: "Rohan Patel",
      roll: "31",
      bg: "#faece7",
      fg: "#993c1d",
      initials: "RP",
    },
    {
      id: "5",
      name: "Sara Nguyen",
      roll: "05",
      bg: "#e1f5ee",
      fg: "#0f6e56",
      initials: "SN",
    },
    {
      id: "6",
      name: "James Miller",
      roll: "17",
      bg: "#eeedfe",
      fg: "#534ab7",
      initials: "JM",
    },
  ];

  const mark = (id: string, status: string) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: prev[id] === status ? "" : status,
    }));
  };

  const counts = {
    P: Object.values(attendance).filter((v) => v === "P").length,
    A: Object.values(attendance).filter((v) => v === "A").length,
    L: Object.values(attendance).filter((v) => v === "L").length,
  };

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Attendance — Grade 10-A</Text>
      <Text style={styles.tabSubtitle}>Monday, March 16, 2026 · Physics</Text>

      <View style={styles.attSummary}>
        <View style={[styles.attStat, { backgroundColor: "#eaf3de" }]}>
          <Text style={[styles.attStatVal, { color: "#3b6d11" }]}>
            {counts.P}
          </Text>
          <Text style={styles.attStatLabel}>Present</Text>
        </View>
        <View style={[styles.attStat, { backgroundColor: "#fcebeb" }]}>
          <Text style={[styles.attStatVal, { color: "#a32d2d" }]}>
            {counts.A}
          </Text>
          <Text style={styles.attStatLabel}>Absent</Text>
        </View>
        <View style={[styles.attStat, { backgroundColor: "#faeeda" }]}>
          <Text style={[styles.attStatVal, { color: "#854f0b" }]}>
            {counts.L}
          </Text>
          <Text style={styles.attStatLabel}>Late</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.markAllBtn}
        onPress={() => {
          const all: Record<string, string> = {};
          students.forEach((s) => (all[s.id] = "P"));
          setAttendance(all);
        }}
      >
        <Text style={styles.markAllText}>✓ Mark all present</Text>
      </TouchableOpacity>

      {students.map((s) => (
        <View key={s.id} style={styles.studentRow}>
          <View style={[styles.studentAvatar, { backgroundColor: s.bg }]}>
            <Text style={[styles.studentInitials, { color: s.fg }]}>
              {s.initials}
            </Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{s.name}</Text>
            <Text style={styles.studentRoll}>Roll {s.roll}</Text>
          </View>
          <View style={styles.attBtns}>
            {["P", "A", "L"].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.attBtn,
                  attendance[s.id] === status &&
                    (status === "P"
                      ? styles.attBtnP
                      : status === "A"
                        ? styles.attBtnA
                        : styles.attBtnL),
                ]}
                onPress={() => mark(s.id, status)}
              >
                <Text
                  style={[
                    styles.attBtnText,
                    attendance[s.id] === status && styles.attBtnTextActive,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveBtnText}>Save Attendance</Text>
      </TouchableOpacity>
    </View>
  );
}

function AssignmentsTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Assignments</Text>
      {[
        {
          subject: "Grade 10-A",
          title: "Wave mechanics problems",
          due: "Today",
          submitted: 28,
          total: 42,
        },
        {
          subject: "Grade 11-B",
          title: "Optics worksheet",
          due: "Mar 18",
          submitted: 35,
          total: 38,
        },
        {
          subject: "Grade 9-C",
          title: "Newton's laws quiz",
          due: "Mar 20",
          submitted: 10,
          total: 40,
        },
      ].map((item, i) => (
        <View key={i} style={styles.assignCard}>
          <View style={styles.assignTop}>
            <Text style={styles.assignClass}>{item.subject}</Text>
            <Text style={styles.badgeMid}>{item.due}</Text>
          </View>
          <Text style={styles.assignTitle}>{item.title}</Text>
          <Text style={styles.assignSub}>
            {item.submitted} of {item.total} submitted
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(item.submitted / item.total) * 100}%` },
              ]}
            />
          </View>
          <TouchableOpacity style={styles.gradeBtn}>
            <Text style={styles.gradeBtnText}>View Submissions</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveBtnText}>+ New Assignment</Text>
      </TouchableOpacity>
    </View>
  );
}

function GradesTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Gradebook — Grade 10-A</Text>
      {[
        {
          initials: "AK",
          name: "Aisha Kumar",
          bg: "#e6f1fb",
          fg: "#185fa5",
          score: 97,
          grade: "A+",
        },
        {
          initials: "LT",
          name: "Liam Torres",
          bg: "#eaf3de",
          fg: "#3b6d11",
          score: 89,
          grade: "A",
        },
        {
          initials: "MW",
          name: "Maya Wong",
          bg: "#faeeda",
          fg: "#854f0b",
          score: 76,
          grade: "B",
        },
        {
          initials: "RP",
          name: "Rohan Patel",
          bg: "#faece7",
          fg: "#993c1d",
          score: 62,
          grade: "C",
        },
        {
          initials: "SN",
          name: "Sara Nguyen",
          bg: "#e1f5ee",
          fg: "#0f6e56",
          score: 84,
          grade: "A",
        },
        {
          initials: "JM",
          name: "James Miller",
          bg: "#eeedfe",
          fg: "#534ab7",
          score: 91,
          grade: "A+",
        },
      ].map((s, i) => (
        <View key={i} style={styles.gradeRow}>
          <View style={[styles.studentAvatar, { backgroundColor: s.bg }]}>
            <Text style={[styles.studentInitials, { color: s.fg }]}>
              {s.initials}
            </Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{s.name}</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${s.score}%`,
                    backgroundColor:
                      s.score >= 90
                        ? "#3b6d11"
                        : s.score >= 75
                          ? "#3266ad"
                          : "#d4ab44",
                  },
                ]}
              />
            </View>
          </View>
          <Text
            style={[
              styles.gradeScore,
              {
                color:
                  s.score >= 90
                    ? "#3b6d11"
                    : s.score >= 75
                      ? "#3266ad"
                      : "#d4ab44",
              },
            ]}
          >
            {s.score}
          </Text>
          <View style={styles.gradePill}>
            <Text style={styles.gradePillText}>{s.grade}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function ChatTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Messages</Text>
      {[
        {
          initials: "AK",
          name: "Aisha Kumar",
          preview: "Sir I am stuck on question 6...",
          time: "9:44 AM",
          unread: true,
          bg: "#e6f1fb",
          fg: "#185fa5",
        },
        {
          initials: "RP",
          name: "Rohan Patel",
          preview: "Can I submit tomorrow?",
          time: "Yesterday",
          unread: true,
          bg: "#faece7",
          fg: "#993c1d",
        },
        {
          initials: "AD",
          name: "Admin",
          preview: "Staff meeting at 3 PM today",
          time: "Mar 15",
          unread: false,
          bg: "#eeedfe",
          fg: "#534ab7",
        },
      ].map((chat, i) => (
        <TouchableOpacity key={i} style={styles.chatItem}>
          <View style={[styles.chatAvatar, { backgroundColor: chat.bg }]}>
            <Text style={[styles.chatAvatarText, { color: chat.fg }]}>
              {chat.initials}
            </Text>
          </View>
          <View style={styles.chatInfo}>
            <Text style={styles.chatName}>{chat.name}</Text>
            <Text style={styles.chatPreview} numberOfLines={1}>
              {chat.preview}
            </Text>
          </View>
          <View style={styles.chatMeta}>
            <Text style={styles.chatTime}>{chat.time}</Text>
            {chat.unread && <View style={styles.unreadDot} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },
  content: { flex: 1 },
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
  classItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  colorBar: { width: 4, height: 40, borderRadius: 2 },
  classInfo: { flex: 1 },
  className: { fontSize: 13, fontWeight: "600", color: "#333" },
  classTime: { fontSize: 11, color: "#999", marginTop: 2 },
  badgeDone: {
    fontSize: 10,
    backgroundColor: "#eaf3de",
    color: "#3b6d11",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgePending: {
    fontSize: 10,
    backgroundColor: "#faeeda",
    color: "#854f0b",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeUpcoming: {
    fontSize: 10,
    backgroundColor: "#e6f1fb",
    color: "#185fa5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeMid: {
    fontSize: 10,
    backgroundColor: "#faeeda",
    color: "#854f0b",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  submItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  submInfo: { marginBottom: 8 },
  submTitle: { fontSize: 13, fontWeight: "600", color: "#333" },
  submSub: { fontSize: 11, color: "#999", marginTop: 2 },
  progressBar: {
    height: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    marginTop: 4,
  },
  progressFill: { height: 5, borderRadius: 3, backgroundColor: "#3266ad" },
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
    marginBottom: 4,
  },
  tabSubtitle: { fontSize: 12, color: "#999", marginBottom: 14 },
  attSummary: { flexDirection: "row", gap: 10, marginBottom: 12 },
  attStat: { flex: 1, borderRadius: 10, padding: 12, alignItems: "center" },
  attStatVal: { fontSize: 20, fontWeight: "bold" },
  attStatLabel: { fontSize: 10, color: "#666", marginTop: 2 },
  markAllBtn: {
    backgroundColor: "#eaf3de",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  markAllText: { fontSize: 12, color: "#3b6d11", fontWeight: "600" },
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
  studentRoll: { fontSize: 11, color: "#999", marginTop: 1 },
  attBtns: { flexDirection: "row", gap: 6 },
  attBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  },
  attBtnP: { backgroundColor: "#eaf3de", borderColor: "#c0dd97" },
  attBtnA: { backgroundColor: "#fcebeb", borderColor: "#f7c1c1" },
  attBtnL: { backgroundColor: "#faeeda", borderColor: "#fac775" },
  attBtnText: { fontSize: 11, color: "#999", fontWeight: "600" },
  attBtnTextActive: { color: "#333" },
  saveBtn: {
    backgroundColor: "#1a3a6b",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 16,
  },
  saveBtnText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  assignCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  assignTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  assignClass: { fontSize: 11, color: "#999", fontWeight: "600" },
  assignTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  assignSub: { fontSize: 11, color: "#999", marginBottom: 6 },
  gradeBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#1a3a6b",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
  },
  gradeBtnText: { color: "#1a3a6b", fontSize: 12, fontWeight: "600" },
  gradeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  gradeScore: {
    fontSize: 15,
    fontWeight: "bold",
    width: 32,
    textAlign: "right",
  },
  gradePill: {
    backgroundColor: "#eaf3de",
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  gradePillText: { fontSize: 11, color: "#3b6d11", fontWeight: "600" },
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
  chatMeta: { alignItems: "flex-end", gap: 4 },
  chatTime: { fontSize: 10, color: "#999" },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3266ad",
  },
});
