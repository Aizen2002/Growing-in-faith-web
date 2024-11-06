import React, { useState } from 'react';
import './LoginRegister.css';
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, get, child, update } from 'firebase/database';
import { auth } from '../../firebase';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import OTPModal from './OTPModal'; // Create an OTP modal component

const LoginRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState(null); // Store the sent OTP
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const navigate = useNavigate();
  const database = getDatabase();

  const handleLogin = async (event) => {
    event.preventDefault();
    const superAdminEmail = "adminaccount@gmail.com";

    try {
        if (email === superAdminEmail) {
            // Super Admin Login
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            toast.success('Superadmin login successful! Redirecting...');
            setTimeout(() => navigate('/super-admin'), 3000);
        } else {
            const dbRef = ref(database);

            // Check Teacher Credentials
            const teacherSnapshot = await get(child(dbRef, 'teachers'));
            let userFound = false;

            teacherSnapshot.forEach((childSnapshot) => {
                const teacherData = childSnapshot.val();
                if (teacherData.email === email) {
                    userFound = true;
                    if (teacherData.password === password) {
                        const teacherId = childSnapshot.key; // Get unique ID
                        localStorage.setItem('teacherId', teacherId); // Store in localStorage

                        toast.success('Teacher login successful! Redirecting...');
                        setTimeout(() => navigate('/teacher'), 3000);
                    } else {
                        toast.error('Invalid password. Please try again.');
                    }
                }
            });

            // Check Student Credentials if not found as Teacher
            if (!userFound) {
                const studentSnapshot = await get(child(dbRef, 'students'));
                
                studentSnapshot.forEach((childSnapshot) => {
                    const studentData = childSnapshot.val();
                    if (studentData.email === email) {
                        userFound = true;
                        if (studentData.password === password) {
                            const studentId = childSnapshot.key; // Get unique ID
                            localStorage.setItem('studentId', studentId); // Store in localStorage

                            toast.success('Student login successful! Redirecting...');
                            setTimeout(() => navigate('/student'), 3000);
                        } else {
                            toast.error('Invalid password. Please try again.');
                        }
                    }
                });

                if (!userFound) {
                    toast.error('Access denied. You are not registered as a teacher or student.');
                }
            }
        }
    } catch (error) {
        console.error("Login error:", error);
        toast.error('An error occurred while trying to log in. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    setIsOTPModalOpen(true);
  };

  const sendOtp = async () => {
    // Generate a random OTP (in production, use a secure method)
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(generatedOtp);
    
    // Send the OTP to the user's email
    // Note: Implement email sending via a backend service or Firebase Functions
    console.log(`Sending OTP ${generatedOtp} to ${email}`);
    
    toast.success('OTP sent to your email. Please check your inbox.');
  };

  const verifyOtp = () => {
    if (otp === sentOtp) {
      setIsVerifyingOtp(true);
      toast.success('OTP verified! You can now reset your password.');
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  const resetPassword = async (newPassword) => {
    const dbRef = ref(database);
    const teacherSnapshot = await get(child(dbRef, 'teachers'));
    let emailFound = false;

    teacherSnapshot.forEach((childSnapshot) => {
      const teacherData = childSnapshot.val();
      if (teacherData.email === email) {
        emailFound = true;
        const teacherId = childSnapshot.key; // Get unique ID

        // Update the password
        update(ref(database, `teachers/${teacherId}`), { password: newPassword })
          .then(() => {
            toast.success('Password updated successfully!');
            setIsOTPModalOpen(false);
            setIsVerifyingOtp(false);
          })
          .catch((error) => {
            toast.error('Failed to update password. Please try again.');
          });
      }
    });

    if (!emailFound) {
      toast.error('Email not found.');
    }
  };

  return (
    <div className="login-page">
      <div className='wrapper'>
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>

            <div className="input-box">
              <input 
                type="text" 
                placeholder='Email' 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <FaUser className='icon' />
            </div>

            <div className="input-box">
              <input 
                type="password" 
                placeholder='Password' 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <FaLock className='icon' />
            </div>

            <div className="remember-forgot">
              <a href="#" onClick={handleForgotPassword}> Forgot Password? </a>
            </div>

            <button type="submit">Login</button>
          </form>
        </div>
        
        {/* OTP Modal */}
        <OTPModal 
          isOpen={isOTPModalOpen}
          onClose={() => setIsOTPModalOpen(false)}
          onSendOtp={sendOtp}
          onVerifyOtp={verifyOtp}
          otp={otp}
          setOtp={setOtp}
          onResetPassword={resetPassword}
          isVerifyingOtp={isVerifyingOtp}
        />
      </div>

      {/* Toast notification container */}
      <ToastContainer />
    </div>
  );
};

export default LoginRegister;
