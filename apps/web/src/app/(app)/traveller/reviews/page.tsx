'use client';

import { useState, useEffect } from 'react';
import { Button, Card, CardBody, Textarea } from '@heroui/react';
import { FaStar, FaMapMarkerAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { useMutation, useQuery } from '@tanstack/react-query';
import { reviewApiWithSession } from '../../../../services/review';
import { ReviewStatusEnum, TUpdateReviewRequest } from '@repo/definitions';

export default function ReviewsPage() {

  const [userId, setUserId] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');

  // const { data: reviews = [], isLoading } = useUserReviews(userId);
  // const updateReview = useUpdateReview();
  // const deleteReview = useDeleteReview();

  const getAllReviewByUserIdQuery = useQuery({
    queryKey: ["get-all-review-by-user-id", userId],
    queryFn: async () => {
      return (await reviewApiWithSession.get_by_userId({ 
        query: {
          filters: {
            userId: userId
          }
        }
       })).data
    },
    enabled: !!userId
  })

  const reviews = getAllReviewByUserIdQuery?.data?.data;

  const updateReviewByIdMutation = useMutation({
    mutationFn: async (data:TUpdateReviewRequest)=>{
      return (await reviewApiWithSession.update(data)).data
    },
    onSuccess:()=>{

    }
  })

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user._id);
    }
  }, []);

  const startEdit = (review: any) => {
    setEditingId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const saveEdit =  (reviewId: string) => {
     updateReviewByIdMutation.mutate({
      _id:reviewId, rating: editRating, comment: editComment ,
    });
    setEditingId(null);
  };

  const handleDelete =  (reviewId: string) => {
     updateReviewByIdMutation.mutate({
      _id:reviewId,
       status: ReviewStatusEnum.DELETED
    });
  };

  return (
    <div className="space-y-6 p-4 h-full overflow-y-scroll">
      <div>
        {/* <h1 className="text-3xl font-serif font-bold text-(--foreground) mb-2">
          My Reviews
        </h1> */}
        <p className="text-(--muted-foreground)">
          Reviews you've written for completed trips
        </p>
      </div>

      <div className="space-y-4">
        {
        getAllReviewByUserIdQuery.isPending ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-(--muted-foreground)">Loading reviews...</p>
            </CardBody>
          </Card>
        ) : (reviews && reviews?.length > 0) ? (
          reviews?.map((review) => (
            <Card key={review._id} className='border border-(--border) rounded-lg'>
              <CardBody className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                    <img
                      // src={review.packageId?.images || '/images/destination-1.jpg'}
                      src={'/images/destination-1.jpg'}
                      // alt={review.packageId?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif font-bold text-lg text-(--foreground) mb-1">
                      {/* {review.packageId?.title} */}Leh Ladakh Trip
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-(--muted-foreground) mb-3">
                      <FaMapMarkerAlt className="w-4 h-4" />
                      Destinations
                      {/* {review.packageId?.destinations?.[0] || 'Destination'} */}
                    </div>

                    {editingId === review._id ? (
                      <div className="space-y-3">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setEditRating(star)}
                              className="focus:outline-none"
                            >
                              <FaStar
                                className={`w-6 h-6 ${
                                  star <= editRating ? 'text-yellow-500' : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <Textarea
                          value={editComment}
                          onValueChange={setEditComment}
                          minRows={3}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" color="primary" className='bg-(--primary) text-(--primary-foreground) rounded-lg flex items-center gap-2' onPress={() => saveEdit(review._id as string)}>
                            Save
                          </Button>
                          <Button size="sm" variant="bordered" className='border border-(--border)' onPress={() => setEditingId(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`w-5 h-5 ${
                                i < (review?.rating || 0) ? 'text-yellow-500' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-(--foreground) mb-3">{review.comment}</p>
                        <p className="text-xs text-(--muted-foreground) mb-3">
                          Posted on {new Date(review?.createdAt?.toISOString() as string).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="bordered"
                            startContent={<FaEdit className="w-4 h-4" />}
                            onPress={() => startEdit(review)}
                            className='flex items-center justify-center gap-2 rounded-lg border border(--border)'
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="bordered"
                            color="danger"
                            startContent={<FaTrash className="w-4 h-4" />}
                            onPress={() => handleDelete(review._id as string)}
                            className='flex items-center justify-center gap-2 rounded-lg border border(--destructive) text-(--destructive)'
                          >
                            Delete
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        )
         : (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-(--muted-foreground) text-lg">
                You haven't written any reviews yet.
              </p>
            </CardBody>
          </Card>
        )
        }
      </div>
    </div>
  );
}
