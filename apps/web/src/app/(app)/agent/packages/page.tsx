'use client';

import { Button, Card, CardBody, Chip } from '@heroui/react';
import { TUpdatePackageRequest } from '@repo/definitions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCheck, FaEye, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import { packageApiWithSession } from '../../../../services/packages';


export default function PackagesPage() {

  const [agentId, setAgentId] = useState<string>('');

  const router = useRouter();
  const queryClient = useQueryClient();

  const getAllPackagesQuery = useQuery({
    queryKey: ["get-all-packages-by-userId-query"],
    queryFn: async () => {
      return (await packageApiWithSession.get({
        query: {
        }
      })).data
    }
  })

  const updatePackageMutation = useMutation({
    mutationFn: async (data: TUpdatePackageRequest) => {
      return (await packageApiWithSession.update(data))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-packages-by-userId-query"] });
      toast.success("Package updated successfully");
    }
  })

  const packages = getAllPackagesQuery?.data?.data
  const totalItems = getAllPackagesQuery?.data?.totalItems ?? 0

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setAgentId(user._id);
    }
  }, []);

  const handleInactive = (packageId: string) => {
    updatePackageMutation.mutate({
      _id: packageId,
      isActive: false
    });
  };

  const handleActive = (packageId: string) => {
    updatePackageMutation.mutate({
      _id: packageId,
      isActive: true
    });
  };

  return (
    <div className="space-y-6 h-full p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {/* <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Trip Packages
          </h1> */}
          <p className="text-(--muted-foreground)">
            Manage and create new trip packages
          </p>

        </div>
        <Button color="primary"
          onPress={() => router.push("/agent/packages/create")} className="gap-2 bg-(--primary) rounded-lg text-(--primary-foreground) flex justify-center items-center w-full md:w-auto">
          <FaPlus className="w-4 h-4" />
          Create New Package
        </Button>
      </div>


      {/* Packages Grid */}
      {getAllPackagesQuery?.isPending ? (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-(--muted-foreground)">Loading packages...</p>
          </CardBody>
        </Card>
      ) : packages && packages?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages?.map((pkg) => (
            <Card
              key={pkg._id}
              className="overflow-hidden hover:shadow-lg transition-shadow border border-(--border) rounded-lg"
            >
              <CardBody className="p-0">
                <div className="relative h-48 bg-(--muted) overflow-hidden">
                  <img
                    src={Array.isArray(pkg.images) ? pkg.images[0] : '/images/destination-1.jpg'}
                    alt={pkg.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-3 right-3">
                    <Chip
                      color={pkg.isActive ? 'success' : 'warning'}
                      variant="flat"
                      size="sm"
                      className={`${pkg.isActive ? "bg-green-400" : "bg-red-500"} rounded-lg text-white text-sm flex items-center justify-center px-2`}
                    >
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </Chip>
                  </div>
                </div>

                <div className="p-4 flex flex-col">
                  <h3 className="font-serif font-bold text-lg text-(--foreground) mb-2 line-clamp-2">
                    {pkg.title}
                  </h3>

                  <div className="flex items-center gap-1 text-sm text-(--muted-foreground) mb-3">
                    <FaMapMarkerAlt className="w-4 h-4" />
                    {pkg.destinations?.map((e) => e.split(",").join(" | ")) || 'Various'}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <p className="text-(--muted-foreground) mb-1">Duration</p>
                      <p className="font-bold text-(--foreground)">{pkg.noOfDays || 7} days</p>
                    </div>
                    <div>
                      <p className="text-(--muted-foreground) mb-1">Price</p>
                      <p className="font-bold text-(--primary)">${pkg.price}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-(--border)">
                    <Button
                      size="sm"
                      variant="bordered"
                      color="danger"
                      className="flex gap-2 justify-center w-full rounded-lg items-center border border-(--border) text-(--primary) hover:bg-(--primary) hover:text-(--primary-foreground) "
                      onPress={() => router.push(`/agent/packages/${pkg._id}`)}
                    >
                      <FaEye className="w-4 h-4" />
                      View
                    </Button>
                    {
                      pkg?.isActive ? (
                        <Button
                          size="sm"
                          variant="bordered"
                          color="danger"
                          className="flex gap-2 justify-center w-full rounded-lg items-center border border-(--border) text-red-400 hover:bg-red-400 hover:text-(--primary-foreground) "
                          onPress={() => handleInactive(pkg?._id as string)}
                        >
                          <RxCross2 className="w-4 h-4" />
                          Mark as Inactive
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="bordered"
                          className="flex gap-2 justify-center w-full rounded-lg items-center border border-(--border) text-green-400 hover:bg-green-400 hover:text-(--primary-foreground) "
                          onPress={() => handleActive(pkg?._id as string)}
                        >
                          <FaCheck className="w-4 h-4" />
                          Mark as active
                        </Button>
                      )
                    }
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <FaPlus className="w-12 h-12 text-(--muted-foreground) mx-auto mb-4" />
            <p className="text-(--muted-foreground) text-lg mb-4">
              No packages found. Create your first package.
            </p>
            <div className='flex items-center justify-center'>
              <Button onPress={() => router.push("/agent/packages/create")} color="primary" className="gap-2 bg-(--primary) flex items-center justify-center rounded-lg text-(--primary-foreground)">
                <FaPlus className="w-4 h-4" />
                Create Package
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
