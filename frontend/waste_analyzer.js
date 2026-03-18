//  SUBMIT WASTE DATA
document.getElementById("wasteForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const userId = localStorage.getItem("userId"); // Must be set on login!
  const foodName = document.getElementById("foodName").value.trim();
  const produced = parseFloat(document.getElementById("produced").value);
  const wasted = parseFloat(document.getElementById("wasted").value);
  const persons = parseInt(document.getElementById("persons").value);
  const mealType = document.getElementById("mealType").value;
  const occasion = document.getElementById("occasion").value;

  if (!userId) {
    alert("Please log in first!");
    return;
  }

  try {
    const res = await fetch("http://localhost:5500/api/waste-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        foodName,
        produced,
        quantityWastedKg: wasted,
        persons,
        mealType,
        occasion
      })
    });

    const data = await res.json();
    document.getElementById("submitStatus").innerText = data.message || "Data submitted!";
  } catch (error) {
    console.error("Submit failed:", error);
    document.getElementById("submitStatus").innerText = "❌ Error submitting data";
  }
});

// VIEW WEEKLY WASTE CHART (Group by Food Item)
async function fetchChart() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Please log in to view your analysis.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:5500/api/waste-data/${userId}`);
    const chartData = await res.json();

    //  Update: chartData is now grouped by food name (_id = food name)
    const labels = chartData.map(item => item._id); // food names
    const values = chartData.map(item => item.totalWaste); // waste in kg

    const ctx = document.getElementById("wasteChart").getContext("2d");
    if (window.barChart) window.barChart.destroy(); // remove previous chart

    window.barChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Total Waste per Item (kg)",
          data: values,
          backgroundColor: "#7b4fff",
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Waste (kg)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Food Item'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Food Waste Analysis (Last 7 Days)',
            font: {
              size: 18
            }
          }
        }
      }
    });

  } catch (error) {
    console.error("Chart fetch failed:", error);
    alert("❌ Failed to fetch analysis.");
  }
}
