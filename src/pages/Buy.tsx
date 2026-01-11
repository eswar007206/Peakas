import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyFilters, FilterState } from "@/components/PropertyFilters";
import { usePaginatedProperties, Property } from "@/hooks/useProperties";
import { trackPageView } from "@/hooks/useAnalytics";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

// Property card skeleton for loading states
const PropertyCardSkeleton = () => (
  <div className="bg-card rounded-xl overflow-hidden border border-border">
    <Skeleton className="aspect-[4/3] w-full" />
    <div className="p-4 space-y-3">
      <div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div>
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-6 w-20 mt-1" />
        </div>
        <div className="text-right">
          <Skeleton className="h-3 w-12 ml-auto" />
          <Skeleton className="h-4 w-24 mt-1" />
        </div>
      </div>
    </div>
  </div>
);

const Buy = () => {
  const [searchParams] = useSearchParams();
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = usePaginatedProperties();
  
  // Flatten all pages into single array
  const allProperties = useMemo(() => {
    return data?.pages.flatMap(page => page.properties) ?? [];
  }, [data]);

  const totalCount = data?.pages[0]?.totalCount ?? 0;
  
  // Initialize filters from URL params
  const getInitialFilters = (): FilterState => {
    const cityParam = searchParams.get("city") || "";
    const bhkParam = searchParams.get("bhk");
    const bhkArray: string[] = [];
    
    if (bhkParam) {
      if (bhkParam === "4") {
        bhkArray.push("4+ LDK");
      } else {
        bhkArray.push(`${bhkParam} LDK`);
      }
    }
    
    return {
      bhk: bhkArray,
      priceRange: [0, 600000000], // ¥0 to ¥6億
      city: cityParam,
      locality: "",
      sortBy: "newest",
    };
  };

  const [filters, setFilters] = useState<FilterState>(getInitialFilters);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Update filters when URL params change
  useEffect(() => {
    setFilters(getInitialFilters());
  }, [searchParams]);

  useEffect(() => {
    trackPageView("buy");
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredProperties = useMemo(() => {
    let result = [...allProperties];

    // Filter by LDK (Japanese term for rooms)
    if (filters.bhk.length > 0) {
      result = result.filter((p) => {
        const ldkString = `${p.bhk} LDK`;
        const fourPlusMatch = filters.bhk.includes("4+ LDK") && p.bhk >= 4;
        return filters.bhk.includes(ldkString) || fourPlusMatch;
      });
    }

    // Filter by price range (prices are in Japanese Yen)
    result = result.filter((p) => {
      return p.start_price >= filters.priceRange[0] && p.start_price <= filters.priceRange[1];
    });

    // Filter by city
    if (filters.city) {
      result = result.filter((p) => p.city === filters.city);
    }

    // Filter by locality
    if (filters.locality) {
      result = result.filter((p) => p.location === filters.locality);
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "price_low":
        result.sort((a, b) => a.start_price - b.start_price);
        break;
      case "price_high":
        result.sort((a, b) => b.start_price - a.start_price);
        break;
    }

    return result;
  }, [allProperties, filters]);

  const activeFilterCount = 
    filters.bhk.length + 
    (filters.city ? 1 : 0) + 
    (filters.locality ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 600000000 ? 1 : 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
          <div className="flex gap-6">
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <Skeleton className="h-96 w-full rounded-lg" />
            </aside>
            <main className="flex-1">
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-destructive">物件の読み込みに失敗しました。もう一度お試しください。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              物件一覧
            </h1>
            <p className="text-muted-foreground mt-1">
              {totalCount}件中 {filteredProperties.length}件を表示
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden relative">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                絞り込み
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>絞り込みオプション</SheetTitle>
              </SheetHeader>
              <div className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
                <PropertyFilters filters={filters} onFiltersChange={setFilters} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-6 h-[calc(100vh-180px)]">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0 overflow-y-auto overscroll-contain">
            <div className="sticky top-0">
              <PropertyFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </aside>

          {/* Property Grid - independently scrollable */}
          <main className="flex-1 overflow-y-auto overscroll-contain pr-2">
            {/* Active Filters Pills */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.bhk.map((bhk) => (
                  <span
                    key={bhk}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                  >
                    {bhk}
                    <button
                      onClick={() =>
                        setFilters({
                          ...filters,
                          bhk: filters.bhk.filter((b) => b !== bhk),
                        })
                      }
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.city && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    {filters.city}
                    <button
                      onClick={() =>
                        setFilters({ ...filters, city: "", locality: "" })
                      }
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.locality && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    {filters.locality}
                    <button
                      onClick={() => setFilters({ ...filters, locality: "" })}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {filteredProperties.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                  
                  {/* Skeleton loaders while fetching next page */}
                  {isFetchingNextPage && 
                    Array.from({ length: 3 }).map((_, i) => (
                      <PropertyCardSkeleton key={`skeleton-${i}`} />
                    ))
                  }
                </div>

                {/* Load More Section */}
                <div 
                  ref={loadMoreRef} 
                  className="mt-8 flex flex-col items-center gap-4"
                >
                  {hasNextPage && !isFetchingNextPage && (
                    <Button 
                      onClick={() => fetchNextPage()}
                      variant="outline"
                      size="lg"
                      className="min-w-[200px]"
                    >
                      さらに物件を読み込む
                    </Button>
                  )}
                  
                  {isFetchingNextPage && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>物件を読み込み中...</span>
                    </div>
                  )}

                  {!hasNextPage && allProperties.length > 0 && (
                    <p className="text-muted-foreground text-sm">
                      全{totalCount}件の物件を表示しました
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  物件が見つかりませんでした
                </h3>
                <p className="text-muted-foreground">
                  検索条件を変更してお試しください
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Buy;
