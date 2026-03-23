import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import "./header.css";


const Header = () => {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // ✅ Clear role on logout
    localStorage.removeItem("name"); // ✅ Clear name on logout
    navigate("/");
  };

    // ✅ STEP 1 — Get User From localStorage
    //const storedUser = JSON.parse(localStorage.getItem("role"));
    const storedUser = localStorage.getItem("role");
    const storedName = localStorage.getItem("name");
    //console.log("User Role:", storedUser?.role); // Debugging line to check the role

    //const user = storedUser ? JSON.parse(storedUser) : null;
    const user = storedUser ? { role: storedUser, name: storedName } : null;
    console.log("Parsed User:", user);
    console.log("User Role:", user?.role); // Debugging line to check the role

  
    // // ✅ STEP 2 — Role Based Menu
    // const menu = {
    //     ROLE_ADMIN: ["Dashboard", "Categories", "Products", "Billing"],
    //     ROLE_STAFF: ["Billing", "Products"]
    // };

    // ✅ STEP 2 — Role Based Menu with REAL ROUTES
const menu = {
  ROLE_ADMIN: [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Categories", path: "/admin/categories" },
    { name: "Products", path: "/admin/products" },
    { name: "Billing", path: "/admin/billing" },
     { name: "Users", path: "/admin/users"}
  ],
  ROLE_STAFF: [
    { name: "Billing", path: "/user/billing" },
    { name: "Products", path: "/user/products" }
  ]
};

  return (
    <nav className="navbar navbar-expand-lg custom-navbar px-3">

      {/* LEFT - LOGO */}
      <Link className="navbar-brand brand-logo" to="#">
        💎 Balaji Jewelers
      </Link>

      {/* Mobile Toggle */}
      <button
        className="navbar-toggler bg-light"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* CENTER - MENU */}
      <div className="collapse navbar-collapse justify-content-center" id="navbarContent">
        <ul className="navbar-nav gap-4">

          {menu[user?.role]?.map((item, index) => (
            <li key={index} className="nav-item">
              <Link className="nav-link" to={item.path}>
                 {item.name}
              </Link>
            </li>
        ))}

        </ul>
      </div>

      {/* RIGHT - USER NAME */}
      {/* <div className="user-info">
        <div className="avatar-circle">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
          {user?.name}
      </div> */}

       {/* PROFILE DROPDOWN */}
      {user && (
        <div className="profile-container">
          <div
            className="user-info"
            onClick={() => setOpen(!open)}
          >
            <div className="avatar-circle">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {user?.name}
          </div>

          {open && (
            <div className="profile-dropdown">
              <div className="dropdown-item">
                👤 Profile
              </div>
              <div
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                🚪 Logout
              </div>
            </div>
          )}
        </div>
      )}

    </nav>
  );
};

export default Header;
