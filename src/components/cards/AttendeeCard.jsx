function AttendeeCard({ attendee }) {
  if (!attendee) return null;

  function getBadgeColor(group) {
    const value = (group || "").toLowerCase();

    if (value.includes("buyer") || value.includes("speaker")) {
      return "badge-red";
    }
    if (value.includes("media") || value.includes("vip")) {
      return "badge-black";
    }
    if (value.includes("staff")) {
      return "badge-purple";
    }
    if (value.includes("exhibitor")) {
      return "badge-blue";
    }

    return "badge-default";
  }

  const badgeColorClass = getBadgeColor(attendee.group);

  return (
    <div className="card card-tall">
      <div className="card-body">
        <div className="card-top d-flex justify-content-between align-items-center mb-2">
          <div className="editable-field">
            <h2 className="card-title">
              {attendee.first_name} {attendee.last_name}
            </h2>
            <span className={`badge ${badgeColorClass}`}>
              {attendee.group || "Role"}
            </span>
          </div>
        </div>

        <div className="card-info d-flex flex-column flex-grow-1 justify-content-center editable-field">
          <p className="card-text">Company: {attendee.company || "-"}</p>
          <p className="card-text">Email: {attendee.email || "-"}</p>
          <p className="card-text">Join Code: {attendee.join_code || "-"}</p>
          <p className="card-text">Status: {attendee.app_registered || "-"}</p>
          <p className="card-text">
            Checked in: {attendee.checked_in ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AttendeeCard;