import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import React from "react";

interface Props {
  children?: React.ReactNode;
}
export default function MainLayout({ children }: Props) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
