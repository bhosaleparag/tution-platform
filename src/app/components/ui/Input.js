"use client";

import { memo } from "react";

const Input = ({
  label,
  theme = "dark",
  className = "",
  startIcon: StartIcon, // Rename props to startIcon and endIcon
  endIcon: EndIcon,
  ...props
}) =>{
  const iconClasses = "absolute top-1/2 -translate-y-1/2";
  const inputPaddingClasses = {
    start: StartIcon ? "pl-10" : "pl-3",
    end: EndIcon ? "pr-10" : "pr-3",
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-white-90">{label}</label>}
      <div className="relative">
        {StartIcon && (
          <div className={`left-3 text-gray-60 ${iconClasses}`}>
            {StartIcon}
          </div>
        )}
        <input
          {...props}
          className={` 
            w-full px-4 py-3 text-white border rounded-xl
            ${theme === 'dark' ? 'bg-gray-08 border-gray-15 placeholder:text-gray-40' : 'bg-gray-15 border-gray-15 placeholder:text-gray-40'}
            focus:outline-none focus:ring-1 focus:ring-purple-60 focus:border-transparent transition
            ${inputPaddingClasses.start}
            ${inputPaddingClasses.end}
            ${className}
          `}
        />
        {EndIcon && (
          <div className={`right-3 text-gray-60 flex ${iconClasses}`}>
            {EndIcon}
          </div>
        )}
      </div>
    </div>
  );
}
export default memo(Input)