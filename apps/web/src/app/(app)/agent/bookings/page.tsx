'use client';

import { Button, Card, CardBody, Chip } from '@heroui/react';
import { BookingStatusEnum } from '@repo/definitions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FaCalendar, FaCheckCircle, FaChevronDown, FaClock, FaEnvelope, FaMapMarkerAlt, FaTimesCircle, FaUser } from 'react-icons/fa';
import Pagination from '../../../../components/ui/Pagination';
import { bookingApiWithSession } from '../../../../services/booking';

const statusConfig = {
  pending: { color: 'yellow-400' as const, icon: FaClock, label: 'Pending' },
  confirmed: { color: 'green-400' as const, icon: FaCheckCircle, label: 'Confirmed' },
  completed: { color: 'blue-400' as const, icon: FaCheckCircle, label: 'Completed' },
  cancelled: { color: 'red-400' as const, icon: FaTimesCircle, label: 'Cancelled' },
};


export default function BookingsPage() {

  const [agentId, setAgentId] = useState<string>('');
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getAllBookingByUserIdQuery = useQuery({
    queryKey: ["get-all-agent-bookings", agentId, currentPage],
    queryFn: async () => {
      return (await bookingApiWithSession.get_by_agentId({
        query: {
          filters: {
            agentId: agentId
          },
          page: currentPage,
          limit: itemsPerPage,
          populate: [
            {
              path: "packageId",
              select: ["title", "images", "price", "duration", "destinations", "category"]
            },
            {
              path: "userId",
              select: ["fullName", "email", "phone"]
            }
          ]
        }
      })).data
    },
    enabled: !!agentId
  })

  const bookings = getAllBookingByUserIdQuery?.data?.data
  const totalItems = getAllBookingByUserIdQuery?.data?.totalItems || 0;
  const queryClient = useQueryClient();


  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setAgentId(user._id);
    }
  }, []);


  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      return await bookingApiWithSession.update({ _id: bookingId, status: status as BookingStatusEnum });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-agent-bookings"] });
    },
  });

  return (
    <div className="space-y-6 p-4 h-full overflow-y-scroll">

      <div>
        <p className="text-(--muted-foreground)">
          Manage all bookings for your trip packages
        </p>
      </div>

      {/* Booking Statistics */}

      {bookings && bookings.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border border-(--border) rounded-lg">
            <CardBody className="text-center p-4">
              <p className="text-2xl font-bold text-(--primary)">{bookings?.length || 0}</p>
              <p className="text-sm text-(--muted-foreground)">Total Bookings</p>
            </CardBody>
          </Card>
          <Card className="border border-(--border) rounded-lg">
            <CardBody className="text-center p-4">
              <p className="text-2xl font-bold text-yellow-500">
                {bookings?.filter(b => b.status === 'pending').length || 0}
              </p>
              <p className="text-sm text-(--muted-foreground)">Pending</p>
            </CardBody>
          </Card>
          <Card className="border border-(--border) rounded-lg">
            <CardBody className="text-center p-4">
              <p className="text-2xl font-bold text-green-500">
                {bookings?.filter(b => b.status === 'confirmed').length || 0}
              </p>
              <p className="text-sm text-(--muted-foreground)">Confirmed</p>
            </CardBody>
          </Card>
          <Card className="border border-(--border) rounded-lg">
            <CardBody className="text-center p-4">
              <p className="text-2xl font-bold text-blue-500">
                {bookings?.filter(b => b.status === 'completed').length || 0}
              </p>
              <p className="text-sm text-(--muted-foreground)">Completed</p>
            </CardBody>
          </Card>
        </div>
      )}


      {/* Bookings List */}
      <div className="space-y-4">
        {
          getAllBookingByUserIdQuery?.isPending ? (
            <Card>
              <CardBody className="text-center py-12">
                <p className="text-(--muted-foreground)">Loading bookings...</p>
              </CardBody>
            </Card>
          ) :
            (bookings && bookings?.length > 0) ? (
              bookings?.map((booking) => {
                const status = statusConfig[booking.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                const isExpanded = expandedBooking === booking._id;

                return (
                  <Card key={booking._id} className='border border-(--border) rounded-lg'>
                    <CardBody className="p-0">
                      <button
                        onClick={() => setExpandedBooking(isExpanded ? null : booking._id as string)}
                        className="w-full"
                      >
                        <div className="p-6 flex items-center gap-4 hover:bg-(--muted) transition-colors">
                          <div className="flex-1 text-left">
                            <h3 className="font-serif font-bold text-lg text-(--foreground) mb-2">
                              {booking.package?.title || 'Package'}
                            </h3>
                            <div className=" text-sm text-(--muted-foreground) mb-3">
                              {/* <div className="flex items-center gap-1">
                                <FaMapMarkerAlt className="w-4 h-4" />
                                {booking.package?.destinations?.map((e) => e + "|")}
                              </div> */}
                              <div className="flex items-center gap-1">
                                <FaCalendar className="w-4 h-4" />
                                {new Date(booking.startDate as string).toLocaleDateString()} - {new Date(booking.endDate as string).toLocaleDateString()}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-3">
                              <Chip
                                // color={status.color}
                                variant="flat"
                                startContent={<StatusIcon className="w-4 h-4" />}
                                className={`flex items-center gap-1 text-sm border border-(--border) px-2 py-1x bg-${status.color}`}
                              >
                                {status.label}
                              </Chip>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-3">
                            <div className="text-right">
                              <p className="text-sm text-(--muted-foreground)">Total Price</p>
                              <p className="text-2xl font-bold text-(--primary)">${booking.totalPrice}</p>
                            </div>
                            <FaChevronDown
                              className={`w-5 h-5 text-(--muted-foreground) transition-transform ${isExpanded ? 'rotate-180' : ''
                                }`}
                            />
                          </div>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-6 py-4 border-t border-(--border) bg-(--muted)/50 space-y-4">
                          <div>
                            <p className="text-sm font-semibold text-(--foreground) mb-3">
                              Traveller Information
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <FaUser className="w-4 h-4 text-(--muted-foreground)" />
                                <p
                                  className="text-sm text-(--primary) hover:underline"
                                >
                                  {(booking?.userId as any)?.fullName || 'N/A'}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <FaEnvelope className="w-4 h-4 text-(--muted-foreground)" />
                                <a
                                  href={`mailto:${(booking?.userId as any)?.email || ''}`}
                                  className="text-sm text-(--primary) hover:underline"
                                >
                                  {(booking?.userId as any)?.email || 'N/A'}
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-(--border) pt-4">
                            <p className="text-sm font-semibold text-(--foreground) mb-3">
                              Booking Details
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-(--muted-foreground) mb-1">Booking ID</p>
                                <p className="font-mono font-medium text-(--foreground)">{booking._id}</p>
                              </div>
                              <div>
                                <p className="text-(--muted-foreground) mb-1">Travellers</p>
                                <p className="font-medium text-(--foreground)">{booking.noOfTravellers}</p>
                              </div>
                              <div>
                                <p className="text-(--muted-foreground) mb-1">Booked On</p>
                                <p className="text-(--foreground)">{new Date(booking.bookingDate as string).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-(--muted-foreground) mb-1">Total Price</p>
                                <p className="font-bold text-(--primary)">${booking.totalPrice}</p>
                              </div>
                            </div>
                          </div>

                          {/* <div className="border-t border-(--border) pt-4 flex gap-2 flex-wrap">


                        <Button size="sm" variant="bordered"
                         className='border border-(--primary) text-(--primary) rounded-lg  text-base'
                         >
                          Send Message
                        </Button>
                      </div> */}
                        </div>
                      )}
                    </CardBody>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardBody className="text-center py-12">
                  <p className="text-(--muted-foreground) text-lg">No bookings found.</p>
                </CardBody>
              </Card>
            )}
      </div>


      {/* Pagination */}
      {bookings && bookings.length > 0 && (
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
