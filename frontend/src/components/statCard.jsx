function StatCard({ title, value, color }) {
  return (
    <div
      className={`p-6 rounded-xl shadow text-white bg-gradient-to-r ${color} hover:scale-105 transition duration-300`}
    >
      <h3 className="text-sm">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

export default StatCard;