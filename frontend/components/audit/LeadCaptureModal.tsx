"use client";

import { memo } from "react";
import { Lock, Sparkles, Copy, Check, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLeadCapture } from "@/lib/hooks/useLeadCapture";
import type { LeadCaptureModalProps } from "@/types/components.types";

export const LeadCaptureModal = memo(function LeadCaptureModal({
  shareSlug,
  teamSize,
}: LeadCaptureModalProps) {
  const {
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
    copied,
    shareUrl,
    handleSubmit,
    handleCopyLink,
  } = useLeadCapture(shareSlug, teamSize);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-heading font-bold text-sm h-11 px-6 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all gap-2" />
        }
      >
        <Lock className="w-4 h-4" />
        <span>Unlock &amp; Share Report</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-[#0e121c] border border-white/10 text-white shadow-2xl p-6">
        <DialogHeader className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <DialogTitle className="text-xl font-heading font-bold text-white tracking-tight">
            Unlock Shareable Link & Executive Summary
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm leading-relaxed">
            Enter your corporate email to generate a permanent shareable
            executive link (`/share/{shareSlug}`) for your CFO or Engineering
            Leadership team.
          </DialogDescription>
        </DialogHeader>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider">
                Work Email <span className="text-emerald-400">*</span>
              </label>
              <Input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#161d2d] border-white/10 text-white focus:ring-emerald-500 focus:border-emerald-500 h-11"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider">
                Company / Organization Name
                <span className="text-zinc-500 font-normal">(Optional)</span>
              </label>
              <Input
                type="text"
                placeholder="Acme Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-[#161d2d] border-white/10 text-white focus:ring-emerald-500 focus:border-emerald-500 h-11"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider">
                Role{" "}
                <span className="text-zinc-500 font-normal">(Optional)</span>
              </label>
              <Input
                type="text"
                placeholder="CTO, VP of Eng, Procurement..."
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-[#161d2d] border-white/10 text-white focus:ring-emerald-500 focus:border-emerald-500 h-11"
              />
            </div>

            {/* Honeypot field for anti-spam verification */}
            <div className="hidden">
              <label>Leave empty</label>
              <Input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-heading font-bold h-11 transition-all gap-2"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Generating Share URL...</span>
                  </div>
                ) : (
                  <>
                    <span>Generate Permanent Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            <p className="text-[11px] text-zinc-500 text-center font-mono">
              Zero spam guarantee. Used solely to secure report access.
            </p>
          </form>
        ) : (
          <div className="space-y-6 mt-4 py-2">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-4 h-4" />
              </div>
              <h4 className="font-heading font-semibold text-white">
                Shareable Report Unlocked
              </h4>
              <p className="text-xs text-zinc-400">
                Anyone with this link can view the complete AI stack audit and
                recommendations.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                Public Share URL
              </label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={shareUrl}
                  className="bg-[#161d2d] border-white/10 text-emerald-400 font-mono text-xs h-10"
                />
                <Button
                  type="button"
                  onClick={handleCopyLink}
                  className="bg-white/10 hover:bg-white/20 text-white h-10 px-3.5 shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                onClick={() => setOpen(false)}
                variant="outline"
                className="w-full border-white/10 text-white hover:bg-white/5 h-11 font-mono text-xs uppercase tracking-wider"
              >
                Close Modal
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});
