// pages/checkout.tsx
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { auth, db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
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

const CheckoutItem = styled.div`
  background-color: ${(props) => props.theme.colors.greenSecondary};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const TotalAmount = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 1rem;
  text-align: right;
`;

const PaymentButton = styled.button`
  background-color: ${(props) => props.theme.colors.greenPrimary};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  margin-top: 2rem;
  width: 100%;
`;

const Checkout: React.FC = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const cartQuery = query(
          collection(db, "cart"),
          where("userId", "==", user.uid),
        );
        const querySnapshot = await getDocs(cartQuery);
        const cartData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCartItems(cartData);
        setTotalAmount(
          cartData.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
          ),
        );
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePayment = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // 주문 정보 저장
        await addDoc(collection(db, "orders"), {
          userId: user.uid,
          items: cartItems.map((item) => ({
            productId: item.id,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount,
          orderDate: new Date(),
          status: "결제 완료",
        });

        // 장바구니 비우기
        for (const item of cartItems) {
          await deleteDoc(doc(db, "cart", item.id));
        }

        alert("결제가 완료되었습니다.");
        router.push("/orders");
      }
    } catch (error) {
      console.error("결제 처리 중 오류 발생:", error);
      alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Title>결제</Title>
      {cartItems.map((item) => (
        <CheckoutItem key={item.id}>
          <h3>{item.productName}</h3>
          <p>가격: {item.price}원</p>
          <p>수량: {item.quantity}</p>
        </CheckoutItem>
      ))}
      <TotalAmount>총 결제 금액: {totalAmount}원</TotalAmount>
      <PaymentButton onClick={handlePayment}>토스 결제하기</PaymentButton>
    </Container>
  );
};

export default Checkout;
