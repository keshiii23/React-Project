const incidentDetails = [
  {
    id: "EVT-2026-001",
    timestamp: "2026-09-16T22:15:30Z",
    eventName: "Brute Force Attempt",
    category: "Authentication",
    status: "OPEN",
    assignedTo: null,
    severity: "High",
    sourceIP: "198.51.100.42",
    details: "Multiple failed SSH login attempts for user 'root' within 30 seconds.",
    notes: [],
    attackType: "T1110 - Brute Force",
    classification: null,
    evidence: `[MOCK AUTHENTICATION LOG]
22:15:01 SSH login failed | user=root | src=198.51.100.42
22:15:02 SSH login failed | user=root | src=198.51.100.42
22:15:03 SSH login failed | user=root | src=198.51.100.42
Summary: 50 failed login attempts within 30 seconds.
Indicator: Percobaan login berulang dari IP yang sama ke akun root.`

  },
  {
    id: "EVT-2026-002",
    timestamp: "2026-09-16T22:18:12Z",
    eventName: "SQL Injection (SQLi) Detected",
    category: "Web Application",
    status: "OPEN",
    assignedTo: null,
    severity: "Critical",
    sourceIP: "203.0.113.88",
    details: "Detected malicious SQL payloads (' OR 1=1--) in login form input fields.",
    notes: [],
    attackType: "T1190 - Exploit Public-Facing Application",
    classification: null,
    evidence: `[MOCK WEB APPLICATION / WAF LOG]
22:18:12 POST /login | src=203.0.113.88
Field: username
Detected input: ' OR 1=1--
Rule: SQL injection pattern detected
Action: Request blocked
Indicator: Input login mengandung pola manipulasi SQL.
Catatan: Percobaan terdeteksi; keberhasilan eksploitasi belum terbukti.`
  },
  {
    id: "EVT-2026-003",
    timestamp: "2026-09-16T22:20:05Z",
    eventName: "Impossible Travel Detection",
    category: "Identity & Access",
    status: "OPEN",
    assignedTo: null,
    severity: "High",
    sourceIP: "185.190.140.10",
    details: "Successful user login from London 10 minutes after a successful login from New York.",
    notes: [],
    attackType: "T1078 - Valid Accounts",
    classification: null,
    evidence: `[MOCK IDENTITY LOG]
22:10:05 Login success | user=demo.user | location=New York
22:20:05 Login success | user=demo.user | location=London
Second login IP: 185.190.140.10
Indicator: Akun yang sama login dari dua lokasi berjauhan dalam 10 menit.
Catatan: Periksa VPN, proxy, dan akurasi geolokasi sebelum menyimpulkan kompromi akun.`
  },
  {
    id: "EVT-2026-004",
    timestamp: "2026-09-16T22:22:45Z",
    eventName: "Internal Network Reconnaissance",
    category: "Network Scans",
    status: "OPEN",
    assignedTo: null,
    severity: "Medium",
    sourceIP: "10.0.4.15",
    details: "Rapid consecutive port scanning (Nmap signatures) detected from an internal workstation.",
    notes: [],
    attackType: "T1046 - Network Service Discovery",
    classification: null,
    evidence: `[MOCK NETWORK LOG]
22:22:40 src=10.0.4.15 -> dst=10.0.4.20:22  | TCP SYN
22:22:40 src=10.0.4.15 -> dst=10.0.4.20:80  | TCP SYN
22:22:41 src=10.0.4.15 -> dst=10.0.4.20:443 | TCP SYN
22:22:41 src=10.0.4.15 -> dst=10.0.4.20:445 | TCP SYN
Summary: 120 destination ports contacted within 5 seconds.
Indicator: Satu workstation mencoba banyak port dalam waktu singkat.
Catatan: Bisa merupakan pemindaian resmi; pola ini saja tidak memastikan penggunaan Nmap.`
  },
  {
    id: "EVT-2026-005",
    timestamp: "2026-09-16T22:25:00Z",
    eventName: "Potential Data Exfiltration",
    category: "Data Protection",
    status: "OPEN",
    assignedTo: null,
    severity: "Critical",
    sourceIP: "10.0.2.110",
    details: "Unusual outbound data transfer volume (15GB) to a known cloud storage provider service.",
    notes: [],
    attackType: "T1567.002 - Exfiltration to Cloud Storage",
    classification: null,
    evidence: `[MOCK PROXY / NETWORK LOG]
Window: 22:00:00–22:25:00
Source: 10.0.2.110
Destination: storage.example.invalid
Traffic: Outbound HTTPS upload
Transferred: 15 GB
Usual daily upload: 200 MB
Indicator: Volume unggahan jauh melebihi kebiasaan workstation.
Catatan: Periksa tujuan, jenis data, dan izin transfer; mungkin aktivitas backup resmi.`
  },
  {
    id: "EVT-2026-006",
    timestamp: "2026-09-16T22:29:18Z",
    eventName: "Suspicious PowerShell Execution",
    category: "Endpoint Malicious Activity",
    status: "OPEN",
    assignedTo: null,
    severity: "High",
    sourceIP: "10.0.1.45",
    details: "Encoded PowerShell command executed from an email attachment process path.",
    notes: [],
    attackType: "T1059.001 - PowerShell",
    classification: null,
    evidence: `[MOCK ENDPOINT PROCESS LOG]
22:29:18 Host IP: 10.0.1.45
Parent process: WINWORD.EXE
Opened document: Email attachment invoice.docm
Child process: powershell.exe
Command-line indicator: -EncodedCommand [MOCK_ENCODED_CONTENT]
Indicator: Dokumen lampiran email memicu PowerShell dengan perintah tersandi.
Catatan: Isi perintah dan aktivitas lanjutannya perlu diperiksa.`
  },
  {
    id: "EVT-2026-007",
    timestamp: "2026-09-16T22:31:02Z",
    eventName: "Phishing Link Clicked",
    category: "Email Security",
    status: "OPEN",
    assignedTo: null,
    severity: "Medium",
    sourceIP: "10.0.1.89",
    details: "User navigated to a known external malicious URL flagged by threat intelligence.",
    notes: [],
    attackType: "T1204.001 - Malicious Link",
    classification: null,
    evidence: `[MOCK EMAIL / WEB PROXY LOG]
22:30:50 Email received | subject=Account Verification Required
22:31:02 Browser request | src=10.0.1.89
URL: https://login-check.example.invalid/verify
Threat intelligence verdict: Malicious [simulated]
Indicator: Pengguna membuka tautan dari email yang ditandai berbahaya.
Catatan: Klik tautan belum membuktikan pengguna memasukkan password atau mengunduh malware.`
  }
];

export default incidentDetails;
