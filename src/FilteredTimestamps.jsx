import {useState, useMemo} from 'react';
function FilteredTimestamps({incidents}) {
  const [date, setDate] = useState('');
  const [appliedDate, setAppliedDate] = useState('');
  const filteredDate = useMemo(() => {
    if (!appliedDate) return [];
    return incidents.filter((incident) => incident.investigatedAt && new Date(incident.investigatedAt).toLocaleDateString('en-CA') === appliedDate);
  }, [incidents, appliedDate]);
  return (
  <div>
    <p>
  Select a date to search for incidents based on the date they were last
revealed through investigation.
.
</p>
    <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
    <button onClick={() => setAppliedDate(date)} disabled={!date}>Search / Filter</button>
    {appliedDate && filteredDate.length === 0 && (
      <p>No incident is being searched.</p>
    )}
    {filteredDate.map((incident) => <p key={incident.id}>Incident Id : {incident.id}</p>)}
  </div>
  )
}


export default FilteredTimestamps;