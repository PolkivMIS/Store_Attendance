console.log("✅ script.js loaded");

// 🟢 Load employee names
document.addEventListener("DOMContentLoaded", () => {
  const sheetId = "16knrcUaOpvowE47mnZpQyNPzv_bllefjT7KutH9qFkA";
  const apiKey = "AIzaSyAdTHSdfP8oBGj0zR_TOIEWO6ETRJGfBoM";
  const range = "EMPLOYEE INFO!A2:A";
  const employeeDropdown = document.getElementById("employee");
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.values) {
        data.values.forEach(row => {
          const option = document.createElement("option");
          option.value = row[0];
          option.textContent = row[0];
          employeeDropdown.appendChild(option);
        });
        console.log("✅ Employee list loaded");
      } else {
        console.warn("⚠️ No employee data found");
      }
    })
    .catch(err => console.error("Error loading employees:", err));
});

// 📸 Convert photo to Base64
document.getElementById("photo").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) {
    console.warn("❌ No file selected");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = function () {
    const base64 = reader.result.split(",")[1];
    document.getElementById("photoData").value = base64;
    console.log("✅ Base64 generated, length:", base64.length);
  };
  reader.readAsDataURL(file);
});

// 🧭 Form Submit Handler
document.getElementById("attendanceForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const photoData = document.getElementById("photoData").value;
  const employee = document.getElementById("employee").value;

  // ✅ Timestamp IST
  const now = new Date();
  document.getElementById("timestamp").value = now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  if (!employee || employee === "Select Employee") {
    alert("Please select an employee");
    return;
  }
  if (!photoData) {
    alert("Please select a photo");
    return;
  }

  console.log("📤 Submitting form. Base64 present:", photoData.length > 0);

  // ✅ Get location then submit
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        document.getElementById("latitude").value = pos.coords.latitude;
        document.getElementById("longitude").value = pos.coords.longitude;
        console.log("📍 Location captured");
        event.target.submit();
      },
      () => {
        console.warn("⚠️ Location unavailable. Submitting without it.");
        document.getElementById("latitude").value = "Unavailable";
        document.getElementById("longitude").value = "Unavailable";
        event.target.submit();
      },
      { 
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 0
      }
    );
  } else {
    console.warn("⚠️ Geolocation not supported");
    document.getElementById("latitude").value = "Unsupported";
    document.getElementById("longitude").value = "Unsupported";
    event.target.submit();
  }
});

