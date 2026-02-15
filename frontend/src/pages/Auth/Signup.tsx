import React, { useState, useContext } from 'react'
import { validateEmail } from '../../utils/helper'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/inputs/Input'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import { UserContext } from '../../context/UserContext'

const Signup = () => {
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [err, setErr] = useState<string | null>(null)
  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!fullname) {
      setErr("Full name is required")
      return
    }

    if (!validateEmail(email)) {
      setErr("Please enter a valid email address")
      return
    }

    if (!pass) {
      setErr("Password is required")
      return
    }

    if (pass.length < 8) {
      setErr("Password must be at least 8 characters")
      return
    }

    if (pass !== confirmPass) {
      setErr("Passwords do not match")
      return
    }

    setErr("")

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.SIGNUP, {
        fullname,
        email,
        pass,
      })
      const { token, refreshToken, user } = response.data
      if (token && user) {
        localStorage.setItem("token", token)
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken)
        updateUser(user)
        navigate("/dashboard")
      }
    } catch (error) {
      const errObj = error as { response?: { data?: { message?: string } } }
      if (errObj.response && errObj.response.data?.message) {
        setErr(errObj.response.data.message)
      } else {
        setErr("Something went wrong. Please try again.")
      }
    }
  }

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create Account</h3>
        <p className="text-xs text-slate-700 mt-1.25 mb-6">
          Please fill in your details to sign up
        </p>

        <form onSubmit={handleSignup}>
          <Input
            value={fullname}
            onChange={({ target }) => setFullname(target.value)}
            label="Full Name"
            placeholder="John Doe"
            type="text"
          />
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />
          <Input
            value={pass}
            onChange={({ target }) => setPass(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />
          <Input
            value={confirmPass}
            onChange={({ target }) => setConfirmPass(target.value)}
            label="Confirm Password"
            placeholder="Re-enter Password"
            type="password"
          />
          {err && <p className='text-red-500 text-xs pb-2.5'>{err}</p>}
          <button type='submit' className='btn-primary'>
            SIGN UP
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link className='font-medium text-primary underlined' to='/login'>
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Signup
