import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Design System Colors
const COLORS = {
  background: "#f7f9fb",
  card: "#ffffff",
  primary: "#10B981",
  text: "#191c1e",
  subtext: "#6B7280",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  blue: "#2563EB",
  lightGray: "#F3F4F6",
  lightBorder: "#E5E7EB",
};

const SHADOWS = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  glow: {
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};

const BORDER_RADIUS = {
  card: 12,
  inner: 8,
  button: 8,
};

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api";

interface FeeRecord {
  id: string;
  studentId: string;
  amount: number;
  feeType: string;
  status: "PAID" | "PARTIAL" | "OVERDUE";
  dueDate: string;
  studentName?: string;
  studentClass?: string;
  studentRoll?: string;
}

export default function AccountantDashboard() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [user, setUser] = useState<any>(null);

  // Overview state
  const [totalCollected, setTotalCollected] = useState(0);
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [totalOverdue, setTotalOverdue] = useState(0);
  const [thisMonth, setThisMonth] = useState(0);

  // Students tab state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Records");

  // Add Fee tab state
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [feeCategory, setFeeCategory] = useState("Tuition");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("GSA-2024-001");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [discountStudent, setDiscountStudent] = useState("");
  const [discountType, setDiscountType] = useState("Scholarship");
  const [discountAmount, setDiscountAmount] = useState("");

  // Notify state
  const [notifyTarget, setNotifyTarget] = useState("overdue");
  const [reminderType, setReminderType] = useState("Payment Reminder");
  const [customMessage, setCustomMessage] = useState("");

  // Load user and fetch data
  useEffect(() => {
    const loadUserAndData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
        await fetchData();
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadUserAndData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch fee records
      const feesRes = await axios.get(`${API_BASE_URL}/fees`, { headers });
      const data = Array.isArray(feesRes.data) ? feesRes.data : [];
      setFeeRecords(data);

      // Calculate stats
      const stats = calculateStats(data);
      setTotalCollected(stats.collected);
      setTotalOutstanding(stats.outstanding);
      setTotalOverdue(stats.overdue);
      setThisMonth(stats.thisMonth);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const calculateStats = (fees: any[]) => {
    let collected = 0,
      outstanding = 0,
      overdue = 0,
      thisMonth = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    fees.forEach((fee) => {
      const amount = fee.amount || 0;
      if (fee.status === "PAID") {
        collected += amount;
        const feeDate = new Date(fee.dueDate);
        if (
          feeDate.getMonth() === currentMonth &&
          feeDate.getFullYear() === currentYear
        ) {
          thisMonth += amount;
        }
      } else if (fee.status === "OVERDUE") {
        overdue += amount;
        outstanding += amount;
      } else if (fee.status === "PARTIAL") {
        outstanding += amount / 2;
      }
    });

    return { collected, outstanding, overdue, thisMonth };
  };

  // TAB 1: OVERVIEW
  const OverviewTab = () => (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ fontSize: 24 }}>🏦</Text>
          <Text
            style={{ fontSize: 18, fontWeight: "700", color: COLORS.primary }}
          >
            GyanSetu
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={COLORS.text}
          />
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: COLORS.primary,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                : "AC"}
            </Text>
          </View>
        </View>
      </View>

      {/* Welcome Section */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: COLORS.text,
            marginBottom: 4,
          }}
        >
          Good morning, {user?.name || "Accountant"}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: COLORS.primary,
              letterSpacing: 1,
            }}
          >
            FINANCE MANAGER
          </Text>
          <Text style={{ fontSize: 12, color: COLORS.subtext }}>
            • Spring Term 2026
          </Text>
        </View>
      </View>

      {/* Financial Summary Cards */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {[
            {
              label: "TOTAL COLLECTED",
              amount: totalCollected,
              icon: "wallet-check",
              color: COLORS.success,
            },
            {
              label: "OUTSTANDING",
              amount: totalOutstanding,
              icon: "clock-outline",
              color: COLORS.warning,
            },
            {
              label: "OVERDUE",
              amount: totalOverdue,
              icon: "alert-circle",
              color: COLORS.danger,
            },
            {
              label: "THIS MONTH",
              amount: thisMonth,
              icon: "calendar",
              color: COLORS.blue,
            },
          ].map((card, idx) => (
            <View
              key={idx}
              style={{
                width: "48%",
                backgroundColor: COLORS.card,
                borderRadius: BORDER_RADIUS.card,
                padding: 16,
                ...SHADOWS.card,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "600",
                    color: COLORS.subtext,
                  }}
                >
                  {card.label}
                </Text>
                <MaterialCommunityIcons
                  name={card.icon as any}
                  size={16}
                  color={card.color}
                />
              </View>
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: COLORS.text }}
              >
                Rs. {card.amount.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: COLORS.text,
            marginBottom: 8,
          }}
        >
          Quick Actions
        </Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              backgroundColor: COLORS.primary,
              borderRadius: BORDER_RADIUS.button,
              padding: 12,
            }}
            onPress={() => setActiveTab("add-fee")}
          >
            <MaterialCommunityIcons name="receipt" size={16} color="white" />
            <Text style={{ color: "white", fontWeight: "600", fontSize: 12 }}>
              Add Fee
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              backgroundColor: COLORS.lightGray,
              borderRadius: BORDER_RADIUS.button,
              padding: 12,
            }}
          >
            <MaterialCommunityIcons
              name="credit-card-check"
              size={16}
              color={COLORS.text}
            />
            <Text
              style={{ color: COLORS.text, fontWeight: "600", fontSize: 12 }}
            >
              Payment
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <View>
            <Text
              style={{ fontSize: 14, fontWeight: "700", color: COLORS.text }}
            >
              Recent Transactions
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: COLORS.primary,
                fontWeight: "600",
                letterSpacing: 0.5,
              }}
            >
              LIVE UPDATES FROM ACCOUNTS
            </Text>
          </View>
          <TouchableOpacity onPress={() => setActiveTab("students")}>
            <Text
              style={{ fontSize: 12, color: COLORS.primary, fontWeight: "600" }}
            >
              VIEW ALL
            </Text>
          </TouchableOpacity>
        </View>

        {feeRecords.slice(0, 5).map((transaction, idx) => (
          <View
            key={idx}
            style={{
              backgroundColor: COLORS.card,
              borderRadius: BORDER_RADIUS.card,
              padding: 12,
              marginBottom: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              ...SHADOWS.card,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: COLORS.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "700", fontSize: 10 }}>
                {transaction.studentName?.substring(0, 2).toUpperCase() || "ST"}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 12, fontWeight: "600", color: COLORS.text }}
              >
                {transaction.studentName || "Student"}
              </Text>
              <Text style={{ fontSize: 10, color: COLORS.subtext }}>
                {new Date(transaction.dueDate).toLocaleDateString()} • ID:{" "}
                {transaction.studentId}
              </Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color:
                    transaction.status === "PAID"
                      ? COLORS.success
                      : transaction.status === "OVERDUE"
                        ? COLORS.danger
                        : COLORS.warning,
                  marginBottom: 2,
                }}
              >
                Rs. {transaction.amount?.toLocaleString() || "0"}
              </Text>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 4,
                  backgroundColor:
                    transaction.status === "PAID"
                      ? "#DCFCE7"
                      : transaction.status === "OVERDUE"
                        ? "#FEE2E2"
                        : "#FEF3C7",
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
                    fontWeight: "700",
                    color:
                      transaction.status === "PAID"
                        ? COLORS.success
                        : transaction.status === "OVERDUE"
                          ? COLORS.danger
                          : COLORS.warning,
                  }}
                >
                  {transaction.status}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );

  // TAB 2: STUDENTS
  const StudentsTab = () => {
    const filteredRecords = feeRecords.filter((record) => {
      const matchesSearch =
        !searchQuery ||
        record.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.studentId?.includes(searchQuery);

      const matchesFilter =
        filterStatus === "All Records" ||
        record.status === filterStatus.toUpperCase().replace(" RECORDS", "");

      return matchesSearch && matchesFilter;
    });

    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.background }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 8,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.text }}>
            Student Fee Records
          </Text>
          <TouchableOpacity>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={COLORS.text}
            />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <Text
            style={{ fontSize: 12, color: COLORS.subtext, marginBottom: 8 }}
          >
            Manage and monitor academic financial status
          </Text>

          {/* Search Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.card,
              borderRadius: BORDER_RADIUS.inner,
              paddingHorizontal: 12,
              marginBottom: 12,
              ...SHADOWS.card,
            }}
          >
            <Ionicons name="search" size={16} color={COLORS.subtext} />
            <TextInput
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 8,
                color: COLORS.text,
              }}
              placeholder="Search by name or ID..."
              placeholderTextColor={COLORS.subtext}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filters */}
          <View
            style={{
              flexDirection: "row",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            {["All Records", "Paid", "Partial", "Overdue"].map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setFilterStatus(filter)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: BORDER_RADIUS.button,
                  backgroundColor:
                    filterStatus === filter ? COLORS.primary : COLORS.lightGray,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "600",
                    color: filterStatus === filter ? "white" : COLORS.text,
                  }}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Student Fee Cards */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          {filteredRecords.map((record, idx) => {
            const totalFee = record.amount || 0;
            const paidAmount =
              record.status === "PAID"
                ? totalFee
                : record.status === "PARTIAL"
                  ? totalFee / 2
                  : 0;
            const pendingAmount = totalFee - paidAmount;
            const progressPercent =
              totalFee > 0 ? (paidAmount / totalFee) * 100 : 0;

            return (
              <View
                key={idx}
                style={{
                  backgroundColor: COLORS.card,
                  borderRadius: BORDER_RADIUS.card,
                  marginBottom: 12,
                  overflow: "hidden",
                  ...SHADOWS.card,
                }}
              >
                {/* Status Badge */}
                <View
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                    backgroundColor:
                      record.status === "PAID"
                        ? "#DCFCE7"
                        : record.status === "OVERDUE"
                          ? "#FEE2E2"
                          : "#FEF3C7",
                    zIndex: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9,
                      fontWeight: "700",
                      color:
                        record.status === "PAID"
                          ? COLORS.success
                          : record.status === "OVERDUE"
                            ? COLORS.danger
                            : COLORS.warning,
                    }}
                  >
                    {record.status}
                  </Text>
                </View>

                {/* Content */}
                <View style={{ padding: 12 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: COLORS.primary,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "700",
                          fontSize: 10,
                        }}
                      >
                        {record.studentName?.substring(0, 2).toUpperCase() ||
                          "ST"}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: COLORS.text,
                        }}
                      >
                        {record.studentName || "Student"}
                      </Text>
                      <Text style={{ fontSize: 10, color: COLORS.subtext }}>
                        {record.studentClass} • Roll: {record.studentRoll}
                      </Text>
                    </View>
                    <TouchableOpacity>
                      <MaterialCommunityIcons
                        name="dots-vertical"
                        size={16}
                        color={COLORS.subtext}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Amount Info */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 10,
                      paddingBottom: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: COLORS.lightBorder,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 9,
                          color: COLORS.subtext,
                          marginBottom: 2,
                        }}
                      >
                        DUE AMOUNT
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "700",
                          color: COLORS.danger,
                        }}
                      >
                        Rs. {totalFee.toLocaleString()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 9,
                          color: COLORS.subtext,
                          marginBottom: 2,
                        }}
                      >
                        TOTAL PAID
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "700",
                          color: COLORS.success,
                        }}
                      >
                        Rs. {paidAmount.toLocaleString()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 9,
                          color: COLORS.subtext,
                          marginBottom: 2,
                        }}
                      >
                        PENDING
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "700",
                          color: COLORS.warning,
                        }}
                      >
                        Rs. {pendingAmount.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View
                    style={{
                      height: 6,
                      backgroundColor: COLORS.lightGray,
                      borderRadius: 3,
                      marginBottom: 8,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        height: "100%",
                        width: `${progressPercent}%`,
                        backgroundColor:
                          record.status === "PAID"
                            ? COLORS.success
                            : record.status === "OVERDUE"
                              ? COLORS.danger
                              : COLORS.warning,
                        borderRadius: 3,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 9, color: COLORS.subtext }}>
                      Due: {new Date(record.dueDate).toLocaleDateString()}
                    </Text>
                    <Text style={{ fontSize: 9, color: COLORS.subtext }}>
                      {Math.round(progressPercent)}% Complete
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Bottom Summary Cards */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: COLORS.card,
                borderRadius: BORDER_RADIUS.card,
                padding: 12,
                ...SHADOWS.card,
              }}
            >
              <Text
                style={{ fontSize: 9, color: COLORS.subtext, marginBottom: 6 }}
              >
                TOTAL COLLECTION
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: COLORS.success,
                }}
              >
                Rs. {totalCollected.toLocaleString()}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: COLORS.card,
                borderRadius: BORDER_RADIUS.card,
                padding: 12,
                ...SHADOWS.card,
              }}
            >
              <Text
                style={{ fontSize: 9, color: COLORS.subtext, marginBottom: 6 }}
              >
                PARTIAL
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: COLORS.warning,
                }}
              >
                Rs. {Math.round(totalOutstanding / 2).toLocaleString()}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: COLORS.card,
                borderRadius: BORDER_RADIUS.card,
                padding: 12,
                ...SHADOWS.card,
              }}
            >
              <Text
                style={{ fontSize: 9, color: COLORS.subtext, marginBottom: 6 }}
              >
                OUTSTANDING
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: COLORS.danger,
                }}
              >
                Rs. {totalOutstanding.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    );
  };

  // TAB 3: ADD FEE (Center)
  const AddFeeTab = () => (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 8,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.text }}>
          Add Fee
        </Text>
        <TouchableOpacity onPress={() => setActiveTab("overview")}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 12 }}>
        <Text style={{ fontSize: 12, color: COLORS.subtext }}>
          Manage student billing, payments, and discounts
        </Text>
      </View>

      {/* Section 1: Add Fee to Student */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: BORDER_RADIUS.card,
            padding: 16,
            marginBottom: 12,
            ...SHADOWS.card,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <MaterialCommunityIcons
              name="receipt"
              size={16}
              color={COLORS.primary}
            />
            <Text
              style={{ fontSize: 12, fontWeight: "700", color: COLORS.text }}
            >
              Add Fee to Student
            </Text>
          </View>

          {/* Student Dropdown */}
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: COLORS.subtext,
              marginBottom: 6,
            }}
          >
            STUDENT NAME
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.lightGray,
              borderRadius: BORDER_RADIUS.inner,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginBottom: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: selectedStudent || COLORS.subtext }}>
              {selectedStudent || "Select a student..."}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={16}
              color={COLORS.subtext}
            />
          </TouchableOpacity>

          {/* Fee Category */}
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: COLORS.subtext,
              marginBottom: 6,
            }}
          >
            FEE CATEGORY
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 6,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            {["Tuition", "Transport", "Laboratory", "Sports", "Library"].map(
              (cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setFeeCategory(cat)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: BORDER_RADIUS.button,
                    backgroundColor:
                      feeCategory === cat ? COLORS.primary : COLORS.lightGray,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      color: feeCategory === cat ? "white" : COLORS.text,
                    }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>

          {/* Amount */}
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: COLORS.subtext,
              marginBottom: 6,
            }}
          >
            AMOUNT
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.lightGray,
              borderRadius: BORDER_RADIUS.inner,
              paddingHorizontal: 12,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: COLORS.subtext, fontWeight: "600" }}>
              Rs.{" "}
            </Text>
            <TextInput
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 8,
                color: COLORS.text,
              }}
              placeholder="Enter amount"
              placeholderTextColor={COLORS.subtext}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          {/* Due Date */}
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: COLORS.subtext,
              marginBottom: 6,
            }}
          >
            DUE DATE
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.lightGray,
              borderRadius: BORDER_RADIUS.inner,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginBottom: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: dueDate || COLORS.subtext }}>
              {dueDate || "Select date..."}
            </Text>
            <MaterialCommunityIcons
              name="calendar"
              size={16}
              color={COLORS.primary}
            />
          </TouchableOpacity>

          {/* Notes */}
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: COLORS.subtext,
              marginBottom: 6,
            }}
          >
            NOTES (OPTIONAL)
          </Text>
          <TextInput
            style={{
              backgroundColor: COLORS.lightGray,
              borderRadius: BORDER_RADIUS.inner,
              paddingHorizontal: 12,
              paddingVertical: 10,
              minHeight: 60,
              color: COLORS.text,
              marginBottom: 12,
              textAlignVertical: "top",
            }}
            placeholder="Add notes..."
            placeholderTextColor={COLORS.subtext}
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />

          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: BORDER_RADIUS.button,
              paddingVertical: 12,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
            }}
          >
            <MaterialCommunityIcons name="plus" size={16} color="white" />
            <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>
              Add Fee
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Section 2: Record Payment */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: BORDER_RADIUS.card,
            padding: 16,
            marginBottom: 12,
            ...SHADOWS.card,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <MaterialCommunityIcons
              name="credit-card-check"
              size={16}
              color={COLORS.blue}
            />
            <Text
              style={{ fontSize: 12, fontWeight: "700", color: COLORS.text }}
            >
              Record Payment
            </Text>
          </View>

          {/* Student Name */}
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: COLORS.subtext,
              marginBottom: 6,
            }}
          >
            STUDENT NAME
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.lightGray,
              borderRadius: BORDER_RADIUS.inner,
              paddingHorizontal: 12,
              marginBottom: 12,
            }}
          >
            <Ionicons name="search" size={16} color={COLORS.subtext} />
            <TextInput
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 8,
                color: COLORS.text,
              }}
              placeholder="Search student..."
              placeholderTextColor={COLORS.subtext}
            />
          </View>

          {/* Amount Received */}
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: COLORS.subtext,
              marginBottom: 6,
            }}
          >
            AMOUNT RECEIVED
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.lightGray,
              borderRadius: BORDER_RADIUS.inner,
              paddingHorizontal: 12,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: COLORS.subtext, fontWeight: "600" }}>
              Rs.{" "}
            </Text>
            <TextInput
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 8,
                color: COLORS.text,
              }}
              placeholder="Enter amount"
              placeholderTextColor={COLORS.subtext}
              keyboardType="decimal-pad"
              value={paymentAmount}
              onChangeText={setPaymentAmount}
            />
          </View>

          {/* Receipt Number */}
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: COLORS.subtext,
              marginBottom: 6,
            }}
          >
            RECEIPT NUMBER
          </Text>
          <TextInput
            style={{
              backgroundColor: COLORS.lightGray,
              borderRadius: BORDER_RADIUS.inner,
              paddingHorizontal: 12,
              paddingVertical: 10,
              color: COLORS.text,
              marginBottom: 12,
            }}
            value={receiptNumber}
            editable={false}
          />

          {/* Payment Method */}
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: COLORS.subtext,
              marginBottom: 6,
            }}
          >
            PAYMENT METHOD
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 6,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            {["Cash", "UPI/QR", "Card", "Bank Transfer"].map((method) => (
              <TouchableOpacity
                key={method}
                onPress={() => setPaymentMethod(method)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: BORDER_RADIUS.button,
                  backgroundColor:
                    paymentMethod === method ? COLORS.blue : COLORS.lightGray,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "600",
                    color: paymentMethod === method ? "white" : COLORS.text,
                  }}
                >
                  {method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: BORDER_RADIUS.button,
              paddingVertical: 12,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
            }}
          >
            <MaterialCommunityIcons
              name="content-save"
              size={16}
              color="white"
            />
            <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>
              Save Payment
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Section 3: Apply Waiver */}
      <View
        style={{ paddingHorizontal: 16, paddingVertical: 12, marginBottom: 20 }}
      >
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: BORDER_RADIUS.card,
            padding: 16,
            borderLeftWidth: 4,
            borderLeftColor: COLORS.warning,
            ...SHADOWS.card,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <MaterialCommunityIcons
              name="percent"
              size={16}
              color={COLORS.warning}
            />
            <Text
              style={{ fontSize: 12, fontWeight: "700", color: COLORS.text }}
            >
              Apply Waiver
            </Text>
          </View>

          {/* Student */}
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: COLORS.subtext,
              marginBottom: 6,
            }}
          >
            STUDENT
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.lightGray,
              borderRadius: BORDER_RADIUS.inner,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginBottom: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: discountStudent || COLORS.subtext }}>
              {discountStudent || "Select student..."}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={16}
              color={COLORS.subtext}
            />
          </TouchableOpacity>

          {/* Discount Type */}
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: COLORS.subtext,
              marginBottom: 6,
            }}
          >
            DISCOUNT TYPE
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.lightGray,
              borderRadius: BORDER_RADIUS.inner,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginBottom: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: COLORS.text }}>{discountType}</Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={16}
              color={COLORS.subtext}
            />
          </TouchableOpacity>

          {/* Amount/% */}
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: COLORS.subtext,
              marginBottom: 6,
            }}
          >
            AMOUNT / %
          </Text>
          <TextInput
            style={{
              backgroundColor: COLORS.lightGray,
              borderRadius: BORDER_RADIUS.inner,
              paddingHorizontal: 12,
              paddingVertical: 10,
              color: COLORS.text,
              marginBottom: 12,
            }}
            placeholder="e.g. 500 or 10%"
            placeholderTextColor={COLORS.subtext}
            value={discountAmount}
            onChangeText={setDiscountAmount}
          />

          <TouchableOpacity
            style={{
              backgroundColor: COLORS.warning,
              borderRadius: BORDER_RADIUS.button,
              paddingVertical: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>
              Apply Discount
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // TAB 4: REPORTS
  const ReportsTab = () => (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "600",
            color: COLORS.primary,
            letterSpacing: 1,
          }}
        >
          EXECUTIVE OVERVIEW
        </Text>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: COLORS.text,
            marginBottom: 12,
          }}
        >
          Financial Reports
        </Text>

        {/* Action Row */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              backgroundColor: COLORS.lightGray,
              borderRadius: BORDER_RADIUS.button,
              paddingVertical: 10,
            }}
          >
            <MaterialCommunityIcons
              name="download"
              size={14}
              color={COLORS.text}
            />
            <Text
              style={{ color: COLORS.text, fontWeight: "600", fontSize: 11 }}
            >
              EXPORT PDF
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              backgroundColor: COLORS.primary,
              borderRadius: BORDER_RADIUS.button,
              paddingVertical: 10,
            }}
          >
            <MaterialCommunityIcons name="calendar" size={14} color="white" />
            <Text style={{ color: "white", fontWeight: "600", fontSize: 11 }}>
              TERM 2 (2023-24)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Overall Collection Card */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: BORDER_RADIUS.card,
            padding: 16,
            alignItems: "center",
            marginBottom: 12,
            ...SHADOWS.card,
          }}
        >
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: COLORS.lightGray,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{ fontSize: 28, fontWeight: "700", color: COLORS.primary }}
            >
              82%
            </Text>
            <Text
              style={{ fontSize: 10, color: COLORS.subtext, fontWeight: "600" }}
            >
              COLLECTED
            </Text>
          </View>

          <Text
            style={{ fontSize: 10, color: COLORS.subtext, marginBottom: 4 }}
          >
            TARGET REVENUE
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: COLORS.text,
              marginBottom: 12,
            }}
          >
            Rs. 10,24,000
          </Text>

          <Text
            style={{ fontSize: 10, color: COLORS.subtext, marginBottom: 4 }}
          >
            TOTAL COLLECTED
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: COLORS.success,
              marginBottom: 12,
            }}
          >
            Rs. {totalCollected.toLocaleString()}
          </Text>

          {/* Progress Bar Legend */}
          <View style={{ width: "100%", gap: 4 }}>
            <View
              style={{
                height: 8,
                backgroundColor: COLORS.lightGray,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  height: "100%",
                }}
              >
                <View
                  style={{ width: "82%", backgroundColor: COLORS.success }}
                />
                <View
                  style={{ width: "12%", backgroundColor: COLORS.lightBorder }}
                />
                <View
                  style={{ width: "6%", backgroundColor: COLORS.warning }}
                />
              </View>
            </View>

            {/* Legend */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 8,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: COLORS.success,
                  }}
                />
                <Text style={{ fontSize: 9, color: COLORS.subtext }}>
                  Collected
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: COLORS.lightBorder,
                  }}
                />
                <Text style={{ fontSize: 9, color: COLORS.subtext }}>
                  Pending
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: COLORS.warning,
                  }}
                />
                <Text style={{ fontSize: 9, color: COLORS.subtext }}>
                  Projected
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Fee Allocation Card */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: BORDER_RADIUS.card,
            padding: 16,
            marginBottom: 12,
            ...SHADOWS.card,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: COLORS.text,
              marginBottom: 12,
            }}
          >
            Fee Allocation
          </Text>

          {[
            { label: "Tuition Fee", percent: 65, color: COLORS.success },
            { label: "Transport", percent: 18, color: COLORS.success },
            { label: "Lab & Activities", percent: 12, color: COLORS.warning },
            { label: "Miscellaneous", percent: 5, color: COLORS.lightGray },
          ].map((item, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: item.color,
                }}
              />
              <Text style={{ flex: 1, fontSize: 11, color: COLORS.text }}>
                {item.label}
              </Text>
              <Text
                style={{ fontSize: 11, fontWeight: "700", color: COLORS.text }}
              >
                {item.percent}%
              </Text>
            </View>
          ))}

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: COLORS.lightBorder,
              paddingTop: 8,
              marginTop: 8,
            }}
          >
            <Text
              style={{ fontSize: 9, color: COLORS.subtext, marginBottom: 2 }}
            >
              TOP REVENUE SOURCE
            </Text>
            <Text
              style={{ fontSize: 12, fontWeight: "700", color: COLORS.primary }}
            >
              Tuition Fee (65%)
            </Text>
          </View>
        </View>
      </View>

      {/* Monthly Collection Trend */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: BORDER_RADIUS.card,
            padding: 16,
            marginBottom: 12,
            ...SHADOWS.card,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{ fontSize: 12, fontWeight: "700", color: COLORS.text }}
            >
              Monthly Collection Trend
            </Text>
            <View
              style={{
                backgroundColor: COLORS.lightGray,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "600",
                  color: COLORS.subtext,
                }}
              >
                CURRENT TERM
              </Text>
            </View>
          </View>

          <View
            style={{
              height: 100,
              justifyContent: "flex-end",
              alignItems: "flex-end",
              flexDirection: "row",
              gap: 6,
            }}
          >
            {[
              { month: "OCT", value: 40 },
              { month: "NOV", value: 65 },
              { month: "DEC", value: 55 },
              { month: "JAN", value: 85, highlight: true },
              { month: "FEB", value: 45 },
            ].map((bar, idx) => (
              <View key={idx} style={{ flex: 1, alignItems: "center" }}>
                <View
                  style={{
                    width: "100%",
                    height: `${bar.value}%`,
                    backgroundColor: bar.highlight
                      ? COLORS.primary
                      : COLORS.lightGray,
                    borderRadius: 4,
                    marginBottom: 4,
                  }}
                />
                <Text
                  style={{
                    fontSize: 8,
                    color: COLORS.subtext,
                    fontWeight: "600",
                  }}
                >
                  {bar.month}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Priority Recoveries */}
      <View
        style={{ paddingHorizontal: 16, paddingVertical: 12, marginBottom: 20 }}
      >
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: BORDER_RADIUS.card,
            padding: 16,
            ...SHADOWS.card,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <MaterialCommunityIcons
              name="alert-circle"
              size={16}
              color={COLORS.danger}
            />
            <Text
              style={{ fontSize: 12, fontWeight: "700", color: COLORS.text }}
            >
              Priority Recoveries
            </Text>
          </View>

          {feeRecords
            .filter((r) => r.status === "OVERDUE")
            .slice(0, 3)
            .map((record, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  paddingVertical: 10,
                  borderBottomWidth: idx < 2 ? 1 : 0,
                  borderBottomColor: COLORS.lightBorder,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: COLORS.danger,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "white", fontWeight: "700", fontSize: 9 }}
                  >
                    {record.studentName?.substring(0, 2).toUpperCase() || "ST"}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      color: COLORS.text,
                    }}
                  >
                    {record.studentName}
                  </Text>
                  <Text style={{ fontSize: 9, color: COLORS.subtext }}>
                    {record.studentClass}
                  </Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: COLORS.success,
                      marginBottom: 2,
                    }}
                  >
                    Rs. {(record.amount || 0).toLocaleString()}
                  </Text>
                  <Text
                    style={{
                      fontSize: 9,
                      color: COLORS.danger,
                      fontWeight: "600",
                    }}
                  >
                    45 days
                  </Text>
                </View>
              </View>
            ))}

          <TouchableOpacity
            style={{
              marginTop: 12,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: COLORS.primary,
              borderRadius: BORDER_RADIUS.button,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: COLORS.primary,
                fontWeight: "700",
                fontSize: 11,
              }}
            >
              VIEW FULL DEFAULTERS LIST
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // TAB 5: NOTIFY
  const NotifyTab = () => (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View
        style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: COLORS.text,
            marginBottom: 2,
          }}
        >
          Send Reminders
        </Text>
        <Text style={{ fontSize: 12, color: COLORS.subtext }}>
          Notify students and parents about fees
        </Text>
      </View>

      {/* Target Selector */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: BORDER_RADIUS.card,
            padding: 16,
            marginBottom: 12,
            ...SHADOWS.card,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: COLORS.text,
              marginBottom: 12,
            }}
          >
            Send To
          </Text>

          {[
            {
              label: "All overdue students",
              count: feeRecords.filter((r) => r.status === "OVERDUE").length,
              value: "overdue",
            },
            {
              label: "All pending students",
              count: feeRecords.filter((r) => r.status !== "PAID").length,
              value: "pending",
            },
            { label: "Specific class/section", count: 0, value: "specific" },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setNotifyTarget(option.value)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 8,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor:
                    notifyTarget === option.value
                      ? COLORS.primary
                      : COLORS.lightBorder,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                {notifyTarget === option.value && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: COLORS.primary,
                    }}
                  />
                )}
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 12,
                  fontWeight: "500",
                  color: COLORS.text,
                }}
              >
                {option.label}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: COLORS.primary,
                }}
              >
                ({option.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Reminder Type */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: BORDER_RADIUS.card,
            padding: 16,
            marginBottom: 12,
            ...SHADOWS.card,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: COLORS.text,
              marginBottom: 12,
            }}
          >
            Reminder Type
          </Text>

          {[
            "Payment Reminder",
            "Overdue Notice",
            "Receipt Confirmation",
            "New Fee Added",
          ].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setReminderType(type)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 8,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor:
                    reminderType === type ? COLORS.primary : COLORS.lightBorder,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                {reminderType === type && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: COLORS.primary,
                    }}
                  />
                )}
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 12,
                  fontWeight: "500",
                  color: COLORS.text,
                }}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Custom Message */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: BORDER_RADIUS.card,
            padding: 16,
            marginBottom: 12,
            ...SHADOWS.card,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: COLORS.text,
              marginBottom: 8,
            }}
          >
            Custom Message (Optional)
          </Text>

          <TextInput
            style={{
              backgroundColor: COLORS.lightGray,
              borderRadius: BORDER_RADIUS.inner,
              paddingHorizontal: 12,
              paddingVertical: 10,
              minHeight: 80,
              color: COLORS.text,
              marginBottom: 6,
              textAlignVertical: "top",
            }}
            placeholder="Write your message here..."
            placeholderTextColor={COLORS.subtext}
            multiline
            numberOfLines={4}
            maxLength={200}
            value={customMessage}
            onChangeText={setCustomMessage}
          />

          <Text
            style={{ fontSize: 10, color: COLORS.subtext, textAlign: "right" }}
          >
            {customMessage.length}/200
          </Text>
        </View>
      </View>

      {/* Send Button */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: BORDER_RADIUS.button,
            paddingVertical: 14,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            ...SHADOWS.glow,
          }}
        >
          <MaterialCommunityIcons name="send" size={16} color="white" />
          <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>
            Send Notification
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notification History */}
      <View
        style={{ paddingHorizontal: 16, paddingVertical: 12, marginBottom: 20 }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: COLORS.text,
            marginBottom: 12,
          }}
        >
          Notification History
        </Text>

        {[
          {
            title: "Payment Reminder",
            recipients: 24,
            date: "Today",
            status: "SENT",
          },
          {
            title: "Overdue Notice",
            recipients: 8,
            date: "Yesterday",
            status: "SENT",
          },
          {
            title: "Fee Confirmation",
            recipients: 156,
            date: "2 days ago",
            status: "DELIVERED",
          },
        ].map((notification, idx) => (
          <View
            key={idx}
            style={{
              backgroundColor: COLORS.card,
              borderRadius: BORDER_RADIUS.card,
              padding: 12,
              marginBottom: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              ...SHADOWS.card,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: COLORS.lightGray,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="bell"
                size={16}
                color={COLORS.primary}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 11, fontWeight: "600", color: COLORS.text }}
              >
                {notification.title}
              </Text>
              <Text style={{ fontSize: 9, color: COLORS.subtext }}>
                {notification.recipients} recipients • {notification.date}
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                backgroundColor: "#DCFCE7",
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: "700",
                  color: COLORS.success,
                }}
              >
                {notification.status}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  // Get active tab component
  const getActiveTabComponent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "students":
        return <StudentsTab />;
      case "add-fee":
        return <AddFeeTab />;
      case "reports":
        return <ReportsTab />;
      case "notify":
        return <NotifyTab />;
      default:
        return <OverviewTab />;
    }
  };

  if (loading && !feeRecords.length) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Main Content */}
      <View style={{ flex: 1 }}>{getActiveTabComponent()}</View>

      {/* Bottom Navigation */}
      <View
        style={{
          height: 80,
          backgroundColor: COLORS.card,
          borderTopWidth: 1,
          borderTopColor: COLORS.lightBorder,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          paddingBottom: 8,
          ...SHADOWS.card,
        }}
      >
        {/* Overview Tab */}
        <TouchableOpacity
          onPress={() => setActiveTab("overview")}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 8,
          }}
        >
          <Ionicons
            name={activeTab === "overview" ? "home" : "home-outline"}
            size={24}
            color={activeTab === "overview" ? COLORS.primary : COLORS.subtext}
          />
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: activeTab === "overview" ? COLORS.primary : COLORS.subtext,
              marginTop: 4,
            }}
          >
            Overview
          </Text>
        </TouchableOpacity>

        {/* Students Tab */}
        <TouchableOpacity
          onPress={() => setActiveTab("students")}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 8,
          }}
        >
          <MaterialCommunityIcons
            name={
              activeTab === "students"
                ? "account-multiple"
                : "account-multiple-outline"
            }
            size={24}
            color={activeTab === "students" ? COLORS.primary : COLORS.subtext}
          />
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: activeTab === "students" ? COLORS.primary : COLORS.subtext,
              marginTop: 4,
            }}
          >
            Students
          </Text>
        </TouchableOpacity>

        {/* Center ADD FEE Button */}
        <TouchableOpacity
          onPress={() => setActiveTab("add-fee")}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: COLORS.primary,
            justifyContent: "center",
            alignItems: "center",
            marginTop: -28,
            ...SHADOWS.glow,
          }}
        >
          <MaterialCommunityIcons name="plus" size={28} color="white" />
        </TouchableOpacity>

        {/* Reports Tab */}
        <TouchableOpacity
          onPress={() => setActiveTab("reports")}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 8,
          }}
        >
          <MaterialCommunityIcons
            name={activeTab === "reports" ? "chart-box" : "chart-box-outline"}
            size={24}
            color={activeTab === "reports" ? COLORS.primary : COLORS.subtext}
          />
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: activeTab === "reports" ? COLORS.primary : COLORS.subtext,
              marginTop: 4,
            }}
          >
            Reports
          </Text>
        </TouchableOpacity>

        {/* Notify Tab */}
        <TouchableOpacity
          onPress={() => setActiveTab("notify")}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 8,
          }}
        >
          <MaterialCommunityIcons
            name={activeTab === "notify" ? "bell" : "bell-outline"}
            size={24}
            color={activeTab === "notify" ? COLORS.primary : COLORS.subtext}
          />
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: activeTab === "notify" ? COLORS.primary : COLORS.subtext,
              marginTop: 4,
            }}
          >
            Notify
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
