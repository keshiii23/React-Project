import './Register.css';
import { useState } from 'react';
import mockUsers from './mockUsers';
import mockAnalyst from './mockAnalyst';

function Register({ onRegister }) {
  const [name, setName] = useState('');
  const [username, setUser] = useState('');
  const [password, setPass] = useState('');
  const [analystId, setAnalystId] = useState('');
  const [role, setRole] = useState('SOC_L1');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    if (
      !name.trim() ||
      !username.trim() ||
      !password.trim() ||
      !analystId.trim() ||
      !role
    ) {
      setError('All fields cannot be blank!');
      return;
    }

    const existingUser = mockUsers.find(
      (user) => user.username === username.trim()
    );

    if (existingUser) {
      setError('Username has already been registered!');
      return;
    }

    const existingAnalyst = mockAnalyst.find(
      (analyst) => analyst.id === analystId.trim()
    );

    if (existingAnalyst) {
      setError('Analyst Id has already been used!');
      return;
    }

    const newAnalyst = {
      id: analystId.trim(),
      name: name.trim(),
      role,
    };

    const newUser = {
      username: username.trim(),
      password,
      analystId: analystId.trim(),
    };

    mockAnalyst.push(newAnalyst);
    mockUsers.push(newUser);

    setSuccess('Registration successful!');

    if (onRegister) {
      onRegister({
        analystId: newUser.analystId,
        username: newUser.username,
      });
    }

    setName('');
    setUser('');
    setPass('');
    setAnalystId('');
    setRole('SOC_L1');
  };

  return (
    <div className="register">
      <h4>Register</h4>

      <form onSubmit={handleSubmit}>
        {error && (
          <p role="alert" className="error-msg">
            {error}
          </p>
        )}

        {success && (
          <p className="success-msg">
            {success}
          </p>
        )}

        <div className="text_area">
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Full Name"
            value={name}
            className="text_input"
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="text_area">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={username}
            className="text_input"
            onChange={(event) => setUser(event.target.value)}
          />
        </div>

        <div className="text_area">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            className="text_input"
            onChange={(event) => setPass(event.target.value)}
          />
        </div>

        <div className="text_area">
          <input
            type="text"
            id="analystId"
            name="analystId"
            placeholder="Analyst Id"
            value={analystId}
            className="text_input"
            onChange={(event) => setAnalystId(event.target.value)}
          />
        </div>

        <div className="text_area">
          <select
            id="role"
            name="role"
            value={role}
            className="text_input"
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="SOC_L1">SOC L1</option>
            <option value="SOC_L2">SOC L2</option>
          </select>
        </div>

        <input
          type="submit"
          value="Register"
          className="btn"
        />
      </form>
    </div>
  );
}

export default Register;