'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useVerifyOTPMutation, useResendOTPMutation } from "@/services/api/authApi"
import { useLocation, useNavigate } from 'react-router-dom'

const OtpStructure = () => {
  const location = useLocation()  
  const navigate = useNavigate()
  const email = location.state?.email

  const [verifyOTP, { isLoading }] = useVerifyOTPMutation()
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation()
  const [resendMessage, setResendMessage] = useState("")
  const [serverErrors, setServerErrors] = useState({})
  const [resendTimer, setResendTimer] = useState(() => {
    const savedTimer = localStorage.getItem("resendTimer")
    const savedTime = localStorage.getItem("resendTime")
    if (savedTimer && savedTime) {
      const passedTime = Math.floor((Date.now() - parseInt(savedTime, 10)) / 1000)
      const remainingTime = Math.max(0, parseInt(savedTimer, 10) - passedTime)
      return remainingTime
    }
    return 60 // Initial timer value
  })

  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]

  useEffect(() => {
    localStorage.removeItem("resendTimer")
    localStorage.removeItem("resendTime")
  }, [])

  useEffect(() => {
    let timer
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prevTimer) => {
          const newTimer = prevTimer - 1
          localStorage.setItem("resendTimer", newTimer.toString())
          localStorage.setItem("resendTime", Date.now().toString())
          return newTimer
        })
      }, 1000)
    }
    return () => {
      clearInterval(timer)
    }
  }, [resendTimer])

  const formik = useFormik({
    initialValues: {
      otp: ['', '', '', '', '', '']
    },
    validationSchema: Yup.object({
      otp: Yup.array()
        .of(Yup.string().required('Required').length(1, 'Must be 1 digit'))
        .test('is-complete', 'Must enter all 6 digits', (value) => value.every(digit => digit !== ''))
    }),
    onSubmit: async (values) => {
      const otpValue = values.otp.join('')
      try {
        await verifyOTP({ email, otpValue }).unwrap()
        navigate("/sign-in")
      } catch (error) {
        setServerErrors({ apiError: error?.data?.message })
        console.log(error?.data?.message)
      }
    }
  })

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...formik.values.otp]
    newOtp[index] = value
    formik.setFieldValue('otp', newOtp)

    if (value !== "" && index < 5) {
      inputRefs[index + 1].current.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !formik.values.otp[index] && index > 0) {
      inputRefs[index - 1].current.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("")
    const newOtp = [...formik.values.otp]
    pastedData.forEach((value, index) => {
      if (index < 6 && /^\d$/.test(value)) {
        newOtp[index] = value
      }
    })
    formik.setFieldValue('otp', newOtp)
  }

  const handleResend = async (e) => {
    e.preventDefault()
    if (isResending || resendTimer > 0) return

    try {
      await resendOTP({ email }).unwrap()
      setResendTimer(60)
      localStorage.setItem("resendTimer", "60")
      localStorage.setItem("resendTime", Date.now().toString())
      setResendMessage("OTP resent successfully")
      setTimeout(() => setResendMessage(""), 2000)
    } catch (error) {
      setResendMessage("Failed to resend OTP. Please try again.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Email Verification</h2>
        <p className="text-center mb-8">Enter the 6-digit verification code sent to your email.</p>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {formik.values.otp.map((digit, index) => (
              <Input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                ref={inputRefs[index]}
                id={`otp-${index}`}
                className="w-12 h-12 text-center text-black bg-white"
              />
            ))}
          </div>
          {formik.errors.otp && formik.touched.otp && (
            <div className="text-red-500 text-center">{formik.errors.otp}</div>
          )}
          {serverErrors.apiError && (
            <div className="text-red-500 text-center">{serverErrors.apiError}</div>
          )}

          <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <span>Didn't receive code? </span>
          <Button
            onClick={handleResend}
            disabled={resendTimer > 0 || isResending}
            variant="link"
            className="text-white p-0"
          >
            {isResending
              ? "Resending..."
              : resendTimer > 0
              ? `Resend in ${resendTimer}s`
              : "Resend"}
          </Button>
        </div>

        {resendMessage && (
          <div className="mt-2 text-center text-sm">{resendMessage}</div>
        )}
      </div>
    </div>
  )
}

export default OtpStructure