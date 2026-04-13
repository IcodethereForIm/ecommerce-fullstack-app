import React from "react";
import { useNavigate } from "react-router-dom";
import ShippingAddress from "../components/ShippingAdresses";
import AccountDetails from "../components/AccountDetails";

function Profile(){
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = React.useState("account");
    const[user,setUser]=React.useState(null)
    const [loading, setLoading] = React.useState(true);

    const getInitials = (email) => {
        if (!email) return "";
        return email.substring(0, 3).toUpperCase();
    };
    React.useEffect(()=>{

        const fetchUser = async ()=>{

            try{
            const token = localStorage.getItem("auth_token")
            

        
            if (!token) {
      setUser(null);
      setLoading(false); 
      return;
    }
            


           const res= await fetch("http://127.0.0.1:8000/api/info",{
                
                headers:{
                    "Content-type":"application/json",
                    "Authorization":`Bearer ${token}`
                }

            })

            
            const data = await res.json()

            

            if(res.ok){
                setUser(data)
            }
            else{
                setUser(null)
            }
            
        } catch (error) {
        console.error("Backend Error",error)
        alert("somethingh went wrong in profile")
        }finally{
            setLoading(false)
        }

        }
        fetchUser();
        
    },[])

    const logOut = async () => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const res = await fetch("http://127.0.0.1:8000/api/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();
        alert(data.message); // better UX than console // "Logged out successfully."

        // remove token from localStorage and reset user
        localStorage.removeItem("auth_token");
        setUser(null);
        setLoading(false);

    } catch (error) {
        console.error("Backend Error", error);
        alert("Something went wrong in logout");
    }
};

    if (loading) {
  return <h2>Loading...</h2>;
}

if (!user) {
  return <h2>User not Logged-in</h2>;
}
    return (
  <div className="container py-4" style={{ marginTop: "80px" }}>

    <div className="card shadow-sm" style={{ minHeight: "500px" }}>

      <div className="row g-0">

        {/* LEFT MENU */}
        <div className="col-md-3 border-end p-3">

          <div className="d-flex flex-column gap-2">

            <button
              className={`btn btn-sm text-start ${activeTab === "account" ? "btn-primary" : "btn-light"}`}
              onClick={() => setActiveTab("account")}
            >
              Account Details
            </button>

            <button
              className={`btn btn-sm text-start ${activeTab === "shipping" ? "btn-primary" : "btn-light"}`}
              onClick={() => setActiveTab("shipping")}
            >
              Shipping Address
            </button>

            <button
              className="btn btn-sm btn-light text-start"
              onClick={() => navigate("/orders")}
            >
              Order History
            </button>

            <hr />

            <button className="btn btn-sm btn-danger text-start" onClick={logOut}>
              Logout
            </button>

          </div>

        </div>

        {/* RIGHT CONTENT */}
        <div className="col-md-9 p-4">

          {activeTab === "account" && (
            <AccountDetails user={user} />
          )}

          {activeTab === "shipping" && (
            <ShippingAddress />
          )}

          {activeTab === "orders" && (
            <div className="text-muted">
              Clicked Order History → redirecting...
            </div>
          )}

        </div>

      </div>
    </div>

  </div>
);
}
export default Profile