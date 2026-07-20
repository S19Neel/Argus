"use client";

import React, { useState, memo } from "react";
import { auditApi } from "@/lib/api/audit.api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Share2, Check, Copy, Sparkles, Lock } from "lucide-react";

interface LeadCaptureModalProps {
  shareSlug: string;
  teamSize: number;
}

export const LeadCaptureModal = memo(function LeadCaptureModal({
  shareSlug,
  teamSize,
}: LeadCaptureModalProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      toast.error("Failed to capture lead details", {
        description: err.message || "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            onClick={() => setOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Share Report & Unlock PDF Link
          </Button>
        </motion.div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[rgba(14,18,28,0.97)] border border-white/8 text-zinc-100 sm:max-w-md rounded-2xl shadow-2xl p-6 backdrop-blur-xl">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-[0.15em]">
              <Sparkles className="w-4 h-4" /> Executive Sharing Portal
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              Unlock Shareable Link & Executive Summary
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Enter your corporate email to generate a permanent shareable
              executive link (`/share/{shareSlug}`) for your CFO or Engineering
              Leadership team.
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="py-6 space-y-6 text-center"
              >
                <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-emerald-300 space-y-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  >
                    <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                  </motion.div>
                  <h4 className="font-bold text-base">
                    Report Unlocked & Saved!
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Your permanent executive report URL is ready for distribution.
                  </p>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg glass-card">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="bg-transparent text-xs text-zinc-400 w-full focus:outline-none font-mono"
                  />
                  <Button
                    size="sm"
                    onClick={handleCopyLink}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1 flex items-center gap-1.5 shrink-0"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="border-white/10 text-zinc-400"
                  >
                    Close & View Dashboard
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-4 pt-4"
              >
                <input
                  type="text"
                  name="_honeypot"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden sm:hidden opacity-0 pointer-events-none"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 block">
                    Work Email (Required) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vp.engineering@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-white/8 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 block">
                    Company / Organization Name
                  </label>
                  <input
                    type="text"
                    placeholder="Acme Technologies Inc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-white/8 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 block">
                    Your Role
                  </label>
                  <input
                    type="text"
                    placeholder="VP of Engineering / CFO / Lead Architect"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-white/8 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  />
                </div>

                <div className="pt-3">
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      Unlock & Generate Shareable URL
                    </Button>
                  </motion.div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
});
