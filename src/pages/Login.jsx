import React from 'react';
import { loginUser } from "../service/authService";
import { useState } from "react";
import './Login.css';
import { useNavigate } from "react-router-dom";

// ✅ ADD THIS (Toast import)
import { toast } from "react-toastify";

function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ OPTIONAL (Better UX - disable button while loading)
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true); // ✅ start loading

    const payload = {
      usernameOrEmail: email,
      password: password,
    };

    try {
      const data = await loginUser(payload);
      console.log("Login Response:", data);

      // ✅ JWT Store
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);

      // ✅ SUCCESS TOAST (Replace alert)
      toast.success("Login Successful 🎉");

      // ✅ ROLE BASED REDIRECT
      if (data.role === "ROLE_ADMIN") {
        navigate("/admin/dashboard");
      } else if (data.role === "ROLE_STAFF") {
        navigate("/user/dashboard");
      } else if (data.role === "ROLE_SHOP_OWNER") {
        navigate("/shop-owner/dashboard");
      } else if (data.role === "ROLE_SUPER_ADMIN") {
        navigate("/super-admin/dashboard");
      }

      // ❌ REMOVE THIS (Old alert)
      // alert("Login Successful");

    } catch (error) {
      console.error(error);

      // ✅ ERROR TOAST (Clean UI)
      const errorMsg =
        error.response?.data?.message || "Invalid Credentials";

      toast.error(errorMsg);

      // ❌ REMOVE THIS
      // alert("Invalid Credentials");

    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
      <div className="col-lg-4 col-md-6 col-sm-10">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-4">

            <h4 className="text-center fw-bold mb-3" style={{ color: "var(--primary-color)" }}>
              Shree Bala Ji Jewellery Billing System
            </h4>

            <form onSubmit={handleLogin}>

              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder='usernameOrEmailId'
                />
              </div>

              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder='Password'
                />
              </div>

              <div className="d-grid">
                <button
                  className="btn btn-primary-custom"
                  disabled={loading} // ✅ disable during API call
                >
                  {/* ✅ Loader text */}
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