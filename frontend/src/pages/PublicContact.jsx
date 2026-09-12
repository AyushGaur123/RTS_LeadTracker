


// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import {
//   ArrowLeft,
//   Mail,
//   Phone,
//   User,
//   Building2,
//   MessageSquare,
//   Sun,
//   Moon,
//   Send,
//   Globe,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// import leadService from "../services/leadService";
// import api from "../services/api";

// function PublicContact() {
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm();

//   const [companies, setCompanies] = useState([]);

//   // --------------------------------------------------
//   // Theme
//   // --------------------------------------------------

//   const [darkMode, setDarkMode] = useState(() => {
//     return localStorage.getItem("leadflow_theme") === "dark";
//   });

//   useEffect(() => {
//     const root = document.documentElement;

//     if (darkMode) {
//       root.classList.add("dark");
//       localStorage.setItem("leadflow_theme", "dark");
//     } else {
//       root.classList.remove("dark");
//       localStorage.setItem("leadflow_theme", "light");
//     }
//   }, [darkMode]);

//   // --------------------------------------------------
//   // Fetch Companies
//   // --------------------------------------------------

//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const response = await api.get("/auth/companies");

//         setCompanies(response.data?.companies || []);
//       } catch (error) {
//         console.error("Failed to load companies:", error);

//         toast.error("Failed to load companies");
//       }
//     };

//     fetchCompanies();
//   }, []);

//   // --------------------------------------------------
//   // Submit
//   // --------------------------------------------------

//   const onSubmit = async (data) => {
//     try {
//       await leadService.createPublicLead({
//         ...data,
//         source: data.source,
//       });

//       toast.success("Message sent successfully!");

//       reset();
//     } catch (error) {
//       console.error("Failed to submit contact form:", error);

//       toast.error(
//         error.response?.data?.message ||
//           "Failed to submit form"
//       );
//     }
//   };

//   // --------------------------------------------------
//   // Common input class
//   // --------------------------------------------------

//   const inputClass = `
//     w-full
//     rounded-xl
//     border
//     border-slate-200
//     bg-slate-50
//     px-4
//     py-2.5
//     pl-10
//     text-sm
//     text-slate-900
//     outline-none
//     transition

//     placeholder:text-slate-400

//     focus:border-indigo-500
//     focus:ring-2
//     focus:ring-indigo-500/20

//     dark:border-slate-700
//     dark:bg-slate-800
//     dark:text-white
//     dark:placeholder:text-slate-500
//   `;

//   return (
//     <div className="min-h-screen bg-slate-50 px-4 py-4 transition-colors duration-300 dark:bg-slate-950 sm:px-6 lg:px-8">

//       {/* =====================================================
//           TOP BAR
//       ===================================================== */}

//       <div className="mx-auto mb-3 flex max-w-6xl items-center justify-between">

//         {/* Back */}
//         <button
//           type="button"
//           onClick={() => navigate(-1)}
//           className="
//             inline-flex
//             items-center
//             gap-2
//             rounded-lg
//             px-2
//             py-1.5
//             text-sm
//             font-medium
//             text-slate-600
//             transition
//             hover:bg-slate-200
//             hover:text-slate-900

//             dark:text-slate-400
//             dark:hover:bg-slate-800
//             dark:hover:text-white
//           "
//         >
//           <ArrowLeft size={18} />
//           Back
//         </button>

//         {/* Theme Toggle */}
//         <button
//           type="button"
//           onClick={() => setDarkMode((prev) => !prev)}
//           className="
//             flex
//             h-9
//             w-9
//             items-center
//             justify-center
//             rounded-xl
//             border
//             border-slate-200
//             bg-white
//             text-slate-600
//             shadow-sm
//             transition
//             hover:bg-slate-100

//             dark:border-slate-700
//             dark:bg-slate-900
//             dark:text-yellow-400
//             dark:hover:bg-slate-800
//           "
//           title={
//             darkMode
//               ? "Switch to light mode"
//               : "Switch to dark mode"
//           }
//         >
//           {darkMode ? (
//             <Sun size={18} />
//           ) : (
//             <Moon size={18} />
//           )}
//         </button>

//       </div>


//       {/* =====================================================
//           MAIN CONTENT
//       ===================================================== */}

//       <div
//         className="
//           mx-auto
//           flex
//           max-w-6xl
//           overflow-hidden
//           rounded-3xl
//           border
//           border-slate-200
//           bg-white
//           shadow-xl
//           shadow-slate-200/40

//           dark:border-slate-800
//           dark:bg-slate-900
//           dark:shadow-none
//         "
//       >

//         {/* ===================================================
//             LEFT SIDE
//         =================================================== */}

//         <div
//           className="
//             relative
//             hidden
//             w-[42%]
//             overflow-hidden
//             lg:block
//           "
//         >

//           <img
//             src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85"
//             alt="Business team meeting"
//             className="
//               absolute
//               inset-0
//               h-full
//               w-full
//               object-cover
//             "
//           />

//           {/* Overlay */}
//           <div
//             className="
//               absolute
//               inset-0
//               bg-gradient-to-br
//               from-indigo-950/90
//               via-indigo-900/75
//               to-slate-950/85
//             "
//           />

//           {/* Content */}
//           <div
//             className="
//               relative
//               flex
//               h-full
//               flex-col
//               justify-between
//               p-8
//               text-white
//             "
//           >

//             {/* Logo */}
//             <div>
//               <div
//                 className="
//                   flex
//                   h-11
//                   w-11
//                   items-center
//                   justify-center
//                   rounded-xl
//                   bg-white/15
//                   backdrop-blur-sm
//                 "
//               >
//                 <Send size={21} />
//               </div>

//               <h2 className="mt-5 text-3xl font-bold leading-tight">
//                 Let's build
//                 <br />
//                 something great.
//               </h2>

//               <p className="mt-3 max-w-sm text-sm leading-6 text-indigo-100">
//                 Tell us about your project and our team
//                 will get back to you shortly.
//               </p>
//             </div>


//             {/* Bottom Info */}
//             <div
//               className="
//                 rounded-2xl
//                 border
//                 border-white/10
//                 bg-white/10
//                 p-4
//                 backdrop-blur-md
//               "
//             >
//               <p className="text-xs uppercase tracking-wider text-indigo-200">
//                 LeadFlow
//               </p>

//               <p className="mt-1 text-sm font-medium">
//                 Your conversation starts here.
//               </p>
//             </div>

//           </div>

//         </div>


//         {/* ===================================================
//             RIGHT SIDE
//         =================================================== */}

//         <div className="w-full p-5 sm:p-6 lg:w-[58%] lg:p-7">

//           {/* Heading */}

//           <div className="mb-5">

//             <div className="flex items-center gap-2">

//               <div
//                 className="
//                   flex
//                   h-9
//                   w-9
//                   items-center
//                   justify-center
//                   rounded-xl
//                   bg-indigo-100
//                   text-indigo-600

//                   dark:bg-indigo-500/10
//                   dark:text-indigo-400
//                 "
//               >
//                 <MessageSquare size={18} />
//               </div>

//               <div>
//                 <h1 className="text-xl font-bold text-slate-900 dark:text-white">
//                   Contact Us
//                 </h1>

//                 <p className="text-xs text-slate-500 dark:text-slate-400">
//                   We'd love to hear from you.
//                 </p>
//               </div>

//             </div>

//           </div>


//           {/* =================================================
//               FORM
//           ================================================= */}

//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="space-y-3.5"
//           >

//             {/* ---------------------------------------------
//                 COMPANY
//             --------------------------------------------- */}

//             <div>
//               <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
//                 Contact Company
//               </label>

//               <div className="relative">

//                 <Building2
//                   size={16}
//                   className="
//                     absolute
//                     left-3.5
//                     top-1/2
//                     -translate-y-1/2
//                     text-slate-400
//                   "
//                 />

//                 <select
//                   {...register("companyId", {
//                     required: "Please select a company",
//                   })}
//                   className={inputClass}
//                 >
//                   <option value="">
//                     Select a company
//                   </option>

//                   {companies.map((company) => (
//                     <option
//                       key={company._id}
//                       value={company._id}
//                     >
//                       {company.companyName}
//                     </option>
//                   ))}
//                 </select>

//               </div>

//               {errors.companyId && (
//                 <p className="mt-1 text-xs text-red-500">
//                   {errors.companyId.message}
//                 </p>
//               )}
//             </div>


//             {/* ---------------------------------------------
//                 NAME + EMAIL
//             --------------------------------------------- */}

//             <div className="grid gap-3 sm:grid-cols-2">

//               {/* Name */}

//               <div>
//                 <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
//                   Your Name
//                 </label>

//                 <div className="relative">

//                   <User
//                     size={16}
//                     className="
//                       absolute
//                       left-3.5
//                       top-1/2
//                       -translate-y-1/2
//                       text-slate-400
//                     "
//                   />

//                   <input
//                     {...register("name", {
//                       required: "Name is required",
//                     })}
//                     placeholder="John Doe"
//                     className={inputClass}
//                   />

//                 </div>

//                 {errors.name && (
//                   <p className="mt-1 text-xs text-red-500">
//                     {errors.name.message}
//                   </p>
//                 )}
//               </div>


//               {/* Email */}

//               <div>
//                 <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
//                   Email
//                 </label>

//                 <div className="relative">

//                   <Mail
//                     size={16}
//                     className="
//                       absolute
//                       left-3.5
//                       top-1/2
//                       -translate-y-1/2
//                       text-slate-400
//                     "
//                   />

//                   <input
//                     type="email"
//                     {...register("email", {
//                       required: "Email is required",
//                     })}
//                     placeholder="john@example.com"
//                     className={inputClass}
//                   />

//                 </div>

//                 {errors.email && (
//                   <p className="mt-1 text-xs text-red-500">
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>

//             </div>


//             {/* ---------------------------------------------
//                 PHONE + SOURCE
//             --------------------------------------------- */}

//             <div className="grid gap-3 sm:grid-cols-2">

//               {/* Phone */}

//               <div>
//                 <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
//                   Phone
//                 </label>

//                 <div className="relative">

//                   <Phone
//                     size={16}
//                     className="
//                       absolute
//                       left-3.5
//                       top-1/2
//                       -translate-y-1/2
//                       text-slate-400
//                     "
//                   />

//                   <input
//                     {...register("phone")}
//                     placeholder="+91 9876543210"
//                     className={inputClass}
//                   />

//                 </div>
//               </div>


//               {/* Source */}

//               <div>
//                 <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
//                   Lead Source
//                 </label>

//                 <div className="relative">

//                   <Globe
//                     size={16}
//                     className="
//                       absolute
//                       left-3.5
//                       top-1/2
//                       -translate-y-1/2
//                       text-slate-400
//                     "
//                   />

//                   <select
//                     {...register("source", {
//                       required: "Please select a source",
//                     })}
//                     className={inputClass}
//                   >

//                     <option value="">
//                       Select source
//                     </option>

//                     <option value="whatsapp">
//                       WhatsApp
//                     </option>

//                     <option value="linkedin">
//                       LinkedIn
//                     </option>

//                     <option value="email">
//                       Email
//                     </option>

//                     <option value="referral">
//                       Referral
//                     </option>

//                     <option value="website">
//                       Website
//                     </option>

//                     <option value="others">
//                       Others
//                     </option>

//                   </select>

//                 </div>

//                 {errors.source && (
//                   <p className="mt-1 text-xs text-red-500">
//                     {errors.source.message}
//                   </p>
//                 )}
//               </div>

//             </div>


//             {/* ---------------------------------------------
//                 COMPANY NAME
//             --------------------------------------------- */}

//             <div>

//               <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
//                 Your Company
//               </label>

//               <div className="relative">

//                 <Building2
//                   size={16}
//                   className="
//                     absolute
//                     left-3.5
//                     top-1/2
//                     -translate-y-1/2
//                     text-slate-400
//                   "
//                 />

//                 <input
//                   {...register("company")}
//                   placeholder="Your company name"
//                   className={inputClass}
//                 />

//               </div>

//             </div>


//             {/* ---------------------------------------------
//                 MESSAGE
//             --------------------------------------------- */}

//             <div>

//               <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
//                 Project Details
//               </label>

//               <div className="relative">

//                 <MessageSquare
//                   size={16}
//                   className="
//                     absolute
//                     left-3.5
//                     top-3
//                     text-slate-400
//                   "
//                 />

//                 <textarea
//                   {...register("message", {
//                     required:
//                       "Please tell us about your project",
//                   })}
//                   rows={3}
//                   placeholder="Tell us what you need..."
//                   className={`${inputClass} resize-none pl-10`}
//                 />

//               </div>

//               {errors.message && (
//                 <p className="mt-1 text-xs text-red-500">
//                   {errors.message.message}
//                 </p>
//               )}

//             </div>


//             {/* ---------------------------------------------
//                 SUBMIT
//             --------------------------------------------- */}

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="
//                 flex
//                 w-full
//                 items-center
//                 justify-center
//                 gap-2
//                 rounded-xl
//                 bg-indigo-600
//                 px-5
//                 py-3
//                 text-sm
//                 font-semibold
//                 text-white
//                 shadow-lg
//                 shadow-indigo-600/20
//                 transition

//                 hover:bg-indigo-700

//                 disabled:cursor-not-allowed
//                 disabled:opacity-60
//               "
//             >

//               {isSubmitting ? (
//                 <>
//                   <span
//                     className="
//                       h-4
//                       w-4
//                       animate-spin
//                       rounded-full
//                       border-2
//                       border-white/30
//                       border-t-white
//                     "
//                   />

//                   Sending...
//                 </>
//               ) : (
//                 <>
//                   <Send size={16} />
//                   Send Message
//                 </>
//               )}

//             </button>

//           </form>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default PublicContact;





import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Building2,
  MessageSquare,
  Send,
  Moon,
  Sun,
} from "lucide-react";

import toast from "react-hot-toast";

import leadService from "../services/leadService";
import api from "../services/api";

function PublicContact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [companies, setCompanies] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  /* =========================================================
     THEME
  ========================================================= */

  useEffect(() => {
    const savedTheme = localStorage.getItem("leadflow_theme");

    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDarkMode(isDark);

    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;

    setDarkMode(newTheme);

    localStorage.setItem(
      "leadflow_theme",
      newTheme ? "dark" : "light"
    );

    document.documentElement.classList.toggle(
      "dark",
      newTheme
    );
  };

  /* =========================================================
     LOAD COMPANIES
  ========================================================= */

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get("/auth/companies");

        setCompanies(response.data?.companies || []);
      } catch (error) {
        console.error(
          "Failed to load companies:",
          error
        );

        toast.error("Failed to load companies");
      }
    };

    fetchCompanies();
  }, []);

  /* =========================================================
     SUBMIT FORM
  ========================================================= */

  const onSubmit = async (data) => {
    try {
      await leadService.createPublicLead({
        ...data,
      });

      toast.success("Message sent successfully!");

      reset();
    } catch (error) {
      console.error(
        "Failed to submit contact form:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to submit form"
      );
    }
  };

  /* =========================================================
     INPUT STYLE
  ========================================================= */

  const inputClass = `
    w-full
    bg-slate-50
    px-4
    py-2.5
    pl-11
    text-sm
    text-slate-900
    outline-none
    shadow-sm
    transition-all
    duration-200

    placeholder:text-slate-400

    hover:shadow-md

    focus:bg-white
    focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12),0_6px_20px_rgba(99,102,241,0.10)]

    dark:bg-slate-800
    dark:text-white
    dark:placeholder:text-slate-500

    dark:focus:bg-slate-800
    dark:focus:shadow-[0_0_0_3px_rgba(129,140,248,0.12),0_6px_20px_rgba(0,0,0,0.25)]
  `;

  const selectClass = `
    w-full
    appearance-none
    bg-slate-50
    px-4
    py-2.5
    text-sm
    text-slate-900
    outline-none
    shadow-sm
    transition-all
    duration-200

    hover:shadow-md

    focus:bg-white
    focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12),0_6px_20px_rgba(99,102,241,0.10)]

    dark:bg-slate-800
    dark:text-white

    dark:focus:bg-slate-800
    dark:focus:shadow-[0_0_0_3px_rgba(129,140,248,0.12),0_6px_20px_rgba(0,0,0,0.25)]
  `;

  return (
    <div
      className="
        min-h-screen
        bg-slate-100
        px-4
        py-4
        text-slate-900
        transition-colors
        duration-300

        dark:bg-slate-950
        dark:text-white

        sm:px-6
      "
    >
      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <div className="mx-auto mb-4 flex max-w-6xl items-center justify-between">
        {/* Back */}
        <Link
          to="/"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-slate-600
            transition
            hover:text-indigo-600

            dark:text-slate-400
            dark:hover:text-indigo-400
          "
        >
          <ArrowLeft size={17} />
          Back
        </Link>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            bg-white
            text-slate-600
            shadow-sm
            transition
            hover:shadow-md
            hover:text-indigo-600

            dark:bg-slate-900
            dark:text-slate-300
            dark:hover:text-indigo-400
          "
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div
        className="
          mx-auto
          grid
          max-w-6xl
          overflow-hidden
          bg-white
          shadow-xl
          shadow-slate-300/30

          dark:bg-slate-900
          dark:shadow-black/20

          lg:grid-cols-2
        "
      >
        {/* ===================================================
            LEFT IMAGE
        =================================================== */}

        <div
          className="
            relative
            hidden
            min-h-[650px]
            overflow-hidden
            lg:block
          "
        >
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85"
            alt="Business team meeting"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
          />

          {/* Image Overlay */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-slate-950/90
              via-slate-950/30
              to-transparent
            "
          />

          {/* Image Content */}
          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              p-10
              text-white
            "
          >
            <div
              className="
                mb-4
                h-1
                w-12
                bg-indigo-500
              "
            />

            <h2 className="text-3xl font-bold leading-tight">
              Let's build something
              <br />
              great together.
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
              Have a project in mind? Tell us what
              you're working on and our team will
              get back to you shortly.
            </p>

            <div className="mt-6 flex items-center gap-3 text-sm text-slate-300">
              <div className="h-px w-8 bg-slate-500" />
              <span>We'd love to hear from you</span>
            </div>
          </div>
        </div>

        {/* ===================================================
            RIGHT FORM
        =================================================== */}

        <div
          className="
            flex
            items-center
            px-5
            py-6

            sm:px-8
            sm:py-8

            lg:px-10
            lg:py-8
          "
        >
          <div className="w-full">
            {/* Header */}

            <div className="mb-5">
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-indigo-600

                  dark:text-indigo-400
                "
              >
                Contact Us
              </p>

              <h1
                className="
                  mt-1
                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-900

                  dark:text-white
                "
              >
                Tell us about your project
              </h1>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500

                  dark:text-slate-400
                "
              >
                Fill in the details below and we'll
                contact you soon.
              </p>
            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-3.5"
            >
              {/* Company */}

              <div>
                <label
                  className="
                    mb-1.5
                    block
                    text-xs
                    font-semibold
                    text-slate-700

                    dark:text-slate-300
                  "
                >
                  Who do you want to contact?
                </label>

                <select
                  {...register("companyId", {
                    required: "Please select a company",
                  })}
                  className={selectClass}
                >
                  <option value="">
                    Select a company
                  </option>

                  {companies.map((company) => (
                    <option
                      key={company._id}
                      value={company._id}
                    >
                      {company.companyName}
                    </option>
                  ))}
                </select>

                {errors.companyId && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.companyId.message}
                  </p>
                )}
              </div>

              {/* Name + Email */}

              <div className="grid gap-3 sm:grid-cols-2">
                {/* Name */}

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Your Name
                  </label>

                  <div className="relative">
                    <User
                      size={16}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      {...register("name", {
                        required: "Name is required",
                      })}
                      placeholder="John Doe"
                      className={inputClass}
                    />
                  </div>

                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={16}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                      })}
                      placeholder="john@example.com"
                      className={inputClass}
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone + Company */}

              <div className="grid gap-3 sm:grid-cols-2">
                {/* Phone */}

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Phone
                  </label>

                  <div className="relative">
                    <Phone
                      size={16}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      {...register("phone")}
                      placeholder="+91 9876543210"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Company */}

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Company
                  </label>

                  <div className="relative">
                    <Building2
                      size={16}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      {...register("company")}
                      placeholder="Your company"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* =================================================
                  SOURCE
              ================================================= */}

              <div>
                <label
                  className="
                    mb-1.5
                    block
                    text-xs
                    font-semibold
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  How did you find us?
                </label>

                <select
                  {...register("source", {
                    required: "Please select a source",
                  })}
                  className={selectClass}
                >
                  <option value="">
                    Select source
                  </option>

                  <option value="whatsapp">
                    WhatsApp
                  </option>

                  <option value="linkdin">
                    Linkdin
                  </option>

                  <option value="email">
                    Email
                  </option>

                  <option value="refrell">
                    Refrell
                  </option>

                  <option value="website">
                    Website
                  </option>

                  <option value="others">
                    Others
                  </option>
                </select>

                {errors.source && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.source.message}
                  </p>
                )}
              </div>

              {/* =================================================
                  MESSAGE
              ================================================= */}

              <div>
                <label
                  className="
                    mb-1.5
                    block
                    text-xs
                    font-semibold
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  Project Details
                </label>

                <div className="relative">
                  <MessageSquare
                    size={16}
                    className="
                      absolute
                      left-4
                      top-4
                      text-slate-400
                    "
                  />

                  <textarea
                    {...register("message", {
                      required:
                        "Please tell us about your project",
                    })}
                    rows={3}
                    placeholder="Tell us what you need..."
                    className={`${inputClass} resize-none pl-11`}
                  />
                </div>

                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* =================================================
                  SUBMIT
              ================================================= */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  bg-indigo-600
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-indigo-600/20
                  transition-all
                  duration-200

                  hover:-translate-y-0.5
                  hover:bg-indigo-700
                  hover:shadow-xl
                  hover:shadow-indigo-600/25

                  active:translate-y-0

                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                      "
                    />

                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>

            {/* Bottom text */}

            <p
              className="
                mt-4
                text-center
                text-[11px]
                text-slate-400
                dark:text-slate-500
              "
            >
              Your information is safe with us.
              We will only use it to contact you
              regarding your inquiry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicContact;