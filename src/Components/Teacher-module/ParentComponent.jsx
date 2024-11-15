import React, { useState } from 'react';
import GradingModal from './GradingModal';

const ParentComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assessmentDetails, setAssessmentDetails] = useState({
    question1: { answer: 'Answer 1', grade: null },
    question2: { answer: 'Answer 2', grade: null },
    question3: { answer: 'Answer 3', grade: null },
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleGradeSubmission = (gradedAssessments) => {
    setAssessmentDetails((prevDetails) => {
      const updatedDetails = { ...prevDetails };

      // Update only the graded fields
      Object.entries(gradedAssessments).forEach(([question, grade]) => {
        if (updatedDetails[question]) {
          updatedDetails[question].grade = grade;
        }
      });

      return updatedDetails;
    });

    console.log('Grades submitted:', gradedAssessments);
  };

  // Always show the Grade Answer button until all grades are completed
  const hasUngradedQuestions = Object.values(assessmentDetails).some(
    (item) => item.grade === null
  );

  return (
    <div>
      {/* Grade Answer Button - Always visible if ungraded questions exist */}
      {hasUngradedQuestions && (
        <button onClick={handleOpenModal} className="grade-answer-button">
          Grade Answer
        </button>
      )}

      {/* Grading Modal */}
      <GradingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        assessmentDetails={assessmentDetails}
        assessmentId="exampleAssessmentId"
        onSubmitGrade={handleGradeSubmission}
      />
    </div>
  );
};

export default ParentComponent;
