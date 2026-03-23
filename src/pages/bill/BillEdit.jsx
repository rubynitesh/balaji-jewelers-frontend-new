import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "./bill.css";

const BillEdit = () => {
  const { id } = useParams();     // ✅ Get bill ID from URL
  const navigate = useNavigate();

  // ✅ State for dropdowns / select options
  const [products, setProducts] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [paymentStatuses, setPaymentStatuses] = useState([]);
  const [billStatuses, setBillStatuses] = useState([]);

  // ✅ Form state
  const [formData, setFormData] = useState({
    customerName: "",
    customerMobile: "",
    paymentModeId: "",
    paymentStatusId: "",
    billStatusId: "",
    items: []
  });

  useEffect(() => {
    if (id) {
      fetchAllData();              // ✅ Load bill + master data
    }
  }, [id]);

  var fetchAllData = async () => {
    try {
      const [prod, pm, ps, bs, billRes] = await Promise.all([
        api.get("/api/products"),
        api.get("/api/payment-modes"),
        api.get("/api/payment-statuses"),
        api.get("/api/bill-statuses"),
        api.get(`/api/bills/${id}`)
      ]);

      setProducts(prod.data);
      setPaymentModes(pm.data);
      setPaymentStatuses(ps.data);
      setBillStatuses(bs.data);

      const bill = billRes.data;

      // ✅ Populate form with existing bill data
      setFormData({
        customerName: bill.customerName,
        customerMobile: bill.customerMobile,
        paymentModeId: bill.paymentModeId,
        paymentStatusId: bill.paymentStatusId,
        billStatusId: bill.billStatusId,
        items: bill.items || []
      });

    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // ✅ Handle simple input changes
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ✅ Handle changes in individual item row
  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = Number(value);

    const price = updated[index].price || 0;
    const gst = updated[index].gstPercentage || 0;
    const qty = updated[index].quantity || 1;

    const gstAmount = (price * gst) / 100;
    updated[index].totalPrice = (price + gstAmount) * qty;

    setFormData(prev => ({ ...prev, items: updated }));
  };

  // ✅ Add new item row
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        productId: "",
        quantity: 1,
        price: 0,
        gstPercentage: 3,
        totalPrice: 0
      }]
    }));
  };

  // ✅ Remove item row
  const removeItem = (index) => {
    const updated = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: updated }));
  };

  // ✅ Submit updated bill
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/bills/${id}`, formData);   // ✅ API PUT request
      alert("Bill Updated Successfully ✅");
      navigate("/bills");                            // ✅ Back to bill list
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="bill-container">
      <h2>✏ Edit Bill</h2>

      <form onSubmit={handleSubmit} className="bill-form">

        {/* Customer Info */}
        <input
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          placeholder="Customer Name"
          required
        />

        <input
          name="customerMobile"
          value={formData.customerMobile}
          onChange={handleChange}
          placeholder="Customer Mobile"
          required
        />

        {/* Selects */}
        <select name="paymentModeId" value={formData.paymentModeId} onChange={handleChange} required>
          <option value="">Select Payment Mode</option>
          {paymentModes.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select name="paymentStatusId" value={formData.paymentStatusId} onChange={handleChange} required>
          <option value="">Select Payment Status</option>
          {paymentStatuses.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select name="billStatusId" value={formData.billStatusId} onChange={handleChange} required>
          <option value="">Select Bill Status</option>
          {billStatuses.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <hr />
        <h4>Items</h4>

        {/* Items List */}
        {formData.items.map((item, index) => (
          <div key={index} className="bill-item-row">

            <select
              value={item.productId}
              onChange={(e) => handleItemChange(index, "productId", e.target.value)}
            >
              <option value="">Select Product</option>
              {products.map(prod => (
                <option key={prod.id} value={prod.id}>{prod.name}</option>
              ))}
            </select>

            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
            />

            <input
              type="number"
              value={item.price}
              onChange={(e) => handleItemChange(index, "price", e.target.value)}
            />

            <input
              type="number"
              value={item.gstPercentage}
              onChange={(e) => handleItemChange(index, "gstPercentage", e.target.value)}
            />

            <input type="number" value={item.totalPrice} readOnly />

            <button type="button" onClick={() => removeItem(index)}>
              Remove
            </button>

          </div>
        ))}

        <button type="button" onClick={addItem}>+ Add Item</button>
        <button type="submit" className="submit-btn">Update Bill</button>

      </form>
    </div>
  );
};

export default BillEdit;