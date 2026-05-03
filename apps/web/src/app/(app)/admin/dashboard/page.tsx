"use client";

import { Button, Card, CardBody, Input } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BiBuilding, BiCreditCard } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { RiLoader2Fill } from "react-icons/ri";
import { adminApiWithSession } from "../../../../services/admin";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

type BankDetailsForm = {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
};

export default function AdminDashboardPage() {

  const queryClient = useQueryClient();

  const agentsQuery = useQuery({
    queryKey: ["admin-agents"],
    queryFn: async () => (await adminApiWithSession.getUsers("agent")).data,
  });

  const travellersQuery = useQuery({
    queryKey: ["admin-travellers"],
    queryFn: async () => (await adminApiWithSession.getUsers("traveller")).data,
  });

  const adminQuery = useQuery({
    queryKey: ["admin-me"],
    queryFn: async () => (await adminApiWithSession.getMe()).data,
  });

  const bankDetails = adminQuery.data?.bankDetails;

  const { register, handleSubmit, formState: { errors } } = useForm<BankDetailsForm>({
    values: {
      accountHolderName: bankDetails?.accountHolderName ?? "",
      accountNumber: bankDetails?.accountNumber ?? "",
      bankName: bankDetails?.bankName ?? "",
      ifscCode: bankDetails?.ifscCode ?? "",
    },
  });

  const bankDetailsMutation = useMutation({
    mutationFn: async (data: BankDetailsForm) =>
      (await adminApiWithSession.updateBankDetails(data)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-me"] });
      toast.success("Bank details saved");
    },
    onError: () => toast.error("Failed to save bank details"),
  });


  const agentTotal: number = agentsQuery.data?.totalItems ?? 0;
  const travellerTotal: number = travellersQuery.data?.totalItems ?? 0;


  return (
    <div className="p-4 space-y-6">
      
      <div>
        <h1 className="text-2xl font-serif font-bold text-(--foreground)">Admin Dashboard</h1>
        <p className="text-(--muted-foreground) text-sm mt-1">Overview and commission settings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/agents">
          <Card className="border border-(--border) hover:shadow-md transition-shadow cursor-pointer">
            <CardBody className="flex flex-row items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-(--primary)/10 flex items-center justify-center">
                  <BiBuilding className="w-5 h-5 text-(--primary)" />
                </div>
                <div>
                  <p className="text-(--muted-foreground) text-sm">Total Agents</p>
                  <p className="text-2xl font-bold text-(--foreground)">
                    {agentsQuery.isPending ? "..." : agentTotal}
                  </p>
                </div>
              </div>
              <BsArrowRight className="w-4 h-4 text-(--muted-foreground)" />
            </CardBody>
          </Card>
        </Link>

        <Link href="/admin/travellers">
          <Card className="border border-(--border) hover:shadow-md transition-shadow cursor-pointer">
            <CardBody className="flex flex-row items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-(--primary)/10 flex items-center justify-center">
                  <FaUsers className="w-5 h-5 text-(--primary)" />
                </div>
                <div>
                  <p className="text-(--muted-foreground) text-sm">Total Travellers</p>
                  <p className="text-2xl font-bold text-(--foreground)">
                    {travellersQuery.isPending ? "..." : travellerTotal}
                  </p>
                </div>
              </div>
              <BsArrowRight className="w-4 h-4 text-(--muted-foreground)" />
            </CardBody>
          </Card>
        </Link>
      </div>

      {/* Bank Details */}
      <Card className="border border-(--border) rounded-lg">
        <CardBody className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-(--primary)/10 flex items-center justify-center">
              <BiCreditCard className="w-5 h-5 text-(--primary)" />
            </div>
            <div>
              <h2 className="font-semibold text-(--foreground)">Commission Bank Details</h2>
              <p className="text-xs text-(--muted-foreground)">All commissions will be transferred to this account</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit((d) => bankDetailsMutation.mutate(d))}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="space-y-1">
              <label className="text-sm">Account Holder Name</label>
              <Input
                placeholder="John Doe"
                {...register("accountHolderName", { required: "Required" })}
                isInvalid={!!errors.accountHolderName}
                errorMessage={errors.accountHolderName?.message}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm">Account Number</label>
              <Input
                placeholder="1234567890"
                {...register("accountNumber", { required: "Required" })}
                isInvalid={!!errors.accountNumber}
                errorMessage={errors.accountNumber?.message}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm">Bank Name</label>
              <Input
                placeholder="State Bank of India"
                {...register("bankName", { required: "Required" })}
                isInvalid={!!errors.bankName}
                errorMessage={errors.bankName?.message}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm">IFSC Code</label>
              <Input
                placeholder="SBIN0001234"
                {...register("ifscCode", { required: "Required" })}
                isInvalid={!!errors.ifscCode}
                errorMessage={errors.ifscCode?.message}
              />
            </div>
            <div className="md:col-span-2">
              <Button
                type="submit"
                className="bg-(--primary) text-white rounded-lg px-6"
                disabled={bankDetailsMutation.isPending}
              >
                {bankDetailsMutation.isPending ? (
                  <RiLoader2Fill className="animate-spin w-4 h-4" />
                ) : (
                  "Save Bank Details"
                )}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

    </div>
  );
}
