import React from 'react';

function IncidentList( {
  incidents,
  currentAnalyst,
  l2Analyst,
  takeIncident,
  investigateIncident,
  escalateIncident
}) {
  if (incidents.length === 0) {
    return <p>No Incident founded.</p>
  }
  return(
    <ul>
          {incidents.map((item) => (
            <li key={item.id}>
              Showing a lists of {item.id} and {item.status},
              Assigned To : {item.assignedTo}{' '}

              <button
                onClick={() => takeIncident(item.id)}
                disabled={
                  item.status !== 'OPEN' ||
                  currentAnalyst.role !== 'SOC_L1'
                }
              >
                {item.status === 'OPEN' ? 'Take Incident' : 'Assigned'}
              </button>{' '}

              <button
                onClick={() => investigateIncident(item.id)}
                disabled={
                  item.assignedTo !== currentAnalyst.id ||
                  !(
                    (currentAnalyst.role === 'SOC_L1' &&
                      item.status === 'IN_PROGRESS') ||
                    (currentAnalyst.role === 'SOC_L2' &&
                      item.status === 'ESCALATED')
                  )
                }
              >
                Investigate
              </button>{' '}

              <button
                onClick={() => escalateIncident(item.id)}
                disabled={
                  !l2Analyst ||
                  item.status !== 'IN_PROGRESS' ||
                  currentAnalyst.role !== 'SOC_L1' ||
                  item.assignedTo !== currentAnalyst.id
                }
              >
                Escalate
              </button>
            </li>
          ))}
        </ul>
  )
}

export default IncidentList;