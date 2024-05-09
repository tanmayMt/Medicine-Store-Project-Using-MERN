import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    //console.log("Admin");
    const authCheck = async () => {
      const res = await axios.post("/api/v1/auth/adminauth", {
        headers:{
        Authorization : "Bearer "+localStorage.getItem("LoginToken"),
      }});
      if (res.data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
   // console.log(auth);
    if (localStorage.getItem("LoginToken")) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner path="" />;
}