import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useSignInMutation } from "@/services/api/user/authApi"

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
})

export const AdminLogin = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [signIn, { isLoading }] = useSignInMutation()

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const response = await signIn(values).unwrap()
      // Handle successful login (e.g., store token, redirect)
      navigate("/admin/dashboard")
    } catch (error) {
      setStatus({ apiError: error?.data?.message || "An error occurred" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-gray-400 mt-2">
            Only admins are allowed to login through this interface
          </p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, status }) => (
            <Form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@email.com"
                  className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    className="bg-gray-900 border-gray-800 text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  >
                    {passwordVisible ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="border-gray-600 data-[state=checked]:bg-white data-[state=checked]:text-black" />
                  <Label htmlFor="remember" className="text-sm text-gray-300">
                    Remember me
                  </Label>
                </div>
                <button type="button" className="text-sm text-gray-300 hover:text-white">
                  Forgot Password?
                </button>
              </div>

              {status && status.apiError && (
                <p className="text-red-500 text-sm text-center">{status.apiError}</p>
              )}

              <Button 
                type="submit" 
                className="w-full bg-white text-black hover:bg-gray-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login Account"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AdminLogin