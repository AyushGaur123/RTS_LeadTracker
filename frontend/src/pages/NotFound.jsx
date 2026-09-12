function NotFound() {
  return (
    <div className="
      flex min-h-[60vh]
      items-center
      justify-center
    ">
      <div className="text-center">
        <h1 className="
          text-6xl font-bold
        ">
          404
        </h1>

        <p className="
          mt-3
          text-slate-500
          dark:text-slate-400
        ">
          Page not found.
        </p>
      </div>
    </div>
  );
}

export default NotFound;