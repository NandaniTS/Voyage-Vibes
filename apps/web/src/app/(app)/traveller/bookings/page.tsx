"use client"

import {
  Button,
  Card,
  CardBody,
  Chip
} from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendar, FaCheckCircle, FaChevronDown, FaClock, FaMapMarkerAlt, FaTimesCircle } from 'react-icons/fa';
import { bookingApiWithSession } from '../../../../services/booking';
import Pagination from '../../../../components/ui/Pagination';

const statusConfig = {
  pending: { color: 'warning' as const, icon: FaClock, label: 'Pending' },
  confirmed: { color: 'success' as const, icon: FaCheckCircle, label: 'Confirmed' },
  completed: { color: 'primary' as const, icon: FaCheckCircle, label: 'Completed' },
  cancelled: { color: 'danger' as const, icon: FaTimesCircle, label: 'Cancelled' },
};


export default function BookingsPage() {

  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // const { data: bookings = [], isLoading } = useUserBookings(userId);
  const getAllBookingQuery = useQuery({
    queryKey: ["get-all-traveller-bookings", userId, currentPage],
    queryFn: async () => {
      return (await bookingApiWithSession.get_by_userId({
        query: {
          filters: {
            userId: userId
          },
          page: currentPage,
          limit: itemsPerPage,
          populate: [
            {
              path: "packageId",
              select: ["title", "images", "price", "duration", "destinations", "category"]
            },
            {
              path: "agentId",
              select: ["fullName", "email", "phone"]
            }
          ]
        }
      })).data
    },
    enabled: !!userId
  })

  const bookings = getAllBookingQuery?.data?.data;
  const totalItems = getAllBookingQuery?.data?.totalItems || 0;

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user._id);
    }
  }, []);


  return (
    <div className="space-y-6 p-4 overflow-y-scroll h-full">

      {/* <div> */}
      {/* <h1 className="text-3xl font-serif font-bold text-(--foreground) mb-2">
          My Bookings
        </h1> */}
      <p className="text-(--muted-foreground)">
        View and manage all your trip bookings
      </p>
      {/* </div> */}

      {/* Bookings List */}
      <div className="space-y-4">
        {
          getAllBookingQuery.isPending ? (
            <Card className='border border-(--border) rounded-lg '>
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
                            <div className="flex flex-wrap gap-4 text-sm text-(--muted-foreground) mb-3">
                              {/* <div className="flex items-center gap-1">
                                <FaMapMarkerAlt className="w-4 h-4" />
                                {booking.package?.destinations?.map((destination) => destination).join('| ')}
                              </div> */}
                              <div className="flex items-center gap-1">
                                <FaCalendar className="w-4 h-4" />
                                {new Date(booking?.startDate as string).toLocaleDateString()} - {new Date(booking?.endDate as string).toLocaleDateString()}
                              </div>
                            </div>
                            <div>
                              <Chip
                                color={status.color}
                                variant="flat"
                                startContent={<StatusIcon className="w-4 h-4" />}
                                className='flex items-center justify-center gap-2 border border-(--border) w-30 px-2'
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
                        <div className="px-6 py-4 border-t border-(--border) bg-(--muted)/50">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-(--muted-foreground) mb-1">Agent Name</p>
                              <p className="font-medium text-foreground">{booking.agent?.fullName || '-'}</p>
                            </div>
                             <div>
                              <p className="text-(--muted-foreground) mb-1">Agent Email</p>
                              <p className="font-medium text-foreground">{booking.agent?.email || '-'}</p>
                            </div>
                            <div>
                              <p className="text-(--muted-foreground) mb-1">Booked On</p>
                              <p className="text-(--foreground)">{new Date(booking.bookingDate as string).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button size="sm" className='bg-(--primary) rounded-lg text-(--primary-foreground)' onPress={() => router.push(`/traveller/bookings/${booking._id}`)}>View Details</Button>
                            {booking.status === 'completed' && (
                              <Button size="sm" variant="bordered" className='border border-(--border) rounded-lg '>Write Review</Button>
                            )}
                          </div>
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
