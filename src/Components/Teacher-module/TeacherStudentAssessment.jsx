// TeacherStudentAssessment.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; // Make sure this path is correct
import { ref, onValue } from 'firebase/database';
import '../../styles/teacherstudentassessment.css'; // Ensure you import the CSS for styling

const TeacherStudentAssessment = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for data fetching

  useEffect(() => {
    const studentsRef = ref(db, 'students'); // Access the students node in Firebase
    onValue(studentsRef, (snapshot) => {
      const studentList = [];
      snapshot.forEach((childSnapshot) => {
        const studentData = childSnapshot.val();
        studentList.push({
          id: childSnapshot.key, // Firebase key, in case you need it for other purposes
          ...studentData, // Spread student data to include all fields
        });
      });
      setStudents(studentList);
      setLoading(false); // Set loading to false after data is fetched
    }, (error) => {
      console.error("Error fetching student data:", error); // Error handling
      setLoading(false); // Ensure loading is set to false even on error
    });
  }, []);

  // Handle button click to view assessments (you may replace this with actual logic)
  const handleAssessmentClick = (studentID) => {
    console.log(`View assessments for student ID: ${studentID}`);
    // Add your logic to navigate or fetch assessment details
  };

  // Show loading message while fetching data
  if (loading) {
    return <div>Loading student data...</div>;
  }

  return (
    <div className='stud-assessment-content'>
      <h1>Student Assessments</h1>
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Section</th>
            <th>Assessment</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.id}>
                {/* Display actual fields as entered during registration */}
                <td>{student.studentID || 'N/A'}</td>
                <td>{`${student.firstName} ${student.lastName}`}</td>
                <td>{student.email}</td>
                <td>{student.section}</td>
                <td>
                  <button onClick={() => handleAssessmentClick(student.studentID)}>
                    Click to view
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No students found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherStudentAssessment;
