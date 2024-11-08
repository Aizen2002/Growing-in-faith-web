import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import '../../styles/teacherstudentassessment.css';

const TeacherStudentAssessment = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch all students from the database
    const studentsRef = ref(db, 'students');
    onValue(studentsRef, (snapshot) => {
      const studentList = [];
      snapshot.forEach((childSnapshot) => {
        const studentData = childSnapshot.val();
        studentList.push({
          id: childSnapshot.key, // Firebase node ID
          ...studentData,
        });
      });
      setStudents(studentList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching student data:", error);
      setLoading(false);
    });
  }, []);

  const handleAssessmentClick = (studentID) => {
    // Fetch assessment information for the specific student
    const assessmentsRef = ref(db, `assessments/${studentID}`);
    onValue(assessmentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const assessmentData = snapshot.val();

        // Find the student details in the students list
        const student = students.find((s) => s.id === studentID);

        // Only keep the assessment data, excluding student information that is repeated
        setSelectedStudent({
          ...student,
          assessmentData: filterAssessmentData(assessmentData),
        });
        setIsModalOpen(true);
      } else {
        console.log("No assessment data found for this student.");
        setSelectedStudent(null);
      }
    });
  };

  const filterAssessmentData = (data) => {
    // Filter out any student information from the assessments data, if present
    if (data) {
      const filteredData = {};
      Object.keys(data).forEach(key => {
        // Keep only the assessment data (excluding fields like email, name, section, studentID)
        if (key !== 'email' && key !== 'name' && key !== 'section' && key !== 'studentID') {
          filteredData[key] = data[key];
        }
      });
      return filteredData;
    }
    return {};
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

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
                <td>{student.studentID || 'N/A'}</td>
                <td>{`${student.firstName} ${student.lastName}`}</td>
                <td>{student.email}</td>
                <td>{student.section}</td>
                <td>
                  <button onClick={() => handleAssessmentClick(student.id)}>
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

      {isModalOpen && selectedStudent && (
        <div className="assessment-modal-overlay">
          <div className="assessment-modal-content">
            <h2>Assessment Details for {selectedStudent.studentID}</h2>

            {/* Student Information Above Assessment Details */}
            <h3>Student Information</h3>
            <p><strong>Student ID:</strong> {selectedStudent.studentID || 'N/A'}</p>
            <p><strong>Name:</strong> {`${selectedStudent.firstName} ${selectedStudent.lastName}`}</p>
            <p><strong>Section:</strong> {selectedStudent.section}</p>

            {/* Assessments Section - Display each assessment and its answers in a table */}
            <h3>Assessments</h3>
            {selectedStudent.assessmentData && Object.keys(selectedStudent.assessmentData).length > 0 ? (
              <div className="assessment-sentences">
                {Object.entries(selectedStudent.assessmentData).map(([assessmentName, answers]) => (
                  <div key={assessmentName}>
                    <h4>{assessmentName}</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Question</th>
                          <th>Answer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(answers).map(([question, answer]) => (
                          <tr key={question}>
                            <td>{question}</td>
                            <td>{String(answer)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ) : (
              <p>No assessment data available.</p>
            )}

            {/* Close Button */}
            <button onClick={closeModal} className="assessment-close-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStudentAssessment;
