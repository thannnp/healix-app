"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PatientSession } from "@/types/patient";

const CHANNEL_NAME = "patient-intake";
const BROADCAST_EVENT = "patient-update";
const STALE_CHECK_INTERVAL_MS = 10_000;
const IDLE_THRESHOLD_MS = 30_000;
const DISCONNECT_THRESHOLD_MS = 60_000;

export function usePatientSubscription() {
  const [patients, setPatients] = useState<PatientSession[]>([]);
  const sessionsRef = useRef<Map<string, PatientSession>>(new Map());

  const syncState = useCallback(() => {
    const sorted = Array.from(sessionsRef.current.values()).sort((a, b) => {
      // typing first, then idle, submitted, disconnected
      const order = { typing: 0, idle: 1, submitted: 2, disconnected: 3 };
      const diff = order[a.status] - order[b.status];
      if (diff !== 0) return diff;
      return (
        new Date(b.lastActivity).getTime() -
        new Date(a.lastActivity).getTime()
      );
    });
    setPatients(sorted);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(CHANNEL_NAME);

    channel
      .on("broadcast", { event: BROADCAST_EVENT }, ({ payload }) => {
        const session = payload as PatientSession;
        if (!session.sessionId) return;

        if (session.status === "disconnected") {
          // Keep the session visible for a while but mark it disconnected
          const existing = sessionsRef.current.get(session.sessionId);
          if (existing) {
            sessionsRef.current.set(session.sessionId, {
              ...existing,
              status: "disconnected",
              activeField: null,
              lastActivity: session.lastActivity,
            });
          }
        } else {
          sessionsRef.current.set(session.sessionId, session);
        }

        syncState();
      })
      .subscribe();

    // Periodic stale-session check
    const interval = setInterval(() => {
      const now = Date.now();
      let changed = false;

      sessionsRef.current.forEach((session, id) => {
        const age = now - new Date(session.lastActivity).getTime();

        if (session.status === "disconnected" && age > DISCONNECT_THRESHOLD_MS * 2) {
          // Remove sessions that have been disconnected for a long time
          sessionsRef.current.delete(id);
          changed = true;
        } else if (
          session.status !== "submitted" &&
          session.status !== "disconnected" &&
          age > DISCONNECT_THRESHOLD_MS
        ) {
          sessionsRef.current.set(id, {
            ...session,
            status: "disconnected",
            activeField: null,
          });
          changed = true;
        } else if (
          session.status === "typing" &&
          age > IDLE_THRESHOLD_MS
        ) {
          sessionsRef.current.set(id, {
            ...session,
            status: "idle",
            activeField: null,
          });
          changed = true;
        }
      });

      if (changed) syncState();
    }, STALE_CHECK_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [syncState]);

  return patients;
}
