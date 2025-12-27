"use client";


import { ChevronDown } from "lucide-react";
import { memo, useState } from "react";

const Select = ({
  multiple = false,
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  error = "",
  className = "",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedValue) => {
    onChange?.(selectedValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  if (multiple) {
    const toggleOption = (optValue) => {
      if (value.includes(optValue)) {
        onChange(value.filter(v => v !== optValue));
      } else {
        onChange([...value, optValue]);
      }
    };

    return (
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-[#141414] border border-[#333333] rounded-xl text-white min-h-[48px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#703bf7] focus:border-transparent transition"
        >
          {value.length === 0 ? (
            <span className="text-[#666666]">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {value.map(v => {
                const opt = options.find(o => o.value === v);
                return (
                  <span key={v} className="px-2 py-1 bg-[#703bf7] rounded-lg text-xs flex items-center gap-1">
                    {opt?.label}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(value.filter(val => val !== v));
                      }}
                      className="hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
        
        {isOpen && !disabled && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-2 bg-[#1a1a1a] border border-[#333333] rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {options.map(opt => (
                <div
                  key={opt.value}
                  onClick={() => toggleOption(opt.value)}
                  className={`px-4 py-3 cursor-pointer hover:bg-[#252525] transition flex items-center gap-3 ${
                    value.includes(opt.value) ? 'text-[#703bf7]' : 'text-white'
                  }`}
                >
                  <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    value.includes(opt.value) ? 'border-[#703bf7] bg-[#703bf7]' : 'border-[#666666]'
                  }`}>
                    {value.includes(opt.value) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {opt.label}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Label */}
      {label && (
        <label className="block mb-2 text-sm font-medium text-white-90">
          {label}
        </label>
      )}

      {/* Select Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-lg border transition-all duration-200
          flex items-center justify-between text-left
          ${disabled 
            ? 'bg-gray-15 border-gray-20 text-gray-50 cursor-not-allowed' 
            : 'bg-gray-08 border-gray-15 text-white-99 hover:border-gray-20 focus:border-purple-60'
          }
          ${error ? 'border-red-500' : ''}
          ${isOpen ? 'border-purple-60' : ''}
          ${className}
        `}
        {...props}
      >
        <span className={selectedOption ? 'text-white-99' : 'text-gray-50'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        <ChevronDown 
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${disabled ? 'text-gray-50' : 'text-gray-40'}`}
        />
      </button>

      {/* Dropdown Options */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-gray-10 border border-gray-15 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <button
              key={option.value || index}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
                w-full px-4 py-3 text-left transition-colors duration-150
                hover:bg-gray-15 focus:bg-gray-15 focus:outline-none
                ${value === option.value 
                  ? 'bg-purple-60 text-white' 
                  : 'text-white-90 hover:text-white-99'
                }
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === options.length - 1 ? 'rounded-b-lg' : ''}
              `}
            >
              {option.label}
            </button>
          ))}
          
          {options.length === 0 && (
            <div className="px-4 py-3 text-gray-50 text-center">
              No options available
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default memo(Select);
