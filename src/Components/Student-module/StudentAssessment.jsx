import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import '../../styles/studentassessment.css';

const StudentAssessment = () => {
  const [assessmentData, setAssessmentData] = useState(null);

  const studentUniqueID = localStorage.getItem('studentId');

  useEffect(() => {
    if (!studentUniqueID) {
      console.error("Error: No student unique ID found. Please make sure you're logged in.");
      return;
    }

    const db = getDatabase();
    const assessmentRef = ref(db, `assessments/${studentUniqueID}`);

    const unsubscribe = onValue(assessmentRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        // Filter out non-assessment data (e.g., 'email', 'name', etc.)
        const assessmentOnlyData = Object.keys(data)
          .filter(key => key.includes("Assessment")) // Only include keys that contain "Assessment"
          .reduce((obj, key) => {
            obj[key] = data[key];
            return obj;
          }, {});

        // Map through assessment-only data for display
        const assessmentList = Object.entries(assessmentOnlyData).map(([title, answers]) => {
          const flattenedAnswers = Object.entries(answers).map(([question, answer]) => ({
            question,
            answer
          }));
          return {
            title,
            answers: flattenedAnswers
          };
        });

        setAssessmentData(assessmentList);
      } else {
        console.log("No assessment data found for this student.");
        setAssessmentData(null);
      }
    });

    return () => unsubscribe();
  }, [studentUniqueID]);

  if (!studentUniqueID) {
    return <p>Error: No student unique ID found. Please make sure you're logged in.</p>;
  }

  return (
    <div className="assessment-container">
      <h2>Assessment Details</h2>
      {assessmentData ? (
        <table className="assessment-table">
          <thead>
            <tr>
              <th>Assessment Title</th>
              <th>Question</th>
              <th>Answer</th>
            </tr>
          </thead>
          <tbody>
            {assessmentData.map((assessment, index) => (
              <React.Fragment key={index}>
                {assessment.answers.map((answerObj, idx) => (
                  <tr key={idx}>
                    {idx === 0 && (
                      <td rowSpan={assessment.answers.length}>
                        {assessment.title}
                      </td>
                    )}
                    <td>{answerObj.question}</td>
                    <td>{answerObj.answer}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No assessment data available for this student.</p>
      )}
    </div>
  );
};

export default StudentAssessment;
