export default function NoDataFound({ filterAmount, dbcSearch, type, description }) {
  return (
    <>
      <h3 className="text-2xl font-bold tracking-tight">You have no {type}</h3>
      {filterAmount || dbcSearch ? (
        <p className="text-sm text-muted-foreground">No {type} found. Try changing/removing filters.</p>
      ) : (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </>
  );
}
