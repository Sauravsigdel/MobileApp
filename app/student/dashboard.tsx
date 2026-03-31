import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../../config";

// ===== Design System =====
const colors = {
  background: "#f7f9fb",
  card: "#ffffff",
  primary: "#2563EB",
  text: "#191c1e",
  subtext: "#6B7280",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  blue: "#2563EB",
  green: "#10B981",
  orange: "#F59E0B",
  red: "#EF4444",
  purple: "#8B5CF6",
};

const shadows = {
  default: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  glow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};

// ===== Types =====
interface TabItem {
  id: string;
  name: string;
  icon: string;
  label: string;
}

interface Notice {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  subject: string;
  submittedDate?: string;
  status: "pending" | "submitted" | "graded" | "overdue";
  score?: number;
  totalScore?: number;
  teacherId: string;
}

interface StudentData {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface StudentProfile {
  _id: string;
  userId: string;
  rollNo: string;
  address: string;
  admissionDate: string;
  parentName: string;
  parentPhone: string;
  sectionId: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ===== API Service =====
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// ===== HOME TAB =====
const HomeTab = ({ studentData, studentProfile }: any) => {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");

        // Fetch timetable
        const timetableRes = await apiClient.get(
          `/api/timetable/${studentProfile?.sectionId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        // Fetch notices
        const noticesRes = await apiClient.get("/api/notices", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch attendance stats
        const statsRes = await apiClient.get(`/api/attendance/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSchedule(timetableRes.data || []);
        setNotices(noticesRes.data || []);
        setStats(statsRes.data || {});
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [studentProfile?.sectionId]);

  const getTodaysSchedule = () => {
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });
    return schedule.filter((item: any) => item.day === today) || [];
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.tab} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.homeHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerEmoji}>🎓</Text>
          <Text style={styles.headerTitle}>GyanSetu</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.notificationBell}>
            <MaterialIcons name="notifications" size={24} color={colors.text} />
            <View style={styles.notificationDot} />
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(studentData?.name || "U")}
            </Text>
          </View>
        </View>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.greeting}>
          Good morning, {studentData?.name?.split(" ")[0]}
        </Text>
        <Text style={styles.greetingSubtitle}>
          {studentProfile?.sectionId} • Roll No. {studentProfile?.rollNo}
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <StatCard
          icon="📋"
          label="ATTENDANCE"
          value={`${stats?.percentage || 92}%`}
          color={colors.blue}
        />
        <StatCard
          icon="📝"
          label="PENDING"
          value={`${stats?.pending || 3} Tasks`}
          color={colors.orange}
        />
        <StatCard
          icon="💰"
          label="FEE BALANCE"
          value={`Rs. ${stats?.feeBalance || "5000"}`}
          color={colors.purple}
        />
      </View>

      {/* Today's Schedule */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{"Today's Schedule"}</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllLink}>View Full Week</Text>
          </TouchableOpacity>
        </View>

        {getTodaysSchedule().length > 0 ? (
          getTodaysSchedule().map((item: any, idx: number) => (
            <ScheduleCard key={idx} item={item} isOngoing={idx === 0} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No classes today</Text>
          </View>
        )}
      </View>

      {/* Recent Notices */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Notices</Text>
        {notices.length > 0 ? (
          notices
            .slice(0, 3)
            .map((notice) => <NoticeCard key={notice._id} notice={notice} />)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No notices</Text>
          </View>
        )}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <View style={[styles.statCard, shadows.default]}>
    <View style={[styles.statIcon, { backgroundColor: color }]}>
      <Text style={styles.statEmoji}>{icon}</Text>
    </View>
    <View style={styles.statContent}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  </View>
);

const ScheduleCard = ({ item, isOngoing }: any) => (
  <View
    style={[
      styles.scheduleCard,
      isOngoing && styles.scheduleCardOngoing,
      shadows.default,
    ]}
  >
    <View style={styles.scheduleTime}>
      <Text style={[styles.timeText, isOngoing && styles.timeTextOngoing]}>
        {item.time || "08:00 AM"}
      </Text>
      {isOngoing && (
        <View style={styles.ongoingBadge}>
          <Text style={styles.ongoingText}>ONGOING</Text>
        </View>
      )}
    </View>
    <View style={styles.scheduleInfo}>
      <Text
        style={[styles.scheduleTitle, isOngoing && styles.scheduleTitleOngoing]}
      >
        {item.subject || "Mathematics"}
      </Text>
      <Text
        style={[
          styles.scheduleTeacher,
          isOngoing && styles.scheduleTeacherOngoing,
        ]}
      >
        {item.teacher || "Mr. Sharma"} • Room {item.room || "101"}
      </Text>
    </View>
    <MaterialIcons
      name={isOngoing ? "broadcast-on-home" : "access-time"}
      size={20}
      color={isOngoing ? colors.card : colors.subtext}
    />
  </View>
);

const NoticeCard = ({ notice }: any) => {
  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      EVENT: colors.blue,
      SPORTS: colors.green,
      GENERAL: colors.subtext,
    };
    return colorMap[category] || colors.subtext;
  };

  return (
    <View
      style={[
        styles.noticeCard,
        {
          borderLeftColor: getCategoryColor(notice.category),
          borderLeftWidth: 4,
        },
        shadows.default,
      ]}
    >
      <View style={styles.noticeCategoryPill}>
        <Text style={styles.noticeCategoryText}>{notice.category}</Text>
      </View>
      <Text style={styles.noticeTitle}>{notice.title}</Text>
      <Text style={styles.noticeContent}>{notice.content}</Text>
      <Text style={styles.noticeDate}>
        {new Date(notice.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );
};

// ===== ASSIGNMENTS TAB =====
const AssignmentsTab = ({ studentProfile }: any) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filter, setFilter] = useState("all");
  const [submitModal, setSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await apiClient.get("/api/assignments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      Alert.alert("Error", "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAssignment) return;

    try {
      const token = await AsyncStorage.getItem("token");
      await apiClient.post(
        `/api/assignments/${selectedAssignment._id}/submit`,
        { submission: submissionText },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      Alert.alert("Success", "Assignment submitted!");
      setSubmitModal(false);
      setSubmissionText("");
      fetchAssignments();
    } catch (error) {
      console.error("Error submitting assignment:", error);
      Alert.alert("Error", "Failed to submit assignment");
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    if (filter === "all") return true;
    return a.status === filter;
  });

  const counts = {
    pending: assignments.filter((a) => a.status === "pending").length,
    submitted: assignments.filter((a) => a.status === "submitted").length,
    graded: assignments.filter((a) => a.status === "graded").length,
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.tab} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderTitle}>My Assignments</Text>
        <Text style={styles.tabHeaderSubtitle}>
          {counts.pending} pending • {counts.submitted} submitted •{" "}
          {counts.graded} graded
        </Text>
      </View>

      {/* Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {["all", "pending", "submitted", "graded"].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterPill, filter === f && styles.filterPillActive]}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Assignment Cards */}
      <View style={styles.assignmentsContainer}>
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment._id}
              assignment={assignment}
              onSubmit={() => {
                setSelectedAssignment(assignment);
                setSubmitModal(true);
              }}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>✓ No assignments here</Text>
            <Text style={styles.emptySubtitle}>You are all caught up!</Text>
          </View>
        )}
      </View>

      <View style={{ height: 100 }} />

      {/* Submit Modal */}
      <Modal visible={submitModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Submit Assignment</Text>
            <Text style={styles.modalAssignmentName}>
              {selectedAssignment?.title}
            </Text>
            <TextInput
              style={styles.modalTextInput}
              multiline
              placeholder="Write your answer..."
              placeholderTextColor={colors.subtext}
              value={submissionText}
              onChangeText={setSubmissionText}
            />
            <TouchableOpacity style={styles.attachButton}>
              <MaterialIcons
                name="attach-file"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.attachButtonText}>Attach File</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setSubmitModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const AssignmentCard = ({ assignment, onSubmit }: any) => {
  const getSubjectColor = (subject: string) => {
    const colors_map: { [key: string]: string } = {
      MATH: "#2563EB",
      SCIENCE: "#10B981",
      HISTORY: "#F59E0B",
      ENGLISH: "#8B5CF6",
    };
    return colors_map[subject.toUpperCase()] || "#6B7280";
  };

  return (
    <View style={[styles.assignmentCard, shadows.default]}>
      {assignment.status === "graded" && <View style={styles.gradedBorder} />}

      <View style={styles.assignmentHeader}>
        <View
          style={[
            styles.subjectPill,
            { backgroundColor: getSubjectColor(assignment.subject) },
          ]}
        >
          <Text style={styles.subjectPillText}>
            {assignment.subject.substring(0, 3).toUpperCase()}
          </Text>
        </View>
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor:
                assignment.status === "pending"
                  ? colors.orange
                  : assignment.status === "submitted"
                    ? colors.success
                    : assignment.status === "graded"
                      ? colors.orange
                      : colors.danger,
            },
          ]}
        >
          <Text style={styles.statusPillText}>
            {assignment.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.assignmentTitle}>{assignment.title}</Text>
      <View style={styles.assignmentMeta}>
        <MaterialIcons name="person" size={16} color={colors.subtext} />
        <Text style={styles.assignmentTeacher}>{assignment.teacherId}</Text>
      </View>

      {assignment.status === "pending" || assignment.status === "overdue" ? (
        <>
          <View style={styles.assignmentMeta}>
            <MaterialIcons
              name="event"
              size={16}
              color={
                assignment.status === "overdue" ? colors.danger : colors.subtext
              }
            />
            <Text
              style={[
                styles.assignmentDate,
                assignment.status === "overdue" && {
                  color: colors.danger,
                },
              ]}
            >
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.submitButton,
              assignment.status === "overdue" && {
                backgroundColor: colors.danger,
              },
            ]}
            onPress={onSubmit}
          >
            <Text style={styles.submitButtonText}>Submit Now →</Text>
          </TouchableOpacity>
        </>
      ) : assignment.status === "submitted" ? (
        <>
          <View style={styles.assignmentMeta}>
            <MaterialIcons
              name="access-time"
              size={16}
              color={colors.subtext}
            />
            <Text style={styles.assignmentDate}>
              Turned in{" "}
              {new Date(assignment.submittedDate || "").toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Submission</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.assignmentMeta}>
            <MaterialIcons
              name="access-time"
              size={16}
              color={colors.subtext}
            />
            <Text style={styles.assignmentDate}>
              Graded on {new Date(assignment.dueDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>SCORE</Text>
            <Text style={styles.scoreValue}>
              {assignment.score}/{assignment.totalScore}
            </Text>
            <MaterialIcons name="chat-bubble" size={20} color={colors.danger} />
          </View>
        </>
      )}
    </View>
  );
};

// ===== ASK AI TAB =====
const AskAITab = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      const conversationHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      conversationHistory.push({
        role: "user",
        content: inputText,
      });

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            "sk-ant-v1-yh5s3U8PdRbKdlgF5FCk7L-MH3FElPEq9OjXLJ7RTQsNkn7e8PjLJQBbWGFI5PO9gYGKy2q4Pn_3J7QZfpPTcg",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system:
            "You are GyanSetu AI, a helpful study assistant for school students in Nepal. Help students understand their subjects, complete homework, and prepare for exams. Be encouraging, clear and concise.",
          messages: conversationHistory,
        }),
      });

      const data = await response.json();

      if (data.content && data.content.length > 0) {
        const aiMessage: ChatMessage = {
          role: "assistant",
          content: data.content[0].text,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error sending message to AI:", error);
      Alert.alert("Error", "Failed to get AI response");
    } finally {
      setLoading(false);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  const quickSuggestions = [
    "Explain this topic",
    "Help with homework",
    "Quiz me",
    "Summarize notes",
  ];

  return (
    <KeyboardAvoidingView
      style={styles.aiTab}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.aiHeader}>
          <MaterialIcons name="menu" size={24} color={colors.text} />
          <View>
            <Text style={styles.aiHeaderTitle}>GyanSetu AI</Text>
            <Text style={styles.aiHeaderSubtitle}>
              YOUR PERSONAL STUDY ASSISTANT
            </Text>
          </View>
          <View style={styles.aiAvatar}>
            <Text>👤</Text>
          </View>
        </View>

        {/* Chat Messages or Quick Suggestions */}
        {messages.length === 0 ? (
          <>
            <View style={styles.aiWelcome}>
              <Text style={styles.aiWelcomeEmoji}>🤖</Text>
              <Text style={styles.aiWelcomeTitle}>Hi there!</Text>
              <Text style={styles.aiWelcomeText}>
                {
                  "I'm your AI study assistant. Ask me anything about your courses!"
                }
              </Text>
            </View>

            <Text style={styles.suggestionsLabel}>Quick Suggestions</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.suggestionsScroll}
            >
              {quickSuggestions.map((suggestion, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.suggestionChip}
                  onPress={() => setInputText(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        ) : (
          messages.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.messageBubble,
                msg.role === "user" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  msg.role === "user" ? styles.bubbleUser : styles.bubbleAI,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.role === "user" && styles.messageTextUser,
                  ]}
                >
                  {msg.content}
                </Text>
              </View>
              <Text style={styles.messageTime}>
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          ))
        )}

        {loading && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingDot}>●</Text>
            <Text style={styles.typingDot}>●</Text>
            <Text style={styles.typingDot}>●</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.aiInputBar}>
        <TouchableOpacity style={styles.attachIconButton}>
          <MaterialIcons name="add" size={24} color={colors.subtext} />
        </TouchableOpacity>
        <TextInput
          style={styles.aiInput}
          placeholder="Ask anything about your courses..."
          placeholderTextColor={colors.subtext}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButtonAI}
          onPress={sendMessage}
          disabled={loading}
        >
          <MaterialIcons name="send" size={20} color={colors.card} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// ===== ATTENDANCE TAB =====
const AttendanceTab = ({ studentProfile }: any) => {
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await apiClient.get("/api/attendance/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendanceData(res.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();

  const getDayDots = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const status =
        Math.random() > 0.1
          ? "present"
          : Math.random() > 0.5
            ? "absent"
            : "late";
      days.push({ date: i, status });
    }
    return days;
  };

  return (
    <ScrollView style={styles.tab} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderTitle}>My Attendance</Text>
        <Text style={styles.tabHeaderSubtitle}>
          Track your consistency and performance.
        </Text>
      </View>

      {/* Overall Card */}
      <View style={[styles.attendanceCard, shadows.default]}>
        <View style={styles.progressRing}>
          <Text style={styles.progressPercentage}>
            {attendanceData?.percentage || 94}%
          </Text>
          <Text style={styles.progressLabel}>OVERALL</Text>
        </View>
        <View style={styles.attendanceStats}>
          <View style={styles.attendanceStat}>
            <Text style={styles.statCount}>
              {attendanceData?.present || 42}
            </Text>
            <Text style={styles.statName}>PRESENT</Text>
          </View>
          <View style={styles.attendanceStat}>
            <Text style={[styles.statCount, { color: colors.danger }]}>
              {attendanceData?.absent || 3}
            </Text>
            <Text style={styles.statName}>ABSENT</Text>
          </View>
          <View style={styles.attendanceStat}>
            <Text style={[styles.statCount, { color: colors.warning }]}>
              {attendanceData?.late || 2}
            </Text>
            <Text style={styles.statName}>LATE</Text>
          </View>
        </View>
      </View>

      {/* Calendar */}
      <View style={[styles.calendarCard, shadows.default]}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            onPress={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() - 1,
                ),
              )
            }
          >
            <MaterialIcons
              name="chevron-left"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
          <Text style={styles.calendarTitle}>
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </Text>
          <TouchableOpacity
            onPress={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1,
                ),
              )
            }
          >
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Day Headers */}
        <View style={styles.dayHeaders}>
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <Text key={day} style={styles.dayHeader}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {getDayDots().map((day, idx) => (
            <View key={idx} style={styles.calendarDay}>
              {day ? (
                <>
                  <Text style={styles.dayNumber}>{day.date}</Text>
                  <View
                    style={[
                      styles.dayDot,
                      {
                        backgroundColor:
                          day.status === "present"
                            ? colors.success
                            : day.status === "absent"
                              ? colors.danger
                              : colors.warning,
                      },
                    ]}
                  />
                </>
              ) : null}
            </View>
          ))}
        </View>

        {/* Legend */}
        <View style={styles.calendarLegend}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: colors.success }]}
            />
            <Text style={styles.legendText}>Present</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: colors.danger }]}
            />
            <Text style={styles.legendText}>Absent</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: colors.warning }]}
            />
            <Text style={styles.legendText}>Late</Text>
          </View>
        </View>
      </View>

      {/* Subject-wise Breakdown */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Subject-wise Breakdown</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllLink}>Download Report</Text>
          </TouchableOpacity>
        </View>

        <SubjectAttendanceCard
          subject="Mathematics"
          attendance={45}
          total={50}
        />
        <SubjectAttendanceCard subject="Science" attendance={44} total={50} />
        <SubjectAttendanceCard subject="English" attendance={42} total={50} />
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const SubjectAttendanceCard = ({ subject, attendance, total }: any) => {
  const percentage = Math.round((attendance / total) * 100);
  const isAboveTarget = percentage >= 75;

  return (
    <View style={[styles.subjectAttendanceCard, shadows.default]}>
      <View style={styles.subjectAttendanceHeader}>
        <View>
          <Text style={styles.subjectAttendanceName}>{subject}</Text>
          <Text style={styles.subjectTeacher}>Mr./Ms. Name</Text>
        </View>
        <View>
          <Text style={styles.targetLabel}>TARGET: 75%</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`,
              backgroundColor: isAboveTarget ? colors.success : colors.warning,
            },
          ]}
        />
      </View>

      <Text
        style={[
          styles.attendancePercentage,
          {
            color: isAboveTarget ? colors.success : colors.warning,
          },
        ]}
      >
        {percentage}%
      </Text>
    </View>
  );
};

// ===== RESULTS TAB =====
const ResultsTab = ({ studentProfile }: any) => {
  const [, setResults] = useState<any>(null);
  const [selectedTerm, setSelectedTerm] = useState("first");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await apiClient.get("/api/exams/results", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.tab} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderTitle}>My Results</Text>
        <Text style={styles.tabHeaderSubtitle}>Academic Year 2023-24</Text>
      </View>

      {/* Rank Banner */}
      <View style={[styles.rankBanner, shadows.default]}>
        <Text style={styles.rankEmoji}>🏆</Text>
        <View style={styles.rankContent}>
          <Text style={styles.rankTitle}>Rank: 5th in Class</Text>
          <Text style={styles.rankSubtitle}>Excellent performance!</Text>
        </View>
      </View>

      {/* Term Selector */}
      <View style={styles.termSelector}>
        {["First Term", "Second Term", "Final"].map((term) => (
          <TouchableOpacity
            key={term}
            onPress={() => setSelectedTerm(term.toLowerCase().split(" ")[0])}
            style={styles.termTab}
          >
            <Text
              style={[
                styles.termTabText,
                selectedTerm === term.toLowerCase().split(" ")[0] &&
                  styles.termTabTextActive,
              ]}
            >
              {term}
            </Text>
            {selectedTerm === term.toLowerCase().split(" ")[0] && (
              <View style={styles.termTabUnderline} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Overall Performance */}
      <View style={[styles.performanceCard, shadows.default]}>
        <View style={styles.performanceRing}>
          <Text style={styles.performancePercentage}>78%</Text>
        </View>
        <View style={styles.performanceContent}>
          <Text style={styles.performanceTitle}>Academic Excellence</Text>
          <Text style={styles.performanceMessage}>
            {"You're doing great! Keep it up."}
          </Text>
          <View style={styles.performanceStats}>
            <View>
              <Text style={styles.performanceStatLabel}>CURRENT GPA</Text>
              <Text style={styles.performanceStatValue}>3.8</Text>
            </View>
            <View>
              <Text style={styles.performanceStatLabel}>CREDITS</Text>
              <Text style={styles.performanceStatValue}>120</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Top Performer Card */}
      <View style={[styles.topPerformerCard, shadows.default]}>
        <Text style={styles.topPerformerEmoji}>🏅</Text>
        <Text style={styles.topPerformerTitle}>Top Performer</Text>
        <Text style={styles.topPerformerText}>
          {"You're among the top performers in your class!"}
        </Text>
        <TouchableOpacity style={styles.certificateButton}>
          <Text style={styles.certificateButtonText}>View Certificate</Text>
        </TouchableOpacity>
      </View>

      {/* Subject Analysis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subject Analysis</Text>
        <SubjectResultCard subject="Mathematics" score={85} grade="A+" />
        <SubjectResultCard subject="Science" score={92} grade="A+" />
        <SubjectResultCard subject="English" score={78} grade="B+" />
        <SubjectResultCard subject="History" score={88} grade="A" />
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const SubjectResultCard = ({ subject, score, grade }: any) => (
  <TouchableOpacity style={[styles.subjectResultCard, shadows.default]}>
    <View style={styles.subjectResultHeader}>
      <Text style={styles.subjectResultName}>{subject}</Text>
      <Text style={styles.subjectResultScore}>{score}/100</Text>
    </View>

    <View style={styles.progressBar}>
      <View
        style={[
          styles.progressFill,
          { width: `${score}%`, backgroundColor: colors.primary },
        ]}
      />
    </View>

    <View style={styles.subjectResultFooter}>
      <Text style={styles.gradeLabel}>GRADE</Text>
      <View style={[styles.gradeBadge, { backgroundColor: colors.primary }]}>
        <Text style={styles.gradeBadgeText}>{grade}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color={colors.subtext} />
    </View>
  </TouchableOpacity>
);
// ===== MAIN DASHBOARD =====
export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        setStudentData(JSON.parse(user));
      }

      const token = await AsyncStorage.getItem("token");
      const profileRes = await apiClient.get("/api/students/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentProfile(profileRes.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs: TabItem[] = [
    { id: "home", name: "Home", icon: "home", label: "🏠" },
    { id: "assignments", name: "Assignments", icon: "assignment", label: "📝" },
    { id: "ai", name: "Ask AI", icon: "smart-toy", label: "🤖" },
    { id: "attendance", name: "Attendance", icon: "check-circle", label: "✅" },
    { id: "results", name: "Results", icon: "bar-chart", label: "📊" },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Content */}
      {activeTab === 0 && (
        <HomeTab studentData={studentData} studentProfile={studentProfile} />
      )}
      {activeTab === 1 && <AssignmentsTab studentProfile={studentProfile} />}
      {activeTab === 2 && <AskAITab />}
      {activeTab === 3 && <AttendanceTab studentProfile={studentProfile} />}
      {activeTab === 4 && <ResultsTab studentProfile={studentProfile} />}

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, shadows.medium]}>
        {tabs.map((tab, idx) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.navItem,
              idx === 2 && styles.navItemCenter, // Special positioning for AI
            ]}
            onPress={() => setActiveTab(idx)}
          >
            {idx === 2 ? (
              // Center AI Button
              <View style={[styles.aiButton, shadows.glow]}>
                <Text style={styles.aiButtonEmoji}>🤖</Text>
              </View>
            ) : (
              <>
                <Text style={styles.navEmoji}>{tab.label}</Text>
                {activeTab === idx && <View style={styles.navIndicator} />}
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tab: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },

  // HOME TAB
  homeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerEmoji: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  notificationBell: {
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: colors.card,
    fontWeight: "600",
  },

  welcomeSection: {
    marginVertical: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: 4,
  },

  statsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 16,
  },
  statIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  statEmoji: {
    fontSize: 32,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.subtext,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginTop: 4,
  },

  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  viewAllLink: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },

  scheduleCard: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
    gap: 12,
  },
  scheduleCardOngoing: {
    backgroundColor: colors.primary,
  },
  scheduleTime: {
    width: 60,
    alignItems: "center",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  timeTextOngoing: {
    color: colors.card,
  },
  ongoingBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginTop: 4,
  },
  ongoingText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.card,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  scheduleTitleOngoing: {
    color: colors.card,
  },
  scheduleTeacher: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 2,
  },
  scheduleTeacherOngoing: {
    color: "rgba(255,255,255,0.8)",
  },

  noticeCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  noticeCategoryPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginBottom: 6,
  },
  noticeCategoryText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.primary,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  noticeContent: {
    fontSize: 12,
    color: colors.subtext,
    marginBottom: 6,
  },
  noticeDate: {
    fontSize: 10,
    color: colors.subtext,
  },

  emptyState: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.subtext,
  },

  // ASSIGNMENTS TAB
  tabHeader: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  tabHeaderTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  tabHeaderSubtitle: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: 4,
  },

  filterContainer: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.subtext,
  },
  filterTextActive: {
    color: colors.card,
  },

  assignmentsContainer: {
    marginBottom: 20,
  },
  assignmentCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  gradedBorder: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.danger,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  assignmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  subjectPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  subjectPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.card,
  },
  statusPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.card,
  },
  assignmentTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  assignmentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  assignmentTeacher: {
    fontSize: 12,
    color: colors.subtext,
  },
  assignmentDate: {
    fontSize: 12,
    color: colors.subtext,
  },

  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  submitButtonText: {
    color: colors.card,
    fontWeight: "600",
    fontSize: 14,
  },

  viewButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  viewButtonText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },

  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.subtext,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.danger,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  modalAssignmentName: {
    fontSize: 13,
    color: colors.subtext,
    marginBottom: 12,
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  attachButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    marginBottom: 16,
  },
  attachButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.subtext,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.subtext,
    fontWeight: "600",
    fontSize: 14,
  },

  // AI TAB
  aiTab: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chatScroll: {
    flex: 1,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  aiHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },
  aiHeaderSubtitle: {
    fontSize: 11,
    color: colors.subtext,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },

  aiWelcome: {
    paddingHorizontal: 16,
    paddingVertical: 40,
    alignItems: "center",
  },
  aiWelcomeEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  aiWelcomeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  aiWelcomeText: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: "center",
  },

  suggestionsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.subtext,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  suggestionsScroll: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  suggestionChip: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "600",
  },

  messageBubble: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginVertical: 6,
  },
  userBubble: {
    justifyContent: "flex-end",
  },
  aiBubble: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
  },
  bubbleAI: {
    backgroundColor: colors.card,
  },
  messageText: {
    fontSize: 14,
    color: colors.text,
  },
  messageTextUser: {
    color: colors.card,
  },
  messageTime: {
    fontSize: 10,
    color: colors.subtext,
    marginTop: 4,
    marginHorizontal: 8,
  },

  typingIndicator: {
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  typingDot: {
    fontSize: 16,
    color: colors.primary,
  },

  aiInputBar: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: "flex-end",
    gap: 8,
  },
  attachIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  aiInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    maxHeight: 100,
  },
  sendButtonAI: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  // ATTENDANCE TAB
  attendanceCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  progressRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 8,
    borderColor: colors.primary,
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.primary,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.subtext,
    marginTop: 4,
  },
  attendanceStats: {
    flexDirection: "row",
    gap: 20,
    width: "100%",
  },
  attendanceStat: {
    flex: 1,
    alignItems: "center",
  },
  statCount: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.success,
  },
  statName: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.subtext,
    marginTop: 4,
  },

  calendarCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  dayHeaders: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dayHeader: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.subtext,
    width: "14.28%",
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 16,
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  calendarLegend: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: colors.subtext,
  },

  subjectAttendanceCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  subjectAttendanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  subjectAttendanceName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  subjectTeacher: {
    fontSize: 11,
    color: colors.subtext,
    marginTop: 2,
  },
  targetLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.subtext,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  attendancePercentage: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.success,
  },

  // RESULTS TAB
  rankBanner: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rankEmoji: {
    fontSize: 32,
  },
  rankContent: {
    flex: 1,
  },
  rankTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  rankSubtitle: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 2,
  },

  termSelector: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  termTab: {
    alignItems: "center",
  },
  termTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.subtext,
    paddingBottom: 8,
  },
  termTabTextActive: {
    color: colors.primary,
  },
  termTabUnderline: {
    height: 2,
    backgroundColor: colors.primary,
    width: "100%",
  },

  performanceCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  performanceRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 6,
    borderColor: colors.primary,
  },
  performancePercentage: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
  },
  performanceContent: {
    alignItems: "center",
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  performanceMessage: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 4,
  },
  performanceStats: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    width: "100%",
  },
  performanceStatLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.subtext,
    textAlign: "center",
  },
  performanceStatValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 4,
    textAlign: "center",
  },

  topPerformerCard: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  topPerformerEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  topPerformerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.warning,
  },
  topPerformerText: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 4,
    textAlign: "center",
  },
  certificateButton: {
    borderWidth: 1.5,
    borderColor: colors.warning,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  certificateButtonText: {
    color: colors.warning,
    fontWeight: "600",
    fontSize: 12,
  },

  subjectResultCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  subjectResultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  subjectResultName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  subjectResultScore: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
  subjectResultFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  gradeLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.subtext,
  },
  gradeBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  gradeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.card,
  },

  // BOTTOM NAV
  bottomNav: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingBottom: 8,
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  navItemCenter: {
    marginTop: -20,
  },
  aiButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  aiButtonEmoji: {
    fontSize: 28,
  },
  navEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  navIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
});
