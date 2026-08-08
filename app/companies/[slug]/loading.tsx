export default function CompanyDetailLoading() {
  return (
    <main>
      <div className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm h-[80px] border-b border-gray-100" />

      <section className="w-full bg-gray-50 py-24 px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="h-4 w-40 bg-gray-300 rounded mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6">
              <div className="h-3 w-24 bg-gray-300 rounded animate-pulse" />
              <div className="h-12 w-64 bg-gray-300 rounded animate-pulse" />
              <div className="h-12 w-48 bg-gray-300 rounded animate-pulse" />
              <div className="h-6 w-full bg-gray-300 rounded animate-pulse" />
              <div className="h-14 w-48 bg-gray-300 rounded animate-pulse" />
            </div>
            <div className="w-full aspect-square bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-24 px-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="flex flex-col gap-4">
            <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="w-12 h-px bg-gray-200 my-2" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-full aspect-video bg-gray-200 rounded animate-pulse" />
        </div>
      </section>
    </main>
  );
}
