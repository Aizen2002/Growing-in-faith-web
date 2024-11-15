import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { ref, get } from "firebase/database";
import "../../styles/studentProfile.css";

const StudentProfile = () => {
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // State to show/hide modal
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentData = async () => {
            const storedStudentId = localStorage.getItem('studentId'); // Retrieve stored student ID

            if (!storedStudentId) {
                console.log("No student ID found in local storage.");
                setLoading(false);
                return;
            }

            try {
                const studentRef = ref(db, `students/${storedStudentId}`);
                const snapshot = await get(studentRef);

                if (snapshot.exists()) {
                    setStudentData(snapshot.val());
                } else {
                    console.log("No data available for this student.");
                }
            } catch (error) {
                console.error("Error fetching student data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, []);

    const handleLogout = () => {
        // Clear localStorage to remove the authentication data
        localStorage.removeItem('studentId');
        localStorage.removeItem('userEmail'); // Or any other keys related to login
    
        // Navigate to login page after logout
        navigate('/login');
      };
    

    const openModal = () => {
        setShowModal(true); // Show the modal
    };

    const closeModal = () => {
        setShowModal(false); // Hide the modal
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!studentData) {
        return <p>Student information not found.</p>;
    }

    return (
        <div className="student-profile">
            <div className="profile-header">
                <h2>{studentData.firstName} {studentData.lastName}</h2>
                <p>Active: Now</p>
            </div>
            <div className="profile-info">
                <p><strong>Section:</strong> {studentData.section}</p>
                <p><strong>Gender:</strong> {studentData.gender}</p>
                <p><strong>Email:</strong> {studentData.email}</p>
                <p><strong>Student ID:</strong> {studentData.studentID}</p>
            </div>
            <button className="logout-button" onClick={openModal}>
                Log Out
            </button>

            {showModal && (
                <div className="modal-overlay">
                    <div className="spmodal">
                        <p>Are you sure you want to log out?</p>
                        <button className="confirm-button" onClick={handleLogout}>
                            Confirm
                        </button>
                        <button className="cancel-button" onClick={closeModal}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentProfile;
