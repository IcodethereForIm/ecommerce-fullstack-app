import React from "react";
import "../components/SignIn.css";

function Signin(){

    const initalFormState = {email:"",password:""}
    const[userData,setuserData] = React.useState(initalFormState)
    const handleSubmit= async(e)=>{
        e.preventDefault()

        try {
            const res = await fetch("http://127.0.0.1:8000/api/login",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify(userData)

        })
        
        const data = await res.json()
        
        alert(data.message)
        if(res.ok){
            setuserData(initalFormState)
            localStorage.setItem("auth_token",data.token)
        }
    }
        catch (error) {
            console.error("Backend Error",error)
            alert("somethingh went wrong")
        }
        

    }


    return(
        <section className="Sign-in">
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="frtyuhjy@12344" 
                 value={userData.email} 
                 onChange={(e)=>setuserData({...userData,email:e.target.value})}/>
                
                <input type="password" value={userData.password}
                 onChange={(e)=>setuserData({...userData,password:e.target.value})}/>
                 <button type="submit">Sign In</button>
            </form>
        </section>
    )
}
export default Signin