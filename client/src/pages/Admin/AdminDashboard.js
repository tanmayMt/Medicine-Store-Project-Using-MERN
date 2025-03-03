import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout>
      <div className="container-fluid m-3 p-4 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="profile-card w-75 p-3">
              <h2> <b>Admin Name :</b> {auth?.user?.name}</h2><br></br>
            <div>
              <p> <b>Admin Email :</b> {auth?.user?.email}</p>
              <p> <b>Admin Contact :</b> {auth?.user?.phone}</p>
            </div>

            </div>
          </div>
        </div>
      </div>
      
    </Layout>
  );
};

export default AdminDashboard;
