import { useEffect, useState } from "react";
import RoadmapCard from "../components/ui/Card";
import RoadmapCardLoader from "../components/ui/Loading";

// const demoRoadmaps = [
//   {
//     id: 1,
//     title: "Dark Mode Support",
//     description: "Add dark mode toggle for better night-time usability.",
//     category: "UI/UX",
//     status: "Planned",
//     upvotes: 10,
//     comments: [
//       {
//         id: 1,
//         user: "Alice",
//         text: "Much needed feature!",
//         replies: [
//           {
//             id: 11,
//             user: "Bob",
//             text: "Absolutely agree!",
//             replies: [],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 2,
//     title: "API Rate Limiting",
//     description: "Prevent abuse of public endpoints.",
//     category: "Backend",
//     status: "In Progress",
//     upvotes: 15,
//     comments: [],
//   },
//   {
//     id: 3,
//     title: "Multi-language Support",
//     description: "Support for translations across UI.",
//     category: "Localization",
//     status: "Completed",
//     upvotes: 8,
//     comments: [],
//   },
// ];

const MAX_NESTING = 3;

export default function Home() {
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortType, setSortType] = useState("Most Upvotes");
  const [roadmapData, setRoadmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = "https://roadmap-app-backend.onrender.com";
  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await fetch(`${url}/api/roadmapitem/`);
        const data = await response.json();
        setLoading(false);
        setRoadmapData(data.data);
      } catch (error) {
        console.error("Failed to fetch roadmaps:", error);
      }
    };
    fetchRoadmaps();
  }, []);

  const filterSortRoadmaps = () => {
    let items = [...roadmapData];
    if (filterCategory !== "All") {
      items = items.filter((item) => item.category === filterCategory);
    }
    if (filterStatus !== "All") {
      items = items.filter((item) => item.status === filterStatus);
    }
    if (sortType === "Most Upvotes") {
      items.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sortType === "Least Upvotes") {
      items.sort((a, b) => a.upvotes - b.upvotes);
    }
    return items;
  };

  const categories = [
    "All",
    ...new Set(roadmapData.map((item) => item.category)),
  ];
  const statuses = ["All", ...new Set(roadmapData.map((item) => item.status))];

  return (
    <div className="max-w-4xl mx-auto mt-20 space-y-8 p-4">
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <select
          className="border px-3 py-2 rounded"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <select
          className="border px-3 py-2 rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          {statuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <select
          className="border px-3 py-2 rounded"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option>Most Upvotes</option>
          <option>Least Upvotes</option>
        </select>
      </div>
      {loading
        ? Array.from({ length: 3 }).map((_, i) => <RoadmapCardLoader key={i} />)
        : filterSortRoadmaps().map((item) => (
            <RoadmapCard
              key={item._id}
              setRoadmapData={setRoadmapData}
              item={item}
            />
          ))}
    </div>
  );
}
