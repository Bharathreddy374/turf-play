import React,{useContext, useState} from 'react'
import { validateEmail } from '../../utils/helper';
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/Input'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { UserContext } from '../../context/UserContext';
const Login = () => {
  const [email,setEmail]= useState("");
  const [pass,setPass]=useState("");
  const [err, setErr] = useState<string | null>(null);
  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)){
      setErr("Please enter a valid email address.");
      return;
    }
    if(!pass ){
      setErr("please enter the password");
      return;
    }
    setErr("");
    //login api call
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,
        pass,
      });
      const {token,user}=response.data;
      if(token && user){
        localStorage.setItem("token",token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      const errObj = error as { response?: { data?: { message?: string } } };
      if (errObj.response && errObj.response.data?.message) {
        setErr(errObj.response.data.message);
      } else {
        setErr("Something went wrong. Please try again.");
      }
    }
    
  }

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-1.25 mb-6">
          Please enter your details to Login
        </p>

      <form onSubmit={handleLogin}>
        <Input value={email} 
        onChange={({target})=>setEmail(target.value)}
        label="Email Address"
        placeholder='jhon@example.com'
        type="text"
        />
         <Input value={pass} 
        onChange={({target})=>setPass(target.value)}
        label="Password"
        placeholder='Min 8 Characters'
        type="password"
        />
        {err && <p className='text-red-500 text-xs pb-2.5'>{err}</p>}
        <button type='submit' className='btn-primary'>
          LOGIN
        </button>
        <p className="text-[13px] text-slate-800 mt-3">
          Dont have an account?{" "}
          <Link className='font-medium text-primary underlined' to='/signup'>
          SignUp
          </Link>
        </p>
      </form>

      </div>
    </AuthLayout>
  )
}
export default Login;