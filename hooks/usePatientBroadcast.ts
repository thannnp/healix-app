"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useWatch, type Control } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import type { PatientSchema } from "@/features/patient/patient.schema";
import type { PatientFormData, PatientStatus } from "@/types/patient";
import { v4 as uuidv4 } from "uuid";

const CHANNEL_NAME = "patient-intake";
const BROADCAST_EVENT = "patient-update";
const DEBOUNCE_MS = 500; // 500ms
const IDLE_TIMEOUT_MS = 10000; // 10 seconds
const FOCUS_THROTTLE_MS = 300; // min interval between focus broadcasts

export function usePatientBroadcast(control: Control<PatientSchema>) {
  const [sessionId] = useState(() => uuidv4());

  const channelRef = useRef<ReturnType<
    ReturnType<typeof createClient>["channel"]
  > | null>(null);

  const statusRef = useRef<PatientStatus>("idle");
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeFieldRef = useRef<string | null>(null);
  const lastFocusBroadcastRef = useRef<number>(0);

  const formValues = useWatch({ control });
  const formValuesRef = useRef(formValues);

  const resolveFieldKey = (el: Element): string | null => {
    const id =
      (el as HTMLInputElement).name ||
      el.id ||
      el.getAttribute("data-field") ||
      "";
    // ids follow the pattern "form-first-name" → strip "form-"
    const key = id.replace(/^form-/, "").replace(/-/g, "_");
    const validKeys: (keyof PatientFormData)[] = [
      "first_name",
      "middle_name",
      "last_name",
      "date_of_birth",
      "gender",
      "phone_number",
      "email",
      "address",
      "preferred_language",
      "nationality",
      "emergency_contact_name",
      "emergency_contact_relationship",
      "religion",
    ];
    return validKeys.includes(key as keyof PatientFormData) ? key : null;
  };

  // ---- helpers send broadcast messages ----
  const broadcast = useCallback(
    (overrides?: { status?: PatientStatus; activeField?: string }) => {
      const channel = channelRef.current;
      if (!channel) return;

      const payload = {
        sessionId,
        formData: formValuesRef.current as Partial<PatientFormData>,
        activeField: overrides?.activeField ?? null,
        status: overrides?.status ?? statusRef.current,
        lastActivity: new Date().toISOString(),
      };

      channel.send({
        type: "broadcast",
        event: BROADCAST_EVENT,
        payload: payload,
      });
    },
    [sessionId],
  );

  // reset idle timer
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    statusRef.current = "typing";
    idleTimerRef.current = setTimeout(() => {
      statusRef.current = "idle";
      broadcast({ status: "idle" });
    }, IDLE_TIMEOUT_MS);
  }, [broadcast]);

  // ---- channel lifecycle ----
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(CHANNEL_NAME);

    channelRef.current = channel;

    channel.subscribe();

    // disconnect handler when unmounting
    return () => {
      // Notify peers of disconnect before unsubscribing
      channel.send({
        type: "broadcast",
        event: BROADCAST_EVENT,
        payload: {
          sessionId,
          formData: {},
          activeField: null,
          status: "disconnected" as PatientStatus,
          lastActivity: new Date().toISOString(),
        },
      });

      supabase.removeChannel(channel);
      channelRef.current = null;

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [sessionId]);

  // ---- debounced broadcast on form value changes ----
  useEffect(() => {
    formValuesRef.current = formValues; // sync new values

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      resetIdleTimer();
      broadcast();
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [formValues, broadcast, resetIdleTimer]);

  // ---- focus / blur handlers (event delegation) ----
  const handleFocusCapture = useCallback(
    (e: React.FocusEvent) => {
      const key = resolveFieldKey(e.target);
      if (!key) return;

      const now = Date.now();
      const isSameField = key === activeFieldRef.current;
      const isTooSoon = now - lastFocusBroadcastRef.current < FOCUS_THROTTLE_MS;

      if (isSameField && isTooSoon) return;

      activeFieldRef.current = key;
      lastFocusBroadcastRef.current = now;
      resetIdleTimer();
      broadcast({ activeField: key });
    },
    [broadcast, resetIdleTimer],
  );

  // ---- called after successful submit ----
  const broadcastSubmitted = useCallback(() => {
    statusRef.current = "submitted";
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    broadcast({ status: "submitted" });
  }, [broadcast]);

  return {
    sessionId,
    broadcastSubmitted,
    handleFocusCapture,
  };
}
