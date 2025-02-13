import React, { useEffect, useState } from "react";
import { retrieveAllTasks } from "../service/TaskApiService";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaPen, FaEye } from "react-icons/fa";
import "../css/tasks.css";

const TasksComponent = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    retrieveAllTasks()
      .then((response) => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks.");
        setLoading(false);
      });
  }, []);

  const updateTask = (id) => navigate(`/update-task/${id}`);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="m-0">Task List</h2>
                <Link to="/add-task" className="btn btn-primary btn-sm">
                  <FaPlus className="me-2" /> Add Task
                </Link>
              </div>

              {/* Loading state */}
              {loading && <p>Loading tasks...</p>}

              {/* Error state */}
              {error && <p className="text-danger">{error}</p>}

              {/* Empty state */}
              {!loading && tasks.length === 0 && <p className="text-muted">No tasks available.</p>}

              {/* Task List */}
              {tasks.map(({ id, task, updatedAt, taskCreatedAt }) => (
                <div key={id} className="mb-4">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-end gap-2 mb-2">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/task-details/${id}`)}>
                          <FaEye />
                        </button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => updateTask(id)}>
                          <FaPen />
                        </button>
                      </div>
                      <div>
                        <strong>{task}</strong>
                      </div>
                      <div className="mt-2">
                        <small className="text-muted">
                          {updatedAt ? `Updated: ${new Date(updatedAt).toLocaleString()}` : `Created: ${new Date(taskCreatedAt).toLocaleString()}`}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksComponent;
