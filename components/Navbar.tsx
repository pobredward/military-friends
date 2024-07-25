// components/Navbar.tsx
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${(props) => props.theme.colors.greenSecondary};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.h1`
  color: ${(props) => props.theme.colors.greenPrimary};
  margin: 0;
  margin-right: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Nav = styled.nav<{ isOpen: boolean }>`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background-color: ${(props) => props.theme.colors.greenSecondary};
    padding: 1rem;
  }
`;

const NavItem = styled.a`
  color: white;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.colors.greenPrimary};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProfileContainer = styled.div`
  position: relative;
`;

const ProfileIcon = styled.div`
  cursor: pointer;
  font-size: 24px;
  color: white;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: none;
  flex-direction: column;
  min-width: 150px;
  z-index: 10;

  ${ProfileContainer}:hover & {
    display: flex;
  }
`;

const DropdownItem = styled.a`
  display: block;
  padding: 10px 20px;
  color: #333;
  text-decoration: none;
  text-align: center;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const MenuIcon = styled.div`
  cursor: pointer;
  font-size: 24px;
  color: white;

  @media (min-width: 769px) {
    display: none;
  }
`;

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDropdownItemClick = (path: string) => {
    if (isLoggedIn) {
      router.push(path);
    } else {
      router.push("/member/login");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("로그아웃 에러:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Header>
      <LeftSection>
        <MenuIcon onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </MenuIcon>
        <Logo>MILITARY FRIENDS</Logo>
        <Nav isOpen={isMenuOpen}>
          <NavItem href="/">HOME</NavItem>
          <NavItem href="/products">PRODUCT</NavItem>
          <NavItem href="/about">ABOUT US</NavItem>
        </Nav>
      </LeftSection>
      <RightSection>
        <ProfileContainer>
          <ProfileIcon>
            <FaUserCircle />
          </ProfileIcon>
          <DropdownMenu>
            {isLoggedIn ? (
              <>
                <DropdownItem
                  onClick={() => handleDropdownItemClick("/mypage")}
                >
                  마이 페이지
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleDropdownItemClick("/orders")}
                >
                  주문조회
                </DropdownItem>
                <DropdownItem onClick={() => handleDropdownItemClick("/cart")}>
                  장바구니
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleDropdownItemClick("/preorders")}
                >
                  사전예약 확인
                </DropdownItem>
                <DropdownItem onClick={handleLogout}>로그아웃</DropdownItem>
              </>
            ) : (
              <DropdownItem
                onClick={() => handleDropdownItemClick("/member/login")}
              >
                로그인
              </DropdownItem>
            )}
          </DropdownMenu>
        </ProfileContainer>
      </RightSection>
    </Header>
  );
};

export default Navbar;
