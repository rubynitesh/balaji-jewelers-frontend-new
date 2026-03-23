import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../api/axiosConfig";
import "./user.css";

const User = () => {

  // ================= STATE =================
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [userForm, setUserForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    roleId: ""
  });

  // ================= FETCH DATA =================
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  var fetchUsers = async () => {
    try {
      const res = await api.get("/api/auth/getAllUsers");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await api.get("/api/role");
      setRoles(res.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value
    });
  };

  // ================= CREATE USER =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/auth/register", userForm);

      alert("User created successfully!");
      setShowModal(false);

      setUserForm({
        name: "",
        username: "",
        email: "",
        password: "",
        roleId: ""
      });

      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user!");
    }
  };

  // ================= RESET PASSWORD =================
  const handleResetClick = (email) => {
    setSelectedUserEmail(email);
    setShowResetModal(true);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/auth/reset-password", {
        email: selectedUserEmail,
        newPassword: newPassword
      });

      alert("Password reset successfully!");
      setShowResetModal(false);
      setNewPassword("");
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password!");
    }
  };

  // ================= UI =================
  return (
    <div className="user-container container">

      {/* HEADER */}
      <div className="user-header">
        <h2>User Management</h2>
        <Button className="btn-create-user" onClick={() => setShowModal(true)}>
          + Create User
        </Button>
      </div>

      {/* USER TABLE */}
      <table className="user-table table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={u.id}>
              <td>{idx + 1}</td>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.roleName || u.nameOfRole}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleResetClick(u.email)}
                >
                  Reset Password
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= CREATE USER MODAL ================= */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                type="text"
                value={userForm.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username"
                type="text"
                value={userForm.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={userForm.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                value={userForm.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="roleId"
                value={userForm.roleId}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              Save User
            </Button>

          </Form>
        </Modal.Body>
      </Modal>

      {/* ================= RESET PASSWORD MODAL ================= */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleResetSubmit}>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                value={selectedUserEmail}
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Update Password
            </Button>

          </Form>
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default User;