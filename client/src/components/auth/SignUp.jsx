import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSignUpMutation } from "../../services/api/user/authApi";

// Define validation schema using Yup
const SignupSchema = Yup.object().shape({
  name: Yup.string()
    // .min(3, "Name must be at least 3 characters")
    // .max(30, "Name must be at most 30 characters")
    // .matches(/^[a-zA-Z\s]+$/, "Name must contain only letters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone Number must be 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    // .min(8, "Password must be at least 8 characters")
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, "Password must contain uppercase, lowercase, number, and special character")
    .required("Password is required"),
  password2: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

export const SignUp = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [signup, { isLoading }] = useSignUpMutation();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError, setStatus }) => {
    try {
      const response = await signup(values).unwrap();
      setStatus({ successMessage: "OTP sent to email" });
      navigate("/verify-otp", { state: { email: values.email } });
    } catch (error) {
      setFieldError("apiError", error?.data?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg border border-gray-700">
        <h3 className="text-2xl font-bold text-center mb-6">Account Signup</h3>
        <Formik
          initialValues={{
            name: "",
            email: "",
            phone: "",
            password: "",
            password2: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ status, errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              {status?.successMessage && (
                <div className="text-green-500 text-center">{status.successMessage}</div>
              )}
              {errors.apiError && <div className="text-red-500 text-center">{errors.apiError}</div>}

              <div>
                <label className="bk text-sm">Name</label>
                <Field
                  name="name"
                  type="text"
                  className="w-full bg-gray-900 text-white border border-gray-600 px-4 py-2 rounded"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm">Email</label>
                <Field
                  name="email"
                  type="email"
                  className="w-full bg-gray-900 text-white border border-gray-600 px-4 py-2 rounded"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm">Phone Number</label>
                <Field
                  name="phone"
                  type="tel"
                  className="w-full bg-gray-900 text-white border border-gray-600 px-4 py-2 rounded"
                />
                <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm">Password</label>
                <div className="relative">
                  <Field
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    className="w-full bg-gray-900 text-white border border-gray-600 px-4 py-2 rounded"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {passwordVisible ? "Hide" : "Show"}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm">Confirm Password</label>
                <Field
                  name="password2"
                  type="password"
                  className="w-full bg-gray-900 text-white border border-gray-600 px-4 py-2 rounded"
                />
                <ErrorMessage name="password2" component="div" className="text-red-500 text-sm" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Submitting..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
