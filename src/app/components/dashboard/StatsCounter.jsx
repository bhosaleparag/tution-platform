'use client';
import { useEffect, useState } from 'react';

function StatsCounter({ end, label, icon: Icon, suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (end === 0) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [end]);

  const formatNumber = (num) => {
    return num.toLocaleString('en-IN');
  };

  return (
    <div className="group bg-gradient-to-br from-gray-10 to-gray-08 border border-gray-15 rounded-2xl p-8 text-center hover:border-purple-60/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-60/10">
      <div className="w-16 h-16 rounded-xl bg-purple-60/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-60/20 group-hover:scale-110 transition-all duration-300">
        <Icon className="w-8 h-8 text-purple-70" />
      </div>
      <div className="text-4xl sm:text-5xl font-bold text-white-99 mb-2 group-hover:text-purple-75 transition-colors duration-300">
        {formatNumber(count)}{suffix}
      </div>
      <p className="text-gray-60 text-sm sm:text-base">{label}</p>
    </div>
  );
}

export default StatsCounter;