import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About Us - Medicure"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/about.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">
<b>To be part of an organization where I get a
chance to use my knowledge and skills to
contribute in the progress of the organization as
well as myself.</b>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
