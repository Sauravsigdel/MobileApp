import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState } from "react";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <View style={styles.container}>
      {/* Screen content changes based on tab */}
      <ScrollView style={styles.content}>
        {activeTab === "home" && <HomeTab />}
        {activeTab === "homework" && <HomeworkTab />}
        {activeTab === "calendar" && <CalendarTab />}
        {activeTab === "grades" && <GradesTab />}
        {activeTab === "chat" && <ChatTab />}
      </ScrollView>

      {/* Bottom nav bar */}
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
  return (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>Aisha Kumar</Text>
          <Text style={styles.badge}>Grade 10-A · Roll No. 14</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AK</Text>
        </View>
      </View>

      {/* Stats cards */}
      <View style={styles.cards}>
        <View style={[styles.card, { backgroundColor: "#e6f1fb" }]}>
          <Text style={styles.cardVal}>94%</Text>
          <Text style={styles.cardLabel}>Attendance</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#eaf3de" }]}>
          <Text style={styles.cardVal}>98.2%</Text>
          <Text style={styles.cardLabel}>Avg Grade</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#eaf3de" }]}>
          <Text style={styles.cardVal}>$0</Text>
          <Text style={styles.cardLabel}>Fee Balance</Text>
        </View>
      </View>

      {/* Homework due */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Homework Due</Text>
        <View style={styles.hwItem}>
          <View style={[styles.hwIcon, { backgroundColor: "#e6f1fb" }]}>
            <Text>📐</Text>
          </View>
          <View style={styles.hwInfo}>
            <Text style={styles.hwTitle}>Physics — Wave mechanics</Text>
            <Text style={styles.hwSub}>Mr. Sharma · Due today</Text>
          </View>
          <Text style={styles.badgeUrgent}>Today</Text>
        </View>
        <View style={styles.hwItem}>
          <View style={[styles.hwIcon, { backgroundColor: "#eaf3de" }]}>
            <Text>📝</Text>
          </View>
          <View style={styles.hwInfo}>
            <Text style={styles.hwTitle}>English — Essay draft</Text>
            <Text style={styles.hwSub}>Ms. Chen · 800 words</Text>
          </View>
          <Text style={styles.badgeMid}>Mar 18</Text>
        </View>
        <View style={styles.hwItem}>
          <View style={[styles.hwIcon, { backgroundColor: "#faeeda" }]}>
            <Text>🧪</Text>
          </View>
          <View style={styles.hwInfo}>
            <Text style={styles.hwTitle}>Chemistry — Lab report</Text>
            <Text style={styles.hwSub}>Dr. Okonkwo · Report format</Text>
          </View>
          <Text style={styles.badgeOk}>Mar 22</Text>
        </View>
      </View>

      {/* Today's schedule */}
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
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Homework</Text>
      {[
        {
          icon: "📐",
          subject: "Physics",
          title: "Wave mechanics problems",
          teacher: "Mr. Sharma",
          due: "Today",
          badgeStyle: "urgent",
        },
        {
          icon: "📝",
          subject: "English",
          title: "Persuasive essay draft",
          teacher: "Ms. Chen",
          due: "Mar 18",
          badgeStyle: "mid",
        },
        {
          icon: "🧪",
          subject: "Chemistry",
          title: "Titration lab report",
          teacher: "Dr. Okonkwo",
          due: "Mar 22",
          badgeStyle: "ok",
        },
        {
          icon: "➗",
          subject: "Mathematics",
          title: "Calculus problem set",
          teacher: "Mr. Singh",
          due: "Mar 24",
          badgeStyle: "ok",
        },
      ].map((hw, i) => (
        <View key={i} style={styles.hwCard}>
          <View style={styles.hwCardTop}>
            <Text style={styles.hwCardIcon}>{hw.icon}</Text>
            <View style={styles.hwCardInfo}>
              <Text style={styles.hwCardSubject}>{hw.subject}</Text>
              <Text style={styles.hwCardTitle}>{hw.title}</Text>
              <Text style={styles.hwCardTeacher}>{hw.teacher}</Text>
            </View>
            <Text
              style={
                hw.badgeStyle === "urgent"
                  ? styles.badgeUrgent
                  : hw.badgeStyle === "mid"
                    ? styles.badgeMid
                    : styles.badgeOk
              }
            >
              {hw.due}
            </Text>
          </View>
          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>View & Submit</Text>
          </TouchableOpacity>
        </View>
      ))}
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

  return (
    <View style={styles.tabContent}>
      {/* Overall score card */}
      <View style={styles.gradeHeader}>
        <Text style={styles.gradeScore}>98.2%</Text>
        <Text style={styles.gradeGrade}>A+</Text>
        <Text style={styles.gradeRank}>Rank 1 of 42 · Top of class</Text>
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
  const chats = [
    {
      initials: "SS",
      name: "Mr. Sharma (Physics)",
      preview: "Please submit your wave problems by tonight",
      time: "9:14 AM",
      unread: true,
      bg: "#e6f1fb",
      fg: "#185fa5",
    },
    {
      initials: "MC",
      name: "Ms. Chen (English)",
      preview: "Great essay draft, a few suggestions...",
      time: "Yesterday",
      unread: false,
      bg: "#eaf3de",
      fg: "#3b6d11",
    },
    {
      initials: "DO",
      name: "Dr. Okonkwo (Chemistry)",
      preview: "Lab report format reminder attached",
      time: "Mar 14",
      unread: false,
      bg: "#faeeda",
      fg: "#854f0b",
    },
  ];

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Messages</Text>
      {chats.map((chat, i) => (
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
  badgeUrgent: {
    fontSize: 10,
    backgroundColor: "#fcebeb",
    color: "#a32d2d",
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
    margin: 0,
    padding: 24,
    alignItems: "center",
  },
  gradeScore: { fontSize: 48, fontWeight: "bold", color: "#fff" },
  gradeGrade: { fontSize: 24, color: "rgba(255,255,255,0.8)", marginTop: 4 },
  gradeRank: { fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 6 },
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
  chatMeta: { alignItems: "flex-end", gap: 4 },
  chatTime: { fontSize: 10, color: "#999" },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3266ad",
  },
});
