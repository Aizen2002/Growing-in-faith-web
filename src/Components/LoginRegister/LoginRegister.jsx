import React, { useState } from 'react';
import './LoginRegister.css';
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, get, child, set } from 'firebase/database';
import { auth } from '../../firebase'; // Assuming this is where you initialize Firebase
import { sendPasswordResetEmail } from 'firebase/auth'; // Import the method for sending reset email
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import OTPModal from './OTPModal';

const LoginRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState(null); 
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false);
  const navigate = useNavigate();
  const database = getDatabase();
  

  const handleLogin = async (event) => {
    event.preventDefault();
    const superAdminEmail = "dejesus.florenceayen.06@gmail.com";

    try {
      if (email === superAdminEmail) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('userEmail', email); 
        toast.success('Superadmin login successful! Redirecting...');
        setTimeout(() => navigate('/super-admin'), 3000);
      } else {
        const dbRef = ref(database);
        let userFound = false;

        // Check Teacher Credentials
        const teacherSnapshot = await get(child(dbRef, 'teachers'));
        teacherSnapshot.forEach((childSnapshot) => {
          const teacherData = childSnapshot.val();
          if (teacherData.email === email) {
            userFound = true;
            if (teacherData.password === password) {
              const teacherId = childSnapshot.key;
              localStorage.setItem('teacherId', teacherId);
              localStorage.removeItem('studentId'); // Clear studentId if teacher logs in

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
                const studentId = childSnapshot.key;
                localStorage.setItem('studentId', studentId);
                localStorage.removeItem('teacherId'); // Clear teacherId if student logs in

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
    try {
      // Use Firebase Authentication to send password reset email
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Please check your inbox.');
      setIsOTPModalOpen(false); // Close the OTP modal if open
      setIsPasswordChangeModalOpen(true); // Open the password change modal after sending reset email
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast.error('Error sending password reset email. Please try again.');
    }
  };

  const sendOtp = async () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(generatedOtp);
    
    console.log(`Sending OTP ${generatedOtp} to ${email}`);
    toast.success('OTP sent to your email. Please check your inbox.');
  };

  const verifyOtp = () => {
    if (otp === sentOtp) {
      setIsVerifyingOtp(true);
      toast.success('OTP verified! You can now reset your password.');
      setIsPasswordChangeModalOpen(true); // Open password change modal after OTP is verified
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  const handleNewPasswordSubmit = async () => {
    try {
      // Only update the password in the Realtime Database for the teacher or student
      const dbRef = ref(database);
      
      // Check for teachers first
      const teacherSnapshot = await get(child(dbRef, 'teachers'));
      teacherSnapshot.forEach((childSnapshot) => {
        const teacherData = childSnapshot.val();
        if (teacherData.email === email) {
          const teacherId = childSnapshot.key;
          const teacherRef = ref(database, `teachers/${teacherId}`);
          set(teacherRef, { ...teacherData, password: newPassword });
        }
      });

      // Check for students if not found as a teacher
      const studentSnapshot = await get(child(dbRef, 'students'));
      studentSnapshot.forEach((childSnapshot) => {
        const studentData = childSnapshot.val();
        if (studentData.email === email) {
          const studentId = childSnapshot.key;
          const studentRef = ref(database, `students/${studentId}`);
          set(studentRef, { ...studentData, password: newPassword });
        }
      });

      toast.success('Password updated successfully!');
      setIsPasswordChangeModalOpen(false); // Close modal after successful password change
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error('Error updating password. Please try again.');
    }
  };

  console.log("isPasswordChangeModalOpen:", isPasswordChangeModalOpen); // Debugging statement to check modal state

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
        
        <OTPModal 
          isOpen={isOTPModalOpen}
          onClose={() => setIsOTPModalOpen(false)}
          onSendOtp={sendOtp}
          onVerifyOtp={verifyOtp}
          otp={otp}
          setOtp={setOtp}
          isVerifyingOtp={isVerifyingOtp}
        />

        {/* Modal for entering new password */}
        {isPasswordChangeModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Enter a New Password</h2>
              <input 
                type="password" 
                placeholder="New Password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button onClick={handleNewPasswordSubmit}>Update Password</button>
              <button onClick={() => setIsPasswordChangeModalOpen(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default LoginRegister;
