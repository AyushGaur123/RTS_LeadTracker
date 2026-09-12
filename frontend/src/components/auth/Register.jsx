import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  FileText,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import authService from "../../services/authService";
import ThemeToggle from "../common/ThemeToggle";

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      await authService.register(data);

      toast.success(
        "Admin account created successfully!"
      );

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-slate-100
        text-slate-900
        dark:bg-slate-950
        dark:text-white
      "
    >


      <div
        className="
          fixed
          right-4
          top-4
          z-10
        "
      >
        <ThemeToggle />
      </div>


     
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          px-4
          py-4
        "
      >

      

        <div
          className="
            w-full
            max-w-[441px]
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-6
            py-5
            shadow-lg
            shadow-slate-200/50
            dark:border-slate-800
            dark:bg-slate-900
            dark:shadow-black/20
          "
        >

         

          <div className="mb-4 text-center">

            <div
              className="
                mx-auto
                mb-2
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-indigo-600
                text-lg
                font-bold
                text-white
              "
            >
              L
            </div>

            <h1
              className="
                text-xl
                font-bold
              "
            >
              Create your account
            </h1>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              Create an admin account for your company
            </p>

          </div>



          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3"
          >

          

            <div>

              <label
                className="
                  mb-1
                  block
                  text-xs
                  font-medium
                "
              >
                Name
              </label>

              <div className="relative">

                <User
                  size={15}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="text"
                  placeholder="Your name"
                  {...register("name", {
                    required:
                      "Name is required",
                  })}
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50
                    pl-9
                    pr-3
                    text-xs
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

              {errors.name && (
                <p className="mt-0.5 text-[10px] text-red-500">
                  {errors.name.message}
                </p>
              )}

            </div>


          

            <div>

              <label
                className="
                  mb-1
                  block
                  text-xs
                  font-medium
                "
              >
                Email
              </label>

              <div className="relative">

                <Mail
                  size={15}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="email"
                  placeholder="admin@company.com"
                  {...register("email", {
                    required:
                      "Email is required",
                  })}
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50
                    pl-9
                    pr-3
                    text-xs
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
                <p className="mt-0.5 text-[10px] text-red-500">
                  {errors.email.message}
                </p>
              )}

            </div>


          
            <div>

              <label
                className="
                  mb-1
                  block
                  text-xs
                  font-medium
                "
              >
                Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={15}
                  className="
                    absolute
                    left-3
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
                    minLength: {
                      value: 6,
                      message:
                        "Minimum 6 characters",
                    },
                  })}
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50
                    pl-9
                    pr-10
                    text-xs
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
                      (prev) => !prev
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                >
                  {showPassword ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>

              </div>

              {errors.password && (
                <p className="mt-0.5 text-[10px] text-red-500">
                  {errors.password.message}
                </p>
              )}

            </div>


          

            <div>

              <label
                className="
                  mb-1
                  block
                  text-xs
                  font-medium
                "
              >
                Company Name
              </label>

              <div className="relative">

                <Building2
                  size={15}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="text"
                  placeholder="Your company"
                  {...register("companyName", {
                    required:
                      "Company name is required",
                  })}
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50
                    pl-9
                    pr-3
                    text-xs
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

              {errors.companyName && (
                <p className="mt-0.5 text-[10px] text-red-500">
                  {errors.companyName.message}
                </p>
              )}

            </div>


        

            <div>

              <label
                className="
                  mb-1
                  block
                  text-xs
                  font-medium
                "
              >
                Company Description
              </label>

              <div className="relative">

                <FileText
                  size={15}
                  className="
                    absolute
                    left-3
                    top-2.5
                    text-slate-400
                  "
                />

                <textarea
                  rows={2}
                  placeholder="Briefly describe your company"
                  {...register(
                    "companyDescription"
                  )}
                  className="
                    h-14
                    w-full
                    resize-none
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50
                    py-2
                    pl-9
                    pr-3
                    text-xs
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

            </div>


           

            <button
              type="submit"
              disabled={loading}
              className="
                h-10
                w-full
                rounded-lg
                bg-indigo-600
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-indigo-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>

          </form>


          

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
                navigate("/login")
              }
              className="
                font-semibold
                text-indigo-600
                hover:text-indigo-700
                dark:text-indigo-400
              "
            >
              Sign in
            </button>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;