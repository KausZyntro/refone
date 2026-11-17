"use client";

import { useEffect } from "react";

const TEXT_INPUT_TYPES = new Set([
  "text",
  "search",
  "email",
  "tel",
  "url",
  "number",
]);

const isTextInput = (el: HTMLInputElement) => TEXT_INPUT_TYPES.has(el.type);

/**
 * Strips leading whitespace from text inputs and textareas across the app.
 * Runs in the capture phase, before React's onChange handler, so the
 * controlled value is updated with the trimmed string.
 */
export default function PreventLeadingSpaces() {
  useEffect(() => {
    const trimLeading = (el: HTMLInputElement | HTMLTextAreaElement) => {
      const original = el.value;
      const trimmed = original.replace(/^\s+/, "");
      if (trimmed === original) return;

      const removed = original.length - trimmed.length;
      const start = el.selectionStart ?? trimmed.length;
      const end = el.selectionEnd ?? trimmed.length;

      const proto =
        el instanceof HTMLTextAreaElement
          ? HTMLTextAreaElement.prototype
          : HTMLInputElement.prototype;
      const valueSetter = Object.getOwnPropertyDescriptor(proto, "value")?.set;

      // Use the native setter so React's value tracker registers the change.
      valueSetter?.call(el, trimmed);

      try {
        el.setSelectionRange(
          Math.max(0, start - removed),
          Math.max(0, end - removed)
        );
      } catch {
        // Some input types (e.g. number) do not support selection ranges.
      }
    };

    const handleInput = (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && isTextInput(target)) {
        trimLeading(target);
      } else if (target instanceof HTMLTextAreaElement) {
        trimLeading(target);
      }
    };

    document.addEventListener("input", handleInput, true);
    return () => document.removeEventListener("input", handleInput, true);
  }, []);

  return null;
}
