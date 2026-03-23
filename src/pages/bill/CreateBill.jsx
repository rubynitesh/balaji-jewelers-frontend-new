import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./bill.css";
import api from "../../api/axiosConfig";

const CreateBill = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ Dropdown States
  const [paymentModes, setPaymentModes] = useState([]);
  const [paymentStatuses, setPaymentStatuses] = useState([]);
  const [billStatuses, setBillStatuses] = useState([]);
  const [products, setProducts] = useState([]);

  // ✅ Form State
  const [formData, setFormData] = useState({
    customerName: "",
    customerMobile: "",
    paymentModeId: "",
    paymentStatusId: "",
    billStatusId: "",
    items: []
  });

  // 🔥 FIX 1: Direct async call inside useEffect
  useEffect(() => {
    const loadDropdowns = async () => {
      try {

        // ⚠ IMPORTANT:
        // Make sure backend mapping matches exactly
        // Example: @RequestMapping("/api/payment-modes")
        // If backend uses dash (-), you must use dash here

        const pm = await api.get("/api/paymentMode"); 
        const ps = await api.get("/Api/GetPaymentStatus");
        const bs = await api.get("/api/billStatus");
        const pr = await api.get("/api/products");

        console.log("PaymentModes:", pm.data);   // ✅ DEBUG
        console.log("PaymentStatuses:", ps.data);
        console.log("BillStatuses:", bs.data);
        console.log("Products:", pr.data);

        setPaymentModes(pm.data || []);
        setPaymentStatuses(ps.data || []);
        setBillStatuses(bs.data || []);
        setProducts(pr.data || []);

      } catch (error) {
        console.error("Dropdown load error:", error);
      }
    };

    loadDropdowns();
  }, []);

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 🔹 Add Item
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: 1, price: 0 }]
    }));
  };

  // 🔹 Remove Item
  const removeItem = (index) => {
    const updated = [...formData.items];
    updated.splice(index, 1);

    setFormData(prev => ({
      ...prev,
      items: updated
    }));
  };

  // 🔹 Handle Item Change
  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = value;

    // 🔥 FIX 2: Safe product price detection
    if (field === "productId") {
      const product = products.find(p => p.id == value);

      // ⚠ Check your backend field name carefully
      // It may be: price, rate, pricePerGram, sellingPrice etc.

      updated[index].price =
        product?.pricePerGram ||
        product?.price ||
        product?.rate ||
        0;
    }

    // 🔥 FIX 3: Quantity always number
    if (field === "quantity") {
      updated[index].quantity = Number(value);
    }

    setFormData(prev => ({
      ...prev,
      items: updated
    }));
  };

  // 🔹 Calculate Total
  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (Number(item.price) * Number(item.quantity));
    }, 0);
  };

  // 🔹 Submit Bill
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        items: formData.items.map(item => ({
          productId: Number(item.productId),  // 🔥 Ensure number
          quantity: Number(item.quantity)
        }))
      };

      console.log("Payload:", payload);  // ✅ DEBUG

      await api.post("/api/bills", payload);

      alert("Bill Created Successfully 🔥");
      navigate("/bills");

    } catch (error) {
      console.error("Bill create error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bill-container">
      <h2>🧾 Create New Bill</h2>

      <form onSubmit={handleSubmit} className="bill-form">

        <input
          name="customerName"
          placeholder="Customer Name"
          value={formData.customerName}
          onChange={handleChange}
          required
        />

        <input
          name="customerMobile"
          placeholder="Customer Mobile"
          value={formData.customerMobile}
          onChange={handleChange}
          required
        />

        {/* ✅ Payment Mode */}
        <select
          name="paymentModeId"
          value={formData.paymentModeId}
          onChange={handleChange}
          required
        >
          <option value="">Select Payment Mode</option>
          {paymentModes.map(pm => (
            <option key={pm.id} value={pm.id}>
              {pm.name || pm.code}  {/* 🔥 Safe field */}
            </option>
          ))}
        </select>

        {/* ✅ Payment Status */}
        <select
          name="paymentStatusId"
          value={formData.paymentStatusId}
          onChange={handleChange}
          required
        >
          <option value="">Select Payment Status</option>
          {paymentStatuses.map(ps => (
            <option key={ps.id} value={ps.id}>
              {ps.name || ps.code || ps.description}  {/* 🔥 Safe field */}
            </option>
          ))}
        </select>

        {/* ✅ Bill Status */}
        <select
          name="billStatusId"
          value={formData.billStatusId}
          onChange={handleChange}
          required
        >
          <option value="">Select Bill Status</option>
          {billStatuses.map(bs => (
            <option key={bs.id} value={bs.id}>
              {bs.name || bs.code}
            </option>
          ))}
        </select>

        {/* ✅ Items */}
        <div className="item-section">
          <h4>Bill Items</h4>
          <button type="button" onClick={addItem} className="add-btn">
            + Add Item
          </button>

          {formData.items.map((item, index) => (
            <div key={index} className="item-row">

              <select
                value={item.productId}
                onChange={(e) =>
                  handleItemChange(index, "productId", e.target.value)
                }
                required
              >
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
              />

              <span>₹ {item.price}</span>

              <button
                type="button"
                onClick={() => removeItem(index)}
                className="delete-btn"
              >
                X
              </button>
            </div>
          ))}
        </div>

        <div className="total-section">
          <h3>Total: ₹ {calculateTotal()}</h3>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Bill"}
        </button>

      </form>
    </div>
  );
};

export default CreateBill;