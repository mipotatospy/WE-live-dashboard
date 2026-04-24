// import { useEffect, useState } from "react";
// import { doc, onSnapshot } from "firebase/firestore";
// import { db } from "../../firebase";
// import MultiSeriesPie from "../../components/charts/MultiSeriesPie";
// import "./AttendanceStatusPage.css";

// function AttendanceStatusPage() {
//   const [attendanceStats, setAttendanceStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const docRef = doc(db, "attendance_stats", "main");

//     const unsubscribe = onSnapshot(
//       docRef,
//       (docSnap) => {
//         setLoading(false);

//         if (!docSnap.exists()) {
//           setError("Document Attendance_stats/main was not found.");
//           return;
//         }

//         const data = docSnap.data();

//         if (!data.attendance_stats) {
//           setError("The document does not contain an attendance_stats field.");
//           return;
//         }

//         setError("");
//         setAttendanceStats(data.attendance_stats); // Directly set the attendanceStats here
//       },
//       (err) => {
//         console.error("Error listening to attendance stats:", err);
//         setError(err.message || "Unable to load attendance stats.");
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   if (loading) {
//     return <div className="attendance-status-page">Loading attendance stats...</div>;
//   }

//   if (error) {
//     return <div className="attendance-status-page">Error: {error}</div>;
//   }

//   if (!attendanceStats) {
//     return <div className="attendance-status-page">No attendance data available.</div>;
//   }

//   return (
//     <div className="attendance-status-page">
//       <div className="pie-chart-container">
//         <MultiSeriesPie attendanceStats={attendanceStats} /> {/* Pass the updated data */}
//       </div>
//     </div>
//   );
// }

// export default AttendanceStatusPage;

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import MetricCard from "../../components/cards/MetricCard";  // Ensure you have this component
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
        setAttendanceStats(data.attendance_stats); // Directly set the attendanceStats here
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

  // Function to calculate the percentage of checked-in attendees
  const calculatePercentage = (checkedIn, totals) => {
    return totals === 0 ? 0 : ((checkedIn / totals) * 100).toFixed(1); // Fixed to 1 decimal place
  };

  return (
    <div className="attendance-status-page">
      <div className="pie-chart-container">
        <MultiSeriesPie attendanceStats={attendanceStats} /> {/* Pass the updated data */}
      </div>

      <div className="summary-grid">
        {/* Render MetricCard for each group */}
        {Object.keys(attendanceStats).map((group) => {
          const { checked_in = 0, totals = 0 } = attendanceStats[group];
          const percentage = calculatePercentage(checked_in, totals);
          return (
            <MetricCard
              key={group}
              title={`${group} (Checked-in %)`}  // Updated to show percentage
              value={`${percentage}% (${checked_in} / ${totals})`}  // Percentage value shown here
            />
          );
        })}
      </div>
    </div>
  );
}

export default AttendanceStatusPage;