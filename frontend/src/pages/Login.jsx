import React, { useState } from "react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[420px] bg-white p-8 rounded-xl shadow-md">
        
        {/* Heading */}
        <h1 className="text-2xl font-semibold text-center">
          {isLogin ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-center text-gray-500 mt-2 mb-6 text-sm">
          {isLogin
            ? "Enter your credentials to access your account"
            : "Fill details to create your account"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLogin && (
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john@lawfirm.com"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Password</label>
              {isLogin && (
                <span className="text-green-600 text-xs cursor-pointer">
                  Forgot password?
                </span>
              )}
            </div>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {isLogin && (
            <div className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
              <span>Remember me for 30 days</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-lg font-medium hover:bg-green-800 transition"
          >
            {isLogin ? "Sign In →" : "Sign Up →"}
          </button>
        </form>

        {/* Divider */}
        <div className="text-center text-xs text-gray-400 my-5">
          OR CONTINUE WITH
        </div>

        {/* Google Button */}
        <button className="w-full border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
          <img
            src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
            alt="google"
            className="w-4"
          />
          Continue with Google
        </button>

        {/* Toggle */}
        <p className="text-center text-sm mt-4">
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

        {/* Footer */}
        <div className="flex justify-between text-xs text-gray-400 mt-6">
          <span>🔒 256-bit SSL</span>
          <span>✔ SOC 2</span>
          <span>✔ GDPR</span>
        </div>
      </div>
    </div>
  );
};

export default Login;