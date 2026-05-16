import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const ResetPassword = () => {
  const inputRefs = React.useRef([]);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }

  const onSubmitEmail = async (e)=>{
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/send-reset-otp", {email});
      if(data.success){
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const onSubmitOtp = async (e) => {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value);
      setOtp(otpArray.join(''));
      setIsOtpSubmited(true);
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/reset-password", {email, otp, newPassword});
      // if(data.success){
        toast.success(data.message);
        navigate("/login");
      // } else {
      //   toast.error(data.message);
      // }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen max-h-screen bg-no-repeat bg-cover bg-center'
        style={{ backgroundImage: `url(${assets.background})`}}
    > 
      {
        !isEmailSent &&
        <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your registered email id.</p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            {/* <img src={assets.mail_icon} alt="" className='w-3 h-3' /> */}
            <MdOutlineMailOutline className='w-4 h-4 text-white'/>
            <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder='Email id' className='bg-transparent outline-none text-white' required />
          </div>
          <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Submit</button>
        </form>
      }

      {
        !isOtpSubmited && isEmailSent &&

        <form onSubmit={onSubmitOtp} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {
              Array(6).fill(0).map((_, index) => (
                <input type="text"
                  className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                  maxLength='1' key={index}
                  ref={e => inputRefs.current[index] = e}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  required />
              ))}
          </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Submit</button>
          <button onClick={onSubmitEmail} className='w-full py-3 mt-2 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Resend Otp</button>
        </form>
      }

      {
        isOtpSubmited && isEmailSent && 
      
      <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the new password below.</p>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          {/* <img src={assets.lock_icon} alt="" className='w-3 h-3' /> */}
          <RiLockPasswordLine className='w-4 h-4'/>
          <input onChange={(e)=>setNewPassword(e.target.value)} value={newPassword} type="password" placeholder='New Password' className='bg-transparent outline-none text-white' required />
        </div>
        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Submit</button>
      </form>
}
    </div>
  )
}

export default ResetPassword
