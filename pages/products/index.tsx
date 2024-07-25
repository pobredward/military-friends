// pages/products/index.tsx
import React from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { Product } from "../../models/Product";

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

const ProductList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

const ProductCard = styled.div`
  background-color: ${(props) => props.theme.colors.greenSecondary};
  padding: 1rem;
  border-radius: 5px;
  text-align: center;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.colors.greenPrimary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
`;

const ProductsPage: React.FC = () => {
  const router = useRouter();

  const handlePurchase = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div>
      <h1>제품 목록</h1>
      <ProductList>
        {products.map((product) => (
          <ProductCard key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>{product.price}원</p>
            <Button onClick={() => handlePurchase(product.id)}>구매하기</Button>
          </ProductCard>
        ))}
      </ProductList>
    </div>
  );
};

export default ProductsPage;
