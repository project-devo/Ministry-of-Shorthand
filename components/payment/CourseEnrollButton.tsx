"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const loadRazorpayScript = async () => {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.Razorpay) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const CourseEnrollButton = ({
  courseId,
  courseSlug,
  description,
  isAuthenticated,
  isEnrolled,
  isFree,
  price,
  userEmail,
  userName,
}: {
  courseId: string;
  courseSlug: string;
  description: string;
  isAuthenticated: boolean;
  isEnrolled: boolean;
  isFree: boolean;
  price: number;
  userEmail?: string | null;
  userName?: string | null;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const redirectToLogin = () => {
    router.push(`/login?callbackUrl=/courses/${courseSlug}`);
  };

  const handleFreeEnrollment = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/payment/free-enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (!response.ok || !result.success) {
        toast.error(result.error ?? "Unable to enroll in this free course.");
        return;
      }

      toast.success("Enrollment successful.");
      router.push("/dashboard/courses");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to enroll.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaidEnrollment = async () => {
    try {
      setIsLoading(true);

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        toast.error("Unable to load Razorpay checkout.");
        return;
      }

      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "COURSE",
          courseId,
        }),
      });

      const orderResult = (await orderResponse.json()) as {
        success: boolean;
        data?: {
          amount: number;
          currency: string;
          orderId: string;
          keyId: string;
        };
        error?: string;
      };

      if (!orderResponse.ok || !orderResult.success || !orderResult.data) {
        toast.error(orderResult.error ?? "Unable to create payment order.");
        return;
      }

      const razorpay = new window.Razorpay({
        key: orderResult.data.keyId,
        amount: orderResult.data.amount,
        currency: orderResult.data.currency,
        name: "Ministry of Shorthand",
        description,
        order_id: orderResult.data.orderId,
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#ef7d5d",
        },
        handler: async (response) => {
          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
          });

          const verifyResult = (await verifyResponse.json()) as {
            success: boolean;
            error?: string;
          };

          if (!verifyResponse.ok || !verifyResult.success) {
            toast.error(verifyResult.error ?? "Payment verification failed.");
            return;
          }

          toast.success("Payment successful and enrollment activated.");
          router.push("/dashboard/courses");
          router.refresh();
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      });

      razorpay.open();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to start payment.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <Button type="button" onClick={() => router.push("/dashboard/courses")}>
        Go to my courses
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={() => {
        if (!isAuthenticated) {
          redirectToLogin();
          return;
        }

        if (isFree || price <= 0) {
          void handleFreeEnrollment();
          return;
        }

        void handlePaidEnrollment();
      }}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
      {isFree || price <= 0 ? "Enroll for free" : `Enroll for Rs. ${price}`}
    </Button>
  );
};
