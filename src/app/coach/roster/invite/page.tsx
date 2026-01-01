"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/trackverse/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  UserPlus,
  Mail,
  Copy,
  Check,
  QrCode,
  Link as LinkIcon,
  Send,
  Users,
  Share2,
} from "lucide-react";

export default function InviteAthletesPage() {
  const [emails, setEmails] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invitesSent, setInvitesSent] = useState(false);

  const classCode = "LHS-TF-2025";
  const inviteLink = `https://trackverse.app/join/${classCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(classCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvites = async () => {
    setIsLoading(true);
    // TODO: Send invites via API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setInvitesSent(true);
    setEmails("");
  };

  const emailCount = emails.split(/[,\n]/).filter(e => e.trim()).length;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Link href="/coach/roster" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to Roster
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-4">
            <UserPlus className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold text-orange-400">INVITE ATHLETES</span>
          </div>
          <h1 className="text-4xl font-black mb-2">GROW YOUR TEAM 🚀</h1>
          <p className="text-white/60">Invite athletes to join your team on TrackVerse</p>
        </div>

        {/* Success Message */}
        {invitesSent && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center gap-3">
            <Check className="h-5 w-5 text-green-500" />
            <p className="text-green-400 font-semibold">Invitations sent successfully!</p>
          </div>
        )}

        {/* Class Code */}
        <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30 mb-6">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-white/60 mb-2">Team Class Code</p>
              <div className="flex items-center justify-center gap-4">
                <p className="text-4xl font-black font-mono tracking-wider text-white">{classCode}</p>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyCode}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-white/50 mt-3">
                Athletes can enter this code at <span className="text-orange-400">trackverse.app/join</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Invite Methods */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Share Link */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-blue-500" />
                Invite Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="bg-white/5 border-white/10 text-white text-sm font-mono"
                />
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 flex-shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <QrCode className="h-5 w-5 text-purple-500" />
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-black" />
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-2">Scan to join</p>
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                    Download QR
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Invites */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-orange-500" />
              Email Invitations
            </CardTitle>
            <CardDescription className="text-white/60">
              Send direct invitations to athletes via email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white/80">Email Addresses</label>
              <Textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="Enter email addresses (one per line or comma-separated)&#10;athlete1@school.edu&#10;athlete2@school.edu"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[120px] font-mono"
              />
              {emailCount > 0 && (
                <p className="text-sm text-white/50">{emailCount} email{emailCount !== 1 ? 's' : ''} entered</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white/80">Personal Message (optional)</label>
              <Textarea
                placeholder="Add a personal message to your invitation..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>

            <Button
              onClick={handleSendInvites}
              disabled={emailCount === 0 || isLoading}
              className="w-full btn-track text-white font-bold"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send {emailCount > 0 ? `${emailCount} ` : ''}Invitation{emailCount !== 1 ? 's' : ''}
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Pending Invites */}
        <Card className="bg-white/5 border-white/10 mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-yellow-500" />
              Pending Invitations
              <span className="ml-auto px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold">
                3
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { email: "newathlete1@school.edu", sent: "2 days ago" },
              { email: "newathlete2@school.edu", sent: "3 days ago" },
              { email: "newathlete3@school.edu", sent: "5 days ago" },
            ].map((invite, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <p className="font-mono text-white text-sm">{invite.email}</p>
                  <p className="text-xs text-white/50">Sent {invite.sent}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-orange-400 hover:text-orange-300">
                    Resend
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
