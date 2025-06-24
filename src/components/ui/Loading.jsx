export default function RoadmapCardLoader() {
  return (
    <div className="bg-white shadow-md rounded p-4 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>

      <div className="flex space-x-4 mt-3">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-3 border-t">
        <div className="h-5 bg-gray-300 rounded w-24"></div>
        <div className="h-5 bg-gray-300 rounded w-20"></div>
      </div>

      <div className="mt-4 space-y-2">
        {[1, 2].map((_, index) => (
          <div key={index} className="h-4 bg-gray-200 rounded w-full"></div>
        ))}
        <div className="flex gap-2 mt-2">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}
