
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNav from './MobileNav';
import DesktopNav from './DesktopNav';
import { navItems } from '@/types/nav';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  if (isMobile) {
    return (
      <MobileNav 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
        navItems={navItems}
        closeMenu={closeMenu}
      />
    );
  }

  return <DesktopNav navItems={navItems} />;
};

export default Navbar;
