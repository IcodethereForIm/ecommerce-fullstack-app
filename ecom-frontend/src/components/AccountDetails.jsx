import { useEffect, useState } from "react";
import axios from "axios";
import { buildUrl } from "../config/api";
const api = (path) => buildUrl(`/api${path}`);

const AccountDetails = ({ user }) => {
    const token = localStorage.getItem("auth_token")
  const [profile, setProfile] = useState({
    full_name: "",
    email:"",
    phone: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await axios.get(api("/shipping-addresses"),{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const addresses = res.data;

      const defaultAddr = addresses.find((a) => a.is_default);

      if (defaultAddr) {
        setProfile({
          full_name: defaultAddr.full_name,
          phone: defaultAddr.phone,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="card p-3 shadow-sm">

      <h5 className="mb-3">Account Details</h5>

      {/* EMAIL */}
      <div className="mb-3">
        <small className="text-muted">Email</small>
        <div>{user?.email || "Loading..."}</div>
      </div>

      {/* NAME */}
      <div className="mb-3">
        <small className="text-muted">Full Name</small>
        <div>{profile.full_name || "Not set"}</div>
      </div>

      {/* PHONE */}
      <div className="mb-3">
        <small className="text-muted">Phone</small>
        <div>{profile.phone || "Not set"}</div>
      </div>

    </div>
  );
};

export default AccountDetails;