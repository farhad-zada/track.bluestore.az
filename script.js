const baseUrl = "http://testapi.bluestore.az";
let allClothes = []; // Store full dataset for filtering
function getCost(item) {
  return item.fabric_cost + item.labor_cost + item.other_cost;
}
// Render clothes items
function renderClothes(clothes) {
  const grid = document.getElementById("clothes-grid");
  grid.innerHTML = "";

  clothes.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "item";
    itemElement.innerHTML = `
        <div class="item-content">
          <img src="${item.image}" alt="${item.name}" class="item-image">
          <div class="item-details">
            <div class="item-name">${item.name}</div>
            <div class="item-code">Code: ${item.code}</div>
           <div class="item-stats">
              <span class="item-price">₼${item.price}</span>
              <span class="item-cost">Cost: ₼${getCost(item)}</span>
              <span class="item-sold">Sold: ${item.sold}</span>
            </div>
          </div>
        </div>
      `;

    itemElement.addEventListener("click", () => openModal(item));
    grid.appendChild(itemElement);
  });
}

// Show custom alert
function showAlert(message, type = "success") {
  const alertContainer = document.getElementById("alert-container");
  const alertElement = document.createElement("div");
  alertElement.className = `alert ${type}`;
  alertElement.innerHTML = `
      <span class="alert-message">${message}</span>
      <span class="alert-close">×</span>
    `;

  alertContainer.appendChild(alertElement);
  setTimeout(() => alertElement.remove(), 3000);
  alertElement.querySelector(".alert-close").onclick = () =>
    alertElement.remove();
}

// Open modal
function openModal(item) {
  const modal = document.getElementById("item-modal");
  const modalContent = document.getElementById("modal-item-content");
  const confirmBtn = document.getElementById("confirm-btn");

  modalContent.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="item-image">
      <div class="item-name">${item.name}</div>
      <div class="item-code">Code: ${item.code}</div>
      <div class="item-stats">
        <span class="item-price">₼${item.price}</span>
        <span class="item-cost">Cost: ₼${getCost(item)}</span>
        <span class="item-sold">Sold: ${item.sold}</span>
      </div>
    `;

  modal.style.display = "flex";

  document.querySelector(".close").onclick = () =>
    (modal.style.display = "none");
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };

  confirmBtn.onclick = async () => {
    try {
      const response = await fetch(baseUrl + "/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clothe_id: item.id }),
      });
      if (!response.ok) throw new Error("Failed to submit order");

      showAlert("Order confirmed successfully!", "success");
      modal.style.display = "none";

      // Refetch data to update the screen
      await fetchClothes(document.getElementById("search-bar").value.trim());
    } catch (error) {
      console.error("Error submitting order:", error);
      showAlert("Failed to confirm order. Please try again.", "error");
    }
  };
}

// Fetch clothes from API
async function fetchClothes(query = "") {
  const grid = document.getElementById("clothes-grid");
  grid.innerHTML = "<div class='loading'>Loading...</div>";

  try {
    const url = query
      ? `${baseUrl}/clothes?query=${encodeURIComponent(query)}`
      : `${baseUrl}/clothes`;
    console.log(url);
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    allClothes = data; // Store full dataset
    renderClothes(data);
  } catch (error) {
    console.error("Error fetching clothes:", error);
    grid.innerHTML =
      "<div class='error'>Failed to load clothes. Showing dummy data instead.</div>";
    allClothes = dummyData;
    renderClothes([]);
  }
}
// Search functionality
function performSearch() {
  const query = document.getElementById("search-bar").value.trim();
  if (query) {
    fetchClothes(query); // Send query to localhost:3000/clothes
  } else {
    fetchClothes(); // Reset to full list if query is empty
  }
}
// Button click search
document.getElementById("search-btn").addEventListener("click", performSearch);

// Enter key search
document.getElementById("search-bar").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    performSearch();
  }
});

// Load clothes on page load
window.onload = () => fetchClothes();
