"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { TonePreview } from "@/components/onboarding/TonePreview";
import { Logo } from "@/components/ui/Logo";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { getProfile, saveProfile, type ProfileInput } from "@/lib/data";
import type { ToneOfVoice } from "@/lib/types";

const INITIAL: ProfileInput = {
  app_name: "",
  app_description: "",
  app_url: "",
  app_category: "",
  target_audience: "",
  tone_of_voice: "friendly",
  differentiators: {
    differentiator_1: "",
    differentiator_2: "",
    differentiator_3: "",
  },
  company_name: null,
};

const CATEGORIES = [
  "Productivity",
  "FinTech",
  "Social",
  "Health",
  "eCommerce",
  "Developer Tools",
  "Education",
  "Entertainment",
  "Other",
];

const TONES: { tone: ToneOfVoice; emoji: string; sample: string }[] = [
  { tone: "professional", emoji: "💼", sample: "Apologies for the disruption…" },
  { tone: "friendly", emoji: "🙌", sample: "Ouch, that's rough 🙌" },
  { tone: "casual", emoji: "💬", sample: "man that sucks…" },
  { tone: "playful", emoji: "🎭", sample: "eats gremlins for breakfast 😅" },
];

export default function OnboardingWizard({
  initial,
}: {
  initial?: ProfileInput & { onboarding_completed?: boolean };
}) {
  const isEdit = !!initial?.onboarding_completed;
  const [step, setStep] = useState(isEdit ? 0 : 1);
  const [form, setForm] = useState<ProfileInput>(
    initial
      ? { ...INITIAL, ...initial, company_name: initial.company_name ?? null }
      : INITIAL
  );
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!initial) {
      getProfile().then((p) => {
        if (p.onboarding_completed) {
          setForm({
            app_name: p.app_name,
            app_description: p.app_description,
            app_url: p.app_url,
            app_category: p.app_category,
            target_audience: p.target_audience,
            tone_of_voice: p.tone_of_voice,
            differentiators: p.differentiators,
            company_name: p.company_name,
          });
        }
      });
    }
  }, [initial]);

  const update = (k: keyof ProfileInput, v: unknown) =>
    setForm((p) => ({ ...p, [k]: v }));
  const updateDiff = (k: keyof ProfileInput["differentiators"], v: string) =>
    setForm((p) => ({
      ...p,
      differentiators: { ...p.differentiators, [k]: v },
    }));

  const canProceed = () => {
    if (step === 1)
      return (
        form.app_name.trim() &&
        form.app_description.trim() &&
        form.app_url.trim()
      );
    if (step === 2)
      return form.app_category && form.target_audience.trim();
    if (step === 3)
      return (
        form.differentiators.differentiator_1.trim() &&
        form.differentiators.differentiator_2.trim() &&
        form.differentiators.differentiator_3.trim()
      );
    return false;
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await saveProfile(form);
      toast.success("Profile saved — welcome aboard!");
      router.push("/dashboard/x");
    } catch {
      toast.error("Couldn't save profile");
      setSaving(false);
    }
  };

  const stepHeader = isEdit ? (
    <div className="mb-8 text-center">
      <h1 className="text-2xl font-bold text-text">Edit app profile</h1>
      <p className="mt-2 text-sm text-muted">
        Update anytime. New AI replies will use the latest context.
      </p>
    </div>
  ) : (
    <div className="mb-8 text-center">
      <h1 className="text-2xl font-bold text-text">Set up your app profile</h1>
      <p className="mt-2 text-sm text-muted">
        AI uses this context to draft personalized replies that sound like
        you, not a bot.
      </p>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <div className="mb-8">
        <Logo />
      </div>

      {stepHeader}

      {!isEdit && (
        <div className="mb-8 flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex-1">
              <motion.div
                animate={{
                  width: step >= n ? "100%" : "0%",
                }}
                transition={{ duration: 0.4 }}
                className="h-1 rounded-full bg-accent"
              />
            </div>
          ))}
        </div>
      )}

      {isEdit && (
        <div className="mb-8">
          <div className="grid gap-6">
            {/* All-in-one compact sections (since step==0 in edit mode) */}
            <Step1Fields form={form} update={update} />
            <Step2Fields form={form} update={update} />
            <Step3Fields form={form} update={update} updateDiff={updateDiff} />
            <TonePreview
              tone={form.tone_of_voice}
              appName={form.app_name || "MyApp"}
              differentiator={form.differentiators.differentiator_1}
            />
          </div>
          <div className="mt-8 flex justify-end">
            <Button onClick={handleFinish} disabled={saving} size="lg">
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Check size={16} /> Save changes
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {!isEdit && (
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.section
              key="s1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-bold text-text">App basics</h2>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted">
                  App name *
                </label>
                <Input
                  value={form.app_name}
                  onChange={(e) => update("app_name", e.target.value)}
                  placeholder="MyApp"
                  className="mt-2"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted">
                  App description *
                </label>
                <Textarea
                  value={form.app_description}
                  onChange={(e) => update("app_description", e.target.value)}
                  rows={3}
                  placeholder="What does it do, what problem does it solve (2-3 sentences)."
                  className="mt-2"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted">
                  App URL *
                </label>
                <Input
                  value={form.app_url}
                  onChange={(e) => update("app_url", e.target.value)}
                  placeholder="https://myapp.io"
                  className="mt-2"
                />
              </div>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section
              key="s2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-bold text-text">Audience</h2>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted">
                  Category *
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => update("app_category", c)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                        form.app_category === c
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border bg-surface-2 text-muted hover:text-text"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted">
                  Target audience *
                </label>
                <Textarea
                  value={form.target_audience}
                  onChange={(e) => update("target_audience", e.target.value)}
                  rows={3}
                  placeholder="Who uses your app? Be specific — indie devs, writers, students…"
                  className="mt-2"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted">
                  Company name (optional)
                </label>
                <Input
                  value={form.company_name ?? ""}
                  onChange={(e) =>
                    update("company_name", e.target.value || null)
                  }
                  placeholder="Solo Studio"
                  className="mt-2"
                />
              </div>
            </motion.section>
          )}

          {step === 3 && (
            <motion.section
              key="s3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-bold text-text">Tone & USP</h2>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted">
                  Tone of voice
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {TONES.map((t) => (
                    <button
                      key={t.tone}
                      onClick={() => update("tone_of_voice", t.tone)}
                      className={`rounded-xl border px-3 py-3 text-center transition-colors ${
                        form.tone_of_voice === t.tone
                          ? "border-accent bg-accent/10"
                          : "border-border bg-surface-2 hover:border-accent/40"
                      }`}
                    >
                      <div className="text-xl">{t.emoji}</div>
                      <div className="mt-1 text-xs font-semibold capitalize text-text">
                        {t.tone}
                      </div>
                      <div className="text-[10px] text-muted">{t.sample}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-muted">
                  3 differentiators (USP)
                </label>
                {(["differentiator_1", "differentiator_2", "differentiator_3"] as const).map(
                  (k, i) => (
                    <Input
                      key={k}
                      value={form.differentiators[k]}
                      onChange={(e) => updateDiff(k, e.target.value)}
                      placeholder={`Differentiator ${i + 1}`}
                    />
                  )
                )}
              </div>

              <div className="mt-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-accent">
                  ✨ Live preview
                </p>
                <TonePreview
                  tone={form.tone_of_voice}
                  appName={form.app_name}
                  differentiator={form.differentiators.differentiator_1}
                />
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      )}

      {!isEdit && (
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            <ArrowLeft size={16} /> Back
          </Button>
          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
            >
              Next <ArrowRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={saving || !canProceed()}>
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Check size={16} /> Finish & start monitoring
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function Step1Fields({
  form,
  update,
}: {
  form: ProfileInput;
  update: (k: keyof ProfileInput, v: unknown) => void;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h3 className="text-sm font-bold text-text">App basics</h3>
      <div className="mt-4 space-y-3">
        <Input
          value={form.app_name}
          onChange={(e) => update("app_name", e.target.value)}
          placeholder="App name"
        />
        <Textarea
          value={form.app_description}
          onChange={(e) => update("app_description", e.target.value)}
          rows={3}
          placeholder="App description"
        />
        <Input
          value={form.app_url}
          onChange={(e) => update("app_url", e.target.value)}
          placeholder="https://myapp.io"
        />
      </div>
    </section>
  );
}

function Step2Fields({
  form,
  update,
}: {
  form: ProfileInput;
  update: (k: keyof ProfileInput, v: unknown) => void;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h3 className="text-sm font-bold text-text">Audience</h3>
      <div className="mt-4 space-y-3">
        <Input
          value={form.app_category}
          onChange={(e) => update("app_category", e.target.value)}
          placeholder="Category (Productivity, FinTech…)"
        />
        <Textarea
          value={form.target_audience}
          onChange={(e) => update("target_audience", e.target.value)}
          rows={2}
          placeholder="Target audience description"
        />
        <Input
          value={form.company_name ?? ""}
          onChange={(e) => update("company_name", e.target.value || null)}
          placeholder="Company name (optional)"
        />
      </div>
    </section>
  );
}

function Step3Fields({
  form,
  update,
  updateDiff,
}: {
  form: ProfileInput;
  update: (k: keyof ProfileInput, v: unknown) => void;
  updateDiff: (
    k: keyof ProfileInput["differentiators"],
    v: string
  ) => void;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h3 className="text-sm font-bold text-text">Tone & USP</h3>
      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {(["professional", "friendly", "casual", "playful"] as const).map(
            (t) => (
              <button
                key={t}
                onClick={() => update("tone_of_voice", t)}
                className={`rounded-full border px-3 py-1.5 text-xs capitalize transition-colors ${
                  form.tone_of_voice === t
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-surface-2 text-muted"
                }`}
              >
                {t}
              </button>
            )
          )}
        </div>
        {(["differentiator_1", "differentiator_2", "differentiator_3"] as const).map(
          (k, i) => (
            <Input
              key={k}
              value={form.differentiators[k]}
              onChange={(e) => updateDiff(k, e.target.value)}
              placeholder={`Differentiator ${i + 1}`}
            />
          )
        )}
      </div>
    </section>
  );
}