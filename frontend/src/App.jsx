import React, { useEffect, useState } from "react";
import { getStudents, addStudent, updateStudent, deleteStudent } from "./api";
import "./App.css";

// react frontend for ftudent information management system 
function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [editingId, setEditingId] = useState(null);

  // load student data on initial render
  useEffect(() => {
    loadStudents();
  }, []);

  // read - retrieve all student records
  const loadStudents = async () => {
    try {
      const res = await getStudents();
      setStudents(res.data);
    } catch (err) {
      console.error("Error loading students:", err);
    }
  };

  // create or update student record
  const handleSubmit = async (e) => {
    e.preventDefault();
    const student = { name, course, year };

    try {
      if (editingId) {
        await updateStudent(editingId, student);
        setEditingId(null);
      } else {
        await addStudent(student);
      }
      setName("");
      setCourse("");
      setYear("");
      loadStudents();
    } catch (err) {
      console.error("Error saving student:", err);
    }
  };

  // edit selected student record
  const handleEdit = (student) => {
    setEditingId(student._id);
    setName(student.name);
    setCourse(student.course);
    setYear(student.year);
  };

  // delete selected student record
  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      loadStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="container">
        <h1>Student Information Management System (CRUD App)</h1>

        {/* adding and updating student ecords */}
        <form onSubmit={handleSubmit} className="student-form">
          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
          <button type="submit">{editingId ? "Update" : "Add"}</button>
        </form>

        {/* displaying all student records */}
        <div className="table-wrapper">
          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Course</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.course}</td>
                    <td>{student.year}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(student._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No students found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
