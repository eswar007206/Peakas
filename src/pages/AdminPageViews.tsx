import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { usePageViewsAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Loader2, Eye, BarChart3 } from "lucide-react";
import { formatDate } from "@/lib/formatPrice";

const AdminPageViews = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { data: viewsData, isLoading } = usePageViewsAnalytics();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const totalViews = viewsData?.reduce((sum, item) => sum + item.view_count, 0) ?? 0;

  // Get page display name
  const getPageDisplayName = (page: string) => {
    const names: Record<string, string> = {
      home: "Home Page",
      buy: "Buy Properties",
      sell: "Sell Property",
      admin: "Admin Dashboard",
      property_detail: "Property Details",
    };
    return names[page] || page.charAt(0).toUpperCase() + page.slice(1);
  };

  // Get page icon color
  const getPageColor = (page: string) => {
    const colors: Record<string, string> = {
      home: "bg-blue-500",
      buy: "bg-green-500",
      sell: "bg-orange-500",
      admin: "bg-purple-500",
      property_detail: "bg-pink-500",
    };
    return colors[page] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button & Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Page Views Analytics
            </h1>
            <p className="text-muted-foreground">
              Track which pages are getting the most traffic
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Eye className="w-4 h-4" /> Total Page Views
            </p>
            <p className="text-2xl font-bold text-foreground">{totalViews}</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <BarChart3 className="w-4 h-4" /> Pages Tracked
            </p>
            <p className="text-2xl font-bold text-foreground">{viewsData?.length ?? 0}</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Most Viewed Page</p>
            <p className="text-lg font-bold text-foreground truncate">
              {viewsData?.[0]?.page ? getPageDisplayName(viewsData[0].page) : "-"}
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Avg Views/Page</p>
            <p className="text-2xl font-bold text-foreground">
              {viewsData?.length ? (totalViews / viewsData.length).toFixed(0) : 0}
            </p>
          </div>
        </div>

        {/* Page Views Table */}
        <div className="bg-card rounded-lg shadow-card overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-foreground">Page Views by Page</h2>
            <p className="text-sm text-muted-foreground">Sorted by most viewed</p>
          </div>
          
          {viewsData && viewsData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Page</TableHead>
                    <TableHead className="text-center">Views</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viewsData.map((item, index) => (
                    <TableRow key={item.page}>
                      <TableCell className="font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getPageColor(item.page)}`} />
                          <div>
                            <p className="font-medium text-foreground">
                              {getPageDisplayName(item.page)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              /{item.page === "home" ? "" : item.page}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary font-semibold rounded-full">
                            <Eye className="w-4 h-4" />
                            {item.view_count}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(item.view_count / totalViews) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">
                            {((item.view_count / totalViews) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No page views yet</h3>
              <p className="text-muted-foreground">
                Page views will appear here once users start browsing the site
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPageViews;
