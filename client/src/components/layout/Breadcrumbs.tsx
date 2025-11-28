import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  jobs: "Jobs",
  bids: "Bids",
  messages: "Messages",
  wallet: "Wallet",
  notifications: "Notifications",
  profile: "Profile",
  settings: "Settings",
  marketplace: "Equipment",
  workers: "Workers",
  "post-job": "Post Job",
  kyc: "KYC Verification",
  earnings: "Earnings",
  reviews: "Reviews",
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const [location] = useLocation();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathParts = location.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = "";

    pathParts.forEach((part, index) => {
      currentPath += `/${part}`;
      const isLast = index === pathParts.length - 1;
      
      breadcrumbs.push({
        label: routeLabels[part] || part.charAt(0).toUpperCase() + part.slice(1),
        href: isLast ? undefined : currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 text-sm text-muted-foreground mb-4"
      data-testid="breadcrumbs"
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>

      {breadcrumbs.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
