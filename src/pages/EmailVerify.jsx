import React, { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;

  const { backendUrl, isLoggedin, userData, getUserData } =
    useContext(AppContent);
  const inputRefs = React.useRef([]); // Create an array to hold the references to each input.
  const navigate = useNavigate();

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );
      if (data.success) {
        // navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // const handleInput = (e, index) => {
  //   const value = e.target.value;
  //   if (value && index < 5) {
  //     inputRefs.current[index + 1].focus();
  //   }
  //   if (!value && index > 0) {
  //     inputRefs.current[index - 1].focus();
  //   }
  // };

  const handleInput = async (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault(); // Prevent default paste behavior
    const paste = e.clipboardData.getData("text"); // Get the pasted text from the clipboard
    const pasteArray = paste.split(""); // Split the pasted text into an array of characters
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        // Ensure that the index exists in the inputRefs
        inputRefs.current[index].value = char; // Assign each character to the respective input field
      }
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");
      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp }
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
      // console.log(otpArray);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedin, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        alt=""
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer "
      />

      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-indigo-300 mb-6 text-center">
          Enter the 6-digit code sent to your email
        </p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                className="text-white bg-[#333a5c] w-12 h-12 text-xl text-center rounded-md"
                type="text"
                maxLength="1"
                key={index}
                required
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button className="w-full py-3 cursor-pointer text-white bg-gradient-to-r from-indigo-500 to to-indigo-900 rounded-full">
          Verify Email
        </button>
        <p className="pt-10 text-white text-center">
          Didn’t receive the OTP ?
          <span
            onClick={sendVerificationOtp}
            className="pl-1 cursor-pointer text-indigo-400 hover:underline"
          >
            Resend OTP
          </span>
        </p>
      </form>
    </div>
  );
};

export default EmailVerify;
