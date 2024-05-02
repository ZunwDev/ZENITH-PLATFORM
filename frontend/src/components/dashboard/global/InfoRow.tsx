export default function InfoRow({ label, value, isBold = false }) {
  return (
    <div className="flex justify-between w-full">
      <span className="text-start text-sm italic">{label}:</span>
      <span className={`text-sm ${isBold ? "font-bold" : ""}`}>{value}</span>
    </div>
  );
}
