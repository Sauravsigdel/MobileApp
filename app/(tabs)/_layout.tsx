import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="student/dashboard" />
      <Stack.Screen name="teacher/dashboard" />
      <Stack.Screen name="accountant/dashboard" />
      <Stack.Screen name="admin/dashboard" />
    </Stack>
  );
}
