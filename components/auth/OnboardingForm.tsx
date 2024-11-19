"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { saveUserData } from "@/app/actions/user";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@prisma/client";

const formSchema = z.object({
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export function OnboardingForm({
  user,
}: {
  user: {
    id: string;
    email: string;
    externalId: string;
    phoneNumber: string;
    name: string | null;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  };
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: user.phoneNumber || "",
      name: `${user.name}`.trim() || "",
      email: user.email || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await saveUserData({
        externalId: user.id,
        ...values,
      });
      if (result.success) {
        toast({
          title: "Profile completed",
          description: "Your profile has been successfully saved.",
        });
        router.push("/dashboard");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
      console.log("Error in onboarding Form: ", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={() => (
            <FormItem>
              <FormLabel className="font-medium">Phone Number</FormLabel>
              <FormControl>
                <Controller
                  name="phoneNumber"
                  control={form.control}
                  render={({ field }) => (
                    <PhoneInput
                      className="border p-1 shadow rounded-md focus:border-none"
                      international
                      countryCallingCodeEditable={false}
                      defaultCountry="US"
                      {...field}
                    />
                  )}
                />
              </FormControl>
              <FormDescription>
                Please enter your phone number with country code.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>Please enter your full name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormDescription>
                Please confirm your email address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Complete Profile"}
        </Button>
      </form>
    </Form>
  );
}
