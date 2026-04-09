import "./EventComparisonTable.css";

function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function EventComparisonTable({ events }) {
  return (
    <div className="comparison-table-wrapper">
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Attendees</th>
            <th>Unique companies</th>
            <th>Total meetings</th>
            <th>Avg meetings / attendee</th>
            <th>Attendees with meetings</th>
            <th>Buyers %</th>
            <th>Sellers %</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.eventName}>
              <td>{event.eventName}</td>
              <td>{formatNumber(event.totalAttendees)}</td>
              <td>{formatNumber(event.uniqueCompanies)}</td>
              <td>{formatNumber(event.totalMeetings)}</td>
              <td>{event.avgMeetingsPerAttendee.toFixed(2)}</td>
              <td>{formatPercent(event.attendeesWithMeetingsPct)}</td>
              <td>{formatPercent(event.buyersPct)}</td>
              <td>{formatPercent(event.sellersPct)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EventComparisonTable;