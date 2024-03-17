import React, { useState } from "react";
import "./signIn.css";
export default function SignIn() {
  const [type, setType] = useState("User");

  return (
    <div class="outer">
      <div class="main">
        <input type="checkbox" id="chk" aria-hidden="true" />

        <div class="login">
          <form class="form">
            <label for="chk" aria-hidden="true">
              Log in
            </label>
            <input
              class="input"
              type="email"
              name="email"
              placeholder="Email"
              required=""
            />
            <input
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
            <button>Log in</button>
          </form>
        </div>

        <div class="register">
          <form class="form">
            <label for="chk" aria-hidden="true">
              Register
            </label>
            <input
              class="input"
              type="text"
              name="txt"
              placeholder="Username"
              required=""
            />
            <input
              class="input"
              type="email"
              name="email"
              placeholder="Email"
              required=""
            />
            <input
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
            <button>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}
