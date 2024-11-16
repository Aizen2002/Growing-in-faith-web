import React, { useState, useEffect } from "react";
import { ref, set, onValue, update, remove } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../styles/studentRegistration.css';

const StudentRegistration = () => {
  const [formData, setFormData] = useState({
    studentID: "",
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    password: "",
    section: "",
    gender: "",
    role: "Student",
  });

  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);

  useEffect(() => {
    const studentsRef = ref(db, "students");
    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      const studentList = data
        ? Object.entries(data).map(([id, details]) => ({
            id,
            ...details,
          }))
        : [];
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

    if (currentStudent) {
      const studentRef = ref(db, `students/${currentStudent.id}`);
      update(studentRef, formData)
        .then(() => {
          toast.success("Student information updated successfully!");
          setFormData({
            studentID: "",
            firstName: "",
            lastName: "",
            middleName: "",
            email: "",
            password: "",
            section: "",
            gender: "",
            role: "Student",
          });
          setCurrentStudent(null);
        })
        .catch((error) => {
          console.error("Error updating student:", error);
          toast.error("Failed to update the student.");
        });
    } else {
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          const user = userCredential.user;
          const studentID = formData.studentID;

          const newStudentData = { ...formData, studentID };

          return set(ref(db, `students/${user.uid}`), newStudentData)
            .then(() => {
              const assessmentData = {
                studentID: studentID,
                name: `${formData.firstName} ${formData.lastName}`,
                section: formData.section,
                email: formData.email,
              };

              return set(ref(db, `assessments/${user.uid}`), assessmentData);
            });
        })
        .then(() => {
          toast.success("Student registered and authenticated successfully!");
          setFormData({
            studentID: "",
            firstName: "",
            lastName: "",
            middleName: "",
            email: "",
            password: "",
            section: "",
            gender: "",
            role: "Student",
          });
        })
        .catch((error) => {
          console.error("Error during registration:", error);
          toast.error("Failed to register the student.");
        });
    }
  };

  const handleModify = (student) => {
    setCurrentStudent(student);
    setFormData({
      studentID: student.studentID,
      firstName: student.firstName,
      lastName: student.lastName,
      middleName: student.middleName,
      email: student.email,
      password: "",
      section: student.section,
      gender: student.gender,
      role: student.role,
    });
  };

  const handleDelete = (studentId) => {
    const studentRef = ref(db, `students/${studentId}`);
    remove(studentRef)
      .then(() => {
        const assessmentRef = ref(db, `assessments/${studentId}`);
        return remove(assessmentRef);
      })
      .then(() => {
        toast.success("Student and their assessment data deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting student or assessment:", error);
        toast.error("Failed to delete the student and their assessment data.");
      });
  };

  return (
    <div className="form-container">
      <h2 className="reg-title">{currentStudent ? "Modify Student" : "Register a Student"}</h2>
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
        <button type="submit">{currentStudent ? "Update" : "Register"}</button>
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
              <th>Actions</th>
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
                  <td>
                    <div className="actions-btns">
                      <button onClick={() => handleModify(student)} className="modify-btn">Modify</button>
                      <button onClick={() => handleDelete(student.id)} className="delete-btn">Delete</button>
                    </div>
                  </td>
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

      {/* Toast notifications container */}
      <ToastContainer />
    </div>
  );
};

export default StudentRegistration;
