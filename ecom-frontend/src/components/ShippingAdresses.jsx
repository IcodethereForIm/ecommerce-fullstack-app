import { useEffect, useState } from "react";
import axios from "axios";

const ShippingAddress = () => {
    const token = localStorage.getItem("auth_token")
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  //  Fetch addresses
  const fetchAddresses = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/shipping-addresses",{
        headers: {
      Authorization: `Bearer ${token}`,
    },
    });
      setAddresses(res.data);
      
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  //  Add address
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:8000/api/shipping-addresses", form,
        {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

      setForm({
        full_name: "",
        phone: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      });

      fetchAddresses();
    } catch (err) {
      console.log(err);
    }
  };

  //  Set default
  const setDefault = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/shipping-addresses/${id}/default`, {},{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchAddresses();
    } catch (err) {
      console.log(err);
    }
  };

  //  Delete
  const deleteAddress = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/shipping-addresses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchAddresses();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="card p-3 shadow-sm">

      <h5 className="mb-3">Shipping Address</h5>

      {/* ADDRESS LIST */}
      {addresses.map((addr) => (
        <div key={addr.id} className="border p-2 mb-2 rounded">
          <div className="d-flex justify-content-between">
            <strong>{addr.full_name}</strong>

            {addr.is_default && (
              <span className="badge bg-success">Default</span>
            )}
          </div>

          <div className="text-muted">
            {addr.address_line_1}, {addr.city}, {addr.state} - {addr.pincode}
          </div>

          <div className="mt-2 d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setDefault(addr.id)}
            >
              Set Default
            </button>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => deleteAddress(addr.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <hr />

      {/* ADD FORM */}
      <button
  className="btn btn-primary mb-3"
  onClick={() => setShowForm(true)}
>
  + Add Address
</button>

      {showForm && (
  <form onSubmit={handleSubmit}>

    <input
      className="form-control mb-2"
      placeholder="Full Name"
      value={form.full_name}
      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
    />

    <input
      className="form-control mb-2"
      placeholder="Phone"
      value={form.phone}
      onChange={(e) => setForm({ ...form, phone: e.target.value })}
    />

    <input
      className="form-control mb-2"
      placeholder="Address Line 1"
      value={form.address_line_1}
      onChange={(e) => setForm({ ...form, address_line_1: e.target.value })}
    />

    <input
      className="form-control mb-2"
      placeholder="City"
      value={form.city}
      onChange={(e) => setForm({ ...form, city: e.target.value })}
    />

    <input
      className="form-control mb-2"
      placeholder="State"
      value={form.state}
      onChange={(e) => setForm({ ...form, state: e.target.value })}
    />

    <input
      className="form-control mb-2"
      placeholder="Pincode"
      value={form.pincode}
      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
    />

    <button className="btn btn-success w-100">
      Add Address
    </button>

  </form>
)}
    </div>
  );
};

export default ShippingAddress;