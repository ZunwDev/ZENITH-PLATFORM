import ScaleLoader from "react-spinners/ScaleLoader";

export default function Loading({ text }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 h-screen text-center w-full">
      <ScaleLoader color="#2563eb" />
      Loading {text} data...
    </div>
  );
}
