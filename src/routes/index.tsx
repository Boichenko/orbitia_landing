import { createFileRoute } from "@tanstack/react-router";
import orbitiaLogo from "@/assets/orbitia-logo.asset.json";
import { trackTelegramClick } from "@/lib/analytics";

const TELEGRAM_URL = "https://t.me/orbitia_bot";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Stars />
      <Nav />
      <Hero />
      <Divider />
      <Inside />
      <Divider />
      <Sample />
      <Divider />
      <HowItWorks />
      <Divider />
      <SolarGuide />
      <Divider />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-3">
        <div className="font-display text-2xl tracking-[0.3em] text-gold-gradient">ORBITIA</div>
      </div>
      <a
        href={TELEGRAM_URL}
        onClick={() => trackTelegramClick("nav")}
        className="hidden rounded-full border border-[var(--gold)]/40 px-5 py-2 text-xs uppercase tracking-[0.25em] text-[var(--gold-soft)] transition hover:bg-[var(--gold)]/10 sm:inline-block"
      >
        Открыть в Telegram
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pt-12 pb-24 text-center">
      <div className="relative mb-10 flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80">
        <div className="absolute inset-0 rounded-full bg-[var(--gold)]/8 blur-3xl" />
        <div className="absolute inset-4 rounded-full border border-[var(--gold)]/20 animate-spin-slow" />
        <div className="absolute inset-12 rounded-full border border-dashed border-[var(--gold)]/15 animate-spin-reverse" />
        <div className="relative z-10 h-full w-full overflow-hidden rounded-[2rem] border border-[var(--gold)]/20 bg-[oklch(0.09_0.02_265)]/80 shadow-[var(--shadow-glow)] backdrop-blur-sm">
          <img
            src={orbitiaLogo.url}
            alt="Orbitia — соляр на год"
            className="h-full w-full object-contain"
          />
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[inset_0_0_80px_30px_color-mix(in_oklab,var(--background)_75%,transparent)]" />
        </div>
      </div>

      <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[var(--gold-soft)]/80">
        Solar Return · Annual Forecast
      </p>
      <h1 className="max-w-3xl font-display text-5xl leading-[1.05] sm:text-7xl">
        Ваш <span className="text-gold-gradient italic">соляр на год</span>
        <br /> в одном PDF
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">
        Telegram-бот Orbitia строит соляр на предстоящий год рождения: асцендент, планеты по домам,
        ключевые аспекты и разбор главных тем года — за пару минут.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <a
          href={TELEGRAM_URL}
          onClick={() => trackTelegramClick("hero")}
          className="group relative inline-flex items-center gap-3 rounded-full bg-[var(--gradient-gold)] px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-[var(--ink)] shadow-[var(--shadow-glow)] transition hover:scale-[1.02]"
          style={{ background: "var(--gradient-gold)" }}
        >
          <TelegramIcon /> Рассчитать соляр
        </a>
        <a
          href="#sample"
          className="text-sm uppercase tracking-[0.25em] text-[var(--gold-soft)]/80 underline-offset-4 hover:underline"
        >
          посмотреть пример →
        </a>
      </div>

      <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
        <span>Solar maps</span>
        <span className="text-[var(--gold)]">✦</span>
        <span>Annual cycles</span>
        <span className="text-[var(--gold)]">✦</span>
        <span>You, in focus</span>
      </div>
    </section>
  );
}

function Divider() {
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="hairline" />
    </div>
  );
}

function Inside() {
  const items = [
    {
      title: "Ключевые показатели",
      body: "Место соляра, асцендент и MC, самый загруженный дом, узлы — вся карта года на одной странице.",
    },
    {
      title: "Разбор по домам",
      body: "Каждая планета соляра — в каком доме, что усиливает и как проявляется в жизни в течение года.",
    },
    {
      title: "Ключевые аспекты",
      body: "Соединения, тригоны, квадраты и квиконсы к натальной карте с орбисами и толкованием.",
    },
    {
      title: "Главный конфликт года",
      body: "Финальная сводка: противоречие года и главный вектор, вокруг которого разворачиваются события.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-16 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-[var(--gold-soft)]/80">
          Что внутри
        </p>
        <h2 className="font-display text-4xl sm:text-5xl">
          Соляр как <span className="italic text-gold-gradient">карта года</span>
        </h2>
      </div>
      <div className="grid gap-px overflow-hidden rounded-lg border border-[var(--gold)]/15 bg-[var(--gold)]/10 sm:grid-cols-2">
        {items.map((it) => (
          <div key={it.title} className="bg-[var(--background)] p-8">
            <div className="mb-4 h-8 w-8 rounded-full border border-[var(--gold)]/40 text-center text-sm leading-[30px] text-[var(--gold)]">
              ✦
            </div>
            <h3 className="mb-3 font-display text-2xl">{it.title}</h3>
            <p className="text-muted-foreground">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Sample() {
  return (
    <section id="sample" className="mx-auto max-w-5xl px-6 py-24">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-[var(--gold-soft)]/80">
          Фрагмент из PDF
        </p>
        <h2 className="font-display text-4xl sm:text-5xl">
          Как это <span className="italic text-gold-gradient">выглядит</span>
        </h2>
      </div>

      <article className="relative overflow-hidden rounded-lg border border-[var(--gold)]/20 bg-[var(--card)]/60 p-8 shadow-[var(--shadow-elegant)] backdrop-blur sm:p-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--gold)]/10 blur-3xl" />
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-soft)]/70">
          Соляр 25.10.1992 · 2025–2026
        </p>
        <h3 className="mt-3 font-display text-3xl sm:text-4xl">Общая картина года</h3>
        <div className="mt-6 hairline" />
        <p className="mt-6 text-lg leading-relaxed text-foreground/90">
          Этот год — резкий поворот на{" "}
          <em className="text-[var(--gold-soft)] not-italic">служение</em> и практическую реальность
          в новой стране. Шесть планет в 6-м доме говорят о том, что энергия года направлена на
          деятельность, трудовую реальность, здоровье и внутреннюю дисциплину.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-foreground/80">
          Асцендент в 9-м доме натала подтверждает тему культурного переходного периода. Главные оси
          года — 6-й дом, 11-й дом с узлом и 9-й дом трансформации мировоззрения.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <Stat label="Асцендент" value="Близнецы" hint="11°18'" />
          <Stat label="MC соляра" value="Водолей" hint="5°43'" />
          <Stat label="Ключевой дом" value="6-й дом" hint="6 планет" />
        </div>
      </article>
    </section>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded border border-[var(--gold)]/15 bg-[var(--ink)]/40 p-5">
      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl text-gold-gradient">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "Откройте бота",
      d: "Нажмите «Рассчитать соляр» и запустите Orbitia в Telegram.",
    },
    { n: "02", t: "Укажите данные", d: "Дата, время и место рождения. Место, где встретите год." },
    { n: "03", t: "Получите PDF", d: "Через пару минут — готовый разбор соляра на год в чате." },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-16 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-[var(--gold-soft)]/80">
          Как это работает
        </p>
        <h2 className="font-display text-4xl sm:text-5xl">
          Три шага <span className="italic text-gold-gradient">до карты года</span>
        </h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-3">
        {steps.map((s) => (
          <div
            key={s.n}
            className="relative rounded-lg border border-[var(--gold)]/15 bg-[var(--card)]/40 p-8"
          >
            <div className="font-display text-6xl text-gold-gradient/80" style={{ opacity: 0.9 }}>
              {s.n}
            </div>
            <h3 className="mt-4 font-display text-2xl">{s.t}</h3>
            <p className="mt-2 text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SolarGuide() {
  const topics = [
    {
      title: "Что такое соляр",
      body: "Соляр — это астрологическая карта на момент, когда Солнце возвращается в точное положение, которое занимало в день рождения. Ее используют как прогноз на личный год: от одного дня рождения до следующего.",
    },
    {
      title: "Как рассчитывается соляр",
      body: "Для расчета соляра берутся дата, точное время и место рождения, а также город, где человек встречает новый год жизни. По этим данным строится карта возвращения Солнца и анализируются дома, планеты и аспекты.",
    },
    {
      title: "Какие данные нужны",
      body: "Чтобы рассчитать соляр онлайн точнее, важно знать время рождения хотя бы до минут. Если время неизвестно, можно увидеть общие темы года, но асцендент, дома и часть прогноза будут менее надежными.",
    },
    {
      title: "Соляр и натальная карта",
      body: "Натальная карта описывает базовый потенциал человека, а соляр показывает акценты конкретного года. Поэтому в разборе важно смотреть не только карту соляра отдельно, но и ее связь с натальной картой.",
    },
    {
      title: "Почему важно место",
      body: "Место, где вы встречаете день рождения, влияет на сетку домов соляра. Из-за смены города или страны акценты года могут сместиться: например, с карьеры на отношения, обучение, здоровье или переезд.",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-14 max-w-3xl">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-[var(--gold-soft)]/80">
          Соляр онлайн
        </p>
        <h2 className="font-display text-4xl sm:text-5xl">
          Что важно знать <span className="italic text-gold-gradient">перед расчетом</span>
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Orbitia помогает рассчитать соляр на год в Telegram и получить PDF-разбор без сложных
          таблиц. Ниже — короткое объяснение, как работает соляр, какие данные нужны и почему место
          дня рождения влияет на прогноз.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {topics.map((topic) => (
          <article
            key={topic.title}
            className="rounded-lg border border-[var(--gold)]/15 bg-[var(--card)]/35 p-6 lg:col-span-1"
          >
            <h3 className="font-display text-2xl">{topic.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{topic.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const qs = [
    {
      q: "Что такое соляр?",
      a: "Карта, построенная на момент, когда Солнце возвращается в ту же градус-минуту, где стояло при рождении. Она описывает энергию и темы предстоящего года жизни.",
    },
    {
      q: "Нужно ли точное время рождения?",
      a: "Да, для корректных домов и асцендента соляра нужно точное время. Если оно неизвестно, часть выводов будет ограничена.",
    },
    {
      q: "Учитывается ли место, где я встречу год?",
      a: "Да. Соляр строится на локацию, где вы будете в момент возвращения Солнца — это влияет на дома и MC.",
    },
    {
      q: "В каком формате приходит результат?",
      a: "PDF-файл прямо в чат Telegram: разбор по домам, аспекты и главный конфликт года.",
    },
  ];
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-[var(--gold-soft)]/80">
          Вопросы
        </p>
        <h2 className="font-display text-4xl sm:text-5xl">
          Коротко <span className="italic text-gold-gradient">о главном</span>
        </h2>
      </div>
      <div className="divide-y divide-[var(--gold)]/15 border-y border-[var(--gold)]/15">
        {qs.map((it) => (
          <details key={it.q} className="group py-6">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
              <span className="font-display text-xl text-foreground">{it.q}</span>
              <span className="mt-1 text-[var(--gold)] transition group-open:rotate-45">＋</span>
            </summary>
            <p className="mt-4 text-muted-foreground">{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative mx-auto max-w-4xl px-6 py-32 text-center">
      <div className="absolute inset-x-0 top-1/2 -z-10 h-72 -translate-y-1/2 bg-[var(--gold)]/10 blur-[100px]" />
      <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[var(--gold-soft)]/80">
        Год начинается сегодня
      </p>
      <h2 className="font-display text-5xl leading-tight sm:text-6xl">
        Загляните в <span className="italic text-gold-gradient">карту года</span>
      </h2>
      <p className="mx-auto mt-6 max-w-lg text-muted-foreground">
        Откройте Orbitia в Telegram, введите данные и получите разбор соляра в PDF.
      </p>
      <a
        href={TELEGRAM_URL}
        onClick={() => trackTelegramClick("cta")}
        className="mt-10 inline-flex items-center gap-3 rounded-full px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-[var(--ink)] shadow-[var(--shadow-glow)] transition hover:scale-[1.02]"
        style={{ background: "var(--gradient-gold)" }}
      >
        <TelegramIcon /> Открыть Orbitia
      </a>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--gold)]/15">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-xs uppercase tracking-[0.3em] text-muted-foreground sm:flex-row">
        <div className="text-gold-gradient">ORBITIA</div>
        <div>Solar maps · Annual cycles · You, in focus</div>
        <div>© {new Date().getFullYear()}</div>
      </div>
    </footer>
  );
}

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.05 2.93 2.62 10.04c-1.26.5-1.25 1.2-.23 1.52l4.73 1.48 10.94-6.9c.52-.31.99-.14.6.2l-8.86 8 .0.0-.33 4.86c.5 0 .72-.23.99-.5l2.38-2.31 4.93 3.64c.91.5 1.56.24 1.79-.84l3.24-15.28c.33-1.32-.5-1.92-1.36-1.53Z" />
    </svg>
  );
}

function Stars() {
  const dots = Array.from({ length: 40 });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {dots.map((_, i) => {
        const top = (i * 37) % 100;
        const left = (i * 53) % 100;
        const size = ((i % 3) + 1) * 1.2;
        const delay = (i % 7) * 0.4;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-[var(--gold-soft)] animate-twinkle"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: size,
              height: size,
              opacity: 0.4,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
