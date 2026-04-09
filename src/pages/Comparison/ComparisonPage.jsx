// import LineChart from "../../components/charts/LineChart";
// import "./ComparisonPage.css";

// function ComparisonPage() {

//     const comparisonData = [
//         {
//         date: "Day -90",
//         "IWE 2023": { registered: 30 },
//         "VinitalyUSA 2024": { registered: 50 },
//         "VinitalyUSA 2025": { registered: 70 },
//         "WE London 2026": { registered: 10 },
//         },
//         {
//         date: "Day -80",
//         "IWE 2023": { registered: 80 },
//         "VinitalyUSA 2024": { registered: 100 },
//         "VinitalyUSA 2025": { registered: 120 },
//         "WE London 2026": { registered: 40 },
//         },
//         {
//         date: "Day -70",
//         "IWE 2023": { registered: 80 },
//         "VinitalyUSA 2024": { registered: 100 },
//         "VinitalyUSA 2025": { registered: 120 },
//         "WE London 2026": { registered: 40 },
//         },
//         {
//         date: "Day -60",
//         "IWE 2023": { registered: 80 },
//         "VinitalyUSA 2024": { registered: 100 },
//         "VinitalyUSA 2025": { registered: 120 },
//         "WE London 2026": { registered: 40 },
//         },
//         {
//         date: "Day -50",
//         "IWE 2023": { registered: 80 },
//         "VinitalyUSA 2024": { registered: 100 },
//         "VinitalyUSA 2025": { registered: 120 },
//         "WE London 2026": { registered: 40 },
//         },
//         {
//         date: "Day -40",
//         "IWE 2023": { registered: 80 },
//         "VinitalyUSA 2024": { registered: 100 },
//         "VinitalyUSA 2025": { registered: 120 },
//         "WE London 2026": { registered: 40 },
//         },
//         {
//         date: "Day -30",
//         "IWE 2023": { registered: 150 },
//         "VinitalyUSA 2024": { registered: 180 },
//         "VinitalyUSA 2025": { registered: 200 },
//         "WE London 2026": { registered: 100 },
//         },
//         {
//         date: "Day -20",
//         "IWE 2023": { registered: 150 },
//         "VinitalyUSA 2024": { registered: 180 },
//         "VinitalyUSA 2025": { registered: 200 },
//         "WE London 2026": { registered: 100 },
//         },
//         {
//         date: "Day 10",
//         "IWE 2023": { registered: 150 },
//         "VinitalyUSA 2024": { registered: 180 },
//         "VinitalyUSA 2025": { registered: 200 },
//         "WE London 2026": { registered: 100 },
//         },
//         {
//         date: "Day -1",
//         "IWE 2023": { registered: 220 },
//         "VinitalyUSA 2024": { registered: 250 },
//         "VinitalyUSA 2025": { registered: 280 },
//         "WE London 2026": { registered: 170 },
//         },
//     ];

//     const { labels, datasets } = buildComparisonChartData(comparisonData);

//     const eventNames = Object.keys(comparisonData[0]).filter(
//         (key) => key !== "date"
//     );

//     const colors = ["#2563EB", "#059669", "#D97706", "#7C3AED"];

//     function buildComparisonChartData(comparisonData) {
//         const labels = comparisonData.map((item) => item.date);
      
//         const eventNames = Object.keys(comparisonData[0]).filter(
//           (key) => key !== "date"
//         );
      
//         const colors = ["#2563EB", "#059669", "#D97706", "#7C3AED"];
      
//         const datasets = eventNames.map((eventName, index) => ({
//           label: eventName,
//           data: comparisonData.map((item) => item[eventName].registered),
//           borderColor: colors[index % colors.length],
//           backgroundColor: colors[index % colors.length],
//           tension: 0.3,
//         }));
      
//         return { labels, datasets };
//     }

//     return (
//         <div className="comparison-page">
//         <div className="chart-container">
//             <LineChart labels={labels} datasets={datasets} />
//         </div>
//         </div>
//     );
// }

// export default ComparisonPage;

import { useMemo } from "react";
import MetricCard from "../../components/cards/MetricCard";
import RegistrationTrendChart from "../../components/charts/RegistrationTrendChart";
import AttendeeGroupChart from "../../components/charts/AttendeeGroupChart";
import BuyerSellerChart from "../../components/charts/BuyerSellerChart";
import EventComparisonTable from "../../components/tables/EventComparisonTable";
import rawRows from "../../data/eventRows.json";
import {
  buildComparisonMetrics,
  buildRegistrationChartData,
  buildAttendeeGroupChartData,
  buildBuyerSellerChartData,
} from "../../services/comparisonAggregator";
import "./ComparisonPage.css";

const MAX_DAYS_PRIOR = 31;

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function formatPercent(value) {
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
}

function ComparisonPage() {
  const eventMetrics = useMemo(() => {
    return buildComparisonMetrics(rawRows, MAX_DAYS_PRIOR);
  }, []);

  const registrationChartData = useMemo(() => {
    if (!eventMetrics.length) return null;
    return buildRegistrationChartData(eventMetrics, MAX_DAYS_PRIOR);
  }, [eventMetrics]);

  const attendeeGroupChartData = useMemo(() => {
    if (!eventMetrics.length) return null;
    return buildAttendeeGroupChartData(eventMetrics);
  }, [eventMetrics]);

  const buyerSellerChartData = useMemo(() => {
    if (!eventMetrics.length) return null;
    return buildBuyerSellerChartData(eventMetrics);
  }, [eventMetrics]);

  const summary = useMemo(() => {
    if (!eventMetrics.length) return null;

    const totalAttendees = eventMetrics.reduce(
      (sum, event) => sum + event.totalAttendees,
      0
    );

    const totalMeetings = eventMetrics.reduce(
      (sum, event) => sum + event.totalMeetings,
      0
    );

    const uniqueCompanies = eventMetrics.reduce(
      (sum, event) => sum + event.uniqueCompanies,
      0
    );

    const totalBuyers = eventMetrics.reduce(
      (sum, event) => sum + event.buyers,
      0
    );

    const totalSellers = eventMetrics.reduce(
      (sum, event) => sum + event.sellers,
      0
    );

    const avgMeetingsPerAttendee = totalAttendees
      ? totalMeetings / totalAttendees
      : 0;

    const buyersPct = totalAttendees ? totalBuyers / totalAttendees : 0;
    const sellersPct = totalAttendees ? totalSellers / totalAttendees : 0;

    return {
      totalEvents: eventMetrics.length,
      totalAttendees,
      totalMeetings,
      uniqueCompanies,
      avgMeetingsPerAttendee,
      buyersPct,
      sellersPct,
    };
  }, [eventMetrics]);

  const currentEvent = useMemo(() => {
    if (!eventMetrics.length) return null;

    return [...eventMetrics].sort((a, b) => {
      const dateA = a.eventDate ? new Date(a.eventDate).getTime() : 0;
      const dateB = b.eventDate ? new Date(b.eventDate).getTime() : 0;
      return dateB - dateA;
    })[0];
  }, [eventMetrics]);

  return (
    <div className="comparison-page">
      <div className="comparison-header">
        <h1>Event Comparison Dashboard</h1>
        <p>
          Compare registration pace, attendee mix, buying/selling intent, and
          engagement across current and past events.
        </p>
      </div>

      {!eventMetrics.length ? (
        <div className="page-message">
          No comparison data found. Make sure <code>eventRows.json</code> exists
          and contains rows parsed from your Excel or CSV files.
        </div>
      ) : (
        <>
          <div className="summary-grid">
            <MetricCard
              title="Events compared"
              value={formatNumber(summary.totalEvents)}
            />
            <MetricCard
              title="Total attendees"
              value={formatNumber(summary.totalAttendees)}
            />
            <MetricCard
              title="Total meetings"
              value={formatNumber(summary.totalMeetings)}
            />
            <MetricCard
              title="Unique companies (sum across events)"
              value={formatNumber(summary.uniqueCompanies)}
            />
            <MetricCard
              title="Avg meetings per attendee"
              value={summary.avgMeetingsPerAttendee.toFixed(2)}
            />
            <MetricCard
              title="Buyers %"
              value={formatPercent(summary.buyersPct)}
            />
            <MetricCard
              title="Sellers %"
              value={formatPercent(summary.sellersPct)}
            />
          </div>

          <div className="chart-card">
            <div className="section-header">
              <h2>Registration Trend</h2>
              <p>
                Cumulative registrations from Day -90 to Day 0 for each event.
              </p>
            </div>
            <div className="chart-box">
              {registrationChartData ? (
                <RegistrationTrendChart data={registrationChartData} />
              ) : null}
            </div>
          </div>

          <div className="chart-grid">
            <div className="chart-card">
              <div className="section-header">
                <h2>Attendee Groups</h2>
                <p>
                  Compare audience composition across all events by attendee
                  group.
                </p>
              </div>
              <div className="chart-box">
                {attendeeGroupChartData ? (
                  <AttendeeGroupChart data={attendeeGroupChartData} />
                ) : null}
              </div>
            </div>
          </div>

          <div className="table-section">
            <div className="section-header">
              <h2>Event Comparison Table</h2>
              <p>
                Side-by-side overview of attendees, companies, meetings, and
                intent mix.
              </p>
            </div>
            <EventComparisonTable events={eventMetrics} />
          </div>
        </>
      )}
    </div>
  );
}

export default ComparisonPage;