const Card = ({ title, value, color, description }) => {
  const colorMap = {
    indigo: { bg: "bg-white", text: "text-indigo-600", border: "border-indigo-100", icon: "bg-indigo-50" },
    blue: { bg: "bg-white", text: "text-blue-600", border: "border-blue-100", icon: "bg-blue-50" },
    teal: { bg: "bg-white", text: "text-teal-600", border: "border-teal-100", icon: "bg-teal-50" },
    green: { bg: "bg-white", text: "text-green-600", border: "border-green-100", icon: "bg-green-50" },
  };

  const styles = colorMap[color] || colorMap.blue;

  return (
    <div className={`${styles.bg} border ${styles.border} font rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300`}>
      <div className="flex flex-col gap-1">
        <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h2>
        <div className={`text-3xl font-bold ${styles.text} my-1`}>{value}</div>
        {description && <p className="text-gray-400 text-xs mt-1">{description}</p>}
      </div>
    </div>
  );
};

export default Card;