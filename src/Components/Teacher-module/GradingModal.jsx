  import React, { useState, useEffect } from 'react';
  import Modal from 'react-modal';
  import { getDatabase, ref, set } from 'firebase/database';
  import { toast } from 'react-toastify'; // Import toast
  import 'react-toastify/dist/ReactToastify.css'; // Import the styles
  import '../../styles/gradingmodal.css';

  Modal.setAppElement('#root');

  const GradingModal = ({ isOpen, onClose, onSubmitGrade, assessmentDetails, assessmentId }) => {
    const [grades, setGrades] = useState({});
    const [error, setError] = useState(null);
    const [totalScore, setTotalScore] = useState(0); // Track the overall score

    // Initialize grades when assessmentDetails are provided
    useEffect(() => {
      if (assessmentDetails) {
        const initialGrades = {};
        let score = 0;
        Object.keys(assessmentDetails).forEach((question) => {
          const assessmentData = assessmentDetails[question];
          initialGrades[question] = assessmentData.grade || ''; // Default to blank if no grade exists
          if (assessmentData.grade) {
            score += assessmentData.grade;
          }
        });
        setGrades(initialGrades);
        setTotalScore(score); // Set the total score based on graded questions
      }
    }, [assessmentDetails]);

    // Handle grade changes
    const handleGradeChange = (question, value) => {
      const numValue = value === '' ? '' : Number(value); // Allow empty input and handle as a number
      // Ensure value is a valid number between 0 and 15
      if (value !== '' && (isNaN(numValue) || numValue < 0 || numValue > 15)) {
        setError('Grade must be a number between 0 and 15');
        return;
      }
      setError(null); // Clear error on valid input
      const updatedGrades = {
        ...grades,
        [question]: numValue,
      };

      // Recalculate total score based on updated grades
      let newTotalScore = 0;
      Object.values(updatedGrades).forEach((grade) => {
        if (grade !== '') {
          newTotalScore += grade; // Only count graded assessments
        }
      });

      setGrades(updatedGrades);
      setTotalScore(newTotalScore); // Update total score
    };

    // Submit grades to Firebase
    const handleSubmit = () => {
      const db = getDatabase();
      const assessmentRef = ref(db, `assessments/${assessmentId}`);

      // Only submit the grades for graded assessments, ungraded assessments remain ungraded
      const gradesToSubmit = Object.entries(grades).reduce((acc, [question, grade]) => {
        if (grade !== '') { // Only include graded assessments
          acc[question] = grade;
        }
        return acc;
      }, {});

      set(assessmentRef, gradesToSubmit)
        .then(() => {
          onSubmitGrade(gradesToSubmit); // Notify parent component
          toast.success('Grades submitted successfully!'); // Show success toast
          onClose(); // Close modal
        })
        .catch((error) => {
          setError('An error occurred while submitting grades.');
          console.error(error);
          toast.error('Error submitting grades. Please try again.'); // Show error toast
        });
    };

    // Render answers (handling objects)
    const renderAnswer = (answer) => {
      if (typeof answer === 'object') {
        return JSON.stringify(answer, null, 2); // Beautify the JSON output for readability
      }
      return answer || 'No answer provided';
    };

    // Check if all assessments are graded to decide whether to show the "Grade Answer" button
    const isAllGraded = Object.values(grades).every((grade) => grade !== '');

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="grading-modal"
        overlayClassName="grading-modal-overlay"
      >
        <h2>Grade Assessment</h2>

        {/* Display error if there's any */}
        {error && <div className="error-message">{error}</div>}

        <div>
          {assessmentDetails && Object.keys(assessmentDetails).length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(assessmentDetails).map(([question, answerObj]) => {
                  if (question === 'grade') return null; // Skip the grade key

                  const answerText = renderAnswer(answerObj);
                  const gradeValue = grades[question] !== '' ? grades[question] : '';

                  return (
                    <tr key={question}>
                      <td>{question.replace(/_/g, ' ')}</td>
                      <td>{answerText}</td>
                      <td>
                        <input
                          type="number"
                          value={gradeValue}
                          onChange={(e) => handleGradeChange(question, e.target.value)}
                          min="0"
                          max="15"
                          step="1"  // Allow proper step increments
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>No assessment data available to grade.</p>
          )}
        </div>

        <div>
          <h3>Total Score: {totalScore}</h3> {/* Display the calculated total score */}
        </div>

        <div className="modal-buttons">
          {/* Submit button remains active, even if grades are incomplete */}
          <button onClick={handleSubmit} className="submit-grade-button">
            Submit Grades
          </button>
          {!isAllGraded && (
            <div className="error-message">Some assessments are missing grades.</div>
          )}
          <button onClick={onClose} className="close-modal-button">Close</button>
        </div>
      </Modal>
    );
  };

  export default GradingModal;
