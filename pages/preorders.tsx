// pages/preorders.tsx
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { auth, db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
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

const PreorderCard = styled.div`
  background-color: ${(props) => props.theme.colors.greenSecondary};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const PreorderItem = styled.p`
  margin-bottom: 0.5rem;
`;

const Preorders: React.FC = () => {
  const [preorders, setPreorders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const preordersQuery = query(
          collection(db, "preorders"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(preordersQuery);
        const preordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPreorders(preordersData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Title>사전예약 확인</Title>
      {preorders.length === 0 ? (
        <p>사전예약 내역이 없습니다.</p>
      ) : (
        preorders.map((preorder) => (
          <PreorderCard key={preorder.id}>
            <PreorderItem>
              <strong>상품명:</strong> {preorder.productName}
            </PreorderItem>
            <PreorderItem>
              <strong>예약 일자:</strong>{" "}
              {new Date(preorder.preorderDate.seconds * 1000).toLocaleDateString()}
            </PreorderItem>
            <PreorderItem>
              <strong>상태:</strong> 사전예약 완료
            </PreorderItem>
          </PreorderCard>
        ))
      )}
    </Container>
  );
};

export default Preorders;