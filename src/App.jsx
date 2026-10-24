import {Routes, Route, Navigate, useMatch} from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import {useState} from 'react';
import incidentDetails from './Incident';
import Register from './Register';
import styles from './Dashboard.module.css'
function RouteError() {
  return (
    <div>
      <h1>404 — Page Not Found</h1>
      <p>URL Unavailable.</p>
    </div>
  );
}

const PrivateRoute = ({currentUser, children}) => {
  return (
    currentUser? children : <Navigate to = "/login" replace/>)
}

function App() {
    const [currentUser, setCurrentUser] = useState(() => JSON.parse(sessionStorage.getItem('currentuser') ?? 'null'));
    const [incidents, setIncidents] = useState(incidentDetails);
    const dashboardMatch = useMatch('/');
    const incidentMatch = useMatch('/incident/:id');
    const isValidPage = Boolean(dashboardMatch || incidentMatch);
    const handleLogin = (user) => {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
    }
    const handleLogout = () => {
      sessionStorage.removeItem('currentUser');
      setCurrentUser(null);
    }

    return(
      <Routes>
        <Route
          path = "/*"
          element={
            !isValidPage ? (
              <div className={styles.routeError}>
                <RouteError/>
              </div>
            ) : <PrivateRoute currentUser={currentUser}>
              <Dashboard 
                currentUser={currentUser}
                onLogout ={handleLogout}
                incidents = {incidents}
                setIncidents = {setIncidents}
             />
           </PrivateRoute>
          }
        />
      <Route 
          path = "/login"
          element = {
            currentUser
            ? <Navigate to ="/" replace />
            : <Login onLogin={handleLogin}/>
          }
          >
        </Route>
      <Route 
          path = "/register"
          element = { <Register/>}
      >
        </Route>
      <Route
      path="*" element={<RouteError/>}>
      </Route>
      </Routes>
    )

}

export default App;