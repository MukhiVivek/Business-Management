const Card = ({ title, value, color }) => {
  const colorMap = {
    indigo: { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-300" },
    blue: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
    teal: { bg: "bg-teal-100", text: "text-teal-700", border: "border-teal-300" },
    green: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  };

  const styles = colorMap[color] || colorMap.blue;

  return (
    <div className={`${styles.bg} ${styles.border} font rounded-xl p-7 gap-y-2 shadow-md`}>
      <h2 className="text-black text-base font-medium mb-1">{title}</h2>
      <div className={`text-2xl font-bold ${styles.text}`}>{value}</div>
    </div>
  );
};

export default Card;