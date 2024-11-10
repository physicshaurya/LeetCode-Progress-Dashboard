export const webAppUrl =
  "https://script.google.com/macros/s/AKfycbz_cPP7KF1NCz7TV9_8Dut9ax_irok9l50qPK4QxmHNNolonxXgX0_yzKGcWpeWTmZ5FA/exec"; // Replace with your actual Web App URL


// Function to fetch data from the given URL and store it in the global `data` variable
export async function fetchData(url) {
  try {
    const response = await fetch(url);
    const fetchedData = await response.json();
    return fetchedData; // Ensure data is returned
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error to propagate it
  }
}

// Function to update the table with formatted data
export function updateTableWithFilter(data, filter) {
  const tableBody = document
    .getElementById("progressTable")
    .getElementsByTagName("tbody")[0];

  // Clear existing rows in the table
  tableBody.innerHTML = "";

  // Format dates and add rows to the table
  data.forEach((item) => {
    item["Date"] = item["Date"].length > 11 ? formatDate(item["Date"]) : item["Date"];
    item["Attempt 2"] = item["Attempt 2"].length > 11 ? formatDate(item["Attempt 2"]) : item["Attempt 2"];
    item["Attempt 3"] = item["Attempt 3"].length > 11 ? formatDate(item["Attempt 3"]) : item["Attempt 3"];

    if (filter === 'all' || item["Revision Required"].toLowerCase() === filter) {
      const row = createTableRow(item);
      tableBody.appendChild(row);
    }
  });
}

// Function to create a table row for a given item
function createTableRow(item) {
  const row = document.createElement("tr");

  // Add each item's values as a table cell
  Object.values(item).forEach((text) => {
    const cell = document.createElement("td");
    cell.textContent = text;
    row.appendChild(cell);
  });

  return row;
}

// Function to update the total count displayed on the page
export function updateCountWithFilter(data, filter) {
  let rowCount = 0;

  // Format dates and add rows to the table
  data.forEach((item) => {
    if (filter === 'all' || item["Revision Required"].toLowerCase() === filter) {
      rowCount++;
    }
  });

  document.getElementById("count").textContent = rowCount;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr); // Convert string to Date object
  const day = String(date.getUTCDate()).padStart(2, "0"); // Get day and pad with 0 if needed
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Get month (0-indexed) and pad
  const year = date.getUTCFullYear(); // Get full year

  return `${day}/${month}/${year}`; // Return formatted date as DD/MM/YYYY
}

export function countRevisions(data) {
  // Initialize counts for all possible categories
  const revisionCounts = {
    "Yes": 0,
    "No": 0,
    "Only Attempted": 0,
    "Can Try": 0,
    "Only Read": 0,
    "Reading Article": 0,
  };

  // Count each item's "Revision Required" status
  data.forEach((item) => {
    const status = item["Revision Required"];
    if (revisionCounts[status] !== undefined) {
      revisionCounts[status]++;
    }
  });

  return revisionCounts;
}

export function calculateStreak(data) {
  let streak = 0;

  const today = new Date();
  let currDate = today;

  let allDateArray = [];

  // Iterate through the data and convert date strings to Date objects if necessary
  data.forEach((item) => {
    Object.values(item).forEach((val) => {
      if (typeof val === "string" && !isNaN(Date.parse(val))) {
        // If it's a valid date string, convert it to a Date object
        val = new Date(val);
      }
      if (val instanceof Date) {
        allDateArray.push(val);
      }
    });
  });

  // Sort the array of dates in descending order (newest first)
  allDateArray.sort((a, b) => b - a);

  let streakFlag = true;

  // Iterate through the sorted dates and calculate the streak
  allDateArray.forEach((dateVal) => {
    if (streakFlag === true && dateVal.getDate() === currDate.getDate()) {
      streak++;
      // Decrement the date by one day for the next iteration
      currDate.setDate(currDate.getDate() - 1);
    }
    else if(streakFlag === true && dateVal.getDate() > currDate.getDate() - 1){ // If multiple problems are solved on same day
      // Pass 
    }
    else {
      streakFlag = false; // Break the loop when the date sequence is interrupted
    }
  });

  return streak;
}




// Function to render the revision chart
export function renderRevisionChart(revisionCounts) {
  const ctx = document.getElementById("revisionChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: [
        "Yes",
        "No",
        "Only Attempted",
        "Can Try",
        "Only Read",
        "Reading Article",
      ],
      datasets: [
        {
          label: "Revision Required",
          data: [
            revisionCounts["Yes"] || 0,
            revisionCounts["No"] || 0,
            revisionCounts["Only Attempted"] || 0,
            revisionCounts["Can Try"] || 0,
            revisionCounts["Only Read"] || 0,
            revisionCounts["Reading Article"] || 0,
          ],
          backgroundColor: [
            "#FF6384", // Yes
            "#36A2EB", // No
            "#FFCE56", // Only Attempted
            "#4BC0C0", // Can Try
            "#9966FF", // Only Read
            "#FF9F40", // Reading Article
          ],
        },
      ],
    },
    options: {
      responsive: true, // Makes the chart responsive
      maintainAspectRatio: false, // Ensures the chart resizes according to canvas size
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw}`;
            },
          },
        },
      },
    },
  });
}
