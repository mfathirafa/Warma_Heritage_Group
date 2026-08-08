export default function BlogDetailLoading() {
  return (
    <main>
      <div className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm h-[80px] border-b border-gray-100" />

      <section className="w-full bg-white pt-[80px]">
        <div className="max-w-[800px] mx-auto px-8 pt-12 pb-8">
          <div className="h-4 w-20 bg-gray-200 rounded mb-10 animate-pulse" />

          <div className="flex gap-3 mb-6">
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <div className="h-9 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-9 w-3/4 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="pl-4 border-l-2 border-gray-200 mb-8">
            <div className="h-5 w-full bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
            <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex flex-col gap-1">
              <div className="h-3 w-36 bg-gray-200 rounded animate-pulse" />
              <div className="h-2 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-gray-200 animate-pulse" />

      <section className="w-full bg-white py-12 px-8">
        <div className="max-w-[800px] mx-auto flex flex-col gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
