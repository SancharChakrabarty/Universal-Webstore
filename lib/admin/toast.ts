"use client";

export type ToastType = "success" | "error";

export function showToast(message: string, type: ToastType = "success") {
  window.dispatchEvent(new CustomEvent("admin-toast", { detail: { message, type } }));
}
