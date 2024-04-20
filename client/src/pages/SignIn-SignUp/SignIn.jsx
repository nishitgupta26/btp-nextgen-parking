import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signIn.css";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/User/userSlice.js";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
  const host = "http://localhost:3001";
  const [formData, setformData] = useState({});
  const [loginData, setLoginData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const [type, setType] = useState("User");
  const [loginType, setLoginType] = useState("User");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cookies = new Cookies();

  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   // Password length validation
  //   if (formData.password.length < 5) {
  //     // Display an error message or toast indicating the password length requirement
  //     return toast.error("Password must be at least 5 characters long", {
  //       position: "top-center",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //   }
  //   try {
  //     // Email existence validation -> Need to be done in the backend
  //     dispatch(signInStart());
  //     const response = await fetch(`${host}/api/auth/createuser`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ ...formData, role: type }), // Include role in formData
  //     });
  //     const data = await response.json();

  //     if (data.error) {
  //       dispatch(signInFailure(data.error));
  //       console.log(data.error);
  //       return toast.error(data.error, {
  //         position: "top-center",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //       });
  //     } else {
  //       cookies.set("access_token", data.authtoken);
  //       const { password, ...userData } = formData;
  //       dispatch(signInSuccess({ ...userData, role: type }));

  //       if (type === "Owner") navigate("/owner-profile");
  //       else if (type === "Manager") navigate("/manager-profile");
  //       else if (type === "User") navigate("/user-profile");
  //       else navigate("/admin-profile");
  //     }
  //   } catch (error) {
  //     dispatch(signInFailure(error.message));
  //   }
  // };
  const handleRegister = async (e) => {
    e.preventDefault();

    // Password length validation
    if (formData.password.length < 5) {
      return toast.error("Password must be at least 5 characters long", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    try {
      // Generate OTP before registering the user
      dispatch(signInStart());
      const otpResponse = await fetch(`${host}/api/auth/generateOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });
      const otpData = await otpResponse.json();

      if (otpData.error) {
        dispatch(signInFailure(otpData.error));
        return toast.error("Failed to generate OTP", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      // Prompt the user to enter OTP
      const enteredOTP = prompt("Enter OTP");

      // Verify OTP
      const verifyResponse = await fetch(`${host}/api/auth/verifyOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          enteredOTP: enteredOTP,
        }),
      });
      const verifyData = await verifyResponse.json();

      if (verifyData.error) {
        dispatch(signInFailure(verifyData.error));
        return toast.error("Invalid OTP", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      // Proceed with user registration if OTP verification successful
      const userResponse = await fetch(`${host}/api/auth/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, role: type }),
      });
      const userData = await userResponse.json();

      if (userData.error) {
        dispatch(signInFailure(userData.error));
        return toast.error(userData.error, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        cookies.set("access_token", userData.authtoken);
        const { password, ...userDataWithoutPassword } = formData;
        dispatch(signInSuccess({ ...userDataWithoutPassword, role: type }));

        if (type === "Owner") navigate("/owner-profile");
        else if (type === "Manager") navigate("/manager-profile");
        else if (type === "User") navigate("/user-profile");
        else navigate("/admin-profile");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    // Password length validation
    if (loginData.password.length < 5) {
      // Display an error message or toast indicating the password length requirement
      return toast.error("Password must be at least 5 characters long", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    try {
      dispatch(signInStart());
      const response = await fetch(`${host}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...loginData }),
      });
      const data = await response.json();

      if (data.errors) {
        dispatch(signInFailure(data.errors));
        // Render toast only when there's an error during login attempt
        toast.error(data.errors, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else if (data.role !== loginType) {
        const error = "Login with your role only";
        dispatch(signInFailure(error));
        // Render toast only when there's an error during login attempt
        toast.error(error, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        cookies.set("access_token", data.authtoken);
        const { password, ...userData } = loginData;
        dispatch(
          signInSuccess({ ...userData, role: data.role, name: data.name })
        );

        if (data.role === "Owner") navigate("/owner-profile");
        else if (data.role === "Manager") navigate("/manager-profile");
        else if (data.role === "User") navigate("/user-profile");
        else navigate("/admin-profile");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  // Frontend function to handle OTP verification
  const handleVerifyOTP = async () => {
    try {
      const response = await fetch(`${host}/api/auth/verifyOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          enteredOTP: formData.otp,
        }),
      });
      const data = await response.json();
      if (data.success) {
        // OTP verification successful, proceed with registration
        // Call handleRegister function or perform registration actions
        toast.success("OTP done", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        // Invalid OTP, display error message
        toast.error("Invalid OTP", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      // Handle error
    }
  };

  return (
    <div className="outer">
      <div className="main">
        <input type="checkbox" id="chk" aria-hidden="true" />

        <div className="login">
          <form className="form" onSubmit={handleSignIn}>
            <label for="chk" aria-hidden="true">
              Login
            </label>
            <input
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              required=""
            />
            <input
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              className="input"
              type="password"
              name="pswd"
              placeholder="Password"
              required=""
            />
            <div className="container">
              <form>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    onChange={(e) => setLoginType("User")}
                    checked={loginType === "User"}
                  />
                  <span>User</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    onChange={(e) => setLoginType("Owner")}
                    checked={loginType === "Owner"}
                  />
                  <span>Owner</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    onChange={(e) => setLoginType("Manager")}
                    checked={loginType === "Manager"}
                  />
                  <span>Manager</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    onChange={(e) => setLoginType("Admin")}
                    checked={loginType === "Admin"}
                  />
                  <span>Admin</span>
                </label>
              </form>
            </div>
            <button>{loading ? "Loading..." : "Log in"}</button>
          </form>
        </div>
        <div className="register">
          <form className="form" onSubmit={handleRegister}>
            <label for="chk" aria-hidden="true">
              Register
            </label>
            <input
              onChange={(e) =>
                setformData({ ...formData, name: e.target.value })
              }
              className="input"
              type="text"
              name="txt"
              placeholder="Username"
              required=""
            />
            <input
              onChange={(e) =>
                setformData({ ...formData, email: e.target.value })
              }
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              required=""
            />
            <input
              onChange={(e) =>
                setformData({ ...formData, password: e.target.value })
              }
              className="input"
              type="password"
              name="pswd"
              placeholder="Password"
              required=""
            />
            <div className="container">
              <form>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    onChange={(e) => setType("User")}
                    checked={type === "User"}
                  />
                  <span>User</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    onChange={(e) => setType("Owner")}
                    checked={type === "Owner"}
                  />
                  <span>Owner</span>
                </label>
              </form>
            </div>
            <button>{loading ? "Loading..." : "Register"}</button>
          </form>

          {/* {error && <p className='text-red-500 mt-5'>{error}</p>} */}
        </div>
      </div>
    </div>
  );
}
