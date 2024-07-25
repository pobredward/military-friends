// components/Layout.tsx
import React, { ReactNode } from "react";
import styled from "@emotion/styled";
import Navbar from "./Navbar";

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  color: white;
  min-height: 100vh;
`;

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Container>
      <Navbar />
      <main>{children}</main>
    </Container>
  );
};

export default Layout;
