import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGoogleAuthMutation, useSignInMutation } from "@/services/api/user/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { setUser } from "@/redux/slice/userSlice";
import { useGoogleLogin } from "@react-oauth/google";
import { setCredentials } from "@/redux/slice/authSlice";

export const LoginStructure = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [signIn, { isLoading }] = useSignInMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleAuthMutation();

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await signIn(values).unwrap();
        console.log(response)
        const user= response?.data.user;
        console.log(user)
        const accessToken = response?.accessToken
        console.log(accessToken);
        
        dispatch(setCredentials({ user,accessToken }));
        localStorage.setItem("userToken", accessToken);
        navigate("/user/home");
      } catch (error) {
        formik.setStatus({ apiError: error?.data?.message });
      }
    },
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Google Login flow
  const handleGoogleSuccess = async (response) => {
    try {
      const authCode = response.code;
      console.log(authCode)
      if (authCode) {
        const backendResponse = await googleLogin({ authCode }).unwrap();
       console.log(`The backed response ://${backendResponse.user.name}`)
       const user = backendResponse?.user;
       const accessToken = backendResponse?.accessToken;
       dispatch(setCredentials({ user,accessToken }));
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

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="p-8 rounded-lg border border-gray-800">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold">Account Signin</h3>
              {formik.status?.apiError && (
                <p className="text-red-500 mt-2">{formik.status.apiError}</p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  {...formik.getFieldProps("email")}
                  className="bg-black text-white border-gray-700"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    {...formik.getFieldProps("password")}
                    className="bg-black text-white border-gray-700 pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {passwordVisible ? (
                      <EyeOffIcon className="h-4 w-4 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                )}
              </div>
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-gray-200"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={googleAuth}
              className="w-full bg-black text-white border-white hover:bg-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 186.69 190.5"
                className="inline-block mr-2"
              >
                <g transform="translate(1184.583 765.171)">
                  <path fill="#4285f4" d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z" />
                  <path fill="#34a853" d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z" />
                  <path fill="#fbbc05" d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z" />
                  <path fill="#ea4335" d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z" />
                </g>
              </svg>
              {isGoogleLoading ? "Loading..." : "Continue with Google"}
            </Button>

            <p className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-blue-500 hover:underline">
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}