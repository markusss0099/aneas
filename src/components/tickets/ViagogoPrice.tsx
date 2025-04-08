
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface ViagogoPriceProps {
  link?: string;
}

const ViagogoPrice: React.FC<ViagogoPriceProps> = ({ link }) => {
  if (!link) return <span className="text-gray-400">-</span>;
  
  return (
    <div className="flex items-center">
      <Button 
        variant="outline" 
        size="sm"
        className="h-8 px-2 text-xs"
        asChild
      >
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          View
        </a>
      </Button>
    </div>
  );
};

export default ViagogoPrice;
