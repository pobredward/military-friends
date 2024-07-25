// pages/member/login.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import { FcGoogle } from "react-icons/fc";

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.greenSecondary};
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: ${(props) => props.theme.colors.greenPrimary};
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.greenPrimary};
  color: white;
`;

const GoogleButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4285f4;
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      console.error("로그인 에러:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error) {
      console.error("Google 로그인 에러:", error);
    }
  };

  return (
    <LoginContainer>
      <Title>로그인</Title>
      <form onSubmit={handleLogin}>
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">로그인</Button>
      </form>
      <GoogleButton onClick={handleGoogleLogin}>
        <FcGoogle style={{ marginRight: "10px" }} /> Google로 로그인
      </GoogleButton>
    </LoginContainer>
  );
};

export default Login;
