import { Navigate } from 'react-router-dom';

function ProtectedResetPassword({ children }) {
    if (localStorage.getItem("ResetToken") && localStorage.getItem("Email") && localStorage.getItem("OTPReference")) {
        return children;
      } else {
        return <Navigate to="/login" />;
      }
}


export default ProtectedResetPassword;