import { Star, Quote } from 'lucide-react';

function TestimonialCard({ name, role, institution, content, rating }) {
  return (
    <div className="group bg-gradient-to-br from-gray-10 to-gray-08 border border-gray-15 rounded-2xl p-6 sm:p-8 hover:border-purple-60/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-60/10">
      {/* Quote Icon */}
      <div className="w-12 h-12 rounded-xl bg-purple-60/10 flex items-center justify-center mb-4 group-hover:bg-purple-60/20 transition-colors duration-300">
        <Quote className="w-6 h-6 text-purple-70" />
      </div>
      
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, index) => (
          <Star key={index} className="w-4 h-4 fill-purple-70 text-purple-70" />
        ))}
      </div>
      
      {/* Content */}
      <p className="text-gray-60 leading-relaxed mb-6 italic">
        "{content}"
      </p>
      
      {/* Author Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-15">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-70 to-purple-60 flex items-center justify-center text-white font-semibold">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="text-white-99 font-semibold">{name}</h4>
          <p className="text-sm text-gray-60">{role}</p>
          <p className="text-xs text-gray-60">{institution}</p>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;