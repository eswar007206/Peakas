import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { usePropertyClicksAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Loader2, MousePointerClick, TrendingUp, ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

const AdminPropertyClicks = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { data: clicksData, isLoading } = usePropertyClicksAnalytics();

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

  const totalClicks = clicksData?.reduce((sum, item) => sum + item.click_count, 0) ?? 0;

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
              Property Clicks Analytics
            </h1>
            <p className="text-muted-foreground">
              See which properties are getting the most engagement
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MousePointerClick className="w-4 h-4" /> Total Clicks
            </p>
            <p className="text-2xl font-bold text-foreground">{totalClicks}</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Properties Clicked
            </p>
            <p className="text-2xl font-bold text-foreground">{clicksData?.length ?? 0}</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Top Property Clicks</p>
            <p className="text-2xl font-bold text-foreground">
              {clicksData?.[0]?.click_count ?? 0}
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Avg Clicks/Property</p>
            <p className="text-2xl font-bold text-foreground">
              {clicksData?.length ? (totalClicks / clicksData.length).toFixed(1) : 0}
            </p>
          </div>
        </div>

        {/* Clicks Table */}
        <div className="bg-card rounded-lg shadow-card overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-foreground">Properties by Click Count</h2>
            <p className="text-sm text-muted-foreground">Sorted by most clicked</p>
          </div>
          
          {clicksData && clicksData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead className="w-[350px]">Property</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Clicks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clicksData.map((item, index) => (
                    <TableRow key={item.property_id}>
                      <TableCell className="font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={item.property?.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"}
                            alt=""
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-foreground line-clamp-1">
                              {item.property?.title || "Unknown Property"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.property?.bhk} BHK • {item.property?.property_type}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.property?.location}, {item.property?.city}
                      </TableCell>
                      <TableCell className="font-medium text-price">
                        {item.property?.start_price ? formatPrice(item.property.start_price) : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.property?.status === "published" ? "default" : "secondary"}
                        >
                          {item.property?.status || "unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary font-semibold rounded-full">
                            <MousePointerClick className="w-4 h-4" />
                            {item.click_count}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/property/${item.property_id}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <MousePointerClick className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No clicks yet</h3>
              <p className="text-muted-foreground">
                Property clicks will appear here once users start browsing
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPropertyClicks;
