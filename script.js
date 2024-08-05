document.addEventListener("DOMContentLoaded", () => {
  hideLoader();
});

const tiers = {
  "Black Diamond": 1000,
  Gold: 750,
  Platinum: 500,
  Silver: 300,
  Bronze: 150,
  Nickel: 70,
};

const form = document.getElementById("upgradeForm");
const resultDiv = document.getElementById("result");
const overlay = document.getElementById("overlay");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const tier = document.getElementById("tier").value;
  const amount = tiers[tier];

  if (!email || !tier) {
    displayResult({ error: "Please provide both email and tier." });
    return;
  }

  if (amount === undefined) {
    displayResult({ error: "Invalid tier selected." });
    return;
  }

  const data = {
    email,
    amount,
  };

  showLoader();

  try {
    console.log("Sending request with data:", data);
    const response = await fetch("http://localhost:3000/upgrade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }
    const result = await response.json();
    console.log("Received result:", result);
    displayResult({
      serverResponse: result,
    });
  } catch (error) {
    console.error("Error in submit handler:", error);
    displayResult({ error: error.message });
  } finally {
    hideLoader();
  }
});

function showLoader() {
  overlay.classList.remove("hidden");
  form
    .querySelectorAll("input, select, button")
    .forEach((el) => (el.disabled = true));
}

function hideLoader() {
  overlay.classList.add("hidden");
  form
    .querySelectorAll("input, select, button")
    .forEach((el) => (el.disabled = false));
}

function displayResult(result) {
  if (result.error) {
    resultDiv.innerHTML = `<span style="color: red;">Error: ${result.error}</span>`;
  } else {
    resultDiv.innerHTML = `<span style="color: green;">Success!</span><br><pre>${JSON.stringify(
      result,
      null,
      2
    )}</pre>`;
  }
}
