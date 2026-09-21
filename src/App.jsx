import {Routes, Route, Navigate} from 'react-router-dom';
import Dashboard from './Dashboard';
import Signin from './Login';
import {useState} from 'react';
import incidentDetails from './Incident';

function App() {
    const [currentUser, setCurrentUser] = useState(null);
     const [incidents, setIncidents] = useState(incidentDetails);
    return(
    <Routes>
      <Route
          path = "/*"
          element={
            currentUser
            ? <Dashboard 
                currentUser={currentUser}
                onLogout ={() => setCurrentUser(null)}
                incidents = {incidents}
                setIncidents = {setIncidents}/>
            : <Navigate to="/login" replace />
          }>

        </Route>
      <Route 
          path = "/login"
          element = {
            currentUser
            ? <Navigate to ="/" replace />
            : <Signin onLogin={setCurrentUser}/>
          }
          >
        </Route>
      </Routes>
    )

}

export default App;