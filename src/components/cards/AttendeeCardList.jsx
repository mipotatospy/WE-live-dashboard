function AttendeeCardList({ attendees, onSelect }) {
    return (
      <div className="results-list">
        {attendees.map((item) => (
          <button
            key={item.id}
            type="button"
            className="card-list-item"
            onClick={() => onSelect(item.id)}
          >
            <div className="search-item">
              <div className="lookup-card lookup-card-list">
                <div className="lookup-card-body lookup-card-body-list">
                  <h5 className="lookup-card-title lookup-card-title-small">
                    {item.first_name} {item.last_name}
                  </h5>
                  <p className="lookup-card-text">{item.company || "-"}</p>
                  <p className="lookup-card-text">{item.email || "-"}</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  }
  
  export default AttendeeCardList;