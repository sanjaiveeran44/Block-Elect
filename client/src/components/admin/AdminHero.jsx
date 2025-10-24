import React, { useEffect, useState } from "react";
import "./AdminHero.css";
import { FaTrash, FaEye } from "react-icons/fa";
import axios from "axios";

const AdminHero = () => {
  const [showForm, setShowForm] = useState(false);
  const [newElection, setNewElection] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchElection = async () =>{
      try{
          setLoading(true);
          const response = await axios.get("http://localhost:5000/api/elections")
          setElections(response.data)
      }
      catch(error){
          console.log(error)
      }
      finally{
          setLoading(false);
      }
  }
  useEffect(
    () =>{
        fetchElection();
    }
  )

  const handleView = (electionId) => {
    console.log("View clicked for election:", electionId);
  };

  const handleRemove = async(electionId) => {
    await axios.delete("http://localhost:5000/api/elections/" + electionId);
    fetchElection();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/elections", newElection)
    .then((response) => {
        console.log(response.data)
    })
    .catch((error) => {
        console.log(error)
    })
    setNewElection({ title: "", description: "", startDate: "", endDate: "" });
    setShowForm(false);
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
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="no-data">
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
                    onClick={() => handleView(election.id)}
                  >
                    <FaEye /> View
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(election.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">
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
              onClick={() => setShowForm(false)}
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
