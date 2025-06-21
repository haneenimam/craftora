import React, { createContext, useContext, useState, useEffect } from "react";

// 1. إنشاء الـ context
const AuthContext = createContext();

// 2. Hook للوصول للـ context بسهولة
export const useAuth = () => useContext(AuthContext);

// 3. Provider المسؤول عن حفظ بيانات المستخدم
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // تحميل المستخدم من localStorage لو موجود
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // تسجيل الدخول
  const login = (userData) => {
  const normalizedUser = {
    ...userData,
    role: userData.role?.toLowerCase(), // نحول الدور لصيغة صغيرة
  };

  localStorage.setItem("loggedInUser", JSON.stringify(normalizedUser));
  setUser(normalizedUser);
};


  // تسجيل الخروج
  const logout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
// 4. تصدير الـ AuthProvider ليتم استخدامه في التطبيق
export default AuthProvider;
// 5. 