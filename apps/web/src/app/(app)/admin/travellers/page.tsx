"use client";

import { Card, CardBody } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { FaUsers } from "react-icons/fa";
import { adminApiWithSession } from "../../../../services/admin";
import UserTable from "../_components/UserTable";

export default function AdminTravellersPage() {
  const travellersQuery = useQuery({
    queryKey: ["admin-travellers"],
    queryFn: async () => (await adminApiWithSession.getUsers("traveller")).data,
  });

  const travellers = travellersQuery.data?.data ?? [];
  const travellerTotal: number = travellersQuery.data?.totalItems ?? 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-(--primary)/10 flex items-center justify-center">
          <FaUsers className="w-5 h-5 text-(--primary)" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-(--foreground)">Travellers</h1>
          <p className="text-(--muted-foreground) text-sm">
            {travellersQuery.isPending ? "Loading..." : `${travellerTotal} registered travellers`}
          </p>
        </div>
      </div>

      <Card className="border border-(--border)">
        <CardBody className="p-0">
          <UserTable
            users={travellers}
            loading={travellersQuery.isPending}
            queryKey="admin-travellers"
          />
        </CardBody>
      </Card>
    </div>
  );
}
