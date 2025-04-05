import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import emailicon from "../assets/email.png";
import passwordicon from "../assets/password.png";
import usernameicon from "../assets/username.png";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Track admin checkbox
  const axiosBaseURL = "http://localhost:8000/api";

  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3, "At least 3 characters").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "At least 6 characters").required("Required"),
  });

  const handleSignup = async (values, { resetForm }) => {
    try {
      setLoading(true);
      const options = {
        name: values.username.trim(),
        email: values.email.trim(),
        password: values.password.trim(),
        role: isAdmin ? "admin" : "user", // Send role to backend
      };

      const response = await axios.post(`${axiosBaseURL}/user/register`, options);

      if (response.status === 201) {
        toast.success("User registered successfully, proceed to Login");
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSignup}>
        <Form className="container d-flex flex-column justify-content-center align-items-center form">
          {/* Username Field */}
          <div className="col-12 my-4 d-flex flex-column align-items-center">
            <div className="d-flex col-12">
              <label htmlFor="username" className="col-1">
                <img src={usernameicon} alt="usernameicon" className="icon" />
              </label>
              <Field type="text" className="ms-4 col-10 rounded p-1 ps-2" name="username" placeholder="Username" />
            </div>
            <ErrorMessage name="username" component="span" className="text-danger" />
          </div>

          {/* Email Field */}
          <div className="col-12 my-4 d-flex flex-column align-items-center">
            <div className="d-flex col-12">
              <label htmlFor="email" className="col-1">
                <img src={emailicon} alt="emailicon" className="icon" />
              </label>
              <Field type="email" className="ms-4 col-10 rounded p-1 ps-2" name="email" placeholder="Email" />
            </div>
            <ErrorMessage name="email" component="span" className="text-danger" />
          </div>

          {/* Password Field */}
          <div className="col-12 my-4 d-flex flex-column align-items-center">
            <div className="d-flex col-12">
              <label htmlFor="password" className="col-1">
                <img src={passwordicon} alt="passwordicon" className="icon" />
              </label>
              <Field type="password" className="col-10 ms-4 rounded p-1 ps-2" name="password" placeholder="Password" />
            </div>
            <ErrorMessage name="password" component="p" className="text-danger" />
          </div>

          {/* Admin Checkbox */}
          <div className="col-12 my-4 d-flex justify-content-center align-items-baseline">
            <input type="checkbox" className="me-2" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
            <div>Register me as Admin</div>
          </div>

          <button type="submit" className="col-6 btn btn-custom my-2 fs-5">
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </Form>
      </Formik>
    </>
  );
};

export default Signup;
