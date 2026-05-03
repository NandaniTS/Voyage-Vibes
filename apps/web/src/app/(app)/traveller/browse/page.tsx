"use client";

import { Card, CardBody, Input } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { packageApiWithSession } from "../../../../services/packages";
import TripCard from "./TripCard";
import Pagination from "../../../../components/ui/Pagination";

export default function BrowseTripsPage() {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const getAllPackagesQuery = useQuery({
    queryKey: ["get-all-tour-packages", currentPage],
    queryFn: async () => {
      return (
        await packageApiWithSession.get({
          query: {
            filters:{
              isActive:true
            },
            page: currentPage,
            limit: itemsPerPage,
          },
        })
      ).data;
    },
  })

  const packages = getAllPackagesQuery?.data?.data?.filter((item)=>item.isActive === true) || [];
  const totalItems = getAllPackagesQuery?.data?.totalItems || 0; 

  return (
    <div className="space-y-6 p-4 overflow-y-scroll h-full">
      {/* <div> */}
        {/* <h1 className="text-3xl font-serif font-bold text-(--foreground) mb-2">
          Browse Trip Packages
        </h1> */}
        <p className="text-(--muted-foreground)">
          Discover amazing destinations and book your next adventure
        </p>
      {/* </div> */}

      {/* Search */}
      {/* <div className="flex border border-(--border) rounded-lg">
        <Input
          placeholder="Search destinations or trips..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          classNames={{
            base: "flex-1",
            inputWrapper:
              "h-9 bg-transparent shadow-none border-none focus-within:ring-0 focus-within:outline-none",
            input:
              "h-9 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
          }}
        />
      </div> */}

      {/* Trips Grid */}
      {getAllPackagesQuery?.isPending ? (
        <div className="text-center py-12">
          <p className="text-(--muted-foreground)">Loading packages...</p>
        </div>
      ) : packages && packages?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {packages?.map((trip,index) => (
            <TripCard key={index} trip={trip} />
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-(--muted-foreground) text-lg">
              No trips found matching your search.
            </p>
          </CardBody>
        </Card>
      )}

      {/* Pagination */}
      {packages && packages.length > 0 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
