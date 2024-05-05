import { Navigate } from 'react-router-dom';

function ProtectedPassword({ children }) {
    if (localStorage.getItem("OldUserToken") && localStorage.getItem("userName")) {
        return children;
      } else {
        return <Navigate to="/login" />;
      }
}


export default ProtectedPassword;