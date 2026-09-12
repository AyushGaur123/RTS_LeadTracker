import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import useAuthStore from "../../store/authStore";
import ThemeToggle from "../common/ThemeToggle";

function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    login,
    loading,
    token,
  } = useAuthStore();

  const [showPassword, setShowPassword] =
    useState(false);

  if (token) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (data) => {
    try {
      await login(data);

      toast.success(
        "Welcome back to LeadFlow!"
      );

      navigate("/admin");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  };

  return (
    <div className="
      min-h-screen
      bg-slate-100
      text-slate-900
      dark:bg-slate-950
      dark:text-white
    ">
     <div className="absolute left-6 top-6">
      <Link to="/"> <ArrowLeft/>
      </Link>
     </div>
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      <div className="
        flex min-h-screen
        items-center justify-center
        px-4
      ">
        <div className="
          w-full max-w-md
          rounded-3xl
          border border-slate-200
          bg-white p-8
          shadow-xl shadow-slate-200/50
          dark:border-slate-800
          dark:bg-slate-900
          dark:shadow-black/20
        ">

          <div className="mb-8 text-center">
            <div className="
              mx-auto mb-4
              flex h-14 w-14
              items-center justify-center
              rounded-2xl
              bg-indigo-600
              text-xl font-bold text-white
            ">
              L
            </div>

            <h1 className="
              text-2xl font-bold
            ">
              Welcome to LeadNova
            </h1>

            <p className="
              mt-2 text-sm
              text-slate-500
              dark:text-slate-400
            ">
              Sign in to manage your leads
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            <div>
              <label className="
                mb-2 block text-sm
                font-medium
              ">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="
                    absolute left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="email"
                  placeholder="admin@leadflow.com"
                  {...register("email", {
                    required:
                      "Email is required",
                  })}
                  className="
                    w-full rounded-xl
                    border border-slate-200
                    bg-slate-50
                    py-3 pl-10 pr-4
                    outline-none
                    transition
                    focus:border-indigo-500
                    focus:ring-2
                    focus:ring-indigo-500/20
                    dark:border-slate-700
                    dark:bg-slate-800
                  "
                />
              </div>

              {errors.email && (
                <p className="
                  mt-1 text-xs text-red-500
                ">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="
                mb-2 block text-sm
                font-medium
              ">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="
                    absolute left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                  {...register("password", {
                    required:
                      "Password is required",
                  })}
                  className="
                    w-full rounded-xl
                    border border-slate-200
                    bg-slate-50
                    py-3 pl-10 pr-12
                    outline-none
                    transition
                    focus:border-indigo-500
                    focus:ring-2
                    focus:ring-indigo-500/20
                    dark:border-slate-700
                    dark:bg-slate-800
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    absolute right-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="
                  mt-1 text-xs text-red-500
                ">
                  {errors.password.message}
                </p>
              )}
            </div>

            <p
              className="
              mt-3
              text-center
              text-xs
              text-slate-500
              dark:text-slate-400
            "
            >
              Already have an account?{" "}

              <button
                type="button"
                onClick={() =>
                  navigate("/register")
                }
                className="
                font-semibold
                text-indigo-600
                hover:text-indigo-700
                dark:text-indigo-400
              "
              >
                Sign up
              </button>
            </p>


            <button
              type="submit"
              disabled={loading}
              className="
                w-full rounded-xl
                bg-indigo-600
                py-3
                font-semibold text-white
                transition
                hover:bg-indigo-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;