"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetDivisionsQuery } from "@/redux/features/division/division.api";
import { useGetTourTypesQuery } from "@/redux/features/Tour/tour.api";
import { useSearchParams } from "react-router";

// ✅ Define proper types for your select options
interface Option {
  label: string;
  value: string;
}

interface Division {
  _id: string;
  name: string;
}

interface TourType {
  _id: string;
  name: string;
}

export default function TourFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedDivision = searchParams.get("division") || "";
  const selectedTourType = searchParams.get("tourType") || "";

  const { data: divisionData, isLoading: divisionIsLoading } = useGetDivisionsQuery({});
  const { data: tourTypeData, isLoading: tourTypeIsLoading } = useGetTourTypesQuery({
    limit: 1000,
    fields: "_id,name",
  });

  // ✅ Add explicit types to prevent "any" warnings
  const divisionOptions: Option[] =
    (divisionData as Division[] | undefined)?.map((d) => ({
      label: d.name,
      value: d._id,
    })) || [];

  const tourTypeOptions: Option[] =
    (tourTypeData?.data as TourType[] | undefined)?.map((t) => ({
      label: t.name,
      value: t._id,
    })) || [];

  const handleDivisionChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set("division", value);
    else params.delete("division");
    setSearchParams(params);
  };

  const handleTourTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set("tourType", value);
    else params.delete("tourType");
    setSearchParams(params);
  };

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("division");
    params.delete("tourType");
    setSearchParams(params);
  };

  return (
    <div className="col-span-3 w-full h-[500px] border border-muted rounded-md p-5 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold">Filters</h1>
        <Button size="sm" variant="outline" onClick={handleClearFilter}>
          Clear Filter
        </Button>
      </div>

      {/* Division Select */}
      <div>
        <Label className="mb-2">Division to visit</Label>
        <Select
          value={selectedDivision}
          onValueChange={handleDivisionChange}
          disabled={divisionIsLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Division" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Divisions</SelectLabel>
              {divisionOptions.map((item: Option) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Tour Type Select */}
      <div>
        <Label className="mb-2">Tour Type</Label>
        <Select
          value={selectedTourType}
          onValueChange={handleTourTypeChange}
          disabled={tourTypeIsLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Tour Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tour Types</SelectLabel>
              {tourTypeOptions.map((item: Option) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
