document.getElementById("showPwd").addEventListener("change", togglePassword);
document.getElementById("checkPasswordBtn").addEventListener("click", checkPassword);
document.getElementById("checkUrlBtn").addEventListener("click", checkURL);

function togglePassword() {
  const pwdInput = document.getElementById("password");
  pwdInput.type = pwdInput.type === "password" ? "text" : "password";
}

function checkPassword() {
  const pwd = document.getElementById("password").value || "";
  let score = 0;
  let suggestions = [];

  if (pwd.length >= 8) score++; else suggestions.push("Use at least 8 characters");
  if (/[A-Z]/.test(pwd)) score++; else suggestions.push("Add an uppercase letter (A–Z)");
  if (/[a-z]/.test(pwd)) score++; else suggestions.push("Add a lowercase letter (a–z)");
  if (/[0-9]/.test(pwd)) score++; else suggestions.push("Add a number (0–9)");
  if (/[^A-Za-z0-9]/.test(pwd)) score++; else suggestions.push("Add a special symbol (!@#$)");

  const meter = document.getElementById("meterFill");
  let html = "";

  if (pwd.length === 0) {
    meter.style.width = "0%";
    html = "Enter a password to analyze.";
  } else if (score <= 2) {
    meter.style.width = "30%";
    meter.style.background = "#ef4444";
    html = "❌ Weak password. Improve it:";
  } else if (score <= 4) {
    meter.style.width = "65%";
    meter.style.background = "#f59e0b";
    html = "🙂 Medium password. Make it stronger:";
  } else {
    meter.style.width = "100%";
    meter.style.background = "#22c55e";
    html = "💪 Strong password! Looks good.";
  }

  if (suggestions.length && score < 5) {
    html += "<ul class='list'>" + suggestions.map(s => `<li>${s}</li>`).join("") + "</ul>";
  }

  document.getElementById("passResult").innerHTML = html;
}

function checkURL() {
  const raw = document.getElementById("url").value.trim();

  if (!raw) {
    document.getElementById("urlResult").innerHTML = "Paste a URL to analyze.";
    return;
  }

  let urlObj;
  try {
    urlObj = new URL(raw);
  } catch (e) {
    document.getElementById("urlResult").innerHTML =
      "❌ This is NOT a valid URL.<br>👉 Example: https://example.com";
    return;
  }

  const url = raw.toLowerCase();
  const domain = urlObj.hostname;

  let reasons = [];
  let tags = [];

  if (url.includes("bit.ly") || url.includes("tinyurl") || url.includes("t.co")) {
    tags.push("Shortened link");
    reasons.push("Short links hide the real destination");
  } 
  else if (/\d+\.\d+\.\d+\.\d+/.test(url)) {
    tags.push("IP-based link");
    reasons.push("Uses IP address instead of a domain name");
  } 
  else if (domain.includes("google.com") || domain.includes("github.com") || domain.includes("microsoft.com")) {
    tags.push("Known website");
  } 
  else {
    tags.push("Normal website");
  }

  if (!url.startsWith("https://")) {
    reasons.push("Not using HTTPS (connection not encrypted)");
  }

  const phishingWords = ["login", "verify", "secure", "account", "update", "reset"];
  phishingWords.forEach(w => {
    if (url.includes(w)) reasons.push(`Contains phishing keyword: "${w}"`);
  });

  if ((url.match(/\./g) || []).length > 3) {
    reasons.push("Too many dots (often seen in fake domains)");
  }

  let html = `<div>🌐 Domain: <b>${domain}</b></div>`;
  html += tags.map(t => `<span class="tag">${t}</span>`).join("");

  if (reasons.length) {
    html += "<div style='margin-top:8px'>⚠️ Suspicious link. Reasons:</div>";
    html += "<ul class='list'>" + reasons.map(r => `<li>${r}</li>`).join("") + "</ul>";
  } else {
    html += "<div style='margin-top:8px'>✅ Looks safe (basic checks passed).</div>";
  }

  document.getElementById("urlResult").innerHTML = html;
}