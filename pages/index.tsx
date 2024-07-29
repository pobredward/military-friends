// pages/index.tsx
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { auth, db } from "../lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  runTransaction,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Hero = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeroText = styled.div`
  flex: 1;
  padding-right: 2rem;
  @media (max-width: 768px) {
    padding-right: 0;
    padding-bottom: 2rem;
  }
`;

const HeroImage = styled.img`
  max-width: 40%;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SectionTitle = styled.h2`
  color: ${(props) => props.theme.colors.greenPrimary};
  text-align: center;
  margin-bottom: 1.5rem;
`;

const PreorderSection = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  padding: 2rem;
  margin-top: 2rem;
`;

const PreorderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const CountdownTimer = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.greenPrimary};
`;

const PreorderProgress = styled.div`
  text-align: right;
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: string }>`
  width: ${(props) => props.width};
  height: 100%;
  background-color: ${(props) => props.theme.colors.greenPrimary};
`;

const PreorderButton = styled.button`
  background-color: ${(props) => props.theme.colors.greenPrimary};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  margin-top: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.greenPrimaryDark};
  }
`;

const ProductSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProductTitle = styled.h3`
  font-size: 1.8rem;
  color: ${(props) => props.theme.colors.greenPrimary};
  text-align: center;
  margin-bottom: 1rem;
`;

const ProductDescription = styled.p`
  text-align: center;
  margin-bottom: 2rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background-color: ${(props) => props.theme.colors.greenSecondary};
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const PriceSection = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #888;
  font-size: 1.2rem;
`;

const DiscountPrice = styled.span`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.greenPrimary};
  margin-left: 1rem;
`;

const DiscountTag = styled.span`
  background-color: #ff6b6b;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-left: 0.5rem;
`;

const Home: React.FC = () => {
  const router = useRouter();
  const [preorderSettings, setPreorderSettings] = useState(null);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const fetchPreorderSettings = async () => {
      const settingsDoc = await getDoc(doc(db, "settings", "preorder"));
      if (settingsDoc.exists()) {
        setPreorderSettings(settingsDoc.data());
      }
    };
    fetchPreorderSettings();
  }, []);

  useEffect(() => {
    if (preorderSettings) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const endTime = preorderSettings.endDate.toDate().getTime();
        const distance = endTime - now;

        if (distance < 0) {
          clearInterval(timer);
          setCountdown("사전예약이 종료되었습니다");
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          setCountdown(`${days}일`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [preorderSettings]);

  const handlePreorder = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await runTransaction(db, async (transaction) => {
          const settingsDocRef = doc(db, "settings", "preorder");
          const settingsDoc = await transaction.get(settingsDocRef);

          if (!settingsDoc.exists()) {
            throw new Error("사전예약 설정을 찾을 수 없습니다.");
          }

          const settings = settingsDoc.data();

          if (settings.currentPreorders >= settings.maxPreorders) {
            throw new Error("사전예약이 마감되었습니다.");
          }

          const userPreorderQueryRef = query(
            collection(db, "preorders"),
            where("userId", "==", user.uid),
          );
          const userPreorderDocs = await getDocs(userPreorderQueryRef);

          if (!userPreorderDocs.empty) {
            throw new Error("이미 사전예약하셨습니다.");
          }

          const newPreorderRef = doc(collection(db, "preorders"));

          transaction.update(settingsDocRef, {
            currentPreorders: settings.currentPreorders + 1,
          });

          transaction.set(newPreorderRef, {
            userId: user.uid,
            productName: "밀리터리 부스터",
            preorderDate: new Date(),
          });
        });

        alert("사전예약이 완료되었습니다.");
        router.push("/preorders");
      } catch (error) {
        console.error("사전예약 중 오류 발생:", error);
        alert(
          error.message ||
            "사전예약 중 오류가 발생했습니다. 다시 시도해주세요.",
        );
      }
    } else {
      router.push("/member/login");
    }
  };

  return (
    <Container>
      <Hero>
        <HeroText>
          <h2>밀리터리 프렌즈</h2>
          <p>
            강함을 추구합니다. 누구나 할 수 있습니다. 방법을 제시해드리겠습니다.
            그대로 따라오면 됩니다. 우리는 이미 그 길을 걸어봤고, 여러분이
            성공할 수 있도록 이끌어드리겠습니다. 모든 과정은 철저하게 계획되어
            있으며, 하나하나 충실히 따라오세요. 여러분의 몸과 마음은 우리가
            안내하는 대로 강해질 것입니다. 끝까지 함께할 테니, 의심하지 말고
            전진하세요. 전역 후의 달라진 자신을 만나게 될 것입니다.
          </p>
        </HeroText>
        <HeroImage src="/model.png" alt="model" />
      </Hero>

      <PreorderSection>
        <SectionTitle>밀리터리 부스터 사전예약</SectionTitle>
        <PreorderInfo>
          <CountdownTimer>
            {countdown && `사전예약 마감까지: ${countdown}`}
          </CountdownTimer>
          {preorderSettings && (
            <PreorderProgress>
              <p>
                예약 현황: {preorderSettings.currentPreorders} /{" "}
                {preorderSettings.maxPreorders}
              </p>
              <ProgressBar>
                <ProgressFill
                  width={`${(preorderSettings.currentPreorders / preorderSettings.maxPreorders) * 100}%`}
                />
              </ProgressBar>
            </PreorderProgress>
          )}
        </PreorderInfo>

        <ProductSection>
          <ProductTitle>밀리터리 부스터</ProductTitle>
          <ProductDescription>
            최고의 성능을 위한 완벽한 조합. 크레아틴, 아르기닌, 글루타민이
            하나로!
          </ProductDescription>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>💪</FeatureIcon>
              <FeatureTitle>밀리터리 크레아틴</FeatureTitle>
              <p>근력 증가와 폭발적인 운동 능력 향상</p>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>🏃</FeatureIcon>
              <FeatureTitle>밀리터리 아르기닌</FeatureTitle>
              <p>혈류 개선과 근육 펌핑 효과 증진</p>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>🛡️</FeatureIcon>
              <FeatureTitle>밀리터리 글루타민</FeatureTitle>
              <p>근육 회복과 면역력 강화</p>
            </FeatureCard>
          </FeaturesGrid>
          <PriceSection>
            <OriginalPrice>75,000원</OriginalPrice>
            <DiscountPrice>52,500원</DiscountPrice>
            <DiscountTag>30% OFF</DiscountTag>
          </PriceSection>
        </ProductSection>

        <PreorderButton onClick={handlePreorder}>
          지금 사전예약하기
        </PreorderButton>
      </PreorderSection>
    </Container>
  );
};

export default Home;
