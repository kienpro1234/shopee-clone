import React from "react";
import RegisterHeader from "../../components/RegisterHeader/RegisterHeader";
import Footer from "../../components/Footer/Footer";

interface Props {
  children?: React.ReactNode;
}

export default function RegisterLayout({ children }: Props) {
  return (
    <div>
      <RegisterHeader />
      {children}
      <Footer />
    </div>
  );
}
