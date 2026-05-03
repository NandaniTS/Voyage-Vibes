"use client"

import { Button, Card, CardBody } from "@heroui/react"
import { TCreateWishlistRequest, TGetByIdPackageResponse, TUpdateWishlistRequest, WishlistStatusEnum } from "@repo/definitions"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { FaHeart, FaMapMarkerAlt, FaRegHeart } from "react-icons/fa"
import { wishlistApiWithSession } from "../../../../services/wishlist"
import { useRouter } from "next/navigation"


type props = {
    trip: TGetByIdPackageResponse
}

const TripCard = ({ trip }: props) => {

    const [userId, setUserId] = useState<string>("");
    const [wishlistId, setWishlistId] = useState<string>("");
    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            setUserId(user._id);
        }
    }, []);

    const getWislistOftheUserQuery = useQuery({
        queryKey: ["get-wishlist-of-user-by-id",userId],
        queryFn: async()=>{
            return (await wishlistApiWithSession.getByUserId({
                query:{
                    filters:{
                        userId
                    }
                }
            })).data
        },
        enabled:!!userId
    })

    useEffect(()=>{
        if(getWislistOftheUserQuery?.data){
           const id = getWislistOftheUserQuery?.data?.data?.filter((item)=>item.packageId?.toString() === trip._id)[0]?.packageId
           setWishlistId(id as string)
        }
    },[getWislistOftheUserQuery?.data])


    const addToWishlistMutation = useMutation({
        mutationFn: async (data: TCreateWishlistRequest) => {
            return (await wishlistApiWithSession.addToWishlist(data)).data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["get-wishlist-of-user-by-id", userId]
            });
         },
    });

    const removeFromWishlistMutation = useMutation({
        mutationFn: async (data: TUpdateWishlistRequest) => {
            return await wishlistApiWithSession.removeFromWishlist(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["get-wishlist-of-user-by-id", userId]
            });
        },
    });

    const toggleWishlist = (packageId: string) => {
        if (wishlistId) {
            removeFromWishlistMutation.mutate({
                _id: wishlistId,
                userId: userId,
                status: WishlistStatusEnum.REMOVED,
            });
        } else {
            addToWishlistMutation.mutate({
                userId,
                packageId,
                status: WishlistStatusEnum.WISHLISTED,
            });
        }
    };

    return (
        <Card
            key={trip._id}
            className="overflow-hidden hover:shadow-lg transition-shadow border border-(--border) rounded-lg"
        >
            <CardBody className="p-0">
                <div className="relative h-48 bg-(--muted) overflow-hidden">
                    <img
                        src={"/images/destination-1.jpg"}
                        // src={trip.images || '/images/destination-1.jpg'}
                        alt={trip.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                    <button
                        onClick={() => toggleWishlist(trip._id as string)}
                        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                    >
                        {wishlistId === trip._id  ? (
                            <FaHeart className="w-5 h-5 text-red-500" />
                        ) : (
                            <FaRegHeart className="w-5 h-5 text-gray-600" />
                        )}
                    </button>
                </div>

                <div className="p-4">
                    <h3 className="font-serif font-bold text-lg text-(--foreground) mb-2 line-clamp-2">
                        {trip.title}
                    </h3>

                    <div className="flex items-center gap-1 text-sm text-(--muted-foreground) mb-3">
                        <FaMapMarkerAlt className="w-4 h-4" />
                        Various
                        {/* {trip.destinations?.[0] || 'Various'} */}
                    </div>

                    <p className="text-sm text-(--muted-foreground) mb-4 line-clamp-2">
                        {trip.description || "Amazing travel experience"}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div>
                            <p className="text-(--muted-foreground) mb-1">Duration</p>
                            <p className="font-bold text-(--foreground)">{7} days</p>
                        </div>
                        <div>
                            <p className="text-(--muted-foreground) mb-1">Price</p>
                            <p className="text-2xl font-bold text-(--primary)">
                                ${trip.price}
                            </p>
                        </div>
                    </div>

                    <Button
                        onPress={() => router.push(`/traveller/browse/${trip._id}`)}
                        color="primary"
                        className="w-full bg-(--primary) rounded-lg text-(--primary-foreground)"
                    >
                        View Details
                    </Button>
                </div>
            </CardBody>
        </Card>
    )
}

export default TripCard;