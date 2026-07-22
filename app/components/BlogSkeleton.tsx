export default function BlogSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-4 animate-pulse">
                    <div className="w-full aspect-video bg-gray-200"/>
                    <div className="flex gap-3">
                        <div className="h-3 w-16 bg-gray-200 rounded" />
                        <div className="h-3 w-24 bg-gray-200 rounded" />
                    </div>
                    <div className="h-5 w-3/4 bg-gray-200 rounded" />
                    <div className="h-5 w-1/2 bg-gray-200 rounded" />
                    <div className="space-y-2">
                        <div className="h-3 w-full bg-gray-200 rounded" />
                        <div className="h-3 w-full bg-gray-200 rounded" />
                        <div className="h-3 w-2/3 bg-gray-200 rounded" />
                    </div>
                    <div className="h-3 w-32 bg-gray-200 rounded" />
                </div>
            ))}
        </div>
    );
}