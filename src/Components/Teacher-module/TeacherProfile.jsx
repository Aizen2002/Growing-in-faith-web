import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { ref, get } from "firebase/database";
import "../../styles/teacherProfile.css";

const TeacherProfile = () => {
    const [teacherData, setTeacherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // State to show/hide modal
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeacherData = async () => {
            const storedTeacherId = localStorage.getItem('teacherId'); // Retrieve stored teacher ID

            if (!storedTeacherId) {
                console.log("No teacher ID found in local storage.");
                setLoading(false);
                return;
            }

            try {
                const teacherRef = ref(db, `teachers/${storedTeacherId}`);
                const snapshot = await get(teacherRef);

                if (snapshot.exists()) {
                    setTeacherData({ ...snapshot.val(), teacherID: storedTeacherId }); // Add the unique teacher ID to the data
                } else {
                    console.log("No data available for this teacher.");
                }
            } catch (error) {
                console.error("Error fetching teacher data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('teacherId'); // Clear the teacher ID from local storage
        navigate("/login"); // Redirect to the login page
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

    if (!teacherData) {
        return <p>Teacher information not found.</p>;
    }

    return (
        <div className="teacher-profile">
            <div className="profile-header">
                <h2>{teacherData.firstName} {teacherData.lastName}</h2>
                <p>Active: Now</p>
            </div>
            <div className="profile-info">
                <p><strong>Department:</strong> {teacherData.department}</p>
                <p><strong>Gender:</strong> {teacherData.gender}</p>
                <p><strong>Email:</strong> {teacherData.email}</p>
                <p><strong>Teacher ID:</strong> {teacherData.teacherID}</p> {/* Displaying unique teacher ID */}
            </div>
            <button className="logout-button" onClick={openModal}>
                Log Out
            </button>

            {showModal && (
                <div className="teacher-modal-overlay">
                    <div className="tpmodal">
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

export default TeacherProfile;
