"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, updatePassword } from "@/app/(storefront)/account/(dashboard)/details/actions";

export default function AccountDetailsForm({
  email,
  fullName,
}: {
  email: string;
  fullName: string;
}) {
  const [name, setName] = useState(fullName);
  const [profileStatus, setProfileStatus] = useState<"idle" | "saved" | "error">("idle");
  const [profileError, setProfileError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "saved" | "error">("idle");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus("idle");
    setProfileError(null);
    startTransition(async () => {
      const res = await updateProfile({ full_name: name });
      if (!res.ok) {
        setProfileStatus("error");
        setProfileError(res.error ?? "Something went wrong.");
        return;
      }
      setProfileStatus("saved");
      router.refresh();
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus("idle");
    setPasswordError(null);
    if (password.length < 8) {
      setPasswordStatus("error");
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordStatus("error");
      setPasswordError("Passwords don't match.");
      return;
    }
    startTransition(async () => {
      const res = await updatePassword(password);
      if (!res.ok) {
        setPasswordStatus("error");
        setPasswordError(res.error ?? "Something went wrong.");
        return;
      }
      setPasswordStatus("saved");
      setPassword("");
      setConfirmPassword("");
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleProfileSubmit} className="card flex flex-col gap-3 p-5">
        <h3 className="font-display text-sm font-bold text-ink">Profile</h3>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink-soft">Full name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-lg border border-line px-3 py-2 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink-soft">Email</span>
          <input
            value={email}
            disabled
            className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink-faint"
          />
          <span className="text-xs text-ink-faint">Contact support to change your email.</span>
        </label>

        {profileStatus === "saved" && (
          <p className="text-xs font-medium text-green-700">Profile updated.</p>
        )}
        {profileStatus === "error" && <p className="text-xs text-red-600">{profileError}</p>}

        <button type="submit" disabled={isPending} className="btn-primary self-start px-5 py-2.5 text-xs">
          {isPending ? "Saving…" : "Save Changes"}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="card flex flex-col gap-3 p-5">
        <h3 className="font-display text-sm font-bold text-ink">Change Password</h3>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink-soft">New password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-lg border border-line px-3 py-2 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink-soft">Confirm new password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="rounded-lg border border-line px-3 py-2 text-sm"
          />
        </label>

        {passwordStatus === "saved" && (
          <p className="text-xs font-medium text-green-700">Password updated.</p>
        )}
        {passwordStatus === "error" && <p className="text-xs text-red-600">{passwordError}</p>}

        <button type="submit" disabled={isPending} className="btn-primary self-start px-5 py-2.5 text-xs">
          {isPending ? "Updating…" : "Update Password"}
        </button>
      </form>
    </div>
  );
}
