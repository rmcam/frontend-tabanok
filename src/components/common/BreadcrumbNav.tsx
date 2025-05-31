import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils'; // Asumo que tienes una utilidad para clases condicionales

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items, className }) => {
  return (
    <nav aria-label="breadcrumb" className={cn("flex items-center space-x-2 text-sm text-muted-foreground", className)}>
      {items.map((item, index) => (
        <React.Fragment key={item.path}>
          <Link to={item.path} className="hover:text-primary transition-colors">
            {item.label}
          </Link>
          {index < items.length - 1 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbNav;
