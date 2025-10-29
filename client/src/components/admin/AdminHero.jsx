import React, { useEffect, useState } from "react";
import "./AdminHero.css";
import { FaTrash, FaEye, FaUserPlus, FaTimes } from "react-icons/fa";
import axios from "axios";

const AdminHero = () => {
  const [showForm, setShowForm] = useState(false);
  const [elections, setElections] = useState([]);
  const [newElection, setNewElection] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    candidates: [], // 🧠 store candidate names
  });
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5000/api/elections";

  const fetchElection = async () => {
    try {
      console.log("hello from react");
      setLoading(true);
      const response = await axios.get(API_URL);
      setElections(response.data.data);
    } catch (error) {
      console.error("Error fetching elections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElection();
  }, []);

  const handleView = (electionId) => {
    console.log("View clicked for election:", electionId);
  };

  const handleRemove = async (electionId) => {
    try {
      console.log("Deleting election:", electionId);
      await axios.delete(`${API_URL}?id=${electionId}`);
      fetchElection();
    } catch (error) {
      console.error("Error deleting election:", error);
    }
  };

  const handleAddCandidate = () => {
    console.log("")
    setNewElection({
      ...newElection,
      candidates: [...newElection.candidates,""],
    });
  };

  const handleCandidateChange = (index, value) => {
    const updated = [...newElection.candidates];
    updated[index] = value;
    setNewElection({ ...newElection, candidates: updated });
  };

  const handleRemoveCandidate = (index) => {
    const updated = [...newElection.candidates];
    updated.splice(index, 1);
    setNewElection({ ...newElection, candidates: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, newElection);
      console.log("Election created:", response.data);
      setNewElection({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        candidates: [],
      });
      setShowForm(false);
      fetchElection();
    } catch (error) {
      console.error("Error creating election:", error);
    }
  };

  return (
    <section className="admin-hero">
      <h3 className="hero-title">Active Elections</h3>

      <table className="election-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Actions</th>
            <th>--</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="no-data">
                Loading...
              </td>
            </tr>
          ) : elections && elections.length > 0 ? (
            elections.map((election, idx) => (
              <tr key={idx}>
                <td>{election.title}</td>
                <td>{election.startDate}</td>
                <td>{election.endDate}</td>
                <td
                  className={
                    election.active ? "status-active" : "status-ended"
                  }
                >
                  {election.active ? "Active" : "Ended"}
                </td>
                <td className="action-buttons">
                  <button
                    className="view-btn"
                    onClick={() => handleView(election._id || election.id)}
                  >
                    <FaEye /> View
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() =>
                      handleRemove(election._id || election.id)
                    }
                  >
                    <FaTrash />
                  </button>
                </td>
                <td>
                  <button className="start-button">Start</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">
                No elections found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="create-btn-wrapper">
        <button
          className="create-election-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Create Election"}
        </button>
      </div>

      {showForm && (
        <form className="create-election-form" onSubmit={handleSubmit}>
          <h4>Create New Election</h4>

          <input
            type="text"
            placeholder="Election Title"
            value={newElection.title}
            onChange={(e) =>
              setNewElection({ ...newElection, title: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Description"
            value={newElection.description}
            onChange={(e) =>
              setNewElection({ ...newElection, description: e.target.value })
            }
            required
          />

          <div className="candidate-section">
            <h5>Candidates</h5>
            {newElection.candidates.map((candidate, index) => (
              <div key={index} className="candidate-row">
                <input
                  type="text"
                  placeholder={`Candidate ${index + 1} name`}
                  value={candidate}
                  onChange={(e) =>
                    handleCandidateChange(index, e.target.value)
                  }
                />
                <button
                  type="button"
                  className="remove-candidate-btn"
                  onClick={() => handleRemoveCandidate(index)}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-candidate-btn"
              onClick={handleAddCandidate}
            >
              <FaUserPlus /> Add Candidate
            </button>
          </div>

          <div className="date-fields">
            <input
              type="date"
              value={newElection.startDate}
              onChange={(e) =>
                setNewElection({ ...newElection, startDate: e.target.value })
              }
              required
            />
            <input
              type="date"
              value={newElection.endDate}
              onChange={(e) =>
                setNewElection({ ...newElection, endDate: e.target.value })
              }
              required
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-btn">
              Submit
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setShowForm(false);
                setNewElection({
                  title: "",
                  description: "",
                  startDate: "",
                  endDate: "",
                  candidates: [],
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default AdminHero;
