import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useMyContext } from "../../store/ContextApi";

//백엔드에서 소숄로그인후 토큰과 함께 요청함
const OAuth2RedirectHandler = () => {
  const navigate = useNavigate(); //이동객체
  const location = useLocation(); //요청주소객체
  const { setToken, setIsAdmin } = useMyContext();

  useEffect(() => {
    const params = new URLSearchParams(location.search); //location.search는 ?뒤 쿼리스트링
    const token = params.get("token"); //토큰만빼옴
    console.log("OAuth2RedirectHandler: Params:", params.toString()); //쿼리스트링
    console.log("OAuth2RedirectHandler: Token:", token); //토큰만 출력

    if (token) {
      try {
        const decodedToken = jwtDecode(token); //토큰 암호풀기
        console.log("Decoded Token:", decodedToken);

        localStorage.setItem("JWT_TOKEN", token);

        const user = {
          username: decodedToken.sub,
          roles: decodedToken.roles.split(","),
        };
        console.log("User Object:", user);
        localStorage.setItem("USER", JSON.stringify(user));

        // Update context state
        setToken(token);
        setIsAdmin(user.roles.includes("ADMIN"));

        // Delay navigation to ensure local storage operations complete
        setTimeout(() => {
          console.log("Navigating to /notes");
          navigate("/notes");
        }, 100); // 100ms delay
      } catch (error) {
        console.error("Token decoding failed:", error);
        navigate("/login");
      }
    } else {
      console.log("Token not found in URL, redirecting to login");
      navigate("/login"); //토큰이 없기때문에 다시 로그인 페이지로
    }
  }, [location, navigate, setToken, setIsAdmin]);

  return <div>Redirecting...</div>;
};

export default OAuth2RedirectHandler;
