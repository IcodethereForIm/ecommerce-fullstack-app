import React from "react";

function Register(){

    const initalFormState = {email:"",name:"",password:"",password_confirmation:""}
    const[form,setForm] = React.useState(initalFormState)

    const handleChange = (e)=>{
        setForm({...form,[e.target.name]:e.target.value})
    }

    
        const handleSubmit = async(e)=>{
        e.preventDefault()
        try {
        const res = await fetch("http://127.0.0.1:8000/api/register",
            {
                method:"POST",
                credentials:"include",
                headers:{ "Content-Type": "application/json",
                         "Accept": "application/json"
                 },
                body:JSON.stringify(form)
            }
        )
        const data = await res.json()
        
        alert(data.message)
    }
     catch (error) {
        console.error("Backend Error",error)
        alert("somethingh went wrong in register")
    }
}
   return(
        
  <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
    {/* Black banner card */}
    <div className="p-5 rounded-4 shadow-lg" style={{ backgroundColor: "#111", color: "#fff", width: "400px" }}>
      <h2 className="mb-4 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="form-control"
          style={{ borderRadius: "0.5rem" }}
        />
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="form-control"
          style={{ borderRadius: "0.5rem" }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="form-control"
          style={{ borderRadius: "0.5rem" }}
        />
        <input
          name="password_confirmation"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="form-control"
          style={{ borderRadius: "0.5rem" }}
        />
        <button type="submit" className="btn btn-success mt-3">
          Register
        </button>
      </form>
    </div>
  </div>
);
    
}

export default Register