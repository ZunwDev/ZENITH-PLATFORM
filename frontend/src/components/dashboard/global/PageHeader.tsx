export default function PageHeader({ title }) {
  return (
    <div className="flex flex-col gap-1 sm:mx-0 sm:text-start">
      <h1 className="text-2xl font-bold w-full">{title}</h1>
    </div>
  );
}
