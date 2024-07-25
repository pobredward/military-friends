// pages/cart.tsx
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { auth, db } from "../lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
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

const CartItem = styled.div`
  background-color: ${(props) => props.theme.colors.greenSecondary};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const RemoveButton = styled.button`
  background-color: #ff4136;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
`;

const CheckoutButton = styled.button`
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

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const cartQuery = query(
          collection(db, "cart"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(cartQuery);
        const cartData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCartItems(cartData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRemoveItem = async (itemId) => {
    await deleteDoc(doc(db, "cart", itemId));
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Title>장바구니</Title>
      {cartItems.length === 0 ? (
        <p>장바구니가 비어있습니다.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <CartItem key={item.id}>
              <ItemInfo>
                <h3>{item.productName}</h3>
                <p>가격: {item.price}원</p>
                <p>수량: {item.quantity}</p>
              </ItemInfo>
              <RemoveButton onClick={() => handleRemoveItem(item.id)}>
                삭제
              </RemoveButton>
            </CartItem>
          ))}
          <CheckoutButton onClick={handleCheckout}>결제하기</CheckoutButton>
        </>
      )}
    </Container>
  );
};

export default Cart;