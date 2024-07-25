// pages/products/[id].tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { Product } from "../../models/Product";
import Script from "next/script";

const products: Product[] = [
  {
    id: "1",
    name: "밀리터리 크레아틴",
    description: "근력 향상 보조제",
    price: 30000,
  },
  {
    id: "2",
    name: "밀리터리 아르기닌",
    description: "혈류 개선 보조제",
    price: 25000,
  },
  {
    id: "3",
    name: "밀리터리 글루타민",
    description: "면역력 강화 보조제",
    price: 20000,
  },
];

const productsMap: { [key: string]: Product } = products.reduce(
  (acc, product) => {
    acc[product.id] = product;
    return acc;
  },
  {},
);

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  color: ${(props) => props.theme.colors.greenPrimary};
  margin-bottom: 1rem;
`;

const ProductDetail = styled.div`
  background-color: ${(props) => props.theme.colors.greenSecondary};
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin: 1rem 0;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.5rem;
  background-color: ${(props) => props.theme.colors.greenPrimary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const PurchasePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const product = id ? productsMap[id as string] : null;

  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(product ? product.price : 0);

  useEffect(() => {
    if (product) {
      setTotalPrice(product.price * quantity);
    }
  }, [quantity, product]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qty = parseInt(e.target.value, 10);
    setQuantity(qty > 0 ? qty : 1);
  };

  const handlePayment = () => {
    if (!product) return;

    const tossPayments = (window as any).TossPayments(
      process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY,
    );
    tossPayments.requestPayment("카드", {
      amount: totalPrice,
      orderId: `order_${new Date().getTime()}`,
      orderName: product.name,
      customerName: "고객명",
      successUrl: `${window.location.origin}/products/success`,
      failUrl: `${window.location.origin}/products/fail`,
    });
  };

  if (!product) return <p>제품을 찾을 수 없습니다.</p>;

  return (
    <Container>
      <Script src="https://js.tosspayments.com/v1"></Script>
      <Title>결제 페이지</Title>
      <ProductDetail>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>가격: {product.price}원</p>
        <Input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
        />
        <p>총 금액: {totalPrice}원</p>
        <Button onClick={handlePayment}>결제하기</Button>
      </ProductDetail>
    </Container>
  );
};

export default PurchasePage;
