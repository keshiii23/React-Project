import {Routes, Route, Navigate, useMatch} from 'react-router-dom';
import Dashboard from './Dashboard';
import Signin from './Login';
import {useState} from 'react';
import incidentDetails from './Incident';

function RouteError() {
  return (
    <div>
      <h1>404 — Halaman tidak ditemukan</h1>
      <p>URL yang kamu masukkan tidak tersedia.</p>
    </div>
  );
}

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [incidents, setIncidents] = useState(incidentDetails);
    const dashboardMatch = useMatch('/');
    const incidentMatch = useMatch('/incident/:id');
    const isValidPage = Boolean(dashboardMatch || incidentMatch);
    return(
    <Routes>
      <Route
          path = "/*"
          element={
            !isValidPage ? (
              <RouteError/>
            ) : currentUser ? (
              <Dashboard 
                currentUser={currentUser}
                onLogout ={() => setCurrentUser(null)}
                incidents = {incidents}
                setIncidents = {setIncidents}
             />
            ) : (
              <Navigate to = "/login" replace/>
            )
          }
        />
      <Route 
          path = "/login"
          element = {
            currentUser
            ? <Navigate to ="/" replace />
            : <Signin onLogin={setCurrentUser}/>
          }
          >
        </Route>
      <Route
      path="*" element={<RouteError/>}>
      </Route>
      </Routes>
    )

}

export default App;