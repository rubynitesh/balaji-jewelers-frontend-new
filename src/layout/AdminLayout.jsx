// ✅ AdminLayout.jsx
import Header from "../components/Header";
import Footer from "../components/Footer"; // 👈 Footer import
import "./AdminLayout.css";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* Header fixed at top */}
      <Header />

      {/* Main content */}
      <main className="admin-content">
        <Outlet /> {/* ✅ Nested route pages render yaha */}
      </main>

      {/* Footer at bottom */}
      <Footer />
    </div>
  );
};

export default AdminLayout;