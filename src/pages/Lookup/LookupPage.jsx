import { useEffect, useState } from "react";
import LookupSearchBar from "../../components/ui/LookupSearchBar.jsx";
import AttendeeCard from "../../components/cards/AttendeeCard.jsx";
import AttendeeCardList from "../../components/cards/AttendeeCardList.jsx";
import { getAllAttendees, getAttendeeById } from "../../services/attendeeFirestore.js";
import { searchAttendeesInMemory } from "../../services/searchAttendees.js";
import "./LookupPage.css";

function LookupPage() {
  const [allAttendees, setAllAttendees] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [loadingAttendees, setLoadingAttendees] = useState(true);
  const [loadingSelection, setLoadingSelection] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    async function loadAttendees() {
      try {
        setLoadingAttendees(true);
        setError("");

        const attendees = await getAllAttendees();
        setAllAttendees(attendees);
      } catch (err) {
        console.error("Failed to load attendees:", err);
        setError(err.message || "Failed to load attendees");
      } finally {
        setLoadingAttendees(false);
      }
    }

    loadAttendees();
  }, []);

  function handleSearch(rawValue) {
    const query = (rawValue || "").trim();
    setHasSearched(!!query);

    if (!query) {
      setResults([]);
      setSelectedAttendee(null);
      return;
    }

    const found = searchAttendeesInMemory(allAttendees, query, 25);
    setResults(found);

    if (found.length === 1) {
      setSelectedAttendee(found[0]);
    } else {
      setSelectedAttendee(null);
    }
  }

  async function handleSelectAttendee(id) {
    try {
      setLoadingSelection(true);
      setError("");

      const attendee = await getAttendeeById(id);
      setSelectedAttendee(attendee);
    } catch (err) {
      console.error("Failed to load attendee:", err);
      setError(err.message || "Failed to load attendee");
    } finally {
      setLoadingSelection(false);
    }
  }

  function renderResults() {
    if (loadingAttendees) {
      return <div className="lookup-message">Loading attendees...</div>;
    }

    if (loadingSelection) {
      return <div className="lookup-message">Loading attendee...</div>;
    }

    if (error) {
      return <div className="lookup-message error">{error}</div>;
    }

    if (!hasSearched) {
      return <div className="lookup-message">Start typing to search attendees.</div>;
    }

    if (results.length === 0 && !selectedAttendee) {
      return <div className="lookup-message">No Results</div>;
    }

    if (selectedAttendee) {
      return <AttendeeCard attendee={selectedAttendee} />;
    }

    if (results.length > 1) {
      return (
        <AttendeeCardList
          attendees={results}
          onSelect={handleSelectAttendee}
        />
      );
    }

    return null;
  }

  return (
    <div className="lookup-page">
      <LookupSearchBar onSearch={handleSearch} />
      <div className="results-container">{renderResults()}</div>
    </div>
  );
}

export default LookupPage;