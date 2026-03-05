import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}
export function Input({
  label,
  error,
  icon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full space-y-1">
      {label &&
      <label className="block text-sm font-semibold text-[#5D4037] font-serif">
          {label}
        </label>
      }
      <div className="relative">
        {icon &&
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B4513]">
            {icon}
          </div>
        }
        <input
          className={`
            w-full rounded-md border-2 border-[#D4A574]/50 bg-[#FAF7F0] 
            px-3 py-2 text-[#3E2723] placeholder:text-[#8B4513]/40
            focus:border-[#8B4513] focus:outline-none focus:ring-1 focus:ring-[#8B4513]
            transition-all duration-200 font-serif
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props} />

      </div>
      {error &&
      <p className="text-sm text-red-600 font-serif italic">{error}</p>
      }
    </div>);

}