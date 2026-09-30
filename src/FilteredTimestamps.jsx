import {useState, useMemo} from 'react';
function FilteredTimestamps({incidents}) {
  const [date, setDate] = useState('');
  const [appliedDate, setAppliedDate] = useState('');
  const filteredDate = useMemo(() => {
    if (!appliedDate) return [];
    return incidents.filter((incident) => incident.investigatedAt?.slice(0, 10) === appliedDate);
  }, [incidents, appliedDate]);
  return (
  <div>
    <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
    <button onClick={() => setAppliedDate(date)} disabled={!date}>Search / Filter</button>
    {filteredDate.map((incident) => <p key={incident.id}>Incident Id : {incident.id}</p>)}
  </div>
  )
}


export default FilteredTimestamps;