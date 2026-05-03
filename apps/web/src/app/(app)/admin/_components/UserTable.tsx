"use client";

import { Button, Chip } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BiUser } from "react-icons/bi";
import { adminApiWithSession } from "../../../../services/admin";

type User = {
  _id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  isSuspended?: boolean;
  createdAt?: string | Date;
};

export default function UserTable({
  users,
  loading,
  queryKey,
}: {
  users: User[];
  loading: boolean;
  queryKey: string;
}) {
  const queryClient = useQueryClient();
// console.log("users",users)
  const suspendMutation = useMutation({
    mutationFn: async ({ id, isSuspended }: { id: string; isSuspended: boolean }) =>
      (await adminApiWithSession.suspendUser(id, isSuspended)).data,
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(vars.isSuspended ? "Account suspended" : "Account reinstated");
    },
    onError: () => toast.error("Failed to update account status"),
  });

  if (loading) {
    return (
      <div className="py-12 text-center text-(--muted-foreground) text-sm">Loading...</div>
    );
  }

  if (!users.length) {
    return (
      <div className="py-12 text-center text-(--muted-foreground) text-sm">No users found.</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-(--border) bg-(--muted)/30">
            <th className="text-left py-3 px-4 font-medium text-(--muted-foreground)">Name</th>
            <th className="text-left py-3 px-4 font-medium text-(--muted-foreground)">Email</th>
            <th className="text-left py-3 px-4 font-medium text-(--muted-foreground)">Phone</th>
            <th className="text-left py-3 px-4 font-medium text-(--muted-foreground)">Joined</th>
            <th className="text-left py-3 px-4 font-medium text-(--muted-foreground)">Status</th>
            <th className="text-left py-3 px-4 font-medium text-(--muted-foreground)">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const isPending =
              suspendMutation.isPending &&
              (suspendMutation.variables as any)?.id === u._id;

            return (
              <tr
                key={u._id ?? Math.random()}
                className="border-b border-(--border) hover:bg-(--muted)/20 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-(--primary)/10 flex items-center justify-center flex-shrink-0">
                      <BiUser className="w-4 h-4 text-(--primary)" />
                    </div>
                    <span className="font-medium text-(--foreground)">{u.fullName ?? "—"}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-(--muted-foreground)">{u.email ?? "—"}</td>
                <td className="py-3 px-4 text-(--muted-foreground)">{u.phoneNumber ?? "—"}</td>
                <td className="py-3 px-4 text-(--muted-foreground)">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="py-3 px-4">
                  <Chip
                    size="sm"
                    className={`rounded-md text-xs font-medium ${
                      u.isSuspended
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {u.isSuspended ? "Suspended" : "Active"}
                  </Chip>
                </td>
                <td className="py-3 px-4">
                  <Button
                    size="sm"
                    disabled={isPending || !u._id}
                    onPress={() =>
                      u._id && suspendMutation.mutate({ id: u._id, isSuspended: !u.isSuspended })
                    }
                    className={`rounded-lg text-xs px-3 h-7 ${
                      u.isSuspended
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {isPending ? "..." : u.isSuspended ? "Reinstate" : "Suspend"}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
