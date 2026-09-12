import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, BarChart3, Check, ChevronDown, Database, Handshake, Lightbulb, Menu, MessageCircle, Moon, Sparkles, Sun, Target, TrendingUp, UserRound, Users, Workflow, X, Zap, } from "lucide-react";
import ThemeToggle from "../components/common/ThemeToggle";
import imageA from "../assets/imageA.avif"
import imageB from "../assets/imageB.avif"
import imageC from "../assets/imageC.avif"
import imageD from "../assets/imageD.avif"
import imageE from "../assets/imageE.avif"
import imageF from "../assets/imageF.avif"
import imageG from "../assets/imageG.avif"

function Home() {

  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-900 transition-colors duration-500 dark:bg-[#07101f] dark:text-white">

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#07101f]/80">

        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 lg:px-8">


          <div className="
              flex h-20
             items-center
             border-b
               border-slate-200
               px-6
               dark:border-slate-800
             ">
            <div className="
          flex items-center gap-3
        ">
              <div className="
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            bg-indigo-600
            font-bold text-white
          ">
                <Handshake size={20} />
              </div>

              <div>
                <h1 className="
              font-bold
            ">
                  <a href="#home">LeadNova</a>

                </h1>

                <p className="
              text-xs
              text-slate-500
              dark:text-slate-400
            ">
                  Client CRM
                </p>
              </div>
            </div>
          </div>


          <nav className="hidden items-center gap-8 md:flex">

            <a
              href="#what-is-crm"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
            >
              What is CRM?
            </a>

            <a
              href="#what-it-does"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
            >
              What it does
            </a>

            <a
              href="#benefits"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
            >
              Benefits
            </a>

            <a
              href="#future"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
            >
              Future
            </a>



          </nav>


          <div className="hidden items-center gap-4 md:flex">

            <ThemeToggle />

            <a
              href="/login"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Login
            </a>

          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 dark:border-white/10"
            >
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {mobileMenu && (
          <div className="border-t border-slate-200 bg-white px-5 py-5 dark:border-white/10 dark:bg-[#07101f] md:hidden">

            <div className="flex flex-col gap-4">

              <a
                onClick={() => setMobileMenu(false)}
                href="#what-is-crm"
                className="text-sm font-medium"
              >
                What is CRM?
              </a>

              <a
                onClick={() => setMobileMenu(false)}
                href="#what-it-does"
                className="text-sm font-medium"
              >
                What it does
              </a>

              <a
                onClick={() => setMobileMenu(false)}
                href="#benefits"
                className="text-sm font-medium"
              >
                Benefits
              </a>

              <a
                onClick={() => setMobileMenu(false)}
                href="#future"
                className="text-sm font-medium"
              >
                Future
              </a>



              <a
                href="/login"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Login
              </a>

            </div>

          </div>
        )}

      </header>


      <main>

        <section
          id="home"
          className="relative min-h-screen overflow-hidden pt-[74px]"
        >

          <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/10" />

          <div className="absolute -left-40 bottom-10 h-[350px] w-[350px] rounded-full bg-cyan-400/10 blur-3xl" />


          <div className="relative mx-auto grid min-h-[calc(100vh-74px)] max-w-7xl items-center gap-14 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">

            <div className="animate-fade-up">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-400">
                <Sparkles size={14} />
                Customer Relationship Management
              </div>


              <h1 className="max-w-3xl font-[Manrope] text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-[76px]">

                Build

                <span className="block text-blue-600">
                  stronger
                </span>

                customer

                <span className="block">
                  relationships.
                </span>

              </h1>


              <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">
                A CRM brings customer information,
                communication and relationships together
                so your business can understand people,
                serve them better and grow with confidence.
              </p>


              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <a
                  href="#getting-started"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-700"
                >
                  Start Building

                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </a>


                <a
                  href="#what-is-crm"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:-translate-y-1 hover:border-blue-400 hover:text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                >
                  Explore CRM
                  <ChevronDown size={16} />
                </a>

              </div>

              <div className="mt-12 flex flex-wrap gap-8 border-t border-slate-200 pt-7 dark:border-white/10">

                <MiniStat
                  number="01"
                  text="Customer First"
                />

                <MiniStat
                  number="02"
                  text="Data Driven"
                />

                <MiniStat
                  number="03"
                  text="Built to Grow"
                />

              </div>

            </div>


            <div className="relative mx-auto h-[360px] w-full max-w-[650px] animate-fade-right sm:h-[440px] lg:h-[520px]">

              <div className="absolute bottom-0 right-0 h-[88%] w-[82%] rounded-[100px_30px_100px_30px] bg-blue-600 transition-transform duration-700 hover:rotate-1" />

              <img
                src={imageB}
                alt="Business team having a meeting"
                className="absolute right-5 top-5 h-[87%] w-[88%] rounded-[30px_100px_30px_100px] object-cover shadow-2xl transition duration-700 hover:scale-[1.02]"
              />


              <div className="absolute bottom-4 left-0 flex max-w-[85%] animate-float items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-white/10 dark:bg-[#111c2d] sm:bottom-10 sm:max-w-none sm:p-4">

                <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Users size={20} />
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Customer First
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Relationships that matter
                  </p>
                </div>

              </div>

              <div className="absolute right-0 top-14 animate-float-slow rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-[#111c2d]">

                <div className="flex items-center gap-2">

                  <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <MessageCircle size={17} />
                  </div>

                  <div>
                    <p className="text-xs font-bold">
                      New interaction
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Customer replied
                    </p>
                  </div>

                </div>

              </div>


              <div className="absolute -bottom-2 right-10 text-5xl text-blue-500 animate-spin-slow">
                ✦
              </div>

            </div>

          </div>

        </section>

        <section
          id="what-is-crm"
          className="bg-slate-50 py-28 dark:bg-[#0b1526]"
        >

          <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 lg:grid-cols-2 lg:px-8">



            <div className="relative">

              <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-blue-600/10" />

              <img
                src={imageC}
                alt="People discussing business in an office"
                className="relative h-[300px] w-full rounded-[40px_12px_40px_12px] object-cover shadow-2xl sm:h-[380px] lg:h-[500px]"
              />


              <div className="absolute -right-5 bottom-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-[#111c2d]">

                <Database className="mb-2 text-blue-600" size={23} />

                <p className="text-sm font-bold">
                  One organized place
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Customers • Conversations • Data
                </p>

              </div>

            </div>


            <div>

              <SectionLabel>
                CRM Meaning
              </SectionLabel>

              <h2 className="font-[Manrope] text-4xl font-extrabold tracking-[-0.035em] sm:text-5xl lg:text-6xl">

                What is

                <span className="text-blue-600">
                  {" "}CRM?
                </span>

              </h2>


              <p className="mt-6 text-lg font-medium text-slate-700 dark:text-slate-300">
                CRM means
                <strong> Customer Relationship Management.</strong>
              </p>


              <p className="mt-5 leading-8 text-slate-600 dark:text-slate-400">
                It refers to the strategies and systems
                businesses use to manage interactions with
                customers, improve relationships and enhance
                satisfaction.
              </p>


              <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                The goal is simple: understand customers,
                communicate effectively and create relationships
                that support long-term business development.
              </p>


              <div className="mt-8 space-y-4">

                <CheckItem text="Manage customer relationships" />

                <CheckItem text="Improve communication" />

                <CheckItem text="Understand customer needs" />

                <CheckItem text="Support long-term growth" />

              </div>

            </div>

          </div>

        </section>

        <section
          id="what-it-does"
          className="bg-white py-28 dark:bg-[#07101f]"
        >

          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="mx-auto max-w-3xl text-center">

              <SectionLabel>
                How CRM Works
              </SectionLabel>

              <h2 className="font-[Manrope] text-4xl font-extrabold tracking-[-0.035em] sm:text-5xl">

                What does a

                <span className="text-blue-600">
                  {" "}CRM do?
                </span>

              </h2>

              <p className="mt-5 leading-8 text-slate-600 dark:text-slate-400">
                A CRM helps businesses organize information,
                maintain communication and manage customer
                relationships more effectively.
              </p>

            </div>


            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <FeatureCard
                number="01"
                icon={Users}
                title="Manage Customers"
                text="Keep customer information organized and accessible."
              />

              <FeatureCard
                number="02"
                icon={MessageCircle}
                title="Track Communication"
                text="Keep conversations and interactions connected to customers."
              />

              <FeatureCard
                number="03"
                icon={Target}
                title="Understand Needs"
                text="Use customer information to better understand expectations."
              />

              <FeatureCard
                number="04"
                icon={BarChart3}
                title="Make Decisions"
                text="Use organized information to support better business decisions."
              />

            </div>

          </div>

        </section>



        <section className="relative overflow-hidden bg-blue-600 py-24 text-white">

          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />

          <div className="absolute -bottom-40 left-10 h-80 w-80 rounded-full border border-white/10" />


          <div className="relative mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-2 lg:px-8">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                Importance of CRM
              </p>

              <h2 className="mt-5 font-[Manrope] text-5xl font-extrabold leading-none tracking-[-0.04em] sm:text-6xl">
                Build loyalty
                <br />
                through
                <br />
                relationships.
              </h2>

            </div>


            <div className="flex items-center">

              <div>

                <h3 className="text-2xl font-bold">
                  Strong relationships create lasting value.
                </h3>

                <p className="mt-5 max-w-xl leading-8 text-blue-100">
                  CRM supports customer loyalty by improving
                  communication, understanding needs and
                  delivering consistent value that strengthens
                  long-term engagement and retention.
                </p>

              </div>

            </div>

          </div>

        </section>


        <section
          id="benefits"
          className="bg-slate-50 py-28 dark:bg-[#0b1526]"
        >

          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="grid items-center gap-16 lg:grid-cols-[0.8fr_1.2fr]">

              <div>

                <SectionLabel>
                  Benefits of a CRM
                </SectionLabel>

                <h2 className="font-[Manrope] text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">

                  Why implement

                  <span className="text-blue-600">
                    {" "}a CRM?
                  </span>

                </h2>

                <p className="mt-6 leading-8 text-slate-600 dark:text-slate-400">
                  CRM systems streamline processes, organize
                  customer information and improve communication.
                  This helps businesses manage relationships more
                  effectively.
                </p>


                <a
                  href="#getting-started"
                  className="group mt-8 inline-flex items-center gap-2 font-bold text-blue-600"
                >
                  Start transforming your workflow

                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />

                </a>

              </div>


              <div className="grid gap-4 sm:grid-cols-2">

                <BenefitCard
                  icon={Database}
                  title="Organized Information"
                  text="Keep important customer information in one structured system."
                />

                <BenefitCard
                  icon={Zap}
                  title="Better Efficiency"
                  text="Reduce scattered information and make everyday work easier."
                />

                <BenefitCard
                  icon={Handshake}
                  title="Stronger Relationships"
                  text="Improve communication and deliver consistent value."
                />

                <BenefitCard
                  icon={TrendingUp}
                  title="Business Growth"
                  text="Use customer insights to support long-term development."
                />

              </div>

            </div>

          </div>

        </section>



        <section className="bg-white py-28 dark:bg-[#07101f]">

          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">

            <div>

              <SectionLabel>
                Relationship Strategy
              </SectionLabel>

              <h2 className="font-[Manrope] text-5xl font-extrabold leading-[0.98] tracking-[-0.04em]">
                Long-term
                <br />
                relationships
                <br />
                matter.
              </h2>

              <p className="mt-6 leading-8 text-slate-600 dark:text-slate-400">
                Maintaining long-term relationships requires
                regular communication, trust building and
                consistent value delivery.
              </p>

            </div>


            <div className="relative grid min-h-[280px] grid-cols-2 gap-3 sm:min-h-[500px] sm:gap-5">

              <img
                src={imageD}
                alt="Office team collaborating"
                className="mt-6 h-[220px] w-full rounded-[60px_16px_60px_16px] object-cover shadow-xl transition duration-500 hover:-translate-y-3 sm:mt-12 sm:h-[350px] sm:rounded-[100px_20px_100px_20px]"
              />

              <img
                src={imageE}
                alt="Business people working together"
                className="h-[220px] w-full rounded-[16px_60px_16px_60px] object-cover shadow-xl transition duration-500 hover:-translate-y-3 sm:h-[350px] sm:rounded-[20px_100px_20px_100px]"
              />


              <div className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-8 border-white bg-blue-600 text-white shadow-xl dark:border-[#07101f]">
                <Handshake size={23} />
              </div>

            </div>

          </div>

        </section>



        <section className="bg-slate-50 py-28 dark:bg-[#0b1526]">

          <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 lg:grid-cols-2 lg:px-8">

            <div className="relative">

              <img
                src={imageF}
                alt="Business analytics dashboard"
                className="h-[300px] w-full rounded-[30px_100px_30px_100px] object-cover shadow-2xl sm:h-[380px] lg:h-[500px]"
              />


              <div className="absolute bottom-8 left-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-[#111c2d]">

                <TrendingUp
                  className="text-blue-600"
                  size={23}
                />

                <p className="mt-2 text-sm font-bold">
                  Data-driven decisions
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Understand customer behavior
                </p>

              </div>

            </div>


            <div>

              <SectionLabel>
                Customer Data Utilization
              </SectionLabel>

              <h2 className="font-[Manrope] text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">

                Turn information
                <span className="text-blue-600">
                  {" "}into insight.
                </span>

              </h2>

              <p className="mt-6 leading-8 text-slate-600 dark:text-slate-400">
                Customer data can help businesses understand
                behavior, preferences and needs. This creates
                opportunities for better decisions and more
                meaningful customer experiences.
              </p>


              <div className="mt-8 space-y-5">

                <DataPoint
                  icon={Database}
                  title="Organized customer data"
                  text="Keep information structured and accessible."
                />

                <DataPoint
                  icon={Lightbulb}
                  title="Better understanding"
                  text="Use customer information to understand needs."
                />

                <DataPoint
                  icon={TrendingUp}
                  title="Growth opportunities"
                  text="Turn insights into better business decisions."
                />

              </div>

            </div>

          </div>

        </section>


        <section className="overflow-hidden bg-[#08111f] py-28 text-white">

          <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                Personalization Strategy
              </p>

              <h2 className="mt-5 font-[Manrope] text-5xl font-extrabold leading-[0.98] tracking-[-0.04em] sm:text-6xl">
                Make every
                <br />
                interaction
                <br />
                <span className="text-blue-400">
                  meaningful.
                </span>
              </h2>

            </div>


            <div className="grid items-center gap-10 md:grid-cols-2">

              <div className="relative">

                <img
                  src={imageA}
                  alt="Customer support team"
                  className="h-[280px] w-full rounded-[100px_20px_100px_20px] object-cover shadow-2xl sm:h-[400px]"
                />

                <div className="absolute -bottom-5 -right-5 grid h-20 w-20 place-items-center rounded-2xl bg-blue-600 shadow-xl">
                  <MessageCircle size={30} />
                </div>

              </div>


              <div>

                <h3 className="text-2xl font-bold">
                  Tailoring experiences for customers
                </h3>

                <p className="mt-5 leading-8 text-slate-400">
                  Personalization uses data insights to customize
                  interactions, offers and communication,
                  enhancing customer experience and supporting
                  satisfaction and loyalty.
                </p>

                <div className="mt-7 flex items-center gap-3 text-sm font-bold text-blue-400">

                  <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-500/10">
                    <Sparkles size={17} />
                  </div>

                  Customer-centered experiences

                </div>

              </div>

            </div>

          </div>

        </section>


        <section className="relative bg-white py-28 dark:bg-[#07101f]">

          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="grid items-center gap-16 lg:grid-cols-2">

              <div>

                <SectionLabel>
                  Transform Your Business
                </SectionLabel>

                <h2 className="font-[Manrope] text-5xl font-extrabold leading-[1] tracking-[-0.04em] sm:text-6xl">

                  Stop managing
                  <br />

                  <span className="text-blue-600">
                    scattered
                  </span>

                  <br />

                  information.

                </h2>

                <p className="mt-7 max-w-xl leading-8 text-slate-600 dark:text-slate-400">
                  Bring customers, communication and useful
                  information into a structured system designed
                  around relationships and growth.
                </p>


                <div className="mt-8 grid gap-4 sm:grid-cols-2">

                  <TransformItem
                    icon={Workflow}
                    text="Organize your workflow"
                  />

                  <TransformItem
                    icon={Users}
                    text="Know your customers"
                  />

                  <TransformItem
                    icon={MessageCircle}
                    text="Improve communication"
                  />

                  <TransformItem
                    icon={TrendingUp}
                    text="Create growth opportunities"
                  />

                </div>

              </div>


              <div className="relative">

                <div className="absolute -inset-5 rounded-[80px] bg-blue-600/10 blur-2xl" />

                <img
                  src={imageG}
                  alt="Professionals collaborating in an office"
                  className="relative h-[300px] w-full rounded-[20px_100px_20px_100px] object-cover shadow-2xl sm:h-[380px] lg:h-[500px]"
                />

                <div className="absolute -bottom-6 -left-6 rounded-2xl bg-blue-600 p-6 text-white shadow-2xl">

                  <Zap size={22} />

                  <p className="mt-3 text-sm font-bold">
                    Work smarter
                  </p>

                  <p className="mt-1 text-xs text-blue-100">
                    Build better relationships
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>


        <section
          id="future"
          className="relative overflow-hidden bg-slate-950 py-28 text-white"
        >

          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-3xl" />


          <div className="relative mx-auto max-w-7xl px-5 lg:px-8">

            <div className="max-w-3xl">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                The Future of CRM
              </p>

              <h2 className="mt-5 font-[Manrope] text-5xl font-extrabold leading-none tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                CRM is becoming
                <span className="block text-blue-400">
                  smarter.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl leading-8 text-slate-400">
                The future of customer relationship management
                will continue to focus on better engagement,
                personalization, information and efficient
                customer management.
              </p>

            </div>


            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <FutureCard
                icon={Sparkles}
                title="AI & Insights"
                text="Smarter ways to understand customer information."
              />

              <FutureCard
                icon={Workflow}
                title="Automation"
                text="More efficient workflows and repetitive task management."
              />

              <FutureCard
                icon={MessageCircle}
                title="Connected Communication"
                text="Better customer interactions across channels."
              />

              <FutureCard
                icon={Target}
                title="Personalization"
                text="More relevant experiences based on customer needs."
              />

            </div>

          </div>

        </section>


        <section
          id="getting-started"
          className="bg-slate-50 py-28 dark:bg-[#0b1526]"
        >

          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="relative overflow-hidden rounded-[35px] bg-blue-600 px-7 py-20 text-center text-white shadow-2xl shadow-blue-600/20 sm:px-12">

              <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full border border-white/10" />

              <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full border border-white/10" />


              <div className="relative">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                  Getting Started
                </p>

                <h2 className="mx-auto mt-5 max-w-3xl font-[Manrope] text-5xl font-extrabold leading-none tracking-[-0.04em] sm:text-6xl">
                  Ready to build
                  <br />
                  better customer relationships?
                </h2>

                <p className="mx-auto mt-6 max-w-2xl leading-8 text-blue-100">
                  Organize your customers, understand your
                  relationships and create a better way to manage
                  your business.
                </p>


                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

                  <a
                    href="/login"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-blue-600 transition hover:-translate-y-1 hover:bg-slate-50"
                  >
                    Login

                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />

                  </a>


                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Contact
                    <MessageCircle size={17} />

                  </a>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

      <footer className="border-t border-slate-200 bg-white dark:border-white/10 dark:bg-[#07101f]">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-3 sm:flex-row sm:items-center lg:px-8">

          <div className="
              flex h-20
             items-center
             border-b
               border-slate-200
               px-6
               dark:border-slate-800
             ">
            <div className="
          flex items-center gap-3
        ">
              <div className="
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            bg-indigo-600
            font-bold text-white
          ">
                <Handshake size={20} />
              </div>

              <div>
                <h1 className="
              font-bold
            ">
                  <a href="#home">LeadNova</a>

                </h1>

                <p className="
              text-xs
              text-slate-500
              dark:text-slate-400
            ">
                  Client CRM
                </p>
              </div>
            </div>

          </div>


          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} LeadNova, All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}


/* ============================================================
   COMPONENTS
============================================================ */

function SectionLabel({ children }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
      {children}
    </div>
  );
}


function MiniStat({ number, text }) {
  return (
    <div className="flex items-center gap-3">

      <span className="font-[Manrope] text-xl font-extrabold text-blue-600">
        {number}
      </span>

      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        {text}
      </span>

    </div>
  );
}


function CheckItem({ text }) {
  return (
    <div className="flex items-center gap-3">

      <div className="grid h-7 w-7 place-items-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
        <Check size={14} />
      </div>

      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {text}
      </span>

    </div>
  );
}


function FeatureCard({
  number,
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 transition duration-500 hover:-translate-y-2 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-900/10 dark:border-white/10 dark:bg-[#0d192b] dark:hover:border-blue-500/40">

      <span className="absolute right-5 top-5 text-xs font-bold text-slate-300 dark:text-slate-700">
        {number}
      </span>


      <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-500/10 dark:text-blue-400 dark:group-hover:bg-blue-600 dark:group-hover:text-white">
        <Icon size={21} />
      </div>


      <h3 className="mt-7 font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
        {text}
      </p>


      <ArrowRight
        size={16}
        className="mt-6 text-blue-600 transition group-hover:translate-x-2"
      />

    </div>
  );
}


function BenefitCard({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-7 transition duration-500 hover:-translate-y-2 hover:shadow-xl dark:border-white/10 dark:bg-[#111c2d]">

      <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
        <Icon size={21} />
      </div>

      <h3 className="mt-6 font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
        {text}
      </p>

    </div>
  );
}


function DataPoint({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="flex gap-4">

      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
        <Icon size={19} />
      </div>

      <div>

        <h3 className="text-sm font-bold">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {text}
        </p>

      </div>

    </div>
  );
}


function TransformItem({
  icon: Icon,
  text,
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
        <Icon size={17} />
      </div>

      <span className="text-sm font-semibold">
        {text}
      </span>

    </div>
  );
}


function FutureCard({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="group min-h-[220px] rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-500 hover:-translate-y-2 hover:border-blue-500/40 hover:bg-blue-500/[0.08]">

      <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-500/10 text-blue-400">
        <Icon size={20} />
      </div>

      <h3 className="mt-7 font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-400">
        {text}
      </p>

    </div>
  );
}


export default Home;