import { Button } from "@/components/ui/button";
import { useGetAllToursQuery } from "@/redux/features/Tour/tour.api";
import { Link, useSearchParams } from "react-router";
import TourFilters from "@/components/modules/Tours/TourFilters";
import { useMemo } from "react";

export default function Tours() {
  const [searchParams] = useSearchParams();

  // Memoize filters to prevent unnecessary re-renders
  const filters = useMemo(
    () => ({
      division: searchParams.get("division") || undefined,
      tourType: searchParams.get("tourType") || undefined,
    }),
    [searchParams]
  );

  const { data, isLoading, isError } = useGetAllToursQuery(filters, {
    refetchOnMountOrArgChange: true, // re-run query when filters change
  });

  const tours = data || [];

  if (isLoading)
    return <p className="text-center py-20 text-muted-foreground">Loading tours...</p>;
  if (isError)
    return (
      <p className="text-center py-20 text-red-500">
        Failed to load tours. Please try again.
      </p>
    );

  return (
    <div className="container mx-auto px-5 py-8 grid grid-cols-12 gap-5">
      <TourFilters />
      <div className="col-span-9 w-full">
        {tours.length === 0 ? (
          <p className="text-center text-muted-foreground">No tours found.</p>
        ) : (
          tours.map((item) => (
            <div
              key={item._id || item.slug}
              className="border border-muted rounded-lg shadow-md overflow-hidden mb-6 flex"
            >
              <div className="w-2/5 flex-shrink-0">
                <img
                  src={item.images?.[0] || "/placeholder.jpg"}
                  alt={item.title || "Tour Image"}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6 flex-1">
                <h3 className="text-xl font-semibold mb-2">{item.title || "Untitled Tour"}</h3>
                <p className="text-muted-foreground mb-3">
                  {item.description || "No description available."}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-primary">
                    From ৳{item.costFrom?.toLocaleString() || "N/A"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Max {item.maxGuest || "N/A"} guests
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-medium">From:</span> {item.departureLocation || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">To:</span> {item.arrivalLocation || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span> {item.tourPlan?.length || 0}{" "}
                    days
                  </div>
                  <div>
                    <span className="font-medium">Min Age:</span> {item.minAge || 0}+
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(item.amenities || []).slice(0, 3).map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-muted/50 text-primary text-xs rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                  {item.amenities && item.amenities.length > 3 && (
                    <span className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-full">
                      +{item.amenities.length - 3} more
                    </span>
                  )}
                </div>

                <Button asChild className="w-full">
                  <Link to={`/tours/${item._id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
