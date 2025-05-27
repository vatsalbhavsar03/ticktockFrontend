import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [otpTryCount, setOtpTryCount] = useState(0);
  const maxOtpTries = 3;

  const otpRefs = useRef([]);

  useEffect(() => {
    if (step === 2) {
      setOtp(['', '', '', '', '', '']);
    }
  }, [step]);

  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (/^\d?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);
      if (val && index < 5) otpRefs.current[index + 1].focus();
    } else {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const otpString = otp.join('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        'https://localhost:7026/api/Users/SendOTP',
        { email },
        { withCredentials: true }
      );
    //   toast.success(response.data.message);
    Swal.fire({
        icon: 'success',
        title: 'OTP Sent Successfully',
        text: 'Please check your email for the OTP.',
        timer: 1500,
        showConfirmButton: false,
      });
      setStep(2);
      setOtpTryCount(0);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Send OTP',
        text: err.response?.data?.message || 'An error occurred while sending the OTP.',
      });
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otpString.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://localhost:7026/api/Users/VerifyOTP',
        { email, otp: otpString },
        { withCredentials: true }
      );
      Swal.fire({
        icon: 'success',
        title: 'OTP Verified',
        text: 'You can now reset your password.',
        timer: 1500,
        showConfirmButton: false,
      });
      setStep(3);
    } catch (err) {
      const tries = otpTryCount + 1;
      setOtpTryCount(tries);
      if (tries >= maxOtpTries) {
        Swal.fire({
          icon: 'error',
          title: 'Too Many Attempts',
          text: 'Maximum OTP attempts exceeded. Please try again later.',
        });
      } else {
        toast.error(`Invalid or expired OTP. You have ${maxOtpTries - tries} attempt(s) left.`);
      }
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    setPasswordMismatch(false);
    setResetLoading(true);
    try {
      const response = await axios.post(
        'https://localhost:7026/api/Users/ForgotPassword',
        { email, password: newPassword }
      );

      Swal.fire({
        icon: 'success',
        title: 'Password Reset Successful',
        text: 'You will be redirected to the login page.',
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Password Reset Failed',
        text: err.response?.data?.message || 'Failed to update password.',
      });
    }
    setResetLoading(false);
  };

  const renderStepIndicator = () => {
    const steps = ['Send OTP', 'Verify OTP', 'Reset Password'];
    return (
      <div className="d-flex justify-content-between mb-3">
        {steps.map((label, index) => {
          const stepNum = index + 1;
          const isActive = step === stepNum;
          const isCompleted = step > stepNum;

          return (
            <div
              key={label}
              className={`flex-fill text-center pb-2 border-bottom ${
                isActive
                  ? 'border-primary fw-bold text-primary'
                  : isCompleted
                  ? 'border-success text-success'
                  : 'border-secondary text-muted'
              }`}
              style={{ cursor: 'default', userSelect: 'none' }}
            >
              {label}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center p-3">
      <div className="card shadow-sm p-4" style={{ maxWidth: '420px', width: '100%' }}>
        {renderStepIndicator()}

        <h3 className="text-primary text-center mb-4 fw-bold">Reset Password</h3>

        {/* Step 1: Send OTP */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <>
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Enter 6-digit OTP</label>
                <div className="d-flex justify-content-between">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="form-control text-center mx-1"
                      style={{ width: '3rem', fontSize: '1.5rem', letterSpacing: '0.3rem' }}
                      value={digit}
                      onChange={(e) => handleOtpChange(e, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      ref={(el) => (otpRefs.current[idx] = el)}
                      disabled={loading || otpTryCount >= maxOtpTries}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 mb-2"
                disabled={loading || otpTryCount >= maxOtpTries}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Verifying OTP...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </form>

            {otpTryCount >= maxOtpTries && (
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setOtpTryCount(0);
                  setOtp(['', '', '', '', '', '']);
                  setLoading(false);
                  handleSendOtp(new Event('submit'));
                }}
              >
                Resend OTP
              </button>
            )}
          </>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label fw-semibold">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="form-control"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordMismatch(false);
                }}
                placeholder="At least 6 characters"
                disabled={resetLoading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label fw-semibold">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordMismatch(false);
                }}
                placeholder="Re-enter your password"
                disabled={resetLoading}
              />
              {passwordMismatch && (
                <div className="form-text text-danger">Passwords do not match.</div>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={resetLoading}>
              {resetLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Updating Password...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ForgotPassword;
