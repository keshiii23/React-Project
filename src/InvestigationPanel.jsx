import React from 'react';

function investigationPanel({
    selectedIncident,
    selectedIncidentId,
    currentAnalyst,
    draftNotes,
    investigationNote,
    addNote,
    selectedClassification,
    classificationDropdown,
    resolvedIncident
}) {
    return(
         <div className="card">
              <p>Selected Incident : {selectedIncidentId}</p>
      <h2>Investigation Notes</h2>

      <textarea
        value={draftNotes}
        onChange={investigationNote}
        placeholder="Type the Investigation Notes right here..."
      />

      <button onClick={() => addNote()}>Add Note</button>

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
          )
        }
      >
        Resolve
      </button>
      </div>
    )
}

export default investigationPanel;