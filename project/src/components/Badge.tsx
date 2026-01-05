import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info';
  icon?: ReactNode;
}

const Badge = ({ children, variant = 'info', icon }: BadgeProps) => {
  return (
    <span className={`badge badge-${variant}`}>
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
