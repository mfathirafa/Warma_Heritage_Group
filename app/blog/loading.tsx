export default function BlogLoading() {
  return (
    <main>
      <div className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm h-[80px] border-b border-gray-100" />

      <section className="w-full bg-white pt-[80px]">
        <div className="max-w-[1440px] mx-auto px-8 pt-20 pb-16 border-b border-gray-100">
          <div className="h-3 w-32 bg-gray-200 rounded mb-5 animate-pulse" />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="flex flex-col gap-3">
              <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-4 w-72 bg-gray-200 rounded animate-pulse md:ml-auto" />
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-16 px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex gap-2 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-4 animate-pulse">
                <div className="w-full aspect-[4/3] bg-gray-200" />
                <div className="flex gap-3">
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
                <div className="h-5 w-3/4 bg-gray-200 rounded" />
                <div className="h-5 w-1/2 bg-gray-200 rounded" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-200 rounded" />
                  <div className="h-3 w-full bg-gray-200 rounded" />
                </div>
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
