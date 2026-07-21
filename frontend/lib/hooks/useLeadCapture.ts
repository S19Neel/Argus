"use client";

import { useState, useCallback } from "react";
import { auditApi } from "@/lib/api/audit.api";
import { toast } from "sonner";
import type { ApiErrorResponse } from "@/types/audit.types";

export function useLeadCapture(
  shareSlug: string,
  teamSize: number,
): {
  open: boolean;
  setOpen: (open: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  role: string;
  setRole: (role: string) => void;
  honeypot: string;
  setHoneypot: (hp: string) => void;
  loading: boolean;
  submitted: boolean;
  setSubmitted: (submitted: boolean) => void;
  copied: boolean;
  shareUrl: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCopyLink: () => void;
} {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/share/${shareSlug}`
      : `http://localhost:3000/share/${shareSlug}`;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !email.includes("@")) {
        toast.error("Please enter a valid corporate email address.");
        return;
      }

      setLoading(true);

      try {
        await auditApi.captureLead({
          shareSlug,
          email,
          companyName: companyName || undefined,
          role: role || undefined,
          teamSize,
          _honeypot: honeypot || undefined,
        });
        setSubmitted(true);
        toast.success("Report unlocked successfully!", {
          description: "Your shareable executive URL is ready.",
        });
      } catch (err: unknown) {
        const errorObj = err as ApiErrorResponse | Error;
        const msg =
          errorObj.message ||
          (errorObj as ApiErrorResponse).error ||
          "Please try again.";
        toast.error("Failed to capture lead details", {
          description: msg,
        });
      } finally {
        setLoading(false);
      }
    },
    [email, companyName, role, honeypot, shareSlug, teamSize],
  );

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  }, [shareUrl]);

  return {
    open,
    setOpen,
    email,
    setEmail,
    companyName,
    setCompanyName,
    role,
    setRole,
    honeypot,
    setHoneypot,
    loading,
    submitted,
    setSubmitted,
    copied,
    shareUrl,
    handleSubmit,
    handleCopyLink,
  };
}
