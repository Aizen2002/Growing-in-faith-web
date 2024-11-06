import React, { useState, useEffect } from "react";
import { ref, push, set, onValue } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../../firebase"; // Ensure 'auth' is imported from your Firebase config
import '../../styles/studentRegistration.css';

const StudentRegistration = () => {
  const [formData, setFormData] = useState({
    studentID: "",
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phoneNumber: "",
    password: "",
    section: "",
    gender: "",
    role: "Student",
  });

  const [students, setStudents] = useState([]);

  useEffect(() => {
    const studentsRef = ref(db, "students");
    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      const studentList = data ? Object.entries(data).map(([id, details]) => ({ id, ...details })) : [];
      setStudents(studentList);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create user in Firebase Authentication
    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        const studentID = user.uid; // Use Firebase Auth UID as the student ID for consistency

        // Prepare data to save in Realtime Database
        const newStudentData = { ...formData, studentID };

        // Save full student data in "students" table
        return set(ref(db, `students/${studentID}`), newStudentData)
          .then(() => {
            // Create an entry in the "assessments" table with only selected fields
            const assessmentData = {
              studentID: studentID,
              name: `${formData.firstName} ${formData.lastName}`,
              section: formData.section,
              email: formData.email,
              DanielAndLionsDen: {
                Q1: "",
                Q2: ""
              }
            };

            // Save assessment data to the "assessments" node using the same ID as the student
            return set(ref(db, `assessments/${studentID}`), assessmentData);
          });
      })
      .then(() => {
        alert("Student registered and authenticated successfully!");
        setFormData({
          studentID: "",
          firstName: "",
          lastName: "",
          middleName: "",
          email: "",
          phoneNumber: "",
          password: "",
          section: "",
          gender: "",
          role: "Student",
        });
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        alert("Failed to register the student.");
      });
  };

  return (
    <div className="form-container">
      <h2 className="reg-title">Register a Student</h2>
      <form className="reg-form" onSubmit={handleSubmit}>
        {/* Registration form fields */}
        <div className="form-group">
          <label>Student ID</label>
          <input type="text" name="studentID" value={formData.studentID} onChange={handleChange} required />
        </div>
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
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Section</label>
          <select name="section" value={formData.section} onChange={handleChange} required>
            <option value="">Select section</option>
            <option value="St. Gabriel">St. Gabriel</option>
            <option value="St. Michael">St. Michael</option>
          </select>
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

      {/* Registered Students Table */}
      <div className="student-table">
        <h2 className="table-title">Registered Students</h2>
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Email</th>
              <th>Section</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id}>
                  <td>{student.studentID}</td>
                  <td>{student.lastName}</td>
                  <td>{student.firstName}</td>
                  <td>{student.middleName}</td>
                  <td>{student.email}</td>
                  <td>{student.section}</td>
                  <td>{student.gender}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No students registered yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentRegistration;