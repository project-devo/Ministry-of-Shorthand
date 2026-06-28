"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast.success("Message Sent", {
        description: "We've received your inquiry and will get back to you shortly.",
      });
      reset();
      setValue("interest", ""); // Reset select manually
    } catch (error) {
      toast.error("Error", {
        description: "There was a problem sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" {...register("name", { required: true })} placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" {...register("email", { required: true })} placeholder="john@example.com" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" {...register("phone")} placeholder="+91 98765 43210" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interest">Area of Interest</Label>
          <Select onValueChange={(val: string | null) => val && setValue("interest", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="practice_pass">Practice Pass Subscription</SelectItem>
              <SelectItem value="video_courses">Video Courses</SelectItem>
              <SelectItem value="institute_bulk">Bulk Enrollment for Institute</SelectItem>
              <SelectItem value="technical_support">Technical Support</SelectItem>
              <SelectItem value="other">Other Inquiry</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Your Message</Label>
        <Textarea 
          id="message" 
          rows={5} 
          {...register("message", { required: true })} 
          placeholder="How can we help you?"
        />
      </div>
      
      <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
        {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
      </Button>
    </form>
  );
}
