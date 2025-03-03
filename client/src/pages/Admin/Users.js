import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [auth, setAuth] = useAuth();

    const getUsers = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/users`);
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getUsers();
  }, [auth?.token]);
  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="container-fluid m-2 p-2">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>All Users</h1>
            {/* <p>{JSON.stringify(users,null,4)}</p> */}
            {users?.map((o, i) => {
              return (
                <div className="border shadow">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">User ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{o?._id}</td>
                        <td>{o?.name}</td>
                        <td>{o?.email}</td>
                        <td>{o?.phone}</td>
                      </tr>
                      <tr>
                        {/* <td> */}
                        <button
                          className="btn btn-outline-warning"
                         // className="btn btn-danger"
                         // onClick={() => handleChange(o._id)}
                         // defaultValue={o?.status}
                        >
                          Block User
                        </button>

                        <button
                          className="btn btn-outline-warning"
                          //className="btn btn-danger ms-2"
                         // onClick={() => handleChange(o._id)}
                         // defaultValue={o?.status}
                        >
                          Unblock User
                        </button>
                        {/* </td> */}
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
          
        </div>
      </div>
    </Layout>
  );
};

export default Users;