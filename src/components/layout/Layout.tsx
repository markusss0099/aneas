
import React from 'react';
import Navbar from './Navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background flex">
      {!isMobile && <Navbar />}
      
      <main className={cn(
        "flex-1 min-h-screen",
        isMobile ? "w-full pt-14" : "ml-64"
      )}>
        {isMobile && <Navbar />}
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
