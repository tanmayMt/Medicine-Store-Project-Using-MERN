import {Navigate} from "react-router-dom";

function ProtectedOtp({ children }) {
    //const navigate = useNavigate;
  if (localStorage.getItem("ValidationToken")) {
    return children;
  }
  else{
    return <Navigate to ="/login"/>;
  }
}

export default ProtectedOtp;