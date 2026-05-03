"use client";

import { Button, Card, CardBody } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaStar, FaTrash } from "react-icons/fa";
import { reviewApiWithSession } from "../../../../services/review";
import { useAuth } from "../../../lib/auth-context";
import { ReviewStatusEnum, TUpdateReviewRequest } from "@repo/definitions";

export default function ReviewsPage() {
  const { user } = useAuth();
  const agentId = user?._id;

  const getAllReviewsQuery = useQuery({
    queryKey: ["get-all-reviews-by-agent-id"],
    queryFn: async () => {
      return (
        await reviewApiWithSession.get_by_agentId({
          query: {
            filters: {
              agentId: agentId,
            },
            populate: [
              {
                path: "userId",
              },
              {
                path: "packageId",
              },
            ],
          },
        })
      ).data;
    },
  });

  const reviews = getAllReviewsQuery?.data?.data || [];

  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [filterRating, setFilterRating] = useState("all");

  const filteredReviews =
    filterRating === "all"
      ? reviews
      : reviews?.filter((r) => r.rating === parseInt(filterRating));

  const deleteReviewMutation = useMutation({
    mutationFn: async (data: TUpdateReviewRequest) => {
      return (await reviewApiWithSession.update(data)).data;
    },
  });

  const deleteReview = (reviewId: string) => {
    deleteReviewMutation.mutate({
      _id: reviewId,
      status: ReviewStatusEnum.DELETED,
    });
  };

  const averageRating =
    reviews && reviews?.length > 0
      ? (
          reviews?.reduce((sum, r) => sum + (r?.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="space-y-6 p-4 overflow-y-scroll h-full">
      <div>
        {/* <h1 className="text-3xl font-serif font-bold text-(--foreground) mb-2">
          Traveller Reviews
        </h1> */}
        <p className="text-(--muted-foreground)">
          Manage and respond to reviews from travellers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-(--border) rounded-lg">
          <CardBody className="p-6">
            <p className="text-sm text-(--muted-foreground) mb-2">
              Total Reviews
            </p>
            <p className="text-3xl font-bold text-(--foreground)">
              {reviews?.length}
            </p>
          </CardBody>
        </Card>
        <Card className="border border-(--border) rounded-lg">
          <CardBody className="p-6">
            <p className="text-sm text-(--muted-foreground) mb-2">
              Average Rating
            </p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-(--foreground)">
                {averageRating}
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(Number(averageRating))
                        ? "text-yellow-500"
                        : "text-(--muted-foreground)"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="border border-(--border) rounded-lg">
          <CardBody className="p-6">
            <p className="text-sm text-(--muted-foreground) mb-2">Responses</p>
            <p className="text-3xl font-bold text-(--foreground)">
              {reviews?.filter((r) => r.status).length}/{reviews?.length}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-(--foreground)">
          Filter by Rating:
        </label>
        <div className="flex gap-2">
          {["all", "5", "4", "3", "2", "1"].map((rating) => (
            <button
              key={rating}
              onClick={() => setFilterRating(rating)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterRating === rating
                  ? "bg-(--primary) text-(--primary-foreground)"
                  : "bg-(--muted) text-(--foreground) hover:bg-(--muted)/80"
              }`}
            >
              {rating === "all" ? "All" : `${rating}⭐`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <Card
              key={review._id}
              className="border border-(--border) rounded-lg"
            >
              <CardBody className="p-6">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-(--primary)/20 flex items-center justify-center shrink-0">
                      <span className="font-bold text-(--primary)">
                        {review.user?.email}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-(--foreground)">
                        {review.user?.fullName}
                      </h3>
                      <p className="text-sm text-(--muted-foreground)">
                        {review.package?.title}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="bordered"
                    color="danger"
                    isIconOnly
                    onPress={() => deleteReview(review._id as string)}
                    className="border border-(--border) text-red-400 hover:bg-red-400 hover:text-(--primary-foreground) rounded-lg flex items-center justify-center"
                  >
                    <FaTrash className="w-4 h-4" />
                  </Button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-5 h-5 ${
                          i < (review.rating as number)
                            ? "text-yellow-500"
                            : "text-(--muted-foreground)"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-(--muted-foreground)">
                    {review.createdAt?.toLocaleDateString()}
                  </span>
                </div>

                {/* Review Comment */}
                <p className="text-foreground mb-4">{review.comment}</p>

                {/* Response or Response Form */}
                {/* {review.response ? (
                  <div className="bg-muted p-4 rounded-lg border border-(--border)">
                    <p className="text-sm font-semibold text-(--foreground) mb-2">
                      Your Response
                    </p>
                    <p className="text-(--foreground) text-sm mb-2">{review.response.text}</p>
                    <p className="text-xs text-(--muted-foreground)">
                      Replied {review.response.respondedAt.toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <>
                    {respondingId === review._id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={responseText}
                          onValueChange={setResponseText}
                          placeholder="Write your response to this review..."
                          minRows={3}
                          className='border rounded-lg'
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            color="primary"
                            className='bg-(--primary) text-(--primary-foreground) flex items-center justify-center gap-2 rounded-lg'
                            onPress={() => submitResponse(review._id)}
                            isDisabled={!responseText.trim()}
                            startContent={<FaPaperPlane className="w-4 h-4" />}
                          >
                            Post Response
                          </Button>
                          <Button
                            size="sm"
                            variant="bordered"
                            onPress={() => {
                              setRespondingId(null);
                              setResponseText('');
                            }}
                            className='border border-(--border) hover:bg-red-400 hover:text-(--primary-foreground) rounded-lg'
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="bordered"
                        onPress={() => setRespondingId(review._id)}
                        startContent={<BiMessageSquareDetail className="w-4 h-4" />}
                        className='border border-(--border) bg-(--muted) flex items-center justify-center gap-2 hover:bg-red-400 hover:text-(--primary-foreground)  rounded-lg'
                      >
                        Respond
                      </Button>
                    )}
                  </>
                )} */}
              </CardBody>
            </Card>
          ))
        ) : (
          <Card>
            <CardBody className="text-center py-12">
              <FaStar className="w-12 h-12 text-(--muted-foreground) mx-auto mb-4" />
              <p className="text-(--muted-foreground) text-lg">
                No reviews found with that rating.
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
