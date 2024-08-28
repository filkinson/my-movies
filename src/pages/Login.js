import React, { useState } from 'react';
import styles from'./LoginAndRegister.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem("token");
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = `http://sefdb02.qut.edu.au:3000/user/login`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        localStorage.setItem("token", data.bearerToken.token);
        localStorage.setItem("tokenExpirationTime", data.bearerToken.expires_in);
        localStorage.setItem("refreshToken", data.refreshToken.token);
        localStorage.setItem("refreshTokenExpirationTime", data.refreshToken.expires_in);        
        console.log(data);
        setSuccess('User loged in')
        setError('')
      })
      .catch((error) => {
        console.log(error);
        if(error.message === "Bad Request") {
            setError('Both email and password are required');
        }
        if(error.message === "Unauthorized") {
            setError('Incorrect email or password');
        }
      });
      
    setUsername('');
    setPassword('');
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
          placeholder='email'
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
          placeholder='password'
        />
      </div>    
      {error && !success && <div className={styles.error}>* {error}</div>}
      {success && !error && <div className={styles.success}>{success}</div>}
      <button type="submit">Login</button>
      <div>{token}</div>
    </form>
    </div>
  );
}
