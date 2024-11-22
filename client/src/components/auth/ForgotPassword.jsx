import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForgotPassMutation } from '@/services/api/user/authApi'

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
})

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [verifyEmail] = useForgotPassMutation()
  const [error, setError] = useState('')

  const handleSubmit = async (values, { setSubmitting }) => {
    
    
    try {
      await verifyEmail({email:values.email}).unwrap()
      navigate('/forgotOtp-verification', { state: { email: values.email } })
    } catch (err) {
      setError(err.data?.message || 'An error occurred. Please try again later.')
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-black border-neutral-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl text-white text-center">Reset your password</CardTitle>
          <CardDescription className="text-neutral-400 text-center">
            We will send you an email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-neutral-400">
                    Email
                  </Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                    className="bg-black border-neutral-800 text-white placeholder:text-neutral-500"
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                  )}
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <Button 
                  type="submit" 
                  className="w-full bg-neutral-800 hover:bg-neutral-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send'}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  )
}