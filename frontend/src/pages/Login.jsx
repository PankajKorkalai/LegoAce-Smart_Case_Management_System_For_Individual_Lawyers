import React, { useState } from "react";
import { Eye, Mail, Lock } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate=useNavigate();

  const handleSignUp = async () => {
    if(!mail || !password || (!isLogin && !name)){
      alert("Please fill all the fields");
      return;
    }
    console.log("here");
     if(isLogin){
       const resp=await axios.post(`${import.meta.env.VITE_API_URL}/user/login`,{
        email:mail,
        password
      });
      if(resp.data.message==="User_not_exists"){
        alert("Invalid email or password. Please try again.");
        return;
      } else{
        navigate("/");
      }
     } else{
      console.log("name ",name);
      console.log("mail ",mail);
      console.log("password ",password);
         const resp=await axios.post(`${import.meta.env.VITE_API_URL}/user/register`,{
        name,
        email:mail,
        password
      });

      console.log("resp ",resp);
      if(resp.data.message==="Email_Present"){
        alert("Email already registered. Please log in.");
        return;
      } else if(resp.data.message==="Invalid_types"){
        alert("Invalid input types. Please check your entries.");
        return;
      } 

      else{
      navigate("/");
      }

      console.log("resp ",resp);
     }

  }

  return (
    <div className="h-screen flex">
      
      {/* LEFT SIDE */}
      <div className="w-1/2 bg-black text-white p-12 flex flex-col justify-center relative">
        
        {/* subtle grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="relative z-10 max-w-xl">
          
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-white text-black rounded-lg p-2">
              ⚖️
            </div>
            <span className="text-lg font-semibold">LegalFlow</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold leading-tight mb-6">
            The complete platform for modern legal practice
          </h1>

          <p className="text-gray-300 mb-8">
            Streamline your workflow, manage cases efficiently, and deliver
            exceptional client service with our all-in-one solution.
          </p>

          {/* Features */}
          <div className="space-y-4 mb-8">
            {[
              "Manage unlimited cases and clients",
              "AI-powered legal research assistant",
              "Secure document management",
              "Video consultations with clients",
              "Calendar and deadline tracking",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  ✓
                </div>
                <span className="text-gray-200 text-sm">{item}</span>
              </div>
            ))}
          </div>

          {/* Rating */}
          <div className="text-green-500 mb-4">★★★★★</div>

          {/* Quote */}
          <p className="italic text-gray-400">
            "The AI assistant alone saves me 10 hours per week on legal research.
            It's like having an extra associate on staff."
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50">
        
        <div className="w-[420px] bg-white p-8 rounded-xl border border-gray-200">
          
          {/* Heading */}
          <h1 className="text-2xl font-semibold text-center">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>

          <p className="text-center text-gray-500 mt-2 mb-6 text-sm">
            {isLogin
              ? "Enter your credentials to access your account"
              : "Create your account to get started"}
          </p>

          {/* Form */}
          <div className="space-y-4">
            
            {!isLogin && (
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <div className="mt-1 border rounded-lg px-3 py-3">
                  <input onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Enter your name"
                    className="w-full outline-none text-sm"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-sm font-medium">Email Address</label>
              <div className="mt-1 border rounded-lg px-3 py-3 flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <input  onChange={(e) => setMail(e.target.value)}
                  type="email"
                  placeholder="john@lawfirm.com"
                  className="w-full outline-none text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between text-sm font-medium">
                <label>Password</label>
                {isLogin && (
                  <span className="text-green-600 cursor-pointer text-xs">
                    Forgot password?
                  </span>
                )}
              </div>

              <div className="mt-1 border rounded-lg px-3 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 w-full">
                  <Lock size={16} className="text-gray-400" />
                  <input onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Enter your password"
                    className="w-full outline-none text-sm"
                  />
                </div>
                <Eye size={18} className="text-gray-400 cursor-pointer" />
              </div>
            </div>

            {/* Remember */}
            {isLogin && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="w-4 h-4" />
                <span>Remember me for 30 days</span>
              </div>
            )}

            {/* Button */}
            <button onClick={handleSignUp} className="w-full bg-[#0f7a3d] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#0d6b35] transition">
              {isLogin ? "Sign In" : "Sign Up"}
              <span>→</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400">
              OR CONTINUE WITH
            </span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google */}
          <button className="w-full border rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50">
            <img
              src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
              alt="google"
              className="w-5"
            />
            Continue with Google
          </button>

          {/* Toggle */}
          <p className="text-center text-sm mt-5 text-gray-600">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-600 cursor-pointer font-medium"
            >
              {isLogin ? " Sign up for free" : " Sign in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;