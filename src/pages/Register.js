import React, { useState } from 'react';
import styles from'./LoginAndRegister.module.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault()
    if(password !== confirmPassword) {
        setError('Password and Confirm Password do not match');
        setUsername('');
        setPassword(''); 
        setConfirmPassword('');       
    } else {
    e.preventDefault();
    const url = `http://sefdb02.qut.edu.au:3000/user/register`; // Update the API endpoint for user registration

    fetch(url, {
      method: 'POST', // Use POST method for user registration
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: username, password: password }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        setSuccess(data.message)
        setError('')
        // Handle successful registration, e.g., display a success message, redirect, etc.
      })
      .catch((error) => {
        console.log(error);
        if(error.message === "Bad Request") {
            setError('Both email and password are required');
        }
        if(error.message === "Conflict") {
            setError('Email is already in use');
        }
      });

    setUsername('');
    setPassword('');
    setConfirmPassword('');
    }
  };

  return (
    <div className={styles.background}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="username"></label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            placeholder="email"
          />
        </div>
        <div>
          <label htmlFor="password"></label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            placeholder="password"
          />
        </div>
        <div>
        <label htmlFor="confirmPassword"></label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="off"
          placeholder='confirm password'
        />
      </div>          
      {error && !success && <div className={styles.error}>* {error}</div>}
      {success && !error && <div className={styles.success}>{success}</div>}
        <button type="submit">Register</button> {/* Update button label to 'Register' */}
      </form>
    </div>
  );
}
