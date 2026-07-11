"use client";

import {
  MOCK_COMPETITORS,
  MOCK_LEDGER,
  MOCK_LEADS,
  MOCK_PROFILE,
  MOCK_TRANSACTIONS,
} from "@/lib/mock-data";
import type {
  Competitor,
  Lead,
  Platform,
  Profile,
  ProfileInput,
  Transaction,
  BillingEntry,
} from "@/lib/types";

export type {
  Competitor,
  Lead,
  Platform,
  Profile,
  ProfileInput,
  Transaction,
  BillingEntry,
};

// Frontend-only data adapter. When NEXT_PUBLIC_SUPABASE_URL is set, the
// backend can be wired up by replacing the bodies below with real Supabase
// queries. For now everything reads/writes against in-memory mock state so the
// whole UX flow can be exercised end-to-end on the client.

const HAS_SUPABASE = Boolean(
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_SUPABASE_URL
);

export const DEMO_MODE_TEXT = HAS_SUPABASE
  ? "Mode: Supabase"
  : "Mode: Demo (mock data)";

let competitorsStore: Competitor[] = [...MOCK_COMPETITORS];
let leadsStore: Lead[] = [...MOCK_LEADS];
let profileStore: Profile = { ...MOCK_PROFILE };
const ledgerStore: BillingEntry[] = [...MOCK_LEDGER];
const transactionsStore: Transaction[] = [...MOCK_TRANSACTIONS];

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function getProfile(): Promise<Profile> {
  await delay(150);
  return { ...profileStore };
}

export async function saveProfile(input: ProfileInput): Promise<Profile> {
  await delay(400);
  profileStore = {
    ...profileStore,
    ...input,
    onboarding_completed: true,
  };
  return { ...profileStore };
}

export async function listCompetitors(platform: Platform): Promise<Competitor[]> {
  await delay(200);
  return competitorsStore.filter((c) => c.platform === platform);
}

export async function addCompetitor(
  data: Pick<Competitor, "competitor_name" | "platform" | "search_query">
): Promise<Competitor> {
  await delay(300);
  const competitor: Competitor = {
    id: uid("comp"),
    profile_id: profileStore.id,
    competitor_name: data.competitor_name,
    platform: data.platform,
    search_query: data.search_query,
    is_active: true,
    created_at: new Date().toISOString(),
  };
  competitorsStore = [competitor, ...competitorsStore];
  return competitor;
}

export async function deleteCompetitor(id: string): Promise<void> {
  await delay(200);
  competitorsStore = competitorsStore.filter((c) => c.id !== id);
}

export async function toggleCompetitor(id: string): Promise<void> {
  await delay(150);
  competitorsStore = competitorsStore.map((c) =>
    c.id === id ? { ...c, is_active: !c.is_active } : c
  );
}

export async function listLeads(
  platform: Platform,
  filter: "PENDING" | "ALL" = "PENDING"
): Promise<Lead[]> {
  await delay(350);
  const list = leadsStore
    .filter((l) => l.platform === platform)
    .filter((l) => (filter === "PENDING" ? l.status === "PENDING" : true))
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  return list;
}

export async function updateLeadDraft(id: string, draft: string): Promise<void> {
  await delay(120);
  leadsStore = leadsStore.map((l) =>
    l.id === id ? { ...l, gate_2_generated_reply: draft } : l
  );
}

export async function markLeadReplied(id: string): Promise<void> {
  await delay(200);
  leadsStore = leadsStore.map((l) =>
    l.id === id ? { ...l, status: "REPLIED" } : l
  );
}

export interface BillingStatus {
  credit_balance: number;
  free_demo_credits_remaining: number;
  free_demo_reset_at: string;
  leads_this_week: number;
  leads_replied_total: number;
}

export async function getBillingStatus(): Promise<BillingStatus> {
  await delay(150);
  const leadsRepliedTotal = leadsStore.filter((l) => l.status === "REPLIED").length;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const leadsThisWeek = leadsStore.filter(
    (l) => +new Date(l.created_at) >= weekAgo
  ).length;
  return {
    credit_balance: profileStore.credit_balance,
    free_demo_credits_remaining: profileStore.free_demo_credits_remaining,
    free_demo_reset_at: profileStore.free_demo_reset_at,
    leads_this_week: leadsThisWeek,
    leads_replied_total: leadsRepliedTotal,
  };
}

export async function listLedger(): Promise<BillingEntry[]> {
  await delay(200);
  return [...ledgerStore].sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
  );
}

export async function listTransactions(): Promise<Transaction[]> {
  await delay(200);
  return [...transactionsStore].sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
  );
}

export async function createTopUp(amountUsd: number): Promise<{ redirectUrl: string; orderId: string }> {
  await delay(500);
  // Real backend: POST /api/billing/topup → returns Midtrans Snap token.
  void amountUsd;
  const orderId = `undercut-${Date.now()}`;
  return {
    redirectUrl: `https://app.midtrans.com/snap/v3/redirection/${orderId}`,
    orderId,
  };
}

export function decrementDemoCredit() {
  if (profileStore.free_demo_credits_remaining > 0) {
    profileStore = {
      ...profileStore,
      free_demo_credits_remaining: profileStore.free_demo_credits_remaining - 1,
    };
  }
  return { ...profileStore };
}