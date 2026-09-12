function Skeleton({
  className = "",
}) {
  return (
    <div
      className={`
        animate-pulse
        rounded-lg
        bg-gray-200
        dark:bg-gray-800
        ${className}
      `}
    />
  );
}


function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Top Navbar */}
      <header
        className="
          h-16
          border-b
          border-gray-200
          bg-white
          dark:border-gray-800
          dark:bg-gray-900
        "
      >
        <div className="flex h-full items-center justify-between px-6">

          <Skeleton className="h-8 w-32" />

          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-24" />
          </div>

        </div>
      </header>


      <div className="flex">

        {/* Sidebar */}
        <aside
          className="
            hidden
            w-64
            min-h-[calc(100vh-4rem)]
            border-r
            border-gray-200
            bg-white
            p-5
            dark:border-gray-800
            dark:bg-gray-900
            md:block
          "
        >

          <Skeleton className="mb-8 h-10 w-full" />

          <div className="space-y-4">

            <Skeleton className="h-10 w-full" />

            <Skeleton className="h-10 w-full" />

            <Skeleton className="h-10 w-full" />

            <Skeleton className="h-10 w-full" />

          </div>

        </aside>


        {/* Main Content */}
        <main className="flex-1 p-5 md:p-8">

          {/* Heading */}
          <div className="mb-8">

            <Skeleton className="h-9 w-64" />

            <Skeleton className="mt-3 h-4 w-96 max-w-full" />

          </div>


          {/* Welcome Card */}
          <div
            className="
              mb-6
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-6
              dark:border-gray-800
              dark:bg-gray-900
            "
          >

            <Skeleton className="h-4 w-32" />

            <Skeleton className="mt-4 h-8 w-72 max-w-full" />

            <Skeleton className="mt-3 h-4 w-full max-w-xl" />

            <Skeleton className="mt-2 h-4 w-3/4 max-w-lg" />

          </div>


          {/* Cards */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            <Skeleton
              className="h-32 w-full rounded-2xl"
            />

            <Skeleton
              className="h-32 w-full rounded-2xl"
            />

            <Skeleton
              className="h-32 w-full rounded-2xl"
            />

          </div>


          {/* Information Section */}
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-6
              dark:border-gray-800
              dark:bg-gray-900
            "
          >

            <Skeleton className="h-6 w-48" />

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              <div>
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-3 h-5 w-52" />
              </div>

              <div>
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-3 h-5 w-64" />
              </div>

              <div>
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-3 h-5 w-48" />
              </div>

              <div>
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-3 h-5 w-56" />
              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default PageSkeleton;