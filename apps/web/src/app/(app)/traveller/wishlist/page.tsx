'use client';

import { Button, Card } from '@heroui/react';
import { TUpdateWishlistRequest, WishlistStatusEnum } from '@repo/definitions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { BiCalendar, BiHeart, BiMapPin } from 'react-icons/bi';
import { FaDollarSign } from 'react-icons/fa';
import { wishlistApiWithSession } from '../../../../services/wishlist';
import { useAuth } from '../../../lib/auth-context';
import Pagination from '../../../../components/ui/Pagination';

 

export default function WishlistPage() {
  
  const {user} = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const queryClient = useQueryClient();

  const getWishlistByUserIdQuery = useQuery({
    queryKey: ["get-wishlist-by-user-Id", currentPage],
    queryFn: async () => {
      return (await wishlistApiWithSession.getByUserId({
        query: {
          filters: {
            userId: user?._id
          },
          page: currentPage,
          limit: itemsPerPage,
          populate:[
            {
            path: "packageId"
          }
        ]
        }
      })).data
    },
    enabled: !!user?._id
  })

  const wishlist = getWishlistByUserIdQuery?.data?.data;
  const totalItems = getWishlistByUserIdQuery?.data?.totalItems || 0;

 const removeFromWishlistMutation = useMutation({
    mutationFn: async (data:TUpdateWishlistRequest) => {
      return (await wishlistApiWithSession.removeFromWishlist(data)).data
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey: ["get-wishlist-by-user-Id"]
      });
    }
  })

  const removeFromWishlistClick = (wishlistId:string)=>{
    removeFromWishlistMutation.mutate({
      _id: wishlistId,
      userId : user?._id,
      status:WishlistStatusEnum.REMOVED
    })
  }

  return (
    <div className="space-y-6 p-4 overflow-y-scroll h-full">
      <div>
        {/* <h1 className="text-3xl font-serif font-bold text-(--foreground) mb-2">
          My Wishlist
        </h1> */}
        <p className="text-(--muted-foreground)">
          {wishlist?.length || 0} trips saved for later
        </p>
      </div>

      {(wishlist && wishlist?.length > 0) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist?.map((item) => (
            <Card
              key={item._id}
              className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              {/* Image */}
              <div className="relative h-48 bg-(--muted) overflow-hidden">
                <img
                  src={Array.isArray(item.package?.images) ? item.package.images[0] : '/images/destination-1.jpg'}
                  alt={item.package?.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
                <div className="absolute top-3 right-3 p-2 rounded-full bg-(--accent) text-(--accent-foreground)">
                  <BiHeart className="w-5 h-5 fill-current" onClick={() => removeFromWishlistClick(item._id as string)}/>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-serif font-bold text-lg text-(--foreground) mb-2 line-clamp-2">
                  {item.package?.title}
                </h3>

                <div className="flex items-center gap-1 text-sm text-(--muted-foreground) mb-2">
                  <BiMapPin className="w-4 h-4" />
                  {item.package?.destinations}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BiCalendar className="w-4 h-4 text-(--primary)" />
                    <span className="text-(--foreground) font-medium">{item.package?.noOfDays}D/{item.package?.noOfNights}N</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-(--muted-foreground)">
                      {/* {item.package?.c}/{item.maxTravellers} booked */}
                    </span>
                  </div>
                </div>

                {/* Agent Info */}
                <p className="text-xs text-(--muted-foreground) mb-3">
                  by {item.package?.agentId}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {/* {[...Array(5)].map((_, i) => (
                      <BiStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(item.package?.ra)
                            ? 'fill-(--accent) text-(--accent)'
                            : 'text-(--muted-foreground)'
                        }`}
                      />
                    ))} */}
                  </div>
                  <span className="text-sm font-medium text-(--foreground)">
                    {/* {item.rating} ({item.reviewCount}) */}
                  </span>
                </div>

                {/* Saved Date */}
                <p className="text-xs text-(--muted-foreground) mb-4">
                  Saved {new Date().toLocaleDateString()}
                </p>

                {/* Price and Actions */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-(--border) gap-2">
                  <div className="flex items-center gap-1">
                    <FaDollarSign className="w-5 h-5 text-(--primary)" />
                    <span className="text-2xl font-bold text-(--foreground)">{item.package?.price
                      }</span>
                  </div>
                  <div className="flex gap-2">
                    {/* <Button
                      size="sm"
                      onPress={() => removeFromWishlistClick(item._id as string)}
                      className="gap-1 border border-(--border) rounded-lg"
                    >
                      <BiTrash className="w-4 h-4" />
                    </Button> */}
                    <Button size="sm" className='bg-(--primary) text-(--primary-foreground) rounded-lg'>Book</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <BiHeart className="w-12 h-12 text-(--muted-foreground) mx-auto mb-4" />
          <p className="text-(--muted-foreground) text-lg mb-4">
            No trips in your wishlist yet
          </p>
          <Button>
            <a href="/traveller/browse">Browse Trips</a>
          </Button>
        </Card>
      )}

      {/* Pagination */}
      {wishlist && wishlist.length > 0 && (
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
