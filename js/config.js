/* ============================================
   CONFIG
   Single source of truth for environment values.
   Change API_BASE_URL here only — every other file
   imports it from here instead of hardcoding it.
   ============================================ */

const API_BASE_URL = "https://kwil-cbt.onrender.com/api"; // Change this to your backend API URL

// Keys used in localStorage. Kept in one place so student and
// admin sessions can never collide (see auth.js).
const STORAGE_KEYS = {
  studentToken: "kwi_student_token",
  studentProfile: "kwi_student_profile",
  adminToken: "kwi_admin_token",
  adminProfile: "kwi_admin_profile",
};
