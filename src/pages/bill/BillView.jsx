import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
// import "../bill/billView.css";
import "./bill.css";

const BillView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);

  const [paymentModes, setPaymentModes] = useState([]);
  const [paymentStatuses, setPaymentStatuses] = useState([]);
  const [billStatuses, setBillStatuses] = useState([]);

  useEffect(() => {
    if (id) {
      fetchAllData();
    }
  }, [id]);

  var fetchAllData = async () => {
    try {

      const billRes = await api.get(`/api/bills/${id}`);
      setBill(billRes.data);

      const pm = await api.get("/api/paymentMode");
      const ps = await api.get("/Api/GetPaymentStatus");
      const bs = await api.get("/api/billStatus");

      setPaymentModes(pm.data);
      setPaymentStatuses(ps.data);
      setBillStatuses(bs.data);

    } catch (error) {
      console.error(error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!bill) return <div className="bill-container">Loading...</div>;

  const getPaymentModeName = (id) => {
    const found = paymentModes.find((item) => item.id === id);
    return found ? found.code || found.name : "-";
  };

  const getPaymentStatusName = (id) => {
    const found = paymentStatuses.find((item) => item.id === id);
    console.log("Finding Payment Status for ID:", id, "Found:", found); // Debug log
    return found ? found.description || found.code || found.name : "-";
  };

  const getBillStatusName = (id) => {
    const found = billStatuses.find((item) => item.id === id);
    return found ? found.code || found.name : "-";
  };

  return (
    <div className="bill-container">

      <div className="bill-card">

        {/* ===== TOP TAX HEADER ===== */}

        <div className="tax-header">
          <div>GSTIN : 09KVZPS1335A1Z1</div>
          <div className="tax-title">TAX INVOICE</div>
        </div>

        {/* ===== SHOP DETAILS ===== */}

        <div className="shop-header">

          <div className="shop-left">
            <h1>Shri Bala Ji Jewellers</h1>
            <p>HDFC Bank Ke Samne</p>
            <p>Shakti Medical Store Ke Bagal</p>
            <p>Phoolpur, Prayagraj</p>
            <p><b>Mob :</b> 9839433050</p>
          </div>

          <div className="shop-right">
            <p><b>Bill No :</b> {bill.billNumber}</p>
            <p><b>Date :</b> {bill.billingDate?.substring(0,10)}</p>
            <p><b>Customer :</b> {bill.customerName}</p>
            <p><b>Mobile :</b> {bill.customerMobile}</p>
          </div>

        </div>

        {/* ===== BILL ITEMS ===== */}

        <div className="bill-table">

          <table>

            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>GST %</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>

              {bill.items?.map((item, index) => (

                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>₹ {item.price}</td>
                  <td>{item.gstPercentage}</td>
                  <td>₹ {item.totalPrice}</td>
                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* ===== SUMMARY ===== */}

        <div className="summary">

          <div className="summary-box">

            <p>Sub Total : ₹ {bill.subTotal}</p>
            <p>Total GST : ₹ {bill.totalGst}</p>

            <h2>Grand Total : ₹ {bill.grandTotal}</h2>

          </div>

        </div>

        {/* ===== FOOTER ===== */}

        <div className="bill-footer">

          <div>
            <p><b>Payment Mode :</b> {getPaymentModeName(bill.paymentModeId)}</p>
            <p><b>Payment Status :</b> {getPaymentStatusName(bill.paymentStatusId)}</p>
            <p><b>Bill Status :</b> {getBillStatusName(bill.billStatusId)}</p>
          </div>

          <div className="signature">
            <p>Authorized Signature</p>
          </div>

        </div>

        {/* ===== ACTION BUTTONS ===== */}

        <div className="actions no-print">

          <button onClick={()=>navigate("/admin/billing")}>
            Back
          </button>

          <button onClick={handlePrint} className="print-btn">
            Print Bill
          </button>

        </div>

      </div>

    </div>
  );
};

export default BillView;