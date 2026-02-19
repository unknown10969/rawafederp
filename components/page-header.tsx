import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Breadcrumb = { label: string; href?: string };

interface PageHeaderProps {
  title: string;
  breadcrumbs: Breadcrumb[];
  addLabel?: string;
  addHref?: string;
  onAdd?: () => void;
}

export function PageHeader({ title, breadcrumbs, addLabel = "Add New", addHref, onAdd }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <div>
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-4 w-4" />}
                {b.href ? (
                  <Link href={b.href} className="hover:text-foreground transition-colors">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="text-xl font-semibold tracking-tight text-foreground mt-1">
            {title}
          </h1>
        </div>
        {(addHref || onAdd) && (
          addHref ? (
            <Link
              href={addHref}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {addLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {addLabel}
            </button>
          )
        )}
      </div>
    </header>
  );
}
