"use client";

import { updateMasterPassword } from "@/app/actions/users";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";

export function MasterPasswordForm() {
  const [state, formAction] = useFormState(updateMasterPassword, null as { error?: string; success?: boolean } | null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!state?.success) return;
    setShowSuccess(true);
    const t = setTimeout(() => setShowSuccess(false), 2500);
    return () => clearTimeout(t);
  }, [state?.success]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="username" value="Abaan" />
      {state?.error && (
        <div className="rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-2">
          {state.error}
        </div>
      )}
      {showSuccess && (
        <div className="rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm px-3 py-2">
          Master password updated successfully!
        </div>
      )}
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-1.5">
          New Password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          className="w-full max-w-md rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter new password"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Update Password
      </button>
    </form>
  );
}
