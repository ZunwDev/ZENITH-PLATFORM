export default function PageHeader({ title, description }) {
  return (
    <div className="flex flex-col gap-1 xs:mx-auto xs:text-center sm:mx-0 sm:text-start">
      <h1 className="text-3xl font-bold w-full">{title}</h1>
      <h2>{description}</h2>
    </div>
  );
}
