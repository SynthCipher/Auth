import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import { RiLockPasswordLine } from "react-icons/ri";

const ResetPassword = () => {
  axios.defaults.withCredentials = true;
  const { backendUrl } = useContext(AppContent);

  const Navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOptSubmited] = useState(false);
  const [isOtpVerified, setIsOptVerified] = useState(false);
  const navigate = useNavigate();

  const inputRefs = React.useRef([]); // Create an array to hold the references to each input.

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

  const sendVerificationOtp = async (e) => {
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-password-otp",
        { email }
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-password-otp",
        { email }
      );
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    const otpValue = otpArray.join("");
    setOtp(otpValue);

    // Pass the constructed OTP value directly instead of relying on state
    await verifyOtp(otpValue);
  };

  const verifyOtp = async (otpValue) => {
    try {
      const otp = otpValue;
      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-reset-password-otp",
        { email, otp }
      );
      if (data.success) {
        toast.success(data.message);
        setIsOptSubmited(true);
        setIsOptVerified(true);
        // console.log("OTP Verified:", data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        { email, otp, newPassword }
      );
      if (data.success) {
        toast.success(data.message);
        // await axios.post(backendUrl + "/api/auth/logout");
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        alt=""
        onClick={() => Navigate("/")}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer "
      />

      {/* enter email id */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-indigo-300 mb-6 text-center">
            Enter your registered email address
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c] ">
            <MdOutlineEmail className="text-gray-100" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none text-gray-100"
              type="email"
              placeholder="Email"
              required
            />
          </div>
          <button className="w-full py-2.5 mt-3 cursor-pointer text-white bg-gradient-to-r from-indigo-500 to to-indigo-900 rounded-full">
            Submit
          </button>
        </form>
      )}

      {/* OTP INTUT FROM */}
      {isEmailSent && !isOtpSubmited && !isOtpVerified && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password OTP
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
          <button className="w-full py-2.5 cursor-pointer text-white bg-gradient-to-r from-indigo-500 to to-indigo-900 rounded-full">
            Submit
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
      )}

      {/* ENTER NEW FORM */}
      {isEmailSent && isOtpSubmited && isOtpVerified && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-indigo-300 mb-6 text-center">
            Enter the new password below
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c] ">
            <RiLockPasswordLine className="text-gray-100" />
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              className="bg-transparent outline-none text-gray-100"
              type="password"
              placeholder="New Password"
              required
            />
          </div>
          <button className="w-full py-2.5 mt-3 cursor-pointer text-white bg-gradient-to-r from-indigo-500 to to-indigo-900 rounded-full">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
