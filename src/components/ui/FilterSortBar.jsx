const FilterSortBar = ({ filter, setFilter, sort, setSort }) => (
  <div className="flex flex-wrap gap-4 mb-6 justify-between">
    <select
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      className="p-2 border rounded"
    >
      <option value="All">All Categories</option>
      <option value="UI">UI</option>
      <option value="Mobile">Mobile</option>
    </select>
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value)}
      className="p-2 border rounded"
    >
      <option value="Popular">Most Popular</option>
      <option value="Status">By Status</option>
    </select>
  </div>
);
export default FilterSortBar;
