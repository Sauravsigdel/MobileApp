import { Platform } from "react-native";

const PROD_API_URL = "https://mobileapp-production-732f.up.railway.app";
const LOCAL_WEB_API_URL = "http://localhost:3000";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (__DEV__ && Platform.OS === "web" ? LOCAL_WEB_API_URL : PROD_API_URL);
