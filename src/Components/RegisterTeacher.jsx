import React, { useState } from "react";
import { ref, push, set } from "firebase/database";
import { db } from "../firebase";
import "../styles/RegisterTeacher.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterTeacher = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phoneNumber: "",
    password: "",
    department: "Christian education department",
    gender: "",
    role: "Teacher",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Password validation
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
  
    const newTeacherRef = push(ref(db, "teachers"));
  
    set(newTeacherRef, formData)
      .then(() => {
        toast.success("Teacher registered successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setFormData({
          firstName: "",
          lastName: "",
          middleName: "",
          email: "",
          phoneNumber: "",
          password: "",
          department: "Christian education department",
          gender: "",
          role: "Teacher",
        });
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        toast.error("Failed to register the teacher.", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };
  
  return (
    <div className="form-container">
      <h2 className="reg-title">Register a Teacher</h2>
      <form className="reg-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Middle Name</label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Department</label>
          <input type="text" name="department" value={formData.department} readOnly />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Role</label>
          <input type="text" name="role" value={formData.role} readOnly />
        </div>
        <button type="submit">Register</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default RegisterTeacher;
