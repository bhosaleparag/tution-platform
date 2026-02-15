import { CheckCircle2 } from 'lucide-react';

function UserTypeCard({ icon, title, description, features }) {
  return (
    <div className="group bg-gradient-to-br from-gray-10 to-gray-08 border border-gray-15 rounded-2xl p-8 hover:border-purple-60/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-60/10">
      <div className="w-16 h-16 rounded-xl bg-purple-60/10 flex items-center justify-center mb-6 group-hover:bg-purple-60/20 group-hover:scale-110 transition-all duration-300">
        <div className="text-purple-70">
          {icon}
        </div>
      </div>
      
      <h3 className="text-2xl font-bold mb-3 text-white-99 group-hover:text-purple-75 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-gray-60 mb-6 leading-relaxed">
        {description}
      </p>
      
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-60/20 flex items-center justify-center mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-purple-70" />
            </div>
            <span className="text-sm text-gray-60">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserTypeCard;