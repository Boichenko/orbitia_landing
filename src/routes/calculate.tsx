import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Download, Heart, Loader2, MapPin, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";

import { type City, downloadBlob, requestReportPdf, searchCities } from "@/lib/reports-api";

export const Route = createFileRoute("/calculate")({
  component: Calculate,
});

type ReportMode = "solar" | "synastry";

type PersonData = {
  name: string;
  birthDate: string;
  birthTime: string;
  timeUnknown: boolean;
  birthPlace: City | null;
};

const emptyPerson: PersonData = {
  name: "",
  birthDate: "",
  birthTime: "",
  timeUnknown: false,
  birthPlace: null,
};

const currentYear = new Date().getFullYear();

function padDatePart(value: string) {
  return value.length === 1 ? `0${value}` : value;
}

function formatBirthDateInput(value: string, finalize = false) {
  const clean = value.replace(/[^\d.]/g, "").slice(0, 10);

  if (clean.includes(".")) {
    const [rawDay = "", rawMonth = "", rawYear = ""] = clean.split(".");
    let day = rawDay.replace(/\D/g, "").slice(0, 2);
    let month = rawMonth.replace(/\D/g, "").slice(0, 2);
    const year = rawYear.replace(/\D/g, "").slice(0, 4);
    const hasDayDot = clean.includes(".");
    const hasMonthDot = clean.indexOf(".") !== clean.lastIndexOf(".");

    if ((hasDayDot || finalize || Number(day) > 3) && day.length === 1) {
      day = padDatePart(day);
    }
    if ((hasMonthDot || finalize || Number(month) > 1) && month.length === 1) {
      month = padDatePart(month);
    }

    if (hasMonthDot || year) return `${day}.${month}${hasMonthDot || year ? "." : ""}${year}`;
    if (hasDayDot || month) {
      const shouldCloseMonth = month.length === 2 || (month.length === 1 && Number(month) > 1);
      return `${day}.${month}${shouldCloseMonth ? "." : ""}`;
    }
    return day;
  }

  const digits = clean.replace(/\D/g, "").slice(0, 8);
  if (!digits) return "";
  if (digits.length === 1) {
    return Number(digits) > 3 || finalize ? `${padDatePart(digits)}.` : digits;
  }
  if (digits.length === 2) return `${digits}.`;

  const day = digits.slice(0, 2);
  if (digits.length === 3) {
    const monthStart = digits.slice(2);
    return Number(monthStart) > 1 ? `${day}.0${monthStart}.` : `${day}.${monthStart}`;
  }

  const month = digits.slice(2, 4);
  if (digits.length === 4) return `${day}.${month}.`;
  return `${day}.${month}.${digits.slice(4)}`;
}

function Calculate() {
  const [mode, setMode] = useState<ReportMode>("solar");
  const [person, setPerson] = useState<PersonData>(emptyPerson);
  const [partner, setPartner] = useState<PersonData>(emptyPerson);
  const [solarPlace, setSolarPlace] = useState<City | null>(null);
  const [solarCycleYear, setSolarCycleYear] = useState(String(currentYear));
  const [userContext, setUserContext] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [reportFile, setReportFile] = useState<{ blob: Blob; filename: string } | null>(null);

  const isSolar = mode === "solar";
  const heading = isSolar ? "Прогноз на год" : "Совместимость партнёров";

  async function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setReportFile(null);
    setMessage("Собираю данные и формирую PDF. Это может занять пару минут.");

    try {
      if (!person.birthPlace) throw new Error("Выберите город рождения из списка.");
      if (isSolar && !solarPlace) throw new Error("Выберите город, где встречаете день рождения.");
      if (!isSolar && !partner.birthPlace) throw new Error("Выберите город рождения партнёра.");

      const basePerson = {
        person_name: person.name.trim(),
        birth_date: person.birthDate.trim(),
        birth_time: person.timeUnknown ? null : person.birthTime || null,
        birth_place: person.birthPlace,
      };

      const result = isSolar
        ? await requestReportPdf("/reports/solar", {
            report_type: "solar",
            ...basePerson,
            solar_place: solarPlace,
            solar_cycle_year: Number(solarCycleYear),
            user_context: userContext.trim() || null,
          })
        : await requestReportPdf("/reports/synastry", {
            report_type: "synastry",
            ...basePerson,
            partner_name: partner.name.trim(),
            partner_birth_date: partner.birthDate.trim(),
            partner_birth_time: partner.timeUnknown ? null : partner.birthTime || null,
            partner_birth_place: partner.birthPlace,
          });

      setReportFile(result);
      setStatus("success");
      setMessage("PDF готов. Нажмите кнопку ниже, чтобы скачать файл.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Что-то пошло не так.");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8">
      <Stars />
      <header className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/" className="font-display text-2xl tracking-[0.3em] text-gold-gradient">
          ORBITIA
        </Link>
        <Link
          to="/"
          className="rounded-full border border-[var(--gold)]/35 px-5 py-2 text-xs uppercase tracking-[0.25em] text-[var(--gold-soft)] transition hover:bg-[var(--gold)]/10"
        >
          На главную
        </Link>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:py-20">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[var(--gold-soft)]/80">
            Расчёт на сайте
          </p>
          <h1 className="font-display text-5xl leading-tight sm:text-6xl">
            {heading} <span className="italic text-gold-gradient">в PDF</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Введите данные так же, как в боте: дату, время и города. Orbitia построит карту,
            подготовит расшифровку и скачает готовый PDF.
          </p>
        </aside>

        <form
          onSubmit={submitReport}
          className="relative rounded-lg border border-[var(--gold)]/15 bg-[var(--card)]/55 p-5 shadow-[var(--shadow-elegant)] backdrop-blur sm:p-8"
        >
          {status === "loading" ? (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 rounded-lg bg-[var(--background)]/80 px-8 text-center backdrop-blur-sm">
              <Loader2 size={34} className="animate-spin text-[var(--gold-soft)]" />
              <div>
                <p className="font-display text-3xl">Готовлю PDF</p>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Расчёт может занять пару минут. Не закрывайте страницу, файл появится здесь.
                </p>
              </div>
            </div>
          ) : null}

          <div className="mb-10">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--gold-soft)]/75">
              Выберите тип расчёта
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <ModeButton
                active={isSolar}
                icon={<CalendarDays size={18} />}
                onClick={() => setMode("solar")}
              >
                Прогноз на год
              </ModeButton>
              <ModeButton
                active={!isSolar}
                icon={<Heart size={18} />}
                onClick={() => setMode("synastry")}
              >
                Совместимость партнёров
              </ModeButton>
            </div>
          </div>

          <SectionTitle eyebrow="01" title={isSolar ? "Ваши данные" : "Первый партнёр"} />
          <PersonFields value={person} onChange={setPerson} cityLabel="Город рождения" />

          {isSolar ? (
            <div className="mt-10 space-y-6">
              <SectionTitle eyebrow="02" title="Данные для прогноза" />
              <CityField label="Город дня рождения" value={solarPlace} onChange={setSolarPlace} />
              <Field label="Год начала периода">
                <input
                  value={solarCycleYear}
                  onChange={(event) => setSolarCycleYear(event.target.value)}
                  inputMode="numeric"
                  pattern="\d{4}"
                  placeholder="2026"
                  required
                  className="field-input"
                />
              </Field>
              <Field label="Контекст года, необязательно">
                <textarea
                  value={userContext}
                  onChange={(event) => setUserContext(event.target.value)}
                  rows={4}
                  maxLength={1200}
                  placeholder="Что происходило, какие планы, что хочется понять..."
                  className="field-input resize-none"
                />
              </Field>
            </div>
          ) : (
            <div className="mt-10">
              <SectionTitle eyebrow="02" title="Второй партнёр" />
              <PersonFields
                value={partner}
                onChange={setPartner}
                cityLabel="Город рождения партнёра"
              />
            </div>
          )}

          <div className="mt-10 rounded-md border border-[var(--gold)]/15 bg-[var(--ink)]/35 p-4 text-sm text-muted-foreground">
            {isSolar
              ? "Нужны имя, дата, время и место рождения, город дня рождения и год периода."
              : "Нужны данные обоих партнёров. Если точное время неизвестно, отметьте это в форме."}
          </div>

          {message ? (
            <div
              className={`mt-5 rounded-md border p-4 text-sm ${
                status === "error"
                  ? "border-red-400/30 bg-red-950/30 text-red-100"
                  : "border-[var(--gold)]/20 bg-[var(--gold)]/10 text-foreground"
              }`}
            >
              {message}
            </div>
          ) : null}

          {reportFile ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button
                type="button"
                onClick={() => downloadBlob(reportFile.blob, reportFile.filename)}
                className="inline-flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-[var(--ink)] shadow-[var(--shadow-glow)] transition hover:scale-[1.01]"
                style={{ background: "var(--gradient-gold)" }}
              >
                <Download size={18} />
                Скачать PDF
              </button>
              <button
                type="button"
                onClick={() => {
                  setReportFile(null);
                  setStatus("idle");
                  setMessage("");
                }}
                className="rounded-full border border-[var(--gold)]/30 px-6 py-4 text-xs uppercase tracking-[0.2em] text-[var(--gold-soft)] transition hover:bg-[var(--gold)]/10"
              >
                Новый расчёт
              </button>
            </div>
          ) : (
            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-[var(--ink)] shadow-[var(--shadow-glow)] transition hover:scale-[1.01] disabled:cursor-wait disabled:opacity-70"
              style={{ background: "var(--gradient-gold)" }}
            >
              {status === "loading" ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Download size={18} />
              )}
              {status === "loading" ? "Готовлю PDF" : "Сделать расчёт"}
            </button>
          )}
        </form>
      </section>
    </main>
  );
}

function PersonFields({
  value,
  onChange,
  cityLabel,
}: {
  value: PersonData;
  onChange: (value: PersonData) => void;
  cityLabel: string;
}) {
  const patch = (next: Partial<PersonData>) => onChange({ ...value, ...next });

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Имя">
        <input
          value={value.name}
          onChange={(event) => patch({ name: event.target.value })}
          placeholder="Анна"
          required
          maxLength={50}
          className="field-input"
        />
      </Field>
      <Field label="Дата рождения">
        <input
          value={value.birthDate}
          onChange={(event) => patch({ birthDate: formatBirthDateInput(event.target.value) })}
          onBlur={(event) => patch({ birthDate: formatBirthDateInput(event.target.value, true) })}
          inputMode="numeric"
          placeholder="ДД.ММ.ГГГГ"
          required
          maxLength={10}
          pattern="\d{2}\.\d{2}\.\d{4}"
          className="field-input"
        />
      </Field>
      <Field label="Время рождения">
        <input
          value={value.birthTime}
          onChange={(event) => patch({ birthTime: event.target.value })}
          disabled={value.timeUnknown}
          type="time"
          required={!value.timeUnknown}
          className="field-input disabled:opacity-45"
        />
      </Field>
      <label className="flex items-center gap-3 self-end rounded-md border border-[var(--gold)]/15 bg-[var(--ink)]/35 px-4 py-3 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={value.timeUnknown}
          onChange={(event) => patch({ timeUnknown: event.target.checked, birthTime: "" })}
          className="h-4 w-4 accent-[var(--gold)]"
        />
        Точное время неизвестно
      </label>
      <div className="sm:col-span-2">
        <CityField
          label={cityLabel}
          value={value.birthPlace}
          onChange={(city) => patch({ birthPlace: city })}
        />
      </div>
    </div>
  );
}

function CityField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: City | null;
  onChange: (city: City | null) => void;
}) {
  const [query, setQuery] = useState(value?.label || "");
  const [options, setOptions] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (value?.label && value.label !== query) {
      setQuery(value.label);
    }
  }, [value, query]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2 || value?.label === trimmed) {
      setOptions([]);
      setError("");
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const cities = await searchCities(trimmed, controller.signal);
        if (!controller.signal.aborted) setOptions(cities);
      } catch {
        if (!controller.signal.aborted) setError("Город не найден. Попробуйте добавить страну.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, value]);

  return (
    <Field label={label}>
      <div className="relative">
        <MapPin
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gold-soft)]"
          size={17}
        />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            onChange(null);
          }}
          placeholder="Минск, Беларусь"
          required
          className="field-input pl-11"
        />
        {loading ? (
          <Loader2
            className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground"
            size={16}
          />
        ) : null}
        {options.length > 0 ? (
          <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-md border border-[var(--gold)]/20 bg-[var(--popover)] shadow-[var(--shadow-elegant)]">
            {options.map((city) => (
              <button
                key={`${city.label}-${city.lat}-${city.lon}`}
                type="button"
                onClick={() => {
                  onChange(city);
                  setQuery(city.label);
                  setOptions([]);
                }}
                className="block w-full px-4 py-3 text-left text-sm text-foreground transition hover:bg-[var(--gold)]/10"
              >
                {city.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {value ? (
        <p className="mt-2 text-xs text-[var(--gold-soft)]">Выбрано: {value.label}</p>
      ) : null}
      {error ? <p className="mt-2 text-xs text-red-200">{error}</p> : null}
    </Field>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-[var(--gold-soft)]/75">
        {label}
      </span>
      {children}
    </label>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="font-display text-3xl">
        <span className="mr-3 text-gold-gradient">{eyebrow}</span>
        {title}
      </h2>
      <Sparkles className="text-[var(--gold-soft)]/70" size={20} />
    </div>
  );
}

function ModeButton({
  active,
  icon,
  onClick,
  children,
}: {
  active: boolean;
  icon: ReactNode;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-md border px-5 py-4 text-left text-sm uppercase tracking-[0.18em] transition ${
        active
          ? "border-[var(--gold)]/50 bg-[var(--gold)]/15 text-foreground"
          : "border-[var(--gold)]/15 bg-[var(--card)]/35 text-muted-foreground hover:bg-[var(--gold)]/10"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function Stars() {
  const dots = useMemo(() => Array.from({ length: 36 }), []);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {dots.map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-[var(--gold-soft)] animate-twinkle"
          style={{
            top: `${(i * 37) % 100}%`,
            left: `${(i * 53) % 100}%`,
            width: ((i % 3) + 1) * 1.2,
            height: ((i % 3) + 1) * 1.2,
            opacity: 0.35,
            animationDelay: `${(i % 7) * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}
