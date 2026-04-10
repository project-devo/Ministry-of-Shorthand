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

export const SubscriptionButton = ({
  isAuthenticated,
  isCurrentPlan,
  plan,
  price,
  userEmail,
  userName,
}: {
  isAuthenticated: boolean;
  isCurrentPlan: boolean;
  plan: "MONTHLY" | "ANNUAL";
  price: string;
  userEmail?: string | null;
  userName?: string | null;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);

      if (!isAuthenticated) {
        router.push("/login?callbackUrl=/pricing");
        return;
      }

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
          type: "SUBSCRIPTION",
          plan,
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
        toast.error(orderResult.error ?? "Unable to create subscription order.");
        return;
      }

      const razorpay = new window.Razorpay({
        key: orderResult.data.keyId,
        amount: orderResult.data.amount,
        currency: orderResult.data.currency,
        name: "Ministry of Shorthand",
        description: `${plan} subscription`,
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

          toast.success("Subscription activated successfully.");
          router.push("/dashboard/billing");
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
      const message = error instanceof Error ? error.message : "Unable to start subscription.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button type="button" onClick={() => void handleSubscribe()} disabled={isLoading || isCurrentPlan} className="w-full">
      {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
      {isCurrentPlan ? `Current plan (${price})` : `Subscribe ${price}`}
    </Button>
  );
};
