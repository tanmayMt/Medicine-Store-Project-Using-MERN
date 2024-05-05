import { Navigate } from 'react-router-dom';

function ProtectedEmail({ children }) {
    if (localStorage.getItem("VerifiedEmailToken") && localStorage.getItem("VerifiedEmail")) {
        return children;
      } else {
        return <Navigate to="/login" />;
      }
}


export default ProtectedEmail;