function ControlPanel({ 
  searchTerm, 
  setSearchTerm, 
  sortBy, 
  setSortBy, 
  onFindNearest 
}) {
  return (
    <div className="control-panel">
      <input
        type="text"
        placeholder="Search by city (e.g. Tartu) or street..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      
      <div className="sort-chips">
        <button 
          className={`chip ${sortBy === null ? 'active' : ''}`}
          onClick={() => setSortBy(null)}
        >
          All
        </button>

        <button 
          className={`chip ${sortBy === '95' ? 'active' : ''}`}
          onClick={() => setSortBy('95')}
        >
          Cheapest 95
        </button>

        <button 
          className={`chip ${sortBy === '98' ? 'active' : ''}`}
          onClick={() => setSortBy('98')}
        >
          Cheapest 98
        </button>

        <button 
          className={`chip ${sortBy === 'diesel' ? 'active' : ''}`}
          onClick={() => setSortBy('diesel')}
        >
          Cheapest Diesel
        </button>
        
        <button 
          className={`chip ${sortBy === 'nearest' ? 'active' : ''}`}
          onClick={onFindNearest}
        >
          📍 Nearest
        </button>
      </div>
    </div>
  );
}

export default ControlPanel;