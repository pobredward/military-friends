// pages/products/[id].tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import LoadingSpinner from "../../components/LoadingSpinner";
import AddToCartButton from "../../components/AddToCartButton";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProductImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  margin-bottom: 2rem;
`;

const ProductName = styled.h1`
  color: ${(props) => props.theme.colors.greenPrimary};
  margin-bottom: 1rem;
`;

const ProductDescription = styled.p`
  margin-bottom: 1rem;
`;

const ProductPrice = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 2rem;
`;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const ProductDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const productDoc = await getDoc(doc(db, "products", id as string));
        if (productDoc.exists()) {
          setProduct({ id: productDoc.id, ...productDoc.data() } as Product);
        } else {
          router.push("/404");
        }
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return <div>제품을 찾을 수 없습니다.</div>;
  }

  return (
    <Container>
      <ProductImage src={product.imageUrl} alt={product.name} />
      <ProductName>{product.name}</ProductName>
      <ProductDescription>{product.description}</ProductDescription>
      <ProductPrice>{product.price.toLocaleString()}원</ProductPrice>
      <AddToCartButton
        productId={product.id}
        productName={product.name}
        price={product.price}
      />
    </Container>
  );
};

export default ProductDetailPage;
