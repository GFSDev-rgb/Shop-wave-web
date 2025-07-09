import { Skeleton } from "@/components/ui/skeleton";

export default function ProductPageSkeleton() {
    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                {/* Main Content Skeleton */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                    <Skeleton className="w-full aspect-[4/5] rounded-lg" />
                    <div className="space-y-6">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-10 w-1/3" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
                {/* Related Products Skeleton */}
                <div className="lg:col-span-1">
                    <h2 className="font-headline text-2xl xl:text-3xl font-bold mb-6 xl:mb-8">
                        <Skeleton className="h-8 w-48" />
                    </h2>
                     {/* Desktop Skeleton */}
                    <div className="hidden lg:flex flex-col space-y-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex gap-4 items-center">
                                <Skeleton className="h-24 w-24 rounded-md flex-shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-5 w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                     {/* Mobile/Tablet Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:hidden">
                         {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex flex-col space-y-3">
                                <Skeleton className="h-[400px] w-full rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
