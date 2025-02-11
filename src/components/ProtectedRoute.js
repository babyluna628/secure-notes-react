import React from "react";
import { Navigate } from "react-router-dom";
import { useMyContext } from "../store/ContextApi";
//props로 관리자 페이지
const ProtectedRoute = ({ children, adminPage }) => {
  //컨택스트로 토큰과 어드민확인 가져옴
  const { token, isAdmin } = useMyContext();

  //토큰이 없으면 로그인으로
  if (!token) {
    return <Navigate to="/login" />;
  }

  //토큰이 있고 관리자페이지이고 관리자가 아니면  접속거부
  if (token && adminPage && !isAdmin) {
    return <Navigate to="/access-denied" />;
  }

  return children;
};

export default ProtectedRoute;

// USING LOCAL STORAGE OPTION FOR OAUTH ISSUE SINCE IT WAS NOT GETTING REDIRECTED.
// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children, adminPage = false }) => {
//   const token = localStorage.getItem('JWT_TOKEN');
//   const user = JSON.parse(localStorage.getItem('USER'));

//   console.log("ProtectedRoute: Token:", token);
//   console.log("ProtectedRoute: User:", user);

//   if (!token) {
//     console.log("ProtectedRoute: No token found, redirecting to login");
//     return <Navigate to="/login" />;
//   }

//   if (adminPage && (!user || !user.roles.includes('ADMIN'))) {
//     console.log("ProtectedRoute: User does not have admin rights, redirecting to access denied");
//     return <Navigate to="/access-denied" />;
//   }

//   console.log("ProtectedRoute: Access granted to protected route");
//   return children;
// };

// export default ProtectedRoute;
