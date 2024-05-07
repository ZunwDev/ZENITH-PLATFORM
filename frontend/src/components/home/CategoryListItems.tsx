import { Link } from "react-router-dom";

export default function CategoryListItems({ category }) {
  return (
    <div className="flex flex-col">
      {(Object.values(category)[0] as any[]).map((item, i) => (
        <Link key={i} to={`/category/${item.name.replace(/\s+/g, "-").toLowerCase()}`} className="px-2 hover:underline">
          {item.name}
        </Link>
      ))}
      <Link to={`/category/${Object.keys(category)[0].replace(/\s+/g, "-").toLowerCase()}`} className="px-2 hover:underline">
        All {Object.keys(category)[0]}
      </Link>
    </div>
  );
}
