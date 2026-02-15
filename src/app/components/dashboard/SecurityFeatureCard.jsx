function SecurityFeatureCard({ icon, title, description }) {
  return (
    <div className="group bg-gradient-to-br from-gray-10 to-gray-08 border border-gray-15 rounded-2xl p-6 text-center hover:border-purple-60/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-60/10">
      <div className="w-16 h-16 rounded-xl bg-purple-60/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-60/20 group-hover:scale-110 transition-all duration-300">
        <div className="text-purple-70">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-white-99 group-hover:text-purple-75 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-sm text-gray-60 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default SecurityFeatureCard;