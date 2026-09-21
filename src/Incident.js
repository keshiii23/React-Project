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
    classification: null
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
    classification: null
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
    classification: null
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
    classification: null
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
    classification: null
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
    classification: null
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
    classification: null
  }
];

export default incidentDetails;
