// Dummy data with sold field
const dummyData = [
    { name: "Shirt", code: "S123", price: 20, cost: 15, image: "https://via.placeholder.com/300x200?text=Shirt", sold: 12 },
    { name: "Pants", code: "P456", price: 30, cost: 25, image: "https://via.placeholder.com/300x200?text=Pants", sold: 8 },
    { name: "Jacket", code: "J789", price: 50, cost: 40, image: "https://via.placeholder.com/300x200?text=Jacket", sold: 5 },
    { name: "T-Shirt", code: "T012", price: 15, cost: 10, image: "https://via.placeholder.com/300x200?text=T-Shirt", sold: 20 }
  ];
  
  let allClothes = []; // Store full dataset for filtering
  
  // Render clothes items
  function renderClothes(clothes) {
    const grid = document.getElementById("clothes-grid");
    grid.innerHTML = "";
  
    clothes.forEach(item => {
      const itemElement = document.createElement("div");
      itemElement.className = "item";
      itemElement.innerHTML = `
        <div class="item-content">
          <img src="${item.image}" alt="${item.name}" class="item-image">
          <div class="item-details">
            <div class="item-name">${item.name}</div>
            <div class="item-code">Code: ${item.code}</div>
            <div class="item-price">$${item.price}</div>
            <div class="item-cost">Cost: $${item.cost}</div>
            <div class="item-sold">Sold: ${item.sold}</div>
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
    alertElement.querySelector(".alert-close").onclick = () => alertElement.remove();
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
      <div class="item-price">$${item.price}</div>
      <div class="item-cost">Cost: $${item.cost}</div>
      <div class="item-sold">Sold: ${item.sold}</div>
    `;
  
    modal.style.display = "flex";
  
    document.querySelector(".close").onclick = () => modal.style.display = "none";
    window.onclick = (e) => {
      if (e.target === modal) modal.style.display = "none";
    };
  
    confirmBtn.onclick = async () => {
      try {
        const response = await fetch("http://5.230.71.232:3000/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clothe_id: item.code })
        });
  
        if (!response.ok) throw new Error("Failed to submit order");
  
        showAlert("Order confirmed successfully!", "success");
        modal.style.display = "none";
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
      const url = query ? `http://5.230.71.232:3000/clothes?query=${encodeURIComponent(query)}` : "http://5.230.71.232:3000/clothes";
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
  
      if (!response.ok) throw new Error("Failed to fetch data");
  
      const data = await response.json();
      allClothes = data; // Store full dataset
      renderClothes(data);
    } catch (error) {
      console.error("Error fetching clothes:", error);
      grid.innerHTML = "<div class='error'>Failed to load clothes. Showing dummy data instead.</div>";
      allClothes = dummyData;
      renderClothes(dummyData);
    }
  }
  
  // Search functionality
  document.getElementById("search-btn").addEventListener("click", () => {
    const query = document.getElementById("search-bar").value.trim();
    if (query) {
      fetchClothes(query); // Send query to localhost:3000/clothes
    } else {
      fetchClothes(); // Reset to full list if query is empty
    }
  });
  
  // Load clothes on page load
  window.onload = () => fetchClothes();