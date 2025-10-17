import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

export interface AlertProps {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ 
  variant = 'default', 
  children,
  className = '' 
}) => {
  const baseClasses = 'relative w-full rounded-lg border p-4 flex items-start gap-3';
  
  const variantClasses = {
    default: 'bg-blue-50 text-blue-900 border-blue-200',
    destructive: 'bg-red-50 text-red-900 border-red-200',
    success: 'bg-green-50 text-green-900 border-green-200',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
  };

  const icons = {
    default: <Info className="h-5 w-5 text-blue-600" />,
    destructive: <XCircle className="h-5 w-5 text-red-600" />,
    success: <CheckCircle className="h-5 w-5 text-green-600" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-600" />,
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} role="alert">
      {icons[variant]}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export const AlertTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children,
  className = '' 
}) => {
  return (
    <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>
      {children}
    </h5>
  );
};

export const AlertDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children,
  className = '' 
}) => {
  return (
    <div className={`text-sm [&_p]:leading-relaxed ${className}`}>
      {children}
    </div>
  );
};
