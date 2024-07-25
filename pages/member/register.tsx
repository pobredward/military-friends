// pages/member/register.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { FcGoogle } from "react-icons/fc";
import theme from "../../styles/theme";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${theme.colors.background};
`;

const Title = styled.h1`
  font-size: 24px;
  color: ${theme.colors.greenPrimary};
  text-align: center;
  margin-bottom: 24px;
`;
const RegisterContainer = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background-color: ${theme.colors.greenSecondary};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px; // 요소들 사이의 간격을 일정하게 유지
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: white;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: ${theme.colors.greenPrimary};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${theme.colors.greenPrimary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${theme.colors.greenPrimary}dd;
  }
`;

const GoogleButton = styled(Button)`
  background-color: white;
  color: #757575;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px; // 아이콘과 텍스트 사이의 간격
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  font-size: 14px;
  margin-top: 8px;
`;

const VerificationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
`;

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [error, setError] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const router = useRouter();

  const saveUserToFirestore = async (user: User, additionalData: any) => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username: additionalData.username,
        phoneNumber: additionalData.phoneNumber,
        birthDate: additionalData.birthDate,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error saving user data to Firestore:", error);
      throw error;
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isPhoneVerified) {
      setError("전화번호 인증이 필요합니다.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await saveUserToFirestore(userCredential.user, {
        username,
        phoneNumber,
        birthDate,
      });
      router.push("/");
    } catch (error) {
      console.error("회원가입 에러:", error);
      setError("회원가입 중 오류가 발생했습니다.");
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user, {
        username: result.user.displayName || "",
        phoneNumber: result.user.phoneNumber || "",
        birthDate: "", // Google doesn't provide birth date
      });
      router.push("/");
    } catch (error) {
      console.error("Google 회원가입 에러:", error);
      setError("Google 회원가입 중 오류가 발생했습니다.");
    }
  };

  const handlePhoneVerification = () => {
    // 실제로는 여기서 본인인증 서비스 팝업을 열어야 합니다.
    // 예: NICE평가정보, KCB, SCI평가정보 등의 서비스
    setShowVerificationModal(true);
  };

  const handleVerificationSuccess = () => {
    setIsPhoneVerified(true);
    setShowVerificationModal(false);
  };

  return (
    <PageContainer>
      <RegisterContainer>
        <Title>회원가입</Title>
        <Form onSubmit={handleRegister}>
          <InputGroup>
            <Label htmlFor="username">아이디</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="phoneNumber">전화번호</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </InputGroup>
          <Button type="button" onClick={handlePhoneVerification}>
            {isPhoneVerified ? "인증완료" : "휴대폰 본인인증"}
          </Button>
          <InputGroup>
            <Label htmlFor="email">이메일 주소</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="birthDate">생년월일</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </InputGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit">회원가입</Button>
        </Form>
        <GoogleButton onClick={handleGoogleRegister}>
          <FcGoogle style={{ marginRight: "10px" }} /> Google로 회원가입
        </GoogleButton>
      </RegisterContainer>

      {showVerificationModal && (
        <VerificationModal>
          <ModalContent>
            <h2>휴대폰 본인인증</h2>
            <p>
              실제 서비스에서는 여기에 본인인증 서비스가 제공하는 인증 화면이
              표시됩니다.
            </p>
            <Button onClick={handleVerificationSuccess}>
              인증 완료 (테스트용)
            </Button>
          </ModalContent>
        </VerificationModal>
      )}
    </PageContainer>
  );
};

export default Register;
