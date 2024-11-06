  import React, { useState } from "react";
  import { ref, push, set } from "firebase/database"; // Import ref, push, and set
  import { db } from "../firebase"; // Import the db instance
  import '../styles/RegisterTeacher.css'

  const RegisterTeacher = () => {
    // Form state initialization with updated fields (added password)
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      phoneNumber: "",
      password: "", // New password field
      department: "Christian education department", // Fixed value for department
      gender: "",
      role: "Teacher", // Fixed value for role
    });

    // Handle input change
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    // Function to submit form data
    const handleSubmit = (e) => {
      e.preventDefault();

      // Reference to the "teachers" collection in the Realtime Database
      const newTeacherRef = push(ref(db, "teachers")); // Generate a unique key

      // Save the form data to the Realtime Database using the generated key
      set(newTeacherRef, formData)
        .then(() => {
          alert("Teacher registered successfully!");
          // Reset form fields
          setFormData({
            firstName: "",
            lastName: "",
            middleName: "",
            email: "",
            phoneNumber: "",
            password: "", // Reset password field
            department: "Christian education department", // Fixed department
            gender: "",
            role: "Teacher", // Reset role field to "Teacher"
          });
        })
        .catch((error) => {
          console.error("Error saving data:", error);
          alert("Failed to register the teacher.");
        });
    };

    return (
      <div className="form-container">
        <h2 className="reg-title">Register a Teacher</h2>
        <form className="reg-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Middle Name</label>
            <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label> {/* New Password Field */}
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
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
      </div>
    );
  };

  export default RegisterTeacher;
