export default function RoadmapFooter() {
  return (
    <footer className="bg-gradient-to-b from-white/80 to-gray-100/80 backdrop-blur-sm border-t border-gray-200 py-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <p className="text-gray-600 text-sm font-medium">
            © {new Date().getFullYear()} RoadmapHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
