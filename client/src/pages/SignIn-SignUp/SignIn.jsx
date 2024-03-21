import React, { useState } from "react";
import { useNavigate} from 'react-router-dom'
import "./signIn.css";
const host = "http://localhost:3001";

export default function SignIn() {
  const [formData, setformData] = useState({});
  const [loginData, setLoginData] = useState({});

  const [error, setError] = useState(null);
  const [loginError, setLoginError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);


  const [type, setType] = useState("User");
  const[loginType, setLoginType] = useState("User");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
        console.log(formData);
        console.log(type);
        const response = await fetch(`${host}/api/auth/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, role: type }),
      });
      const data = await response.json();
      console.log(data);

      if (data.success === false) {
        setError(data.message);
      } else {
        if(type === "Owner") navigate('/owner-profile');
        else if(type === "Manager") navigate('/manager-profile');
        else if(type === "User") navigate('/user-profile'); 
        else navigate('/admin-profile');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); 
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      setLoginLoading(true);
      const response = await fetch(`${host}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...loginData, role: loginType }),
      });
      const data = await response.json();
      console.log(data);

      if (data.success === false) {
        setLoginError(data.message);
      } else {
        if(loginType === "Owner") navigate('/owner-profile');
        else if(loginType === "Manager") navigate('/manager-profile');
        else if(loginType === "User") navigate('/user-profile'); 
        else navigate('/admin-profile');
      }
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoginLoading(false);
    }
  }

  return (
    <div class="outer">
      <div class="main">
        <input type="checkbox" id="chk" aria-hidden="true" />

        <div class="login">
          <form class="form" onSubmit={handleSignIn}>
            <label for="chk" aria-hidden="true">
              Log in
            </label>
            <input onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              class="input"
              type="email"
              name="email"
              placeholder="Email"
              required=""
            />
            <input onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              class="input"
              type="password"
              name="pswd"
              placeholder="Password"
              required=""
            />
            <div class="container">
              <form>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    onChange = {(e) => setLoginType("User")}
                    checked = {loginType === "User"}
                  />
                  <span>User</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    onChange = {(e) => setLoginType("Owner")}
                    checked = {loginType === "Owner"}
                  />
                  <span>Owner</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    onChange = {(e) => setLoginType("Manager")}
                    checked = {loginType === "Manager"}
                  />
                  <span>Manager</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    onChange = {(e) => setLoginType("Admin")}
                    checked = {loginType === "Admin"}
                  />
                  <span>Admin</span>
                </label>
              </form>
            </div>
            <button>{loginLoading ? 'Loading...': 'Log in'}</button>
          </form>

          {loginError && <p className='text-red-500 mt-5'>{loginError}</p>}
        </div>

        <div class="register">
          <form class="form" onSubmit={handleRegister}>
            <label for="chk" aria-hidden="true">
              Register
            </label>
            <input onChange={(e) => setformData({ ...formData, name: e.target.value })}
              class="input"
              type="text"
              name="txt"
              placeholder="Username"
              required=""
            />
            <input onChange={(e) => setformData({ ...formData, email: e.target.value })}
              class="input"
              type="email"
              name="email"
              placeholder="Email"
              required=""
            />
            <input onChange={(e) => setformData({ ...formData, password: e.target.value })}
              class="input"
              type="password"
              name="pswd"
              placeholder="Password"
              required=""
            />
            <div class="container">
              <form>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    onChange={(e) => setType("User")}
                    checked = {type === "User"}
                  />
                  <span>User</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    onChange={(e) => setType("Owner")}
                    checked = {type === "Owner"}
                  />
                  <span>Owner</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    onChange={(e) => setType("Manager")}
                    checked = {type === "Manager"}
                  />
                  <span>Manager</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    onChange={(e) => setType("Admin")}
                    checked = {type === "Admin"}
                  />
                  <span>Admin</span>
                </label>
              </form>
            </div>
            <button>{loading ? 'Loading...': 'Register'}</button>
          </form>

          {error && <p className='text-red-500 mt-5'>{error}</p>}
        </div>
      </div>
    </div>
  );
}
