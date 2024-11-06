// OTPModal.jsx
import React, { useState } from 'react';
import './OTPModal.css'; // Add your styles

const OTPModal = ({ isOpen, onClose, onSendOtp, onVerifyOtp, otp, setOtp, onResetPassword, isVerifyingOtp }) => {
  const [email, setEmail] = useState(''); // State for email
  const [newPassword, setNewPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-background">
      <div className="modal-content-box">
        <span className="modal-close-button" onClick={onClose}>&times;</span>
        <h2 className="modal-title-text">Forgot Password</h2> {/* Header title for the modal */}
        <input 
          type="email" 
          className="modal-input-email"
          placeholder="Enter your email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <button className="modal-primary-button" onClick={onSendOtp}>Send OTP</button>
        <div>
          <input 
            type="text" 
            className="modal-input-otp"
            placeholder="Enter OTP" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)} 
            required 
          />
          <button className="modal-primary-button" onClick={onVerifyOtp}>Verify OTP</button>
        </div>
        {isVerifyingOtp && (
          <div>
            <input 
              type="password" 
              className="modal-input-password"
              placeholder="New Password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
            <button className="modal-primary-button" onClick={() => onResetPassword(newPassword)}>Reset Password</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPModal;
