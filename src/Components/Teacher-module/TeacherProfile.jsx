import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { ref, get } from "firebase/database";
import "../../styles/teacherProfile.css";

const TeacherProfile = () => {
    const [teacherData, setTeacherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [teacherId, setTeacherId] = useState(null);

    useEffect(() => {
        const fetchTeacherData = async () => {
            const storedTeacherId = localStorage.getItem('teacherId'); // Retrieve stored ID
            setTeacherId(storedTeacherId); // Store teacherId in state

            if (!storedTeacherId) {
                console.log("No teacher ID found in local storage.");
                setLoading(false);
                return;
            }

            try {
                const teacherRef = ref(db, `teachers/${storedTeacherId}`);
                const snapshot = await get(teacherRef);

                if (snapshot.exists()) {
                    setTeacherData(snapshot.val());
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
                <p><strong>ID:</strong> {teacherId}</p> {/* Display the teacherId */}
            </div>
        </div>
    );
};

export default TeacherProfile;
