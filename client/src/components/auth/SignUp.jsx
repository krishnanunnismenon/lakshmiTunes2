import { useState } from "react"
import { useNavigate ,Link} from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useSignUpMutation } from "../../services/api/user/authApi"
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setUser } from "@/redux/slice/userSlice"
import { useGoogleAuthMutation } from "../../services/api/user/authApi"

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required"),
  lastName: Yup.string()
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone Number must be 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .required("Password is required"),
  password2: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
})

export const SignUp = () => {
  const navigate = useNavigate()
  const [signup, { isLoading }] = useSignUpMutation()
  const dispatch = useDispatch();
  const [googleLogin] = useGoogleAuthMutation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const authCode = response.code;
      console.log(authCode)
      if (authCode) {
        const backendResponse = await googleLogin({ authCode }).unwrap();
        console.log(`The backed response ://${backendResponse.user.name}`)
        const user = backendResponse?.user;
        const accessToken = backendResponse?.accessToken;
        dispatch(setUser({ user }));
        localStorage.setItem("userToken", accessToken);
        navigate("/user/home");
      }
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google login error:", error);
  };

  const googleAuth = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleFailure,
    flow: "auth-code",
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await signup({
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        phone: values.phone,
        password: values.password
      }).unwrap()
      navigate("/verify-otp", { state: { email: values.email } })
    } catch (error) {
      setFieldError("apiError", error?.data?.message || "Signup failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="bg-[#111] rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Create Account
          </h2>

          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              password: "",
              password2: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                {errors.apiError && (
                  <div className="text-red-500 text-center text-sm">
                    {errors.apiError}
                  </div>
                )}

                <div>
                  <Field
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    className="w-full bg-white text-black px-4 py-2 rounded-md"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <Field
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    className="w-full bg-white text-black px-4 py-2 rounded-md"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full bg-white text-black px-4 py-2 rounded-md"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <Field
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full bg-white text-black px-4 py-2 rounded-md"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <div className="relative">
                    <Field
                      name="password"
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Password"
                      className="w-full bg-white text-black px-4 py-2 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {passwordVisible ? "Hide" : "Show"}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <Field
                    name="password2"
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full bg-white text-black px-4 py-2 rounded-md"
                  />
                  <ErrorMessage
                    name="password2"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Register
                </button>
              </Form>
            )}
          </Formik>
        </div>

        <button
          onClick={googleAuth}
          className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition-colors"
        >
          Sign in With Google
        </button>
        <p className="text-white text-center text-sm">
              Already Have an Account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
          </p>
      </div>
    </div>
  )
}