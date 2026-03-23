import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "./bill.css";

const downloadBillPdf = async (id) => {
  try {
    const response = await api.get(`/api/reports/bill/${id}`, { responseType: "blob" });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Bill_${id}.pdf`);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("PDF download error:", error);
  }
};

const BillList = () => {

  const [bills, setBills] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [paymentStatuses, setPaymentStatuses] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchAllData = async () => {
    try {

      setLoading(true);

      const billsRes = await api.get("/api/bills");
      setBills(billsRes.data);

      const modesRes = await api.get("/api/paymentMode");
      setPaymentModes(modesRes.data);

      const statusRes = await api.get("/Api/GetPaymentStatus");
      setPaymentStatuses(statusRes.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // 🔹 Payment Mode Name
  const getPaymentModeName = (id) => {

    const found = paymentModes.find((mode) => Number(mode.id) === Number(id));

    if (!found || !found.code) {
      return "-";
    }

    return found.code.trim();
  };

  // 🔹 Payment Status Name
  const getPaymentStatusName = (id) => {

    const found = paymentStatuses.find(
      (status) => Number(status.id) === Number(id)
    );

    if (!found || !found.description) {
      return "-";
    }

    return found.description.trim();
  };

  // 🔹 Status CSS class
  const getStatusClass = (statusText) => {

    if (!statusText) return "status-default";

    const status = statusText.toLowerCase();

    if (status.includes("paid")) {
      return "status-paid";
    }

    if (status.includes("pending")) {
      return "status-pending";
    }

    if (status.includes("reject")) {
      return "status-reject";
    }

    return "status-default";
  };

  const handleDelete = async (id) => {

    if (window.confirm("Are you sure you want to delete this bill?")) {

      try {

        await api.delete(`/api/bills/${id}`);
        fetchAllData();

      } catch (error) {
        console.error(error);
      }

    }

  };

  return (

    <div className="bill-container">

      <div className="bill-header">

        <h2>🧾 Bill Management</h2>

        <button
          className="create-btn"
          onClick={() => navigate("/admin/billing/create")}
        >
          + Create New Bill
        </button>

      </div>

      <div className="bill-table">

        <table>

          <thead>

            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Mobile</th>
              <th>Payment Mode</th>
              <th>Status</th>
              <th>Total Amount</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td colSpan="7">Loading...</td>
              </tr>

            ) : bills.length === 0 ? (

              <tr>
                <td colSpan="7">No Bills Found</td>
              </tr>

            ) : (

              bills.map((bill, index) => {

                const statusText = getPaymentStatusName(bill.paymentStatusId);

                return (

                  <tr key={bill.id}>

                    <td>{index + 1}</td>

                    <td>{bill.customerName}</td>

                    <td>{bill.customerMobile}</td>

                    <td>{getPaymentModeName(bill.paymentModeId)}</td>

                    <td>
                      <span className={getStatusClass(statusText)}>
                        {statusText}
                      </span>
                    </td>

                    <td>₹ {bill.grandTotal}</td>

                    <td>

                      <button
                        className="view-btn"
                        onClick={() => navigate(`/admin/billing/view/${bill.id}`)}
                      >
                        View
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/admin/billing/edit/${bill.id}`)}
                      >
                        Edit
                      </button>

                      <button
                        className="pdf-btn"
                        onClick={() => downloadBillPdf(bill.id)}
                      >
                        Print
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(bill.id)}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                );

              })

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default BillList;