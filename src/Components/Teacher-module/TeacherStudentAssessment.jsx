import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { ref, onValue, update } from 'firebase/database';
import '../../styles/teacherstudentassessment.css';
import GradingModal from '../../Components/Teacher-module/GradingModal';

const TeacherStudentAssessment = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [overallGrades, setOverallGrades] = useState({});
  const [isGradingAllowed, setIsGradingAllowed] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = () => {
    const studentsRef = ref(db, 'students');
    const gradesMap = {};

    onValue(studentsRef, (snapshot) => {
      const studentList = [];
      const studentsData = snapshot.val();
      if (studentsData) {
        Object.entries(studentsData).forEach(([studentID, studentData]) => {
          const assessmentsRef = ref(db, `assessments/${studentID}`);
          onValue(assessmentsRef, (assessmentSnapshot) => {
            const assessments = assessmentSnapshot.val();

            if (assessments?.status === 'graded' && assessments.overallGrade !== undefined) {
              gradesMap[studentID] = assessments.overallGrade;
            }

            const studentWithAssessments = {
              id: studentID,
              ...studentData,
              assessments: assessments,
            };
            studentList.push(studentWithAssessments);

            if (studentList.length === Object.keys(studentsData).length) {
              setStudents(studentList);
              setOverallGrades(gradesMap);
              setLoading(false);
            }
          });
        });
      }
    }, (error) => {
      console.error("Error fetching student data:", error);
      setLoading(false);
    });
  };

  const handleAssessmentClick = (studentID) => {
    const assessmentsRef = ref(db, `assessments/${studentID}`);
    onValue(assessmentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const assessmentData = snapshot.val();
        const student = students.find((s) => s.id === studentID);
  
        // Check if there are incomplete grades
        const gradesIncomplete = Object.values(assessmentData).some((assessment) => {
          return assessment.grade === 0 || isNaN(assessment.grade);
        });
  
        setSelectedStudent({
          ...student,
          assessmentData: filterAssessmentData(assessmentData),
          status: assessmentData.status,
        });
  
        // Allow grading if not all grades are completed
        setIsGradingAllowed(gradesIncomplete || assessmentData.status !== 'graded');
        setIsModalOpen(true);
      } else {
        console.log("No assessment data found for this student.");
        setSelectedStudent(null);
      }
    });
  };  

  const filterAssessmentData = (data) => {
    if (data) {
      const filteredData = {};
      Object.keys(data).forEach(key => {
        if (!['email', 'name', 'section', 'studentID', 'overallGrade', 'status'].includes(key)) {
          filteredData[key] = data[key];
        }
      });
      return filteredData;
    }
    return {};
  };

  const openGradingModal = () => {
    if (isGradingAllowed) {
      setIsGradingModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const closeGradingModal = () => {
    setIsGradingModalOpen(false);
  };

  const handleGradeSubmit = (grades) => {
    if (selectedStudent) {
      const studentID = selectedStudent.id;
      let totalGrade = 0;
      let allGradesComplete = true; // Flag to check if all grades are complete
  
      // Check if all grades are complete
      Object.values(grades).forEach((grade) => {
        totalGrade += grade;
        if (grade === 0 || isNaN(grade)) {
          allGradesComplete = false; // Mark incomplete if any grade is zero or invalid
        }
      });
  
      const overallGrade = totalGrade;
  
      // Only mark as 'graded' if all grades are filled in
      const updates = {
        [`assessments/${studentID}/overallGrade`]: overallGrade,
      };
  
      // Only update the status if all grades are complete
      if (allGradesComplete) {
        updates[`assessments/${studentID}/status`] = 'graded';
      }
  
      Object.entries(grades).forEach(([assessmentName, grade]) => {
        updates[`assessments/${studentID}/${assessmentName}/grade`] = grade;
      });
  
      update(ref(db), updates)
        .then(() => {
          console.log("Grades submitted successfully.");
          setOverallGrades((prev) => ({
            ...prev,
            [studentID]: overallGrade,
          }));
          fetchStudentData(); // Refresh student data after grading
        })
        .catch((error) => {
          console.error("Error submitting grades:", error);
        });
    }
  };
  

  const gradingRubric = (
    <div className="grading-rubric">
      <h4>Grading Rubric (Total: 15 Points) Per Assessment</h4>
      <p><strong>Clarity (5 points):</strong> The student's responses are clear and well-organized.</p>
      <p><strong>Content (5 points):</strong> The answers are complete and directly address the questions asked.</p>
      <p><strong>Accuracy (5 points):</strong> The responses are factually correct and align with the expected answer.</p>
    </div>
  );

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
            <th>Grade</th>
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
                <td>{student.assessments?.status === 'graded' ? 
                  (typeof overallGrades[student.id] === 'number' ? overallGrades[student.id].toFixed(2) : 'N/A') : 'Pending'}
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No students found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && selectedStudent && (
        <div className="assessment-modal-overlay">
          <div className="assessment-modal-content">
            <h2>Assessment Details for {selectedStudent.studentID}</h2>
            <h3>Status: {selectedStudent.status === 'graded' ? 'Graded' : 'Pending'}</h3>

            <h3>Student Information</h3>
            <p><strong>Student ID:</strong> {selectedStudent.studentID || 'N/A'}</p>
            <p><strong>Name:</strong> {`${selectedStudent.firstName} ${selectedStudent.lastName}`}</p>
            <p><strong>Section:</strong> {selectedStudent.section}</p>

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
                          <td>{typeof answer === 'object' ? (answer.grade || 'N/A') : answer}</td>
                        </tr>
                      ))}

                      </tbody>
                    </table>
                  </div>
                ))}
                {isGradingAllowed && <button onClick={openGradingModal}>Grade Answers</button>}
              </div>
            ) : (
              <p>No assessment data available.</p>
            )}
            {gradingRubric}
            <button onClick={closeModal} className="assessment-close-button">Close</button>
          </div>
        </div>
      )}

      {isGradingModalOpen && selectedStudent && (
        <GradingModal
          isOpen={isGradingModalOpen}
          onClose={closeGradingModal}
          onSubmitGrade={handleGradeSubmit}
          assessmentDetails={selectedStudent.assessmentData || {}}
        />
      )}
    </div>
  );
};

export default TeacherStudentAssessment;
