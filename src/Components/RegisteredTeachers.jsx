import React, { useEffect, useState } from 'react';
import { ref, onValue, remove, update } from 'firebase/database';
import { db } from '../firebase';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // assuming you have firebase authentication setup
import '../styles/registeredteachers.css';

const RegisteredTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [deleteVerification, setDeleteVerification] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Add state for logout confirmation modal

  useEffect(() => {
    const teachersRef = ref(db, 'teachers');
    onValue(teachersRef, (snapshot) => {
      const data = snapshot.val();
      
      const teacherList = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      
      setTeachers(teacherList);
      setFilteredTeachers(teacherList);
    });
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredTeachers(teachers);
    } else {
      const filtered = teachers.filter((teacher) =>
        teacher.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTeachers(filtered);
    }
  }, [searchQuery, teachers]);

  const handleModify = (teacher) => {
    setCurrentTeacher(teacher);
    setShowModal(true);
  };

  const confirmDelete = (teacher) => {
    setCurrentTeacher(teacher);
    setDeleteVerification('');
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (deleteVerification === 'DELETE') {
      const teacherRef = ref(db, `teachers/${currentTeacher.id}`);
      remove(teacherRef)
        .then(() => {
          alert("Teacher deleted successfully.");
          setTeachers((prevTeachers) => prevTeachers.filter((t) => t.id !== currentTeacher.id));
          setFilteredTeachers((prevTeachers) => prevTeachers.filter((t) => t.id !== currentTeacher.id));
          setShowDeleteConfirm(false);
        })
        .catch((error) => {
          console.error("Error deleting teacher:", error);
          alert("Failed to delete the teacher.");
        });
    } else {
      alert("Please type DELETE to confirm.");
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const teacherRef = ref(db, `teachers/${currentTeacher.id}`);
    update(teacherRef, currentTeacher)
      .then(() => {
        alert("Teacher updated successfully.");
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error updating teacher:", error);
        alert("Failed to update the teacher.");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTeacher({ ...currentTeacher, [name]: value });
  };

 // Function to handle Log Out button click
const handleLogoutClick = () => {
  setShowLogoutModal(true); // Show the confirmation modal
};

// Function to log out the user and redirect to login page
  const handleLogout = () => {
    auth.signOut().then(() => {
      // Clear session data if needed
      localStorage.removeItem('user');
      window.location.href = '/login'; // Redirect to login page
    }).catch(error => {
      console.error('Logout error', error);
    });
  };
  // Function to cancel logout
  const handleCancelLogout = () => {
    setShowLogoutModal(false); // Close the confirmation modal without logging out
  };

  return (
    <div className="container">
      <h2 className='rgstrd-t'>Registered Teachers</h2>

      <input
        type="text"
        placeholder="Search by name or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="rt-search-box"
      />

      <table className="teachers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Middle Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Gender</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.id}</td>
              <td>{teacher.firstName}</td>
              <td>{teacher.lastName}</td>
              <td>{teacher.middleName}</td>
              <td>{teacher.email}</td>
              <td>{teacher.department}</td>
              <td>{teacher.gender}</td>
              <td>{teacher.role}</td>
              <td>
                <button onClick={() => handleModify(teacher)} className="modify-btn">Modify</button>
                <button onClick={() => confirmDelete(teacher)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Modify */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Modify Teacher</h3>
            <form onSubmit={handleUpdate}>
              <label>First Name</label>
              <input type="text" name="firstName" value={currentTeacher.firstName} onChange={handleChange} />
              
              <label>Last Name</label>
              <input type="text" name="lastName" value={currentTeacher.lastName} onChange={handleChange} />
              
              <label>Middle Name</label>
              <input type="text" name="middleName" value={currentTeacher.middleName} onChange={handleChange} />
              
              <label>Email</label>
              <input type="email" name="email" value={currentTeacher.email} onChange={handleChange} />
              
              <label>Gender</label>
              <select name="gender" value={currentTeacher.gender} onChange={handleChange}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation with Verification */}
      {showDeleteConfirm && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this teacher?</p>
            <p>Please type <strong>DELETE</strong> to confirm:</p>
            <input
              type="text"
              value={deleteVerification}
              onChange={(e) => setDeleteVerification(e.target.value)}
              placeholder="Type DELETE to confirm"
            />
            <button onClick={handleDelete}>Confirm Delete</button>
            <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Log Out Button */}
      <button onClick={handleLogoutClick} className="logout-btn">Log Out</button>

      {/* Log Out Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <p>Are you sure you want to log out?</p>
            <button onClick={handleLogout} className="confirm-btn">Yes, Log Out</button>
            <button onClick={handleCancelLogout} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredTeachers;
