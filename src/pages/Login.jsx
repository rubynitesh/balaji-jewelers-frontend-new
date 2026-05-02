import React from 'react';
import { loginUser } from "../service/authService";
import { useState } from "react";
import './Login.css';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    const payload = {
      usernameOrEmail: email,
      password: password,
    };

    try {
      const data = await loginUser(payload);
      console.log("Login Response:", data);

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);

      toast.success("Login Successful 🎉");

      if (data.role === "ROLE_ADMIN") {
        navigate("/admin/dashboard");
      } else if (data.role === "ROLE_STAFF") {
        navigate("/user/dashboard");
      } else if (data.role === "ROLE_SHOP_OWNER") {
        navigate("/shop-owner/dashboard");
      } else if (data.role === "ROLE_SUPER_ADMIN") {
        navigate("/super-admin/dashboard");
      }

    } catch (error) {
      console.error(error);

      const errorMsg =
        error.response?.data?.message || "Invalid Credentials";

      toast.error(errorMsg);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid login-container vh-100 d-flex align-items-center justify-content-center">
      <div className="col-lg-4 col-md-6 col-sm-10">
        <div className="card shadow-lg border-0 rounded-4 login-card">
          <div className="card-body p-4">

            <h4 className="text-center fw-bold mb-4 login-title">
              Shree Bala Ji Jewellery Billing System
            </h4>

            <form onSubmit={handleLogin}>

              <div className="mb-3">
                <label className="form-label text-white">Email</label>
                <input
                  type="email"
                  className="form-control custom-input"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder='usernameOrEmailId'
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-white">Password</label>
                <input
                  type="password"
                  className="form-control custom-input"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder='Password'
                />
              </div>

              <div className="d-grid">
                <button
                  className="btn btn-primary-custom"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;