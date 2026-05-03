"use client";

import {
  Button,
  Input,
  Textarea
} from "@heroui/react";
import { TCreatePackageRequest } from "@repo/definitions";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaPlus, FaTrash } from "react-icons/fa";
import ImageUpload from "../../../../../components/ImageUpload";
import { packageApiWithSession } from "../../../../../services/packages";
import { useAuth } from "../../../../lib/auth-context";


const CATEGORIES = [
  "Adventure",
  "Cultural",
  "Beach",
  "Mountain",
  "City",
  "Wildlife",
  "Cruise",
  "Backpacking",
];

const Page = () => {
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TCreatePackageRequest>({
    defaultValues: {
      currency: "INR",
      isActive: true,
      itinerary: [{ title: "", description: "", activities: [""] }],
      destinations: [{ value: "" }] as any,
      category: [],
      availableDates: [{ startDate: "", endDate: "", seatsAvailable: 1 }],
      totalSeats: 10,
      availableSeats: 10,
      images: [],
    },
  });

  const {user} = useAuth();

  // Update form value when images change
  React.useEffect(() => {
    setValue("images", uploadedImages);
  }, [uploadedImages, setValue]);

  // Register images field properly
  register("images");

  // Watch totalSeats and update availableSeats to match
  const totalSeats = watch("totalSeats");
  React.useEffect(() => {
    if (totalSeats !== undefined) {
      setValue("availableSeats", totalSeats);
    }
  }, [totalSeats, setValue]);

  const {
    fields: itineraryFields,
    append: appendItinerary,
    remove: removeItinerary,
  } = useFieldArray({ control, name: "itinerary" });

  const {
    fields: destinationFields,
    append: appendDestination,
    remove: removeDestination,
  } = useFieldArray({ control, name: "destinations" as any });

  const {
    fields: availableDateFields,
    append: appendAvailableDate,
    remove: removeAvailableDate,
  } = useFieldArray({ control, name: "availableDates" });

  const createPackageMutation = useMutation({
    mutationFn: async (data: TCreatePackageRequest) => {
      // console.log("hello")
      return await packageApiWithSession.create(data);
    },
    onSuccess: () => {
      toast.success("Package Created Successfully!");
      router.push("/agent/packages");
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });


  const onSubmit = (data: TCreatePackageRequest) => {
    // Validate that at least one image is uploaded
    if (uploadedImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const payload = {
      ...data,
      destinations: (data.destinations as any[]).map((d) =>
        typeof d === "object" ? d.value : d,
      ),
      images: uploadedImages, // Now storing URLs instead of base64
      agentId: user?._id as string
    };

    // console.log(payload)
        
    createPackageMutation.mutate(payload);
  };

  return (
    <div className="h-[95vh] overflow-y-scroll p-4">
      {/* Header */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Basic Info */}
        <section className="space-y-4">
          {/* <h2 className="text-lg font-semibold text-(--foreground) border-b border-(--border) pb-2">
            Basic Info
          </h2> */}

          <div className="space-y-2">
            <label className="mb-2" htmlFor="title">
              Title
            </label>
            <Input
              placeholder="e.g. Bali Solo Adventure"
              isRequired
              {...register("title", { required: "Title is required" })}
              isInvalid={!!errors.title}
              errorMessage={errors.title?.message}
              classNames={{
                base: "flex-1 border border-(--border) rounded-lg",
                inputWrapper:
                  "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
                input:
                  "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="mb-2" htmlFor="slug">
              Slug
            </label>
            <Input
              placeholder="e.g. bali-solo-adventure"
              {...register("slug")}
              classNames={{
                base: "flex-1 border border-(--border) rounded-lg",
                inputWrapper:
                  "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
                input:
                  "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="mb-2" htmlFor="description">
              Description
            </label>
            <Textarea
              placeholder="Describe the trip..."
              {...register("description")}
              minRows={3}
              classNames={{
                base: "flex-1 border border-(--border) rounded-lg",
                inputWrapper:
                  "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
                input:
                  "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="mb-2 block">
              Package Images
            </label>
            <ImageUpload
              images={uploadedImages}
              onChange={setUploadedImages}
              maxImages={5}
            />
            {uploadedImages.length === 0 && (
              <p className="text-red-500 text-sm">At least one image is required</p>
            )}
          </div>
        </section>

        {/* Pricing */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-(--foreground) border-b border-(--border) pb-2">
            Pricing
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="mb-2" htmlFor="price">
                Price
              </label>
              <Input
                // label="Price"
                type="number"
                placeholder="0"
                isRequired
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                })}
                isInvalid={!!errors.price}
                errorMessage={errors.price?.message}
                classNames={{
                  base: "flex-1 border border-(--border) rounded-lg",
                  inputWrapper:
                    "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
                  input:
                    "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="mb-2" htmlFor="discountedPrice">
                Discounted Price
              </label>
              <Input
                // label="Discount Price"
                type="number"
                placeholder="0"
                {...register("disountPrice", { valueAsNumber: true })}
                classNames={{
                  base: "flex-1 border border-(--border) rounded-lg",
                  inputWrapper:
                    "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
                  input:
                    "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                }}
              />
            </div>
          </div>

          <div>
            <label className="mb-2" htmlFor="discountedPrice">
              Currency
            </label>
            <Input
              // label="Discount Price"
              type="string"
              placeholder="0"
              {...register("currency")}
              value="INR"
              disabled
              classNames={{
                base: "flex-1 border border-(--border) rounded-lg",
                inputWrapper:
                  "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
                input:
                  "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="mb-2" htmlFor="totalSeats">
                Total Seats
              </label>
              <Input
                type="number"
                placeholder="10"
                isRequired
                {...register("totalSeats", {
                  required: "Total seats is required",
                  valueAsNumber: true,
                })}
                isInvalid={!!errors.totalSeats}
                errorMessage={errors.totalSeats?.message}
                classNames={{
                  base: "flex-1 border border-(--border) rounded-lg",
                  inputWrapper:
                    "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
                  input:
                    "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="mb-2" htmlFor="availableSeats">
                Available Seats
              </label>
              <Input
                type="number"
                placeholder="10"
                isRequired
                {...register("availableSeats", {
                  required: "Available seats is required",
                  valueAsNumber: true,
                })}
                isInvalid={!!errors.availableSeats}
                errorMessage={errors.availableSeats?.message}
                classNames={{
                  base: "flex-1 border border-(--border) rounded-lg",
                  inputWrapper:
                    "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
                  input:
                    "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                }}
              />
            </div>
          </div>
          {/* <Select
            label="Currency"
            isRequired
            defaultSelectedKeys={["USD"]}
            {...register("currency", { required: "Currency is required" })}
          >
            {CURRENCIES.map((c) => (
              <SelectItem key={c}>{c}</SelectItem>
            ))}
          </Select> */}
        </section>

        {/* Locations */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-(--foreground) border-b border-(--border) pb-2">
            Locations
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="mb-2" htmlFor="startLocation">
                Start Location
              </label>
              <Input
                placeholder="e.g. Denpasar Airport"
                isRequired
                {...register("startLocation", {
                  required: "Start location is required",
                })}
                isInvalid={!!errors.startLocation}
                errorMessage={errors.startLocation?.message}
                classNames={{
                  base: "flex-1 border border-(--border) rounded-lg",
                  inputWrapper:
                    "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
                  input:
                    "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="mb-2" htmlFor="endLocation">
                End Location
              </label>
              <Input
                placeholder="e.g. Denpasar Airport"
                isRequired
                {...register("endLocation", {
                  required: "End location is required",
                })}
                isInvalid={!!errors.endLocation}
                errorMessage={errors.endLocation?.message}
                classNames={{
                  base: "flex-1 border border-(--border) rounded-lg",
                  inputWrapper:
                    "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
                  input:
                    "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className=" font-medium text-(--foreground)">
                Destinations
              </label>
              <Button
                size="sm"
                variant="flat"
                onPress={() => appendDestination({ value: "" } as any)}
                startContent={<FaPlus size={12} />}
                className="border border-(--border) rounded-lg flex items-center gap-2"
              >
                Add Destination
              </Button>
            </div>
            {destinationFields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  placeholder={`Destination ${i + 1}`}
                  {...register(`destinations.${i}.value` as any)}
                  classNames={{
                    base: "flex-1 border border-(--border) rounded-lg",
                    inputWrapper:
                      "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
                    input:
                      "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                  }}
                />
                {destinationFields.length > 1 && (
                  <Button
                    isIconOnly
                    variant="light"
                    color="danger"
                    onPress={() => removeDestination(i)}
                  >
                    <FaTrash size={14} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Duration & Details */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-(--foreground) border-b border-(--border) pb-2">
            Duration & Details
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="mb-2" htmlFor="noOfDays">
                No. of Days
              </label>
              <Input
                type="number"
                isRequired
                {...register("noOfDays", {
                  required: true,
                  valueAsNumber: true,
                  validate: (value) =>
                    Number.isInteger(value) || "Only whole numbers allowed",
                })}
                step={1}
                inputMode="numeric"
                min={0}
                isInvalid={!!errors.noOfDays}
                classNames={{
                  base: "flex-1 border border-(--border) rounded-lg",
                  inputWrapper:
                    "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
                  input:
                    "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="mb-2" htmlFor="noOfNights">
                No. of Nights
              </label>
              <Input
                type="number"
                isRequired
                {...register("noOfNights", {
                  required: true,
                  valueAsNumber: true,
                  validate: (value) =>
                    Number.isInteger(value) || "Only whole numbers allowed",
                })}
                step={1}
                min={0}
                inputMode="numeric"
                isInvalid={!!errors.noOfNights}
                classNames={{
                  base: "flex-1 border border-(--border) rounded-lg",
                  inputWrapper:
                    "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
                  input:
                    "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="mb-2" htmlFor="minAge">
                Min Age
              </label>
              <Input
                type="number"
                {...register("minAge", {
                  required: true,
                  valueAsNumber: true,
                  validate: (value) =>
                    Number.isInteger(value) || "Only whole numbers allowed",
                })}
                step={1}
                min={1}
                inputMode="numeric"
                classNames={{
                  base: "flex-1 border border-(--border) rounded-lg",
                  inputWrapper:
                    "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
                  input:
                    "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                }}
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-(--foreground) border-b border-(--border) pb-2">
            Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 cursor-pointer border border-(--border) rounded-lg px-3 py-2 text-sm hover:bg-(--muted) transition-colors"
              >
                <input
                  type="checkbox"
                  value={cat}
                  {...register("category")}
                  className="accent-(--primary)"
                />
                {cat}
              </label>
            ))}
          </div>
        </section>

        {/* Available Dates */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-(--border) pb-2">
            <h2 className="text-lg font-semibold text-(--foreground)">
              Available Dates
            </h2>
            <Button
              size="sm"
              variant="flat"
              onPress={() =>
                appendAvailableDate({
                  startDate: "",
                  endDate: "",
                  seatsAvailable: 1,
                })
              }
              startContent={<FaPlus size={12} />}
              className="border border-(--border) rounded-lg flex items-center gap-2"
            >
              Add Date Slot
            </Button>
          </div>
          {availableDateFields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-4 gap-2 items-end">
              {/* <DatePicker
                {...register(`availableDates.${i}.startDate`)}
              /> */}
              <div className="space-y-2">
                <label className="mb-2" htmlFor="startDate">
                  Start Date
                </label>
                <Input
                  // label="Discount Price"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  placeholder=""
                  {...register(`availableDates.${i}.startDate`)}
                  classNames={{
                    base: "flex-1 border border-(--border) rounded-lg",
                    inputWrapper:
                      "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
                    input:
                      "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="mb-2" htmlFor="endDate">
                  End Date
                </label>

                <Input
                  // label="Discount Price"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  placeholder=""
                  {...register(`availableDates.${i}.endDate`)}
                  classNames={{
                    base: "flex-1 border border-(--border) rounded-lg",
                    inputWrapper:
                      "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
                    input:
                      "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="mb-2" htmlFor="seats">
                  Available Seats
                </label>
                <Input
                  type="number"
                  {...register(`availableDates.${i}.seatsAvailable`, {
                    valueAsNumber: true,
                  })}
                  classNames={{
                    base: "flex-1 border border-(--border) rounded-lg",
                    inputWrapper:
                      "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
                    input:
                      "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                  }}
                />
              </div>
              {availableDateFields.length > 1 && (
                <Button
                  isIconOnly
                  variant="light"
                  color="danger"
                  onPress={() => removeAvailableDate(i)}
                >
                  <FaTrash size={14} />
                </Button>
              )}
            </div>
          ))}
        </section>

        {/* Itinerary */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-(--border) pb-2">
            <h2 className="text-lg font-semibold text-(--foreground) ">
              Itinerary
            </h2>
            <Button
              size="sm"
              variant="flat"
              className="border border-(--border) rounded-lg flex items-center gap-2"
              onPress={() =>
                appendItinerary({
                  title: "",
                  description: "",
                  activities: [""],
                })
              }
              startContent={<FaPlus size={12} />}
            >
              Add Day
            </Button>
          </div>
          {itineraryFields.map((field, i) => (
            <div
              key={field.id}
              className="border border-(--border) rounded-xl p-4 space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-(--foreground)">
                  Day {i + 1}
                </span>
                {itineraryFields.length > 1 && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => removeItinerary(i)}
                  >
                    <FaTrash size={12} />
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="mb-2" htmlFor="Title">
                  Title
                </label>
                <Input
                  placeholder="e.g. Arrival & City Tour"
                  {...register(`itinerary.${i}.title`)}
                  classNames={{
                    base: "flex-1 border border-(--border) rounded-lg",
                    inputWrapper:
                      "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
                    input:
                      "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="mb-2" htmlFor="description">
                  Description
                </label>
                <Textarea
                  placeholder="What happens this day..."
                  {...register(`itinerary.${i}.description`)}
                  minRows={2}
                  classNames={{
                    base: "flex-1 border border-(--border) rounded-lg",
                    inputWrapper:
                      "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
                    input:
                      "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                  }}
                />
              </div>
              <div className="space-y-2">
                <ActivitiesField
                  control={control}
                  register={register}
                  dayIndex={i}
                />
              </div>
            </div>
          ))}
        </section>

        {/* Submit */}
        <div className="flex justify-end gap-3 mb-14">
          <Button
            variant="bordered"
            onPress={() => router.back()}
            className="border rounded-lg border-(--border)"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-(--primary) text-(--primary-foreground) rounded-lg"
            isLoading={createPackageMutation.isPending}
          >
            Create Package
          </Button>
        </div>
      </form>
    </div>
  );
};

// Sub-component for activities within each itinerary day
function ActivitiesField({
  control,
  register,
  dayIndex,
}: {
  control: any;
  register: any;
  dayIndex: number;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `itinerary.${dayIndex}.activities` as any,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="mb-2">Activities</label>
        <Button
          size="sm"
          variant="flat"
          onPress={() => append("")}
          startContent={<FaPlus size={10} />}
          className="border border-(--border) rounded-lg flex items-center gap-2"
        >
          Add Activity
        </Button>
      </div>
      {fields.map((field, i) => (
        <div key={field.id} className="flex gap-2">
          <Input
            placeholder={`Activity ${i + 1}`}
            size="sm"
            {...register(`itinerary.${dayIndex}.activities.${i}`)}
            classNames={{
              base: "flex-1 border border-(--border) rounded-lg",
              inputWrapper:
                "h-10 bg-transparent shadow-none focus-within:ring-0 focus-within:outline-none",
              input:
                "h-10 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
            }}
          />
          {fields.length > 1 && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={() => remove(i)}
            >
              <FaTrash size={12} />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Page;
