import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/SignIn.module.css"
import { buildUrl } from "../config/api";
const api = (path) => buildUrl(`/api${path}`);

function Signin(){
    const navigate = useNavigate()
    const initalFormState = {email:"",password:""}
    const[userData,setuserData] = React.useState(initalFormState)
    const handleSubmit= async(e)=>{
        e.preventDefault()

        try {
            const res = await fetch(api("/login"),{
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
        navigate("/admin")
    }
        catch (error) {
            console.error("Backend Error",error)
            alert("somethingh went wrong")
        }
        

    }


    return(
        
        
        <section className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>

        <h2 className={styles.title}>Welcome Admin 👑</h2>

        <input
          className={styles.input}
          type="email"
          placeholder="frtyuhjy@12344"
          value={userData.email}
          onChange={(e) =>
            setuserData({ ...userData, email: e.target.value })
          }
        />

        <input
          className={styles.input}
          type="password"
          value={userData.password}
          onChange={(e) =>
            setuserData({ ...userData, password: e.target.value })
          }
        />

        <button className={styles.button} type="submit">
          Sign In
        </button>

      </form>
    </section>
    )
}
export default Signin