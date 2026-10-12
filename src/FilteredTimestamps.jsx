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
  Pilih tanggal untuk mencari insiden berdasarkan tanggal terakhir
  investigasi dibuka.
</p>
    <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
    <button onClick={() => setAppliedDate(date)} disabled={!date}>Search / Filter</button>
    {appliedDate && filteredDate.length === 0 && (
      <p>Tidak ada insident yang dicari.</p>
    )}
    {filteredDate.map((incident) => <p key={incident.id}>Incident Id : {incident.id}</p>)}
  </div>
  )
}


export default FilteredTimestamps;