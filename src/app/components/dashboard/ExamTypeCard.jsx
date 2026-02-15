function ExamTypeCard({ icon, title, description }) {
  return (
    <div className="group bg-gradient-to-br from-gray-10 to-gray-08 border border-gray-15 rounded-2xl p-6 hover:border-purple-60/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-60/10">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-60/10 flex items-center justify-center group-hover:bg-purple-60/20 transition-colors duration-300">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2 text-white-99 group-hover:text-purple-75 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-60 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ExamTypeCard;