import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import '../../styles/studentassessment.css';

const StudentAssessment = () => {
  const [assessmentData, setAssessmentData] = useState(null);
  const [comment, setComment] = useState("No comment available"); // Default comment

  const studentUniqueID = localStorage.getItem('studentId');

  useEffect(() => {
    if (!studentUniqueID) {
      console.error("Error: No student unique ID found. Please make sure you're logged in.");
      return;
    }

    const db = getDatabase();

    // Fetch assessment data
    const assessmentRef = ref(db, `assessments/${studentUniqueID}`);
    const unsubscribeAssessments = onValue(assessmentRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Assessment Data:", data); // Debugging: Check the entire data structure

        // Extract assessments
        const assessmentOnlyData = Object.keys(data)
          .filter((key) => key.includes("Assessment")) // Include only assessment keys
          .reduce((obj, key) => {
            obj[key] = data[key];
            return obj;
          }, {});

        const assessmentList = Object.entries(assessmentOnlyData).map(
          ([title, answers]) => {
            const flattenedAnswers = Object.entries(answers).map(
              ([question, answer]) => ({
                question,
                answer,
              })
            );
            return {
              title,
              answers: flattenedAnswers,
            };
          }
        );

        setAssessmentData({ assessments: assessmentList });
      } else {
        console.log("No assessment data found for this student.");
        setAssessmentData(null);
      }
    });

    // Fetch comment data from comments table (nested structure)
    const commentRef = ref(db, `comments/undefined/${studentUniqueID}`);
    const unsubscribeComment = onValue(commentRef, (snapshot) => {
      if (snapshot.exists()) {
        setComment(snapshot.val()); // Set the comment for the specific student
      } else {
        console.log("No comment found for this student.");
        setComment("No comment available"); // Default message if no comment is found
      }
    });

    return () => {
      unsubscribeAssessments();
      unsubscribeComment();
    };
  }, [studentUniqueID]);

  if (!studentUniqueID) {
    return <p>Error: No student unique ID found. Please make sure you're logged in.</p>;
  }

  return (
    <div className="assessment-container">
      <h2>Assessment Details</h2>
      {assessmentData ? (
        <>
          <table className="assessment-table">
            <thead>
              <tr>
                <th>Assessment Title</th>
                <th>Question</th>
                <th>Answer</th>
              </tr>
            </thead>
            <tbody>
              {assessmentData.assessments.map((assessment, index) => (
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
          <div className="overall-comment">
            <h3>Overall Comment</h3>
            <p>{comment}</p> {/* Display the comment from the nested structure */}
          </div>
        </>
      ) : (
        <p>No assessment data available for this student.</p>
      )}
    </div>
  );
};

export default StudentAssessment;
