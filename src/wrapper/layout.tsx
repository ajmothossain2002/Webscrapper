'use client';

import Header from "./header";
import Footer from "./footer";
import { PropsWithChildren } from 'react';




const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default Layout;