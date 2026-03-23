// ✅ pages/bill/BillingPage.jsx
import { Outlet, Link } from "react-router-dom";

const BillingPage = () => {
  return (
    <div> 
      <h2>🧾 Billing Section</h2>

      <nav style={{ marginBottom: "10px" }}>
       {/* <Link to="list" style={{ marginRight: "10px" }}>Bill List</Link> */}
        {/* <Link to="create">Create Bill</Link> */}
      </nav>
      {/* ✅ Nested child pages render yaha */}
      <Outlet />
    </div>
  );
};

export default BillingPage;