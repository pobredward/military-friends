// pages/orders.tsx
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

const OrderCard = styled.div`
  background-color: ${(props) => props.theme.colors.greenSecondary};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const OrderItem = styled.p`
  margin-bottom: 0.5rem;
`;

const TrackingButton = styled.button`
  background-color: ${(props) => props.theme.colors.greenPrimary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
`;

const Orders: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(ordersQuery);
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleTrackOrder = (trackingNumber) => {
    // 실제 배송 추적 서비스 연동
    alert(`배송 추적 번호: ${trackingNumber}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Title>주문 조회</Title>
      {orders.length === 0 ? (
        <p>주문 내역이 없습니다.</p>
      ) : (
        orders.map((order) => (
          <OrderCard key={order.id}>
            <OrderItem>
              <strong>주문 번호:</strong> {order.id}
            </OrderItem>
            <OrderItem>
              <strong>상품:</strong> {order.productName}
            </OrderItem>
            <OrderItem>
              <strong>결제 금액:</strong> {order.totalAmount}원
            </OrderItem>
            <OrderItem>
              <strong>주문 일자:</strong>{" "}
              {new Date(order.orderDate.seconds * 1000).toLocaleDateString()}
            </OrderItem>
            <OrderItem>
              <strong>배송 상태:</strong> {order.status}
            </OrderItem>
            {order.trackingNumber && (
              <TrackingButton onClick={() => handleTrackOrder(order.trackingNumber)}>
                배송 조회
              </TrackingButton>
            )}
          </OrderCard>
        ))
      )}
    </Container>
  );
};

export default Orders;