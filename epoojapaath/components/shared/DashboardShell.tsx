interface DashboardShellProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardShell({ title, subtitle, action, children }: DashboardShellProps) {
  const hasHeader = title || subtitle || action;
  
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {hasHeader && (
        <div className="flex items-start justify-between mb-6">
          <div>
            {title && <h1 className="font-heading text-2xl md:text-3xl text-foreground">{title}</h1>}
            {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
