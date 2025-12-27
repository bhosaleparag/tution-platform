import { useState } from 'react';
import { Calendar } from 'lucide-react';

// DateInput Component
export default function DateInput({
  value = '',
  onChange,
  label,
  placeholder = 'Select date',
  error,
  disabled = false,
  required = false,
  minDate,
  maxDate,
  className = ''
}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white-90 mb-2">
          {label}
          {required && <span className="text-purple-60 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          min={minDate}
          max={maxDate}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3.5 pl-12
            bg-gray-15 text-white-95
            border-2 rounded-xl
            transition-all duration-200
            placeholder:text-gray-50
            disabled:opacity-50 disabled:cursor-not-allowed
            font-medium
            shadow-sm
            ${isFocused 
              ? 'border-purple-60 bg-gray-10 ring-4 ring-purple-60/20 shadow-purple-60/10' 
              : error 
                ? 'border-red-500' 
                : 'border-transparent hover:border-gray-30 hover:bg-gray-10'
            }
            ${disabled ? '' : 'cursor-pointer'}
          `}
          style={{
            colorScheme: 'dark'
          }}
        />
        
        <Calendar 
          className={`
            absolute left-4 top-1/2 -translate-y-1/2
            w-5 h-5 pointer-events-none
            transition-colors duration-200
            ${isFocused ? 'text-purple-60' : 'text-gray-50'}
          `}
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}