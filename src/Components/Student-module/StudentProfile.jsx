import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { ref, get } from "firebase/database";
import "../../styles/studentProfile.css";

const StudentProfile = () => {
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [studentId, setStudentId] = useState(null);

    useEffect(() => {
        const fetchStudentData = async () => {
            const storedStudentId = localStorage.getItem('studentId'); // Retrieve stored student ID
            setStudentId(storedStudentId); // Store studentId in state

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
                <p><strong>ID:</strong> {studentId}</p> {/* Display the studentId */}
            </div>
        </div>
    );
};

export default StudentProfile;
