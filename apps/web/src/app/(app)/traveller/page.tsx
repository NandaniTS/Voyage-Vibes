"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button, Card, CardBody } from "@heroui/react";
// import { useLogout } from "@repo/frontend-sdk";

export default function TravellerPage() {
  const router = useRouter();
  // const logout = useLogout();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    // logout();
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-4xl font-bold">Welcome Traveller!</h1>
          <Button onClick={handleLogout} variant="bordered">
            Logout
          </Button>
        </div>
        
        <Card>
          <CardBody className="p-8">
            <h2 className="text-2xl font-bold mb-4">Explore Amazing Destinations</h2>
            <p className="text-muted-foreground mb-6">
              Your traveller dashboard is coming soon. Here you'll be able to browse packages, 
              manage bookings, and plan your next adventure.
            </p>
            <Button color="primary">Browse Packages</Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
