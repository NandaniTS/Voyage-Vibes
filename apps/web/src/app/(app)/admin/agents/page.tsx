"use client";

import { Card, CardBody } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { BiBuilding } from "react-icons/bi";
import { adminApiWithSession } from "../../../../services/admin";
import UserTable from "../_components/UserTable";
import { TUser } from "@repo/definitions";

export default function AdminAgentsPage() {
  const agentsQuery = useQuery({
    queryKey: ["admin-agents"],
    queryFn: async () => (await adminApiWithSession.getUsers("agent")).data,
  });

  const agents = agentsQuery.data?.data ?? [];
  const agentTotal: number = agentsQuery.data?.totalItems ?? 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-(--primary)/10 flex items-center justify-center">
          <BiBuilding className="w-5 h-5 text-(--primary)" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-(--foreground)">Agents</h1>
          <p className="text-(--muted-foreground) text-sm">
            {agentsQuery.isPending ? "Loading..." : `${agentTotal} registered agents`}
          </p>
        </div>
      </div>

      <Card className="border border-(--border) rounded-lg">
        <CardBody className="p-0">
          <UserTable
            users={agents as TUser[]}
            loading={agentsQuery.isPending}
            queryKey="admin-agents"
          />
        </CardBody>
      </Card>
    </div>
  );
}
