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

const Section = styled.section`
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  color: ${(props) => props.theme.colors.greenPrimary};
  text-align: center;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background-color: ${(props) => props.theme.colors.greenSecondary};
  padding: 1rem;
  border-radius: 5px;
`;

const PreorderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
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
`;

const PreorderInfo = styled.p`
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const CountdownTimer = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1rem;
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
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60),
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setCountdown(`${days}일 ${hours}시간 ${minutes}분 ${seconds}초`);
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
        {countdown && (
          <CountdownTimer>사전예약 마감까지: {countdown}</CountdownTimer>
        )}
        {preorderSettings && (
          <PreorderInfo>
            현재 사전예약: {preorderSettings.currentPreorders} /{" "}
            {preorderSettings.maxPreorders}
          </PreorderInfo>
        )}
        <PreorderButton onClick={handlePreorder}>
          밀리터리 부스터 사전예약
        </PreorderButton>
      </PreorderSection>

      <Section>
        <SectionTitle>밀리터리 부스터</SectionTitle>
        <FeatureGrid>
          <FeatureCard>
            <h3>밀리터리 크레아틴</h3>
            <p>
              근력과 폭발적인 운동 능력을 향상시키고, 근육 세포에 에너지를
              공급하여 운동 지속 시간을 연장시킵니다.
            </p>
          </FeatureCard>
          <FeatureCard>
            <h3>밀리터리 아르기닌</h3>
            <p>
              혈류 개선과 근육 펌핑 효과를 증진시키고, 성장 호르몬 분비를
              촉진하여 운동 후 회복을 가속화합니다.
            </p>
          </FeatureCard>
          <FeatureCard>
            <h3>밀리터리 글루타민</h3>
            <p>
              근육 회복과 면역력 강화를 도와주고, 단백질 합성을 촉진하여 근육
              손실을 방지합니다.
            </p>
          </FeatureCard>
        </FeatureGrid>
      </Section>
    </Container>
  );
};

export default Home;
