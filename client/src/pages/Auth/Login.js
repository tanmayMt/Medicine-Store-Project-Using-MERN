import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { FiLock, FiMail } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/login`,
        { email, password }
      );
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Login - Medicure">
      <div className="relative flex w-full max-w-full flex-1 flex-col items-center justify-center overflow-x-hidden bg-gradient-to-b from-slate-50 via-white to-sky-50/50 px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 max-w-full bg-gradient-to-b from-sky-100/25 to-transparent"
          aria-hidden
        />

        <div className="relative w-full max-w-[420px] sm:max-w-md">
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-xl shadow-slate-900/[0.08] ring-1 ring-slate-900/[0.04] backdrop-blur-sm">
            <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600" aria-hidden />

            <div className="px-5 pb-8 pt-7 sm:px-8 sm:pb-9 sm:pt-8">
              <div className="text-center">
                <h1 className="font-playfair text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Welcome back
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                  Sign in to manage orders, track deliveries, and shop trusted healthcare products.
                </p>
              </div>

              <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Email
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <FiMail className="h-4 w-4" aria-hidden />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/25 sm:text-[15px]"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Password
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <FiLock className="h-4 w-4" aria-hidden />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/25 sm:text-[15px]"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm font-medium text-sky-700 transition hover:text-sky-900 hover:underline underline-offset-2"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:bg-slate-800 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 active:scale-[0.99]"
                >
                  Sign in
                </button>

                <p className="pt-1 text-center text-sm text-slate-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-slate-900 underline-offset-2 transition hover:text-sky-800 hover:underline"
                  >
                    Create account
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
