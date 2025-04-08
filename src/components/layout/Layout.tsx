
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
      <main className={cn(
        "flex-1 min-h-screen w-full",
        isMobile ? "pt-0" : "ml-64"
      )}>
        {isMobile && <Navbar />}
        <div className={cn(
          "container mx-auto p-6",
          isMobile && "p-2"
        )}>
          {children}
        </div>
      </main>
      
      {!isMobile && <Navbar />}
    </div>
  );
};

export default Layout;
