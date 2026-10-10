import './App.css';
import styles from './Dashboard.module.css'
import { useState, useRef, useEffect } from 'react';
import mockAnalyst from './mockAnalyst';
import IncidentList from './IncidentList';
import InvestigationPanel from './InvestigationPanel';
import {
  useNavigate,
  Routes,
  Route,
  Link,
  useMatch,
  Navigate,
} from 'react-router-dom';
import FilteredTimestamps from './FilteredTimestamps';

function RouteError() {
  return (
    <div style={{ padding: '20px', color: 'red' }}>
      <h1>Oops! Something went wrong, nothing to find here...</h1>
      <p>Please Try Reloading or Contact Your friends.</p>
    </div>
  );
}

function Dashboard({ currentUser, onLogout, incidents, setIncidents }) {
  const [draftNotes, setDraftNotes] = useState('');
  const incidentMatch = useMatch('/incident/:id');
  const selectedIncidentId = incidentMatch?.params.id ?? null;
  const [assignmentIncidentID, setAssignmentIncidentID] = useState(null);
  const [selectedClassification, setSelectedClassification] = useState('');
  const [searchIncident, setSearchIncident] = useState('');
  const [incidentDetailID, setIncidentDetailID] = useState('');

  const navigate = useNavigate();
  const dialogRef = useRef(null);
  const totalIncidents = incidents.length;

  const currentAnalyst = mockAnalyst.find(
    (analyst) => analyst?.id === currentUser?.analystId
  ) || { name: 'Guest', role: 'Unknown' };

  const openIncidents = incidents
    ? incidents.filter((incident) => incident.status === 'OPEN')
    : [];

  const selectedIncident = incidents.find(
    (incident) => incident.id === selectedIncidentId
  );

  const l2Analyst = mockAnalyst.find(
    (mockAnalysts) => mockAnalysts.role === 'SOC_L2'
  );

  const openModal = () => {
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

  const takeIncident = (id) => {
    const targetIncident = incidents.find(
      (incident) => incident.id === id
    );

    if (
      targetIncident &&
      currentAnalyst.role === 'SOC_L1' &&
      targetIncident.status === 'OPEN'
    ) {
      setIncidents((prevIncidents) =>
        prevIncidents.map((incident) =>
          incident.id === id && incident.status === 'OPEN'
            ? {
                ...incident,
                status: 'IN_PROGRESS',
                assignedTo: currentAnalyst.id,
              }
            : incident
        )
      );

      setAssignmentIncidentID(id);
      openModal();
    }
  };

  const investigationNote = (event) => {
    setDraftNotes(event.target.value);
  };

  const addNote = () => {
    if (
      selectedIncident &&
      selectedIncident.assignedTo === currentAnalyst.id &&
      (
        (currentAnalyst.role === 'SOC_L1' &&
          selectedIncident.status === 'IN_PROGRESS') ||
        (currentAnalyst.role === 'SOC_L2' &&
          selectedIncident.status === 'ESCALATED')
      ) &&
      draftNotes?.trim()
    ) {
      setIncidents((currentIncidents) =>
        currentIncidents.map((incident) =>
          incident.id === selectedIncidentId &&
          incident.assignedTo === currentAnalyst.id &&
          (
            (currentAnalyst.role === 'SOC_L1' &&
              incident.status === 'IN_PROGRESS') ||
            (currentAnalyst.role === 'SOC_L2' &&
              incident.status === 'ESCALATED')
          )
            ? {
                ...incident,
                notes: [...(incident.notes || []), draftNotes.trim()],
              }
            : incident
        )
      );

      setDraftNotes('');
    }
  };

  const resolvedIncident = () => {
    if (
      selectedClassification === 'TRUE_POSITIVE' ||
      selectedClassification === 'FALSE_POSITIVE'
    ) {
      setIncidents((currentIncidents) =>
        currentIncidents.map((incident) =>
          incident.id === selectedIncidentId &&
          incident.assignedTo === currentAnalyst.id &&
          (
            (currentAnalyst.role === 'SOC_L1' &&
              incident.status === 'IN_PROGRESS') ||
            (currentAnalyst.role === 'SOC_L2' &&
              incident.status === 'ESCALATED')
          )
            ? {
                ...incident,
                status: 'RESOLVED',
                classification: selectedClassification,
              }
            : incident
        )
      );

      setSelectedClassification('');
      setDraftNotes('');
      navigate('/');
    }
  };

  const escalateIncident = (id) => {
    if (l2Analyst && currentAnalyst.role === 'SOC_L1') {
      setIncidents((prevIncidents) =>
        prevIncidents.map((incident) =>
          incident.id === id &&
          incident.status === 'IN_PROGRESS' &&
          incident.assignedTo === currentAnalyst.id
            ? {
                ...incident,
                status: 'ESCALATED',
                assignedTo: l2Analyst.id,
              }
            : incident
        )
      );
    }
  };

  const incidentDetail = incidents.find(
    (incident) => incident.id === incidentDetailID
  );

  const incidentDetails = (id) => {
    const validIncident = incidents.find(
      (incident) => incident.id === id
    );

    if (!validIncident) return;

    setIncidentDetailID(id);
  };

  const classificationDropdown = (event) => {
    setSelectedClassification(event.target.value);
  };

  const investigateIncident = (id) => {
    const now = new Date().toISOString();

    setIncidents((incidents) =>
      incidents.map((incident) =>
        incident.id === id
          ? {
              ...incident,
              investigatedAt: now,
            }
          : incident
      )
    );

    setDraftNotes('');
    setSelectedClassification('');
    navigate(`/incident/${id}`);
  };

  useEffect(() => {
    setDraftNotes('');
    setSelectedClassification('');
  }, [selectedIncidentId]);

  const query = searchIncident.trim().toLowerCase()
  const filteredIncident = incidents.filter((incident) => {
    if (query === '') return true;
    if (/^\d+$/.test(query)) {
      const incidentNumber = incident.id.split('-').pop();
      return Number(incidentNumber) === Number(query);
    }
    return incident.id.toLowerCase() === query;
  }
  );

  return (
    <main className={styles.dashboard}>
      <div>
        <FilteredTimestamps incidents={incidents} />
      </div>

      <button onClick={onLogout}>Logout</button>

      <h1>SOC Incident Management System</h1>
      <p>Incident Overview</p>

      <label htmlFor="incident-search">Search Incident ID : </label>
      <input
        id="incident-search"
        type="search"
        value={searchIncident}
        onChange={(event) => setSearchIncident(event.target.value)}
      />

      <div className={styles.card}>
        <h2>Total Incidents : {totalIncidents}</h2>
        <p>{currentAnalyst.name} & {currentAnalyst.role}</p>

        <dialog ref={dialogRef}>
          <h2>Incident has been Assigned....</h2>
          <p>
            Incident<strong>{assignmentIncidentID}</strong>
            is assigned to SOC Analyst <strong>{currentAnalyst.name}</strong>
          </p>
          <button onClick={closeModal}>Close</button>
        </dialog>

        <h2>
          Known Incident with status of 'OPEN' : {openIncidents.length}
        </h2>

        <Routes>
          <Route
            path="/"
            element={
            <>
              <IncidentList
                incidents={filteredIncident}
                currentAnalyst={currentAnalyst}
                l2Analyst={l2Analyst}
                takeIncident={takeIncident}
                investigateIncident={investigateIncident}
                escalateIncident={escalateIncident}
                incidentDetails={incidentDetails}
              />
            {incidentDetail && (
              <div className={styles.card}>
                <h2>{incidentDetail.eventName}</h2>
                <p>Category: {incidentDetail.category}</p>
                <p>Severity: {incidentDetail.severity}</p>
                <p>Details: {incidentDetail.details}</p>
                <button onClick={() => setIncidentDetailID(null)}>
                  {' '}Close Detail
                </button>
              </div>
            )}
            </>
            }
            />

          <Route
            path="/incident/:id"
            element={
              selectedIncident ? (
                <InvestigationPanel
                  selectedIncident={selectedIncident}
                  selectedIncidentId={selectedIncidentId}
                  currentAnalyst={currentAnalyst}
                  draftNotes={draftNotes}
                  investigationNote={investigationNote}
                  addNote={addNote}
                  selectedClassification={selectedClassification}
                  classificationDropdown={classificationDropdown}
                  resolvedIncident={resolvedIncident}
                  escalateIncident={escalateIncident}
                  l2Analyst={l2Analyst}
                />
              ) : (
                <RouteError />
              )
            }
          />

          <Route path="/*" element={<RouteError />}>
          </Route>
        </Routes>

        <Link to="/">Back to Incident List.</Link>
      </div>
    </main>
  );
}

export default Dashboard;