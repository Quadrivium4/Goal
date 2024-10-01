import React from 'react';
import { useAuth, useUser } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


function Settings() {
  const {logout} = useAuth();
  const navigate = useNavigate()
  const user = useUser();
  return (
    <div>
      <h1>Your Account</h1>
      <p>{user.name}</p>
      <p>{user.email}</p>
      <button onClick={async() =>{
        let res  = await logout();
        navigate("/")
        }}>logout</button>
    </div>
  );
}

export default Settings;
