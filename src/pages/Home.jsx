import axios from "axios";
import { useEffect, useState } from "react";
import RoadmapCard from "../components/ui/Card";
import RoadmapCardLoader from "../components/ui/Loading";

const MAX_NESTING = 3;

export default function Home() {
  const [state, setState] = useState({
    filterCategory: "All",
    filterStatus: "All",
    sortType: "Most Upvotes",
    roadmapData: [],
    loading: true,
  });
  const url = import.meta.env.VITE_URL;

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await axios.get(`${url}/api/roadmapitem/`);
        setState((prev) => ({
          ...prev,
          loading: false,
          roadmapData: response.data.data,
        }));
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false }));
        console.error("Failed to fetch roadmaps:", error);
      }
    };
    fetchRoadmaps();
  }, [url]);

  const filterSortRoadmaps = () => {
    let items = [...state.roadmapData];
    if (state.filterCategory !== "All") {
      items = items.filter((item) => item.category === state.filterCategory);
    }
    if (state.filterStatus !== "All") {
      items = items.filter((item) => item.status === state.filterStatus);
    }
    if (state.sortType === "Most Upvotes") {
      items.sort((a, b) => b.upvotes - a.upvotes);
    } else if (state.sortType === "Least Upvotes") {
      items.sort((a, b) => a.upvotes - b.upvotes);
    }
    return items;
  };

  const categories = [
    "All",
    ...new Set(state.roadmapData.map((item) => item.category)),
  ];
  const statuses = [
    "All",
    ...new Set(state.roadmapData.map((item) => item.status)),
  ];

  return (
    <div className="max-w-4xl mx-auto mt-20 space-y-8 p-4">
      {/* Filter and sort controls */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <select
          className="border px-3 py-2 rounded"
          value={state.filterCategory}
          onChange={(e) =>
            setState((prev) => ({ ...prev, filterCategory: e.target.value }))
          }
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <select
          className="border px-3 py-2 rounded"
          value={state.filterStatus}
          onChange={(e) =>
            setState((prev) => ({ ...prev, filterStatus: e.target.value }))
          }
        >
          {statuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <select
          className="border px-3 py-2 rounded"
          value={state.sortType}
          onChange={(e) =>
            setState((prev) => ({ ...prev, sortType: e.target.value }))
          }
        >
          <option>Most Upvotes</option>
          <option>Least Upvotes</option>
        </select>
      </div>

      {state.loading
        ? Array.from({ length: 3 }).map((_, i) => <RoadmapCardLoader key={i} />)
        : filterSortRoadmaps().map((item) => (
            <RoadmapCard
              key={item._id}
              setRoadmapData={(roadmapData) =>
                setState((prev) => ({ ...prev, roadmapData }))
              }
              item={item}
            />
          ))}
    </div>
  );
}
