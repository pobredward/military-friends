// components/AddToCartButton.tsx
import React, { useState } from "react";
import styled from "@emotion/styled";
import { auth, db } from "../lib/firebase";
import { addDoc, collection } from "firebase/firestore";

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.greenPrimary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.greenPrimaryDark};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  price: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  productName,
  price,
}) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    const user = auth.currentUser;

    if (user) {
      try {
        await addDoc(collection(db, "cart"), {
          userId: user.uid,
          productId,
          productName,
          price,
          quantity: 1,
        });
        alert("제품이 장바구니에 추가되었습니다.");
      } catch (error) {
        console.error("장바구니 추가 중 오류 발생:", error);
        alert("장바구니에 추가하는 중 오류가 발생했습니다.");
      }
    } else {
      alert("로그인이 필요합니다.");
    }

    setLoading(false);
  };

  return (
    <Button onClick={handleAddToCart} disabled={loading}>
      {loading ? "추가 중..." : "장바구니에 추가"}
    </Button>
  );
};

export default AddToCartButton;
