import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import { message } from "antd";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  //default axios
  axios.defaults.headers.common["Authorization"] = auth?.token;

  useEffect(async() => {
    const data = localStorage.getItem("LoginToken");
    const res = await axios.post("/api/v1/auth/getuser", {
      headers:{
      Authorization : "Bearer "+localStorage.getItem("LoginToken"),
    }});
    if(res.data.success)
    {
      //console.log(res.data.user);
      setAuth({
       // ...auth,
        user: res.data.user,
      });
      
      // console.log("Success");
      // localStorage.setItem("Hi", useAuth);
      // localStorage.setItem("Hi2", res.data.user);
      // message.success(res.data.message);

      //navigate("/");
    }
    else{
      message.error(res.data.message);
    }
    // if (data) {
    //   const parseData = JSON.parse(data);
    //   setAuth({
    //     ...auth,
    //     user: parseData.user,
    //     token: parseData.token,
    //   });
    // }
    //eslint-disable-next-line
  }, []);
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };