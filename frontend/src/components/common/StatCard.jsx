function StatCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="
      rounded-2xl
      border
      border-slate-200
      bg-white p-5
      transition
      hover:-translate-y-0.5
      hover:shadow-lg
      hover:shadow-slate-200/50
      dark:border-slate-800
      dark:bg-slate-900
      dark:hover:shadow-black/20
    ">

      <div className="
        flex items-start
        justify-between
      ">
        <div>
          <p className="
            text-sm
            text-slate-500
            dark:text-slate-400
          ">
            {title}
          </p>

          <p className="
            mt-2
            text-3xl font-bold
          ">
            {value}
          </p>
        </div>

        <div className="
          flex h-11 w-11
          items-center justify-center
          rounded-xl
          bg-indigo-50
          text-indigo-600
          dark:bg-indigo-500/10
          dark:text-indigo-400
        ">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export default StatCard;