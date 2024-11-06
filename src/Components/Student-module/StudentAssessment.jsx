// StudentAssessment.jsx
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import '../../styles/studentassessment.css'; // Ensure this CSS file exists for styling

const StudentAssessment = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const studentsRef = ref(db, 'students'); // Update to match your Firebase structure

    const unsubscribe = onValue(studentsRef, (snapshot) => {
      const studentsData = [];
      snapshot.forEach((childSnapshot) => {
        const studentId = childSnapshot.key;
        const studentData = childSnapshot.val();
        studentsData.push({ studentId, ...studentData });
      });
      setStudents(studentsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="stud-ascontent">
      <h2 className="module-title">Assessment Module</h2>
      <div className="progress">
        <h3>Your Progress:</h3>
        <div className="units">
          {students.map((student) => (
            <div className="unit-column" key={student.studentId}>
              <h4>{student.name || `${student.firstName} ${student.lastName}`}</h4>
              <div className="assessment">
                <p>Assessment #1</p>
                <p>{student.assessment1 || "Answer not available"}</p>
              </div>
              <div className="assessment">
                <p>Assessment #2</p>
                <p>{student.assessment2 || "Answer not available"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentAssessment;