import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import User from "./pages/User";   // ✅ ADD THIS
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import CategoryPage from "./pages/category/CategoryPage"; // ✅ ADD
import AdminLayout from "./layout/AdminLayout"; // ✅ ADD
import ProtectedRoute from "./auth/ProtectedRoute";
import ProductPage from "./pages/products/ProductPage"; // ✅ ADD
import BillingPage from "./pages/bill/BillingPage"; // ✅ Correct parent
import CreateBill from "./pages/bill/CreateBill";   // ✅ Child Page
import BillList from "./pages/bill/BillList";       // ✅ Child Page
import BillView from "./pages/bill/BillView";       // ✅ Child Page
import BillEdit from "./pages/bill/BillEdit";       // ✅ Child Page
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* ================= ADMIN LAYOUT ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AdminLayout /> {/* ✅ Header yaha fix hoga */}
            </ProtectedRoute>
          }
        >
          {/* ✅ Nested Routes */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="products" element={<ProductPage />} />

            {/* ✅ USERS PAGE */}
          <Route path="users" element={<User />} />
           {/* Billing Module */}
          <Route path="billing" element={<BillingPage />}>
          <Route index element={<BillList />} />         {/* Default list when /billing visit */}
          <Route path="create" element={<CreateBill />} />
          <Route path="view/:id" element={<BillView />} />
        <Route path="edit/:id" element={<BillEdit />} />
</Route>
        </Route>

        {/* ================= STAFF ================= */}
        <Route
            path="/user"
                element={
                <ProtectedRoute allowedRoles={["ROLE_STAFF"]}>
                  <AdminLayout />  {/* Same Layout */}
                  </ProtectedRoute>
              }
          >
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="products" element={<ProductPage />} />
                {/* Billing Module */}
             <Route path="billing" element={<BillingPage />}>
                  <Route index element={<BillList />} />         {/* Default list when /billing visit */}
                  <Route path="create" element={<CreateBill />} />
                  <Route path="view/:id" element={<BillView />} />
                  <Route path="edit/:id" element={<BillEdit />} />
              </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
