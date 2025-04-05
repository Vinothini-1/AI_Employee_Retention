import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailicon from "../assets/email.png";
import passwordicon from "../assets/password.png";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoggedIn, setToken } from "../Slices/AuthSlice";

const Login = () => {
  const axiosBaseURL = "http://localhost:8000/api";
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "At least 6 characters").required("Required"),
  });

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const options = { email: values.email.trim(), password: values.password.trim() };

      const res = await axios.post(`${axiosBaseURL}/user/login`, options);

      if (res.status === 200) {
        const userRole = res.data.role; // Get role from backend
       
        // Store in local storage
        dispatch(setLoggedIn(true));
        dispatch(setToken(res.data.token));
        localStorage.setItem("authToken", res.data.token);

        toast.success("Login successful");

        // Redirect based on role
        if (userRole === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error(res.data.message || "An error occurred");
      }
    } catch (error) {
      toast.error("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleLogin}>
        <Form className="container d-flex flex-column justify-content-center align-items-center form">
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

          <button type="submit" className="col-6 btn btn-custom my-2 fs-5">
            {loading ? "Processing..." : "Login"}
          </button>
        </Form>
      </Formik>
    </>
  );
};

export default Login;
