// import { useEffect, useState } from "react";
// import {
//   collection,
//   query,
//   orderBy,
//   limit,
//   getDocs,
//   onSnapshot,
// } from "firebase/firestore";
// import { db } from "../../firebase";
// import LineChart from "../../components/charts/LineChart";
// import "./LiveTrendPage.css";

// function LiveTrendPage() {
//   const [trendData, setTrendData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let unsubscribe = null;

//     async function setupTrendListener() {
//       try {
//         setLoading(true);
//         setError("");

//         // 1) Initial fetch: latest 3 docs
//         const initialQuery = query(
//           collection(db, "buckets"),
//           orderBy("timestamp", "desc"),
//           limit(3)
//         );

//         const initialSnapshot = await getDocs(initialQuery);

//         const initialRows = initialSnapshot.docs
//           .map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }))
//           .reverse(); // oldest -> newest for chart display

//         setTrendData(initialRows);
//         setLoading(false);

//         // 2) Live listener: only latest 1 doc
//         const latestQuery = query(
//           collection(db, "buckets"),
//           orderBy("timestamp", "desc"),
//           limit(1)
//         );

//         unsubscribe = onSnapshot(
//           latestQuery,
//           (snapshot) => {
//             if (snapshot.empty) return;

//             const latestDoc = {
//               id: snapshot.docs[0].id,
//               ...snapshot.docs[0].data(),
//             };

//             setTrendData((current) => {
//               if (current.length === 0) {
//                 return [latestDoc];
//               }

//               const currentNewest = current[current.length - 1];

//               // Ignore if it's the same latest doc already in memory
//               if (currentNewest?.id === latestDoc.id) {
//                 return current;
//               }

//               const next = [...current, latestDoc];

//               // Keep only last 3 docs
//               return next.slice(-7);
//             });
//           },
//           (err) => {
//             console.error("Error listening to latest bucket:", err);
//             setError(err.message || "Failed to listen to trend updates.");
//           }
//         );
//       } catch (err) {
//         console.error("Error loading trend data:", err);
//         setError(err.message || "Failed to load trend data.");
//         setLoading(false);
//       }
//     }

//     setupTrendListener();

//     return () => {
//       if (unsubscribe) unsubscribe();
//     };
//   }, []);

//   function formatLabel(rawTimestamp) {
//     if (!rawTimestamp) return "";

//     const date = new Date(rawTimestamp);

//     return date.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   }

//   const labels = trendData.map((item) => formatLabel(item.timestamp?.timestamp));

//   const datasets = [
//     {
//       label: "Total",
//       data: trendData.map((item) => item.totals_checkedin || 0),
//       borderColor: "#111111",
//       backgroundColor: "#111111",
//       tension: 0.3,
//     },
//     {
//       label: "Buyers",
//       data: trendData.map((item) => item.buyers?.checked_in || 0),
//       borderColor: "#2563EB",
//       backgroundColor: "#2563EB",
//       tension: 0.3,
//     },
//     {
//       label: "Exhibitors",
//       data: trendData.map((item) => item.exhibitors?.checked_in || 0),
//       borderColor: "#059669",
//       backgroundColor: "#059669",
//       tension: 0.3,
//     },
//     {
//       label: "VIP",
//       data: trendData.map((item) => item.vip?.checked_in || 0),
//       borderColor: "#D97706",
//       backgroundColor: "#D97706",
//       tension: 0.3,
//     },
//     {
//       label: "Media",
//       data: trendData.map((item) => item.media?.checked_in || 0),
//       borderColor: "#7C3AED",
//       backgroundColor: "#7C3AED",
//       tension: 0.3,
//     },
//   ];

//   if (loading) {
//     return <div className="live-trend-page">Loading trend data...</div>;
//   }

//   if (error) {
//     return <div className="live-trend-page">Error: {error}</div>;
//   }

//   return (
//     <div className="live-trend-page">
//       <div className="chart-container">
//         <LineChart labels={labels} datasets={datasets} />
//       </div>
//     </div>
//   );
// }

// export default LiveTrendPage;


import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import LineChart from "../../components/charts/LineChart";
import "./LiveTrendPage.css";

const chartLength = 10

const EMPTY_POINT = () => ({
  id: null,
  timestamp: null,
  totals_checkedin: 0,
  buyers: { checked_in: 0 },
  exhibitors: { checked_in: 0 },
  vip: { checked_in: 0 },
  media: { checked_in: 0 },
});

function LiveTrendPage() {
  const [trendData, setTrendData] = useState(
    Array.from({ length: chartLength }, () => EMPTY_POINT())
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let unsubscribe = null;

    async function setupTrendListener() {
      try {
        setLoading(true);
        setError("");

        // 1) Initial fetch: latest 10 docs
        const initialQuery = query(
          collection(db, "buckets"),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        const initialSnapshot = await getDocs(initialQuery);

        let initialRows = initialSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .reverse(); // oldest -> newest for chart display

        // Pad to always have 10 points
        if (initialRows.length < chartLength) {
          const padding = Array.from(
            { length: chartLength - initialRows.length },
            () => EMPTY_POINT()
          );
          initialRows = [...padding, ...initialRows];
        }

        setTrendData(initialRows);
        setLoading(false);

        // 2) Live listener: only latest 1 doc
        const latestQuery = query(
          collection(db, "buckets"),
          orderBy("timestamp", "desc"),
          limit(1)
        );

        unsubscribe = onSnapshot(
          latestQuery,
          (snapshot) => {
            if (snapshot.empty) return;

            const latestDoc = {
              id: snapshot.docs[0].id,
              ...snapshot.docs[0].data(),
            };

            setTrendData((current) => {
              if (!current || current.length === 0) {
                const base = Array.from({ length: chartLength - 1 }, () => EMPTY_POINT());
                return [...base, latestDoc];
              }

              const currentNewestRealDoc = [...current]
                .reverse()
                .find((item) => item?.id);

              // Ignore if the newest real doc is already the latest one
              if (currentNewestRealDoc?.id === latestDoc.id) {
                return current;
              }

              const next = [...current, latestDoc];

              // Keep only the last 10 points
              return next.slice(-chartLength);
            });
          },
          (err) => {
            console.error("Error listening to latest bucket:", err);
            setError(err.message || "Failed to listen to trend updates.");
          }
        );
      } catch (err) {
        console.error("Error loading trend data:", err);
        setError(err.message || "Failed to load trend data.");
        setLoading(false);
      }
    }

    setupTrendListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  function formatLabel(rawTimestamp) {
    if (!rawTimestamp) return "";

    const date = new Date(rawTimestamp);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const labels = trendData.map((item) =>
    formatLabel(item?.timestamp?.timestamp)
  );

  const datasets = [
    {
      label: "Total",
      data: trendData.map((item) => item?.totals_checkedin || 0),
      borderColor: "#111111",
      backgroundColor: "#111111",
      tension: 0.3,
    },
    {
      label: "Buyers",
      data: trendData.map((item) => item?.buyers?.checked_in || 0),
      borderColor: "#2563EB",
      backgroundColor: "#2563EB",
      tension: 0.3,
    },
    {
      label: "Exhibitors",
      data: trendData.map((item) => item?.exhibitors?.checked_in || 0),
      borderColor: "#059669",
      backgroundColor: "#059669",
      tension: 0.3,
    },
    {
      label: "VIP",
      data: trendData.map((item) => item?.vip?.checked_in || 0),
      borderColor: "#D97706",
      backgroundColor: "#D97706",
      tension: 0.3,
    },
    {
      label: "Media",
      data: trendData.map((item) => item?.media?.checked_in || 0),
      borderColor: "#7C3AED",
      backgroundColor: "#7C3AED",
      tension: 0.3,
    },
  ];

  if (loading) {
    return <div className="live-trend-page">Loading trend data...</div>;
  }

  if (error) {
    return <div className="live-trend-page">Error: {error}</div>;
  }

  return (
    <div className="live-trend-page">
      <div className="chart-container">
        <LineChart labels={labels} datasets={datasets} />
      </div>
    </div>
  );
}

export default LiveTrendPage;