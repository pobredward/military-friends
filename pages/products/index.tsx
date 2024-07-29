// pages/products/index.tsx
import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import LoadingSpinner from "../../components/LoadingSpinner";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.colors.greenPrimary};
  text-align: center;
  margin-bottom: 2rem;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled.div`
  background-color: ${(props) => props.theme.colors.greenSecondary};
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const ProductName = styled.h3`
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.p`
  font-weight: bold;
  color: ${(props) => props.theme.colors.greenPrimary};
`;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsList);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Title>제품 목록</Title>
      <ProductGrid>
        {products.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <ProductCard>
              <ProductImage src={product.imageUrl} alt={product.name} />
              <ProductName>{product.name}</ProductName>
              <ProductPrice>{product.price.toLocaleString()}원</ProductPrice>
            </ProductCard>
          </Link>
        ))}
      </ProductGrid>
    </Container>
  );
};

export default ProductsPage;
