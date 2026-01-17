import { ReactNode } from 'react';

import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'TradePilot' }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">

      
      <main className="">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}