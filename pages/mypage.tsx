import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import LoadingSpinner from "../components/LoadingSpinner";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.colors.greenPrimary};
  text-align: center;
  margin-bottom: 2rem;
`;

const InfoCard = styled.div`
  background-color: ${(props) => props.theme.colors.greenSecondary};
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.p`
  margin-bottom: 0.5rem;
`;

const MyPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser({ ...currentUser, ...userDoc.data() });
        } else {
          setUser(currentUser);
        }
      } else {
        router.push("/member/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Title>마이 페이지</Title>
      {user && (
        <InfoCard>
          <InfoItem>
            <strong>이메일:</strong> {user.email}
          </InfoItem>
          <InfoItem>
            <strong>이름:</strong> {user.displayName || "설정되지 않음"}
          </InfoItem>
          <InfoItem>
            <strong>전화번호:</strong> {user.phoneNumber || "설정되지 않음"}
          </InfoItem>
          {user.username && (
            <InfoItem>
              <strong>사용자명:</strong> {user.username}
            </InfoItem>
          )}
          {user.birthDate && (
            <InfoItem>
              <strong>생년월일:</strong> {user.birthDate}
            </InfoItem>
          )}
          <InfoItem>
            <strong>가입일:</strong>{" "}
            {user.metadata?.creationTime
              ? new Date(user.metadata.creationTime).toLocaleDateString()
              : "알 수 없음"}
          </InfoItem>
        </InfoCard>
      )}
    </Container>
  );
};

export default MyPage;
