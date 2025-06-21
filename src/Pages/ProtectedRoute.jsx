// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../Context/AuthContext"; // المسار حسب مشروعك

// function ProtectedRoute({ children, allowedRoles }) {
//   const { user } = useAuth();

//   if (!user) {
//     // لو مفيش حد مسجل دخول --> حولي على صفحة login
//     return <Navigate to="/login" />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     // لو المستخدم مش من الناس اللي لهم صلاحية الصفحة --> حولي على صفحة Unauthorized (صفحة رفض الوصول)
//     return <Navigate to="/unauthorized" />;
//   }

//   // لو كل حاجة صح، خلي الصفحة تظهر
//   return children;
// }

// export default ProtectedRoute;
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [status, setStatus] = useState("loading");
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("unauthenticated");
        return;
      }

      try {
const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify`, {
  headers: { Authorization: `Bearer ${token}` },
});
      console.log("Response from /verify:", res.data); // 🟢

const userRole = res.data.user.role;
      console.log("Extracted user role:", userRole); // 🔵
      console.log("Allowed roles:", allowedRoles); 
        if (!allowedRoles.includes(userRole)) {
          setStatus("unauthorized");
        } else {
          setHasAccess(true);
          setStatus("authorized");
        }
      } catch {
        setStatus("unauthenticated");
      }
    };

    verify();
  }, [allowedRoles]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthorized") return <Navigate to="/unauthorized" />;

  return hasAccess ? children : null;
};

export default ProtectedRoute;
