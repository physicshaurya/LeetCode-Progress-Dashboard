import {
  webAppUrl,
  countRevisions,
  calculateStreak,
  updateTableWithFilter,
  updateCountWithFilter,
  renderRevisionChart,
  fetchData
} from "./utils.js";

// Declare a global variable to store the fetched data
let data = [];

document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Fetch data and wait for the response
    data = await fetchData(webAppUrl);

    console.log(data);
    // Calculate streak
    const streak = calculateStreak(data);
    document.getElementById("streakDays").textContent = streak;

    // Proceed after data is fetched
    updateTableWithFilter(data, 'all');
    updateCountWithFilter(data, 'all');


    // Calculate revision counts for the chart
    const revisionCounts = countRevisions(data);
    renderRevisionChart(revisionCounts);

    // Apply filters
    const statusFilter = document.getElementById("statusFilter");
    statusFilter.addEventListener("change", (e) => {
      const selectedStatus = e.target.value.toLowerCase(); // Normalize filter to lowercase
      updateTableWithFilter(data, selectedStatus);
      updateCountWithFilter(data, selectedStatus);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
