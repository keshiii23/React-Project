import React, {useState} from 'react';
import styles from './InvestigationPanel.module.css';
import {Link} from 'react-router-dom';


function InvestigationPanel({
    selectedIncident,
    selectedIncidentId,
    currentAnalyst,
    draftNotes,
    investigationNote,
    addNote,
    selectedClassification,
    classificationDropdown,
    resolvedIncident,
    escalateIncident,
    l2Analyst
}) {
    const [isOpen, setisOpen] = useState(false);
    const handleEscalate = () => {
      if (!selectedIncident || !l2Analyst || currentAnalyst.role !== 'SOC_L1' || selectedIncident.status !== 'IN_PROGRESS' ||
    selectedIncident.assignedTo !== currentAnalyst.id) {
      return;
    }
      escalateIncident(selectedIncident.id);
      setisOpen(true);
    }
    return(
         <div className={styles.panel}>
              <p>Selected Incident : {selectedIncidentId}</p>
      <h2>Investigation Notes</h2>

      <textarea
        value={draftNotes}
        onChange={investigationNote}
        placeholder="Type the Investigation Notes right here..."
      />

      <button onClick={() => addNote()} disabled={!draftNotes.trim()}>Add Note</button>

      <ul>
        {selectedIncident?.notes?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <select
        value={selectedClassification}
        onChange={classificationDropdown}
      >
        <option value="">Choose Classification :</option>
        <option value="TRUE_POSITIVE">True Positive</option>
        <option value="FALSE_POSITIVE">False Positive</option>
      </select>

      <button
        onClick={() => resolvedIncident()}
        disabled={
          !selectedIncident ||
          selectedIncident.assignedTo !== currentAnalyst.id ||
          !(
            (selectedIncident.status === 'IN_PROGRESS' &&
              currentAnalyst.role === 'SOC_L1') ||
            (selectedIncident.status === 'ESCALATED' &&
              currentAnalyst.role === 'SOC_L2')
          ) ||
          (
            selectedClassification !== 'TRUE_POSITIVE' &&
            selectedClassification !== 'FALSE_POSITIVE'
          ) || !selectedIncident?.notes?.length
        }
      >
        Resolve
      </button>
      <button onClick={handleEscalate} disabled={!selectedIncident || !l2Analyst || currentAnalyst.role !== 'SOC_L1' || selectedIncident.status !== 'IN_PROGRESS' ||
    selectedIncident.assignedTo !== currentAnalyst.id}
        >
          Escalate To L2.
                </button>
      {isOpen && (<div className={styles.popup} role="status"><h2>Sent to L2!</h2> <p>Success</p>
    <button className={styles.close} onClick={() => setisOpen(false)}>Close</button> </div>) }
      <Link to="/" className={styles.backLink}>Back to Incident List.</Link>
      </div>
  
    )
}


export default InvestigationPanel;