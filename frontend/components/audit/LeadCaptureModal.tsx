'use client';

import React, { useState } from 'react';
import { auditApi } from '@/lib/api/audit.api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Share2, Download, Check, Copy, Sparkles, Lock } from 'lucide-react';

interface LeadCaptureModalProps {
  shareSlug: string;
  teamSize: number;
}

export function LeadCaptureModal({ shareSlug, teamSize }: LeadCaptureModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/share/${shareSlug}`
      : `http://localhost:3000/share/${shareSlug}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid corporate email address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await auditApi.captureLead({
        shareSlug,
        email,
        companyName: companyName || undefined,
        role: role || undefined,
        teamSize,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to capture lead details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => setOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" /> Share Report & Unlock PDF Link
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-zinc-950 border border-zinc-800 text-zinc-100 sm:max-w-md rounded-2xl shadow-2xl p-6">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Executive Sharing Portal
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              Unlock Shareable Link & Executive Summary
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Enter your corporate email to generate a permanent shareable executive link (`/share/${shareSlug}`) for your CFO or Engineering Leadership team.
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="py-6 space-y-6 text-center">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-base">Report Unlocked & Saved!</h4>
                <p className="text-xs text-zinc-400">
                  Your permanent executive report URL is ready for distribution.
                </p>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="bg-transparent text-xs text-zinc-300 w-full focus:outline-none font-mono"
                />
                <Button
                  size="sm"
                  onClick={handleCopyLink}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1 flex items-center gap-1.5 shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="border-zinc-700 text-zinc-300"
                >
                  Close & View Dashboard
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Work Email (Required) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="vp.engineering@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  placeholder="Acme Technologies Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Your Role
                </label>
                <input
                  type="text"
                  placeholder="VP of Engineering / CFO / Lead Architect"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  Unlock & Generate Shareable URL
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
