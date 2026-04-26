# Healix — Real-time Patient System

Real-time patient registration form with a live staff monitoring dashboard.
Patients fill in a multi-step form; staff see every keystroke appear instantly on a shared dashboard via Supabase Realtime Broadcast.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** (App Router, React 19) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui |
| Forms | React Hook Form + Zod 4 validation |
| Database | Supabase   |
| Real-time | Supabase Realtime Broadcast |


---

## Project Structure

```
healix-app/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout — fonts, metadata
│   ├── page.tsx                  # Landing / hero page
│   ├── globals.css               # Tailwind config + design tokens (oklch)
│   ├── patient/
│   │   └── page.tsx              # Patient form page (renders PatientForm)
│   └── staff/
│       └── page.tsx              # Staff dashboard (Server Component, fetches initial data)
│
├── features/                     # Feature-sliced modules
│   ├── patient/
│   │   ├── PatientForm.tsx       # Multi-step form orchestrator (client)
│   │   ├── PatientSuccess.tsx    # Success confirmation screen
│   │   ├── actions.ts            # Server Actions — submit form, fetch patients
│   │   ├── patient.schema.ts     # Zod validation schema + inferred type
│   │   ├── types.ts              # Shared form prop types (PatientStepFormProps)
│   │   └── form/
│   │       ├── StepProgress.tsx  # Step indicator with animated connector
│   │       ├── InformationPatient.tsx  # Step 1 — personal info fields
│   │       ├── ContactPatient.tsx      # Step 2 — phone, email, address
│   │       └── EmergencyContactPatient.tsx  # Step 3 — emergency contact
│   └── staff/
│       ├── StaffDashboard.tsx    # Live dashboard with stat bar + card grid
│       ├── PatientCard.tsx       # Summary card per patient session
│       ├── PatientDetailSheet.tsx # Side-sheet with all field values
│       └── StatusIndicator.tsx   # Colored dot + label for session status
│
├── hooks/
│   ├── usePatientBroadcast.ts    # Patient-side: broadcasts form changes
│   └── usePatientSubscription.ts # Staff-side: subscribes to broadcast events
│
├── components/ui/                # shadcn/ui (button, card, sheet, etc.)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client (createBrowserClient)
│   │   └── server.ts             # Server Supabase client (cookie-based)
│   └── utils.ts                  # utils function
│
├── types/
│   ├── patient.ts                # PatientFormData, PatientSession, PatientStatus
│   └── database.ts               # PatientRow (Supabase table shape)
│
├── proxy.ts                      # Middleware-style auth proxy (refreshes Supabase session)
├── next.config.ts               
├── components.json               # shadcn/ui config
└── package.json
```

---

## Design Decisions

### 1. Project Structure with Feature-Sliced Architecture

Code is grouped by **domain feature** (`features/patient/`, `features/staff/`) rather than by technical role.
Each feature folder is self-contained: components, server actions, schemas.
Shared primitives go in `components/ui/`; shared hooks go in `hooks/`.

### 2. Multi-Step Form with React Hook Form

The patient form is split into 3 steps, each rendered by a dedicated component receiving only `control`:

| Step | Component | Fields |
|---|---|---|
| Patient Info | `InformationPatient` | first/middle/last name, DOB, gender, language, nationality, religion |
| Contact | `ContactPatient` | phone, email, address |
| Emergency | `EmergencyContactPatient` | emergency contact name, relationship |

Validation is triggered per step, using Zod schema as the single source of truth.

### 3. Supabase Realtime Broadcast 

Supabase Realtime Broadcast is used to stream real-time form updates from patients to the staff dashboard.

- **Free tier friendly** — sufficient for prototyping and small-scale production without additional infrastructure setup.
- **Easy to integrate** — simple client libraries and clear documentation enable rapid development.
- **Built-in realtime support** — Realtime Broadcast allows streaming form updates instantly without managing a custom WebSocket server.

### 5. Status State

Patient sessions cycle through four statuses:

```
typing  ──(10s no activity)──▶  idle
typing  ──(form submitted)───▶  submitted
typing  ──(tab closed)───────▶  disconnected
idle    ──(60s no activity)──▶  disconnected (staff-side cleanup)

```

---

## Real-time Data Flow

Both sides communicate through Supabase Realtime Broadcast on channel `"patient-intake"`.

### Patient Side (`usePatientBroadcast`)

1. Patient types or selects a value in the form
2. `useWatch()` detects the change
3. Wait 500ms debounce, then send via `channel.send()` to Supabase
4. When a new field is focused → broadcast immediately with `activeField` (throttled: skip if same field within 300ms)
5. No activity for 10 seconds → broadcast status `"idle"`
6. Submit button pressed → Server Action saves to DB → broadcast `"submitted"`
7. Tab closed → broadcast `"disconnected"` and remove channel

### Staff Side (`usePatientSubscription`)

1. On mount, subscribe to the `"patient-intake"` channel using `supabase.channel().on("broadcast").subscribe()`
2. The initial patient list is fetched server-side via `getSubmittedPatients()` and seeded into `sessionsRef` Map
3. When a broadcast payload arrives, upsert it into `sessionsRef` Map by `sessionId`
4. Call `syncState()` to sort sessions (typing → idle → submitted → disconnected) and trigger re-render
5. Every 10 seconds, run a stale-session cleanup:
   - `typing` with no message for > 30s → mark as `idle`
   - Any non-submitted session inactive for > 60s → mark as `disconnected`
   - `disconnected` for > 120s → remove from Map
6. On unmount, unsubscribe and remove the channel

### Broadcast Payload

```ts
{
  sessionId: string               // UUID v4 
  formData: Partial<PatientFormData>
  activeField: string | null      //  "first_name"
  status: "typing" | "idle" | "submitted" | "disconnected"
  lastActivity: string            // ISO timestamp
}
```

---

## Component Architecture

```
app/layout.tsx
├── app/page.tsx .......................... Landing (Server Component)
│
├── app/patient/page.tsx .................. Patient route (Server Component shell)
│   └── PatientForm ....................... Client — form orchestrator
│       ├── usePatientBroadcast() ........ Hook — manages broadcast channel
│       ├── StepProgress ................. Step indicator bar
│       ├── InformationPatient ........... Step 0 fields
│       ├── ContactPatient ............... Step 1 fields
│       ├── EmergencyContactPatient ...... Step 2 fields
│       └── PatientSuccess ............... Post-submit confirmation
│
└── app/staff/page.tsx .................... Staff route (async Server Component)
    └── StaffDashboard ................... Client — live dashboard
        ├── usePatientSubscription() ..... Hook — listens to broadcast
        ├── PatientCard .................. Per-patient summary card
        │   └── StatusIndicator .......... Status dot + label
        └── PatientDetailSheet ........... Side-sheet with full detail
            └── StatusIndicator
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A Supabase project with a `patients` table matching `PatientRow` in `types/database.ts`

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### Run

```bash
npm install
npm run dev
```

- **Patient form** → [http://localhost:3000/patient](http://localhost:3000/patient)
- **Staff dashboard** → [http://localhost:3000/staff](http://localhost:3000/staff)

Open both in separate tabs/devices to see real-time updates.

---

## Database Schema

The Supabase `patients` table:

| Column | Type | Nullable |
|---|---|---|
| `id` | uuid (PK) | no |
| `first_name` | text | no |
| `last_name` | text | no |
| `middle_name` | text | yes |
| `date_of_birth` | text | no |
| `gender` | text | no |
| `phone_number` | text | no |
| `email` | text | no |
| `address` | text | no |
| `preferred_language` | text | no |
| `nationality` | text | no |
| `emergency_contact_name` | text | yes |
| `emergency_contact_relationship` | text | yes |
| `religion` | text | yes |
| `created_at` | timestamptz | no (default `now()`) |
