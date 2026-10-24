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
  useMatch,
} from 'react-router-dom';
import FilteredTimestamps from './FilteredTimestamps';

function RouteError() {
  return (
    <div className={styles.routeError}>
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
  const [selectedAttackType, setSelectedAttackType] = useState('');
  const [showEvidence, setShowEvidence ] = useState(false);

  const navigate = useNavigate();
  const dialogRef = useRef(null);
  const totalIncidents = incidents.length;

  const currentAnalyst = mockAnalyst.find(
    (analyst) => analyst?.id === currentUser?.analystId
  ) || { name: 'Guest', role: 'Unknown' };

  const openIncidents = incidents
    ? incidents.filter((incident) => incident.status === 'OPEN' && (selectedAttackType === '' || incident.attackType ===  selectedAttackType))
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
                classification: selectedClassification
              }
            : incident
        )
      );
      navigate('/');
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
    setShowEvidence(false);
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
    if (selectedAttackType !== '' && incident.attackType !== selectedAttackType) {
      return false;
    }
    if (query === '') return true;
    if (/^\d+$/.test(query)) {
      const incidentNumber = incident.id.split('-').pop();
      return Number(incidentNumber) === Number(query);
    }

    return incident.id.toLowerCase() === query;
  }
  );

  const filteredIncidentByAttackType = incidents.filter((incident) => 
    (selectedAttackType === '' || incident.attackType === selectedAttackType) 
  )

  const setAttackTypes = [
    ...new Set(incidents.map((incident) => incident.attackType).filter(Boolean))
  ];

  const toggleEvidence = () => {
    setShowEvidence((previous) => !previous)
  }

  return (
    <main className={styles.dashboard}>
      <div>
        <FilteredTimestamps incidents={incidents} />
      </div>

      <button className={styles.logoutButton}onClick={onLogout}>Logout</button>

      <h1>SOC Incident Management System</h1>
      <p>Incident Overview</p>

      <label htmlFor="incident-search">Search Incident ID : </label>
      <input
        id="incident-search"
        type="search"
        value={searchIncident}
        onChange={(event) => setSearchIncident(event.target.value)}
      />
      <label htmlFor="attack-type">Filter Category:</label>
      <select id="attack-type" value={selectedAttackType} onChange={(e) => setSelectedAttackType(e.target.value)}>
        <option value="">All Attack Types</option>
        {Array.from(setAttackTypes).map((attackType) => (
          <option key={attackType} value={attackType}>{attackType}</option>
          ))}
      </select>

      <div className={styles.card}>
        <h2>Total Incidents : {totalIncidents}</h2>
        <p>{currentAnalyst.name} (Role : {currentAnalyst.role})</p>

        <dialog ref={dialogRef}>
          <h2>Incident has been Assigned....</h2>
          <p>
            Incident <strong>{assignmentIncidentID}</strong> 
             is assigned to SOC Analyst <strong>{currentAnalyst.name}</strong>
          </p>
          <button onClick={closeModal}>Close</button>
        </dialog>

       <h2>
  {selectedAttackType
    ? ` ${selectedAttackType} — Total incident status OPEN: ${filteredIncidentByAttackType.length}`
    : `All INCIDENT - OPEN: ${openIncidents.length}`}
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
                <p>Evidence: 
                  <button onClick={toggleEvidence}>{showEvidence ? 'Hide Evidence' : 'View More Detail'}</button>
                  {showEvidence && (
                    <div>
                   {incidentDetail?.evidence || 'No Evidence.'}
                   </div>
)}
                </p>
                <p>Source IP : {incidentDetail.sourceIP}</p>
                <p>Timestamp : {new Date(incidentDetail.timestamp).toLocaleString()}</p>
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
              
              selectedIncident && selectedIncident.assignedTo === currentAnalyst.id  ? (
                <InvestigationPanel
                  selectedIncident={selectedIncident}
                  selectedIncidentId={selectedIncidentId}
                  currentAnalyst={currentAnalyst}
                  draftNotes={draftNotes}
                  investigationNote={investigationNote}
                  addNote={addNote}
                  classificationDropdown={classificationDropdown}
                  resolvedIncident={resolvedIncident}
                  escalateIncident={escalateIncident}
                  selectedClassification= {selectedClassification}
                  l2Analyst={l2Analyst}
                />
              ) : 
                 <RouteError />
              
            }
          />

          <Route path="/*" element={<RouteError />}>
          </Route>
        </Routes>
      </div>
    </main>
  );
}

export default Dashboard;