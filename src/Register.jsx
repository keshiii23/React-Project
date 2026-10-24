import { useState } from 'react';
import mockUsers from './mockUsers';
import mockAnalyst from './mockAnalyst';
import {useNavigate, Link} from 'react-router-dom';
import styles from './Register.module.css'

function Register({ onRegister }) {
  const [name, setName] = useState('');
  const [username, setUser] = useState('');
  const [password, setPass] = useState('');
  const [role, setRole] = useState('SOC_L1');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const prefix = role.split('_')[1];

  const handleSubmit = (event) => {
  const count  = mockAnalyst.filter((a) => a.role === role).length;
  const nextId = count === 0? `analyst-${prefix}` : `analyst-${prefix}(${count})`;
    event.preventDefault();

    setError(null);
    setSuccess(null);

    if (
      !name.trim() ||
      !username.trim() ||
      !password.trim() ||

      !role
    ) {
      setError('All fields cannot be blank!');
      return;
    }

    const existingUser = mockUsers.find(
      (user) => user.username === username.trim()
    );

    if (password.length < 8) {
      setError("Password must be at least 8 characters long!");
      return;
    }

    if (existingUser) {
      setError('Username has already been registered!');
      return;
    }

    const newAnalyst = {
      name: name.trim(),
      role,
      id: nextId
    };

    const newUser = {
      username: username.trim(),
      password,
      analystId: nextId
    };

    mockAnalyst.push(newAnalyst);
    mockUsers.push(newUser);

    setSuccess('Registration successful!');
    
    navigate("/login");

    if (onRegister) {
      onRegister({
        username: newUser.username,
      });
    }

    setName('');
    setUser('');
    setPass('');
    setRole('SOC_L1');
  };

  return (
    <div className={styles.register}>
      <h4>Register</h4>

      <form onSubmit={handleSubmit}>
        {error && (
          <p role="alert" className={styles.errorMsg}>
            {error}
          </p>
        )}

        {success && (
          <p className={styles.successMsg}>
            {success}
          </p>
        )}

        <div className={styles.textArea}>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Full Name"
            value={name}
            className={styles.textInput}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className={styles.textArea}>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={username}
            className={styles.textInput}
            onChange={(event) => setUser(event.target.value)}
          />
        </div>

        <div className={styles.textArea}>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            className={styles.textInput}
            onChange={(event) => setPass(event.target.value)}
          />
        </div>

        <input
          type="submit"
          value="Register"
          className={styles.btn}
        />
      </form>
      <p>
  Already have an account? <Link to="/login">Back to Login</Link>
</p>
    </div>
  );
}

export default Register;