function formatDayLabel(day) {
    return `Day ${day}`;
  }
  
  function diffInDays(dateA, dateB) {
    const a = new Date(dateA);
    const b = new Date(dateB);
  
    const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utcA - utcB) / (1000 * 60 * 60 * 24));
  }
  
  function safeKey(value, fallback = "Unknown") {
    const v = String(value || "").trim();
    return v || fallback;
  }
  
  function groupRowsByEvent(rows) {
    return rows.reduce((acc, row) => {
      const eventName = safeKey(row.eventName, "Unnamed Event");
      if (!acc[eventName]) acc[eventName] = [];
      acc[eventName].push(row);
      return acc;
    }, {});
  }
  
  function countBy(rows, fieldName, fallback = "Unknown") {
    return rows.reduce((acc, row) => {
      const key = safeKey(row[fieldName], fallback);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }
  
  function buildIntentCounts(rows) {
    const counts = {
      buyersOnly: 0,
      sellersOnly: 0,
      both: 0,
      neither: 0,
    };
  
    rows.forEach((row) => {
      const buyer = !!row.exploringBuying;
      const seller = !!row.offeringSelling;
  
      if (buyer && seller) counts.both += 1;
      else if (buyer) counts.buyersOnly += 1;
      else if (seller) counts.sellersOnly += 1;
      else counts.neither += 1;
    });
  
    return counts;
  }
  
  function buildRegistrationTrend(rows, maxDaysPrior = 90) {
    const counts = {};
    for (let day = -maxDaysPrior; day <= 0; day += 1) {
      counts[day] = 0;
    }
  
    rows.forEach((row) => {
      if (!row.joinedAt || !row.eventDate) return;
  
      const relativeDay = diffInDays(row.joinedAt, row.eventDate);
  
      if (relativeDay >= -maxDaysPrior && relativeDay <= 0) {
        counts[relativeDay] += 1;
      }
    });
  
    let runningTotal = 0;
    const cumulative = {};
  
    for (let day = -maxDaysPrior; day <= 0; day += 1) {
      runningTotal += counts[day];
      cumulative[day] = runningTotal;
    }
  
    return cumulative;
  }
  
  function buildEventSummary(eventName, rows, maxDaysPrior = 90) {
    const uniqueCompanies = new Set(
      rows.map((row) => safeKey(row.companyName, "")).filter(Boolean)
    );
  
    const totalMeetings = rows.reduce(
      (sum, row) => sum + (Number(row.numberOfMeetings) || 0),
      0
    );
  
    const attendeesWithMeetings = rows.filter(
      (row) => (Number(row.numberOfMeetings) || 0) > 0
    ).length;
  
    const buyers = rows.filter((row) => row.exploringBuying).length;
    const sellers = rows.filter((row) => row.offeringSelling).length;
  
    const eventDate =
      rows.find((row) => row.eventDate)?.eventDate || null;
  
    return {
      eventName,
      eventDate,
      totalAttendees: rows.length,
      uniqueCompanies: uniqueCompanies.size,
      totalMeetings,
      avgMeetingsPerAttendee: rows.length ? totalMeetings / rows.length : 0,
      attendeesWithMeetings,
      attendeesWithMeetingsPct: rows.length
        ? attendeesWithMeetings / rows.length
        : 0,
      buyers,
      sellers,
      buyersPct: rows.length ? buyers / rows.length : 0,
      sellersPct: rows.length ? sellers / rows.length : 0,
      attendeeGroupCounts: countBy(rows, "attendeeGroup", "Unknown"),
      operatesInCounts: countBy(rows, "operatesIn", "Unknown"),
      intentCounts: buildIntentCounts(rows),
      registrationTrend: buildRegistrationTrend(rows, maxDaysPrior),
    };
  }
  
  export function buildComparisonMetrics(rows, maxDaysPrior = 90) {
    const grouped = groupRowsByEvent(rows);
  
    return Object.entries(grouped).map(([eventName, eventRows]) =>
      buildEventSummary(eventName, eventRows, maxDaysPrior)
    );
  }
  
  export function buildRegistrationChartData(eventMetrics, maxDaysPrior = 90) {
    const dayOffsets = [];
    for (let day = -maxDaysPrior; day <= 0; day += 1) {
      dayOffsets.push(day);
    }
  
    const labels = dayOffsets.map(formatDayLabel);
    const colors = [
      "#2563EB",
      "#059669",
      "#D97706",
      "#7C3AED",
      "#DC2626",
      "#0891B2",
      "#65A30D",
      "#9333EA",
    ];
  
    const datasets = eventMetrics.map((event, index) => ({
      label: event.eventName,
      data: dayOffsets.map((day) => event.registrationTrend[day] ?? 0),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length],
      tension: 0.25,
      fill: false,
    }));
  
    return { labels, datasets };
  }
  
  export function buildAttendeeGroupChartData(eventMetrics) {
    const allGroups = Array.from(
      new Set(
        eventMetrics.flatMap((event) => Object.keys(event.attendeeGroupCounts))
      )
    );
  
    const colors = [
      "#2563EB",
      "#059669",
      "#D97706",
      "#7C3AED",
      "#DC2626",
      "#0891B2",
      "#65A30D",
      "#9333EA",
    ];
  
    return {
      labels: allGroups,
      datasets: eventMetrics.map((event, index) => ({
        label: event.eventName,
        data: allGroups.map((group) => event.attendeeGroupCounts[group] || 0),
        backgroundColor: colors[index % colors.length],
      })),
    };
  }
  
  export function buildBuyerSellerChartData(eventMetrics) {
    return {
      labels: eventMetrics.map((event) => event.eventName),
      datasets: [
        {
          label: "Buyers only",
          data: eventMetrics.map((event) => event.intentCounts.buyersOnly || 0),
          backgroundColor: "#2563EB",
        },
        {
          label: "Sellers only",
          data: eventMetrics.map((event) => event.intentCounts.sellersOnly || 0),
          backgroundColor: "#059669",
        },
        {
          label: "Both",
          data: eventMetrics.map((event) => event.intentCounts.both || 0),
          backgroundColor: "#D97706",
        },
        {
          label: "Neither",
          data: eventMetrics.map((event) => event.intentCounts.neither || 0),
          backgroundColor: "#94A3B8",
        },
      ],
    };
  }