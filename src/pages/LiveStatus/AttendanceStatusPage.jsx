import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import MultiSeriesPie from "../../components/charts/MultiSeriesPie";
import "./AttendanceStatusPage.css";

function AttendanceStatusPage() {
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const docRef = doc(db, "attendance_stats", "main");

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        setLoading(false);

        if (!docSnap.exists()) {
          setError("Document Attendance_stats/main was not found.");
          return;
        }

        const data = docSnap.data();

        if (!data.attendance_stats) {
          setError("The document does not contain an attendance_stats field.");
          return;
        }

        setError("");
        setAttendanceStats(data.attendance_stats);
      },
      (err) => {
        console.error("Error listening to attendance stats:", err);
        setError(err.message || "Unable to load attendance stats.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="attendance-status-page">Loading attendance stats...</div>;
  }

  if (error) {
    return <div className="attendance-status-page">Error: {error}</div>;
  }

  if (!attendanceStats) {
    return <div className="attendance-status-page">No attendance data available.</div>;
  }

  return (
    <div className="attendance-status-page">
      <div className="pie-chart-container">
        <MultiSeriesPie attendanceStats={attendanceStats} />
      </div>
    </div>
  );
}

export default AttendanceStatusPage;