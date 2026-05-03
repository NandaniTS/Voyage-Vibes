"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import { FaCheckCircle, FaHome, FaCalendarCheck, FaDownload } from "react-icons/fa";

const PaymentSuccessPage = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/traveller/browse');
  };

  const handleViewBookings = () => {
    router.push('/traveller/bookings');
  };

  // const handleDownloadInvoice = () => {
  //   // Mock invoice download
  //   const invoiceData = {
  //     invoiceNumber: `INV-${Date.now()}`,
  //     date: new Date().toLocaleDateString(),
  //     amount: "₹5,000",
  //     status: "Paid"
  //   };
    
  //   const dataStr = JSON.stringify(invoiceData, null, 2);
  //   const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
  //   const exportFileDefaultName = `invoice-${invoiceData.invoiceNumber}.json`;
    
  //   const linkElement = document.createElement('a');
  //   linkElement.setAttribute('href', dataUri);
  //   linkElement.setAttribute('download', exportFileDefaultName);
  //   linkElement.click();
  // };

  return (
    <main className="min-h-screen bg-(--background) p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md p-8 text-center border border-(--border)">
            {/* Success Icon */}
            <div className="mb-6">
              <FaCheckCircle className="mx-auto text-6xl text-green-500" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-(--foreground) mb-2">
              Payment Successful!
            </h1>
            <p className="text-(--muted-foreground) mb-8">
              Your booking has been confirmed. You will receive a confirmation email shortly.
            </p>

            {/* Booking Details */}
            <div className="bg-(--secondary) p-4 rounded-lg mb-6 border border-(--border)">
              <div className="flex items-center justify-center gap-2 text-sm text-(--muted-foreground) mb-2">
                <FaCalendarCheck />
                <span>Booking Confirmed</span>
              </div>
              <p className="text-lg font-semibold text-(--foreground)">
                Order #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-(--primary) text-(--primary-foreground) rounded-lg"
                size="lg"
                onPress={handleViewBookings}
              >
                View My Bookings
              </Button>
              
              {/* <Button
                className="w-full border border-(--border) text-(--foreground) rounded-lg"
                size="lg"
                variant="bordered"
                onPress={handleDownloadInvoice}
              >
                <FaDownload className="mr-2" />
                Download Invoice
              </Button> */}
              
              <Button
                className="w-full"
                size="lg"
                variant="light"
                onPress={handleGoHome}
              >
                <FaHome className="mr-2" />
                Back to Home
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-(--border)">
              <p className="text-xs text-(--muted-foreground)">
                Need help? Contact our support team at support@voyagevibes.com
              </p>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default PaymentSuccessPage;
