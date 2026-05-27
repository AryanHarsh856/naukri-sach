// ==========================================
// FAKE COMPANY DATABASE
// ==========================================
const knownScamCompanies = [
  { name: "shine hr solutions", type: "Registration Fee", details: "Asks for 2000 registration fee after fake offer letter" },
  { name: "global tech recruiters", type: "Ghost Company", details: "Company does not exist on MCA India" },
  { name: "work from home india", type: "Data Entry Scam", details: "Fake data entry job scam" },
  { name: "bright future consultancy", type: "MLM Scheme", details: "MLM chain marketing disguised as job" },
  { name: "easy jobs india", type: "Registration Fee", details: "Collects money then disappears" },
  { name: "digital india jobs", type: "Fake Offer Letter", details: "Sends fake government looking offer letters" },
  { name: "home based jobs india", type: "Data Entry Scam", details: "Classic data entry scam" },
  { name: "national recruitment services", type: "Registration Fee", details: "Fake recruitment agency asking for fees" },
];

// ==========================================
// RED FLAGS DATABASE
// ==========================================
const redFlags = [
  { phrase: 'work from home', message: 'Claims easy work from home — common in fake offers', weight: 10 },
  { phrase: 'no experience needed', message: 'No experience needed — suspicious for high paying jobs', weight: 10 },
  { phrase: 'earn 50000', message: 'Unrealistic salary promise', weight: 15 },
  { phrase: 'earn 1 lakh', message: 'Unrealistic salary promise', weight: 15 },
  { phrase: 'guaranteed income', message: 'Guaranteed income — no real job guarantees this', weight: 20 },
  { phrase: 'registration fee', message: 'Asking for registration fee — major red flag', weight: 25 },
  { phrase: 'pay to join', message: 'Asking you to pay — real companies never do this', weight: 25 },
  { phrase: 'deposit required', message: 'Asking for deposit — this is a scam pattern', weight: 25 },
  { phrase: 'gmail.com', message: 'HR using Gmail instead of company email — suspicious', weight: 15 },
  { phrase: 'yahoo.com', message: 'HR using Yahoo instead of company email — suspicious', weight: 15 },
  { phrase: 'whatsapp only', message: 'Communication only on WhatsApp — not professional', weight: 15 },
  { phrase: 'limited seats', message: 'Creating fake urgency with limited seats', weight: 10 },
  { phrase: 'act now', message: 'Pressure tactics — real jobs do not rush you', weight: 10 },
  { phrase: 'no interview', message: 'Job offer without interview — very suspicious', weight: 20 },
  { phrase: 'data entry', message: 'Vague data entry jobs are commonly fake', weight: 10 },
  { phrase: 'part time', message: 'Vague part time offers are commonly fake', weight: 8 },
  { phrase: 'be your own boss', message: 'MLM style language — be careful', weight: 12 },
  { phrase: 'unlimited earning', message: 'Unlimited earning claims are unrealistic', weight: 15 },
  { phrase: 'work from mobile', message: 'Work from mobile — very common in scam offers', weight: 15 },
  { phrase: 'daily payment', message: 'Daily payment promises are unrealistic', weight: 12 },
  { phrase: 'weekly payment', message: 'Unusual payment frequency — verify carefully', weight: 8 },
  { phrase: 'urgently required', message: 'Fake urgency — pressure tactic', weight: 8 },
  { phrase: 'immediate joining', message: 'Immediate joining without process — suspicious', weight: 10 },
  { phrase: 'no qualification', message: 'No qualification needed for high pay — red flag', weight: 12 },
  { phrase: 'simple copy paste', message: 'Copy paste jobs are almost always fake', weight: 20 },
  { phrase: 'form filling', message: 'Form filling jobs are commonly scams', weight: 20 },
  { phrase: 'investment required', message: 'Any investment required is a scam pattern', weight: 25 },
];

// ==========================================
// UPDATE STATS
// ==========================================
function updateStats() {
  const reports = getReports();
  document.getElementById('totalReports').textContent = reports.length + knownScamCompanies.length;
  document.getElementById('totalSaved').textContent = (reports.length + knownScamCompanies.length) * 12 + '+';
}

// ==========================================
// ANALYZE JOB OFFER
// ==========================================
function analyzeJob() {
  const input = document.getElementById('jobInput').value.toLowerCase();
  const resultBox = document.getElementById('result');

  if (input.trim() === '') {
    resultBox.className = 'result-box warning';
    resultBox.innerHTML = '⚠️ Please paste a job description first.';
    resultBox.classList.remove('hidden');
    return;
  }

  let found = [];
  let totalScore = 0;

  redFlags.forEach(flag => {
    if (input.includes(flag.phrase)) {
      found.push(flag);
      totalScore += flag.weight;
    }
  });

  totalScore = Math.min(totalScore, 100);
  resultBox.classList.remove('hidden', 'safe', 'warning', 'danger');

  let barColor = '#28a745';
  let verdict = '';
  let emoji = '';

  if (totalScore === 0) {
    barColor = '#28a745';
    verdict = 'Looks Safe';
    emoji = '✅';
    resultBox.className = 'result-box safe';
  } else if (totalScore <= 30) {
    barColor = '#ffc107';
    verdict = 'Slightly Suspicious';
    emoji = '⚠️';
    resultBox.className = 'result-box warning';
  } else if (totalScore <= 60) {
    barColor = '#fd7e14';
    verdict = 'Very Suspicious';
    emoji = '🚨';
    resultBox.className = 'result-box danger';
  } else {
    barColor = '#dc3545';
    verdict = 'Almost Certainly Fake!';
    emoji = '🚨';
    resultBox.className = 'result-box danger';
  }

  const flagsList = found.length > 0
    ? found.map(f => `<li>🔴 ${f.message}</li>`).join('')
    : '<li>✅ No red flags detected</li>';

  const checklist = `
    <div class="checklist">
      <strong>📋 Always Verify These Before Accepting:</strong>
      <ul>
        <li><input type="checkbox"> Company exists on <a href="https://www.mca.gov.in/content/mca/global/en/mca/master-data/MDS.html" target="_blank">MCA India</a></li>
        <li><input type="checkbox"> HR email matches company domain (not Gmail/Yahoo)</li>
        <li><input type="checkbox"> Company has a real website with contact details</li>
        <li><input type="checkbox"> Offer letter is on company letterhead</li>
        <li><input type="checkbox"> No money asked from you at any point</li>
        <li><input type="checkbox"> You can find the company on LinkedIn</li>
      </ul>
    </div>
  `;

  resultBox.innerHTML = `
    <h2>${emoji} ${verdict}</h2>
    <div class="score-section">
      <div class="score-label">
        <span>Suspicion Score</span>
        <span><strong>${totalScore}/100</strong></span>
      </div>
      <div class="score-bar-bg">
        <div class="score-bar-fill" style="width: ${totalScore}%; background: ${barColor};"></div>
      </div>
    </div>
    ${found.length > 0 ? `
      <div class="flags-found">
        <strong>🚩 Red Flags Found (${found.length})</strong>
        <ul>${flagsList}</ul>
      </div>
    ` : ''}
    ${checklist}
  `;
}

// ==========================================
// SEARCH COMPANY
// ==========================================
function searchCompany() {
  const query = document.getElementById('companySearch').value.toLowerCase().trim();
  const resultBox = document.getElementById('searchResult');

  if (query === '') {
    resultBox.className = 'result-box warning';
    resultBox.innerHTML = '⚠️ Please enter a company name to search.';
    resultBox.classList.remove('hidden');
    return;
  }

  const builtIn = knownScamCompanies.filter(c => c.name.includes(query));
  const userReports = getReports().filter(r =>
    r.companyName.toLowerCase().includes(query)
  );

  const allResults = [
    ...builtIn.map(c => ({
      companyName: c.name,
      scamType: c.type,
      details: c.details,
      source: 'Our Database'
    })),
    ...userReports.map(r => ({
      companyName: r.companyName,
      scamType: r.scamType,
      details: r.details,
      source: 'User Report'
    }))
  ];

  resultBox.classList.remove('hidden', 'safe', 'warning', 'danger');

  if (allResults.length === 0) {
    resultBox.className = 'result-box safe';
    resultBox.innerHTML = `
      ✅ <strong>No reports found for "${query}"</strong><br><br>
      This company has not been reported yet. Still verify on
      <a href="https://www.mca.gov.in/content/mca/global/en/mca/master-data/MDS.html" target="_blank">MCA India</a>
      before proceeding.
    `;
  } else {
    resultBox.className = 'result-box danger';
    resultBox.innerHTML = `
      🚨 <strong>${allResults.length} Report(s) Found for "${query}"</strong><br><br>
      ${allResults.map(r => `
        <div style="background:rgba(0,0,0,0.05); padding:12px; border-radius:8px; margin-bottom:10px;">
          <strong>${r.companyName.toUpperCase()}</strong><br>
          <span style="font-size:12px; color:#dc3545;">● ${r.scamType}</span> &nbsp;
          <span style="font-size:12px; color:#888;">[${r.source}]</span><br>
          <span style="font-size:13px;">${r.details}</span>
        </div>
      `).join('')}
    `;
  }
}

// ==========================================
// SUBMIT REPORT
// ==========================================
function submitReport() {
  const companyName = document.getElementById('companyName').value.trim();
  const companyContact = document.getElementById('companyContact').value.trim();
  const scamType = document.getElementById('scamType').value;
  const details = document.getElementById('scamDetails').value.trim();
  const resultBox = document.getElementById('reportResult');

  if (!companyName || !scamType) {
    resultBox.className = 'result-box warning';
    resultBox.innerHTML = '⚠️ Please fill in Company Name and Scam Type.';
    resultBox.classList.remove('hidden');
    return;
  }

  const report = {
    companyName,
    companyContact,
    scamType,
    details: details || 'No details provided',
    date: new Date().toLocaleDateString('en-IN')
  };

  saveReport(report);
  renderReportedList();
  updateStats();

  resultBox.className = 'result-box safe';
  resultBox.innerHTML = '✅ Report submitted! Thank you for helping other freshers stay safe.';
  resultBox.classList.remove('hidden');

  document.getElementById('companyName').value = '';
  document.getElementById('companyContact').value = '';
  document.getElementById('scamType').value = '';
  document.getElementById('scamDetails').value = '';
}

// ==========================================
// SHARE APP
// ==========================================
function shareApp() {
  if (navigator.share) {
    navigator.share({
      title: 'Naukri Sach — Verify Before You Trust',
      text: 'Check if your job offer is real or fake. Free tool for Indian freshers!',
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied! Share it with your friends to protect them from fake job scams.');
  }
}

// ==========================================
// LOCAL STORAGE HELPERS
// ==========================================
function saveReport(report) {
  const reports = getReports();
  reports.unshift(report);
  localStorage.setItem('naukrisach_reports', JSON.stringify(reports));
}

function getReports() {
  const data = localStorage.getItem('naukrisach_reports');
  return data ? JSON.parse(data) : [];
}

// ==========================================
// RENDER REPORTED LIST
// ==========================================
function renderReportedList() {
  const reports = getReports();
  const container = document.getElementById('reportedList');

  if (reports.length === 0) {
    container.innerHTML = '<p class="empty-state">No reports yet. Be the first to report a fake company.</p>';
    return;
  }

  container.innerHTML = reports.map(r => `
    <div class="reported-card">
      <span class="badge">${r.scamType}</span>
      <h3>${r.companyName}</h3>
      <p>📋 ${r.details}</p>
      ${r.companyContact ? `<p>📞 Contact reported: ${r.companyContact}</p>` : ''}
      <p style="font-size:12px; color:#aaa;">Reported on ${r.date}</p>
    </div>
  `).join('');
}

// ==========================================
// INIT
// ==========================================
renderReportedList();
updateStats();