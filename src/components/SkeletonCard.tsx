export default function SkeletonCard() {
  return (
    <div className="bg-[#1a1f2e] rounded overflow-hidden animate-pulse h-full flex flex-col">
      <div className="aspect-square bg-gray-800" />

      <div className="p-4 flex-1 flex-row">
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-700 rounded w-1/2" />
        </div>

        <div className="h-5 bg-gray-700 rounded w-1/4 ml-auto" />
      </div>
    </div>
  );
}
