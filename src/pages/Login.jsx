import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { GoPerson } from "react-icons/go";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
const Login = () => {
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  // const [state, setState] = useState("Sign Up");
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          toast.success(data.message);
          setIsLoggedin(true);
          getUserData();
          navigate("/");

          // console.log(name, email, password);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });
        if (data.success) {
          toast.success(data.message);
          setIsLoggedin(true);

          // console.log(name, email, password);
          getUserData();

          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen px-6 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        alt=""
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer "
      />
      <div className="bg-slate-900 p-10 shadow-lg w-full sm:w-96 text-indigo-300 text-sm rounded-xl">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your acccount!"}
        </p>
        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c] text-gray-100">
              <GoPerson />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c] text-gray-100">
            <MdOutlineEmail />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none"
              type="email"
              placeholder="Email "
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c] text-gray-100">
            <RiLockPasswordLine />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none"
              type="password"
              placeholder="password"
              required
            />
          </div>
          {state !== "Sign Up" && (
            <p
              onClick={() => navigate("/reset-password")}
              className="mb-4 mr-3 -mt-2 text-xs text-right text-indigo-500 cursor-pointer "
            >
              forgot password ?
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium
          hover:bg-gradient-to-r hover:from-indigo-900 hover:to-indigo-500 "
          >
            {state}
          </button>
        </form>

        <p className="text-gray-400 text-center text-xs mt-4">
          {state === "Sign Up" ? (
            <>
              Already have an account ?{" "}
              <span
                className="text-blue-400 cursor-pointer "
                onClick={() => setState("Login")}
              >
                {" "}
                Login here
              </span>{" "}
            </>
          ) : (
            <>
              {" "}
              Create Account{" "}
              <span
                className="text-blue-400 cursor-pointer "
                onClick={() => setState("Sign Up")}
              >
                {" "}
                Sign Up
              </span>{" "}
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
