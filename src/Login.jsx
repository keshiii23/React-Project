import './Login.css';
import mockUsers from './mockUsers';
import {useState} from 'react';


function Signin({onLogin}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const handleSubmit = (event) => {
    event.preventDefault();
    const matchedUser = mockUsers.find((user) =>
        user.username === username.trim() && user.password === password
    )
    if (matchedUser) {
        alert(`Welcome! ${matchedUser.username}`)
        setError(null);
        onLogin({
            analystId: matchedUser.analystId,
            username: matchedUser.username,
        })
    }
    else {
        setError('Either your username or password is false, please try again.')
    }
};
     return(
            <div className="login">
                <h4>Login</h4>
                <form onSubmit={handleSubmit}> { error && <p role='alert'>{error}</p>}
                    <div className="text_area">
                    <input 
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    className="text_input"
                    onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div className="text_area">
                    <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    className="text_input"
                    onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <input
                type="submit"
                value="login"
                className="btn"
                />
            </form>
            </div>
        )
}
export default Signin;