import { useState } from 'react';

const LOOPS_FORM_URL =
  'https://app.loops.so/api/newsletter-form/cmoukeakw05640i1ejr2oq33w';
const RATE_LIMIT_KEY = 'loops-form-timestamp';
const RATE_LIMIT_MS = 60_000;

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function Subscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const reset = () => {
    setStatus('idle');
    setErrorMessage('');
    setEmail('');
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const previous = Number(localStorage.getItem(RATE_LIMIT_KEY) ?? 0);
    if (previous && previous + RATE_LIMIT_MS > Date.now()) {
      setStatus('error');
      setErrorMessage('Too many signups, please try again in a little while');
      return;
    }
    localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));

    setStatus('loading');

    try {
      const body = `userGroup=&mailingLists=&email=${encodeURIComponent(email)}`;
      const res = await fetch(LOOPS_FORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });

      if (res.ok) {
        setStatus('success');
        return;
      }

      const data = await res.json().catch(() => null);
      localStorage.removeItem(RATE_LIMIT_KEY);
      setStatus('error');
      setErrorMessage(data?.message ?? res.statusText);
    } catch (error) {
      if (error instanceof TypeError) {
        setStatus('error');
        setErrorMessage('Too many signups, please try again in a little while');
        return;
      }
      localStorage.removeItem(RATE_LIMIT_KEY);
      setStatus('error');
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : 'Oops! Something went wrong, please try again',
      );
    }
  }

  return (
    <div>
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-warm-gray mb-2">
        Stay in the loop
      </div>
      <p className="text-[13px] text-slate-warm font-light mb-3 leading-relaxed">
        Sign up to hear about feature releases.
      </p>

      {status === 'success' ? (
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-slate-warm font-light leading-relaxed m-0">
            Thanks! We'll be in touch.
          </p>
          <button
            type="button"
            onClick={reset}
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-warm-gray hover:text-charcoal transition-colors cursor-pointer bg-transparent border-0 p-0"
          >
            ← Back
          </button>
        </div>
      ) : status === 'error' ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] text-red-700 font-light leading-relaxed m-0">
            {errorMessage || 'Oops! Something went wrong, please try again'}
          </p>
          <button
            type="button"
            onClick={reset}
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-warm-gray hover:text-charcoal transition-colors cursor-pointer bg-transparent border-0 p-0 whitespace-nowrap"
          >
            ← Back
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              placeholder="email@address"
              required
              disabled={status === 'loading'}
              className="flex-1 rounded-l-sm border border-rule-strong border-r-0 bg-white px-3 py-2 font-mono text-[12px] text-charcoal outline-none focus:border-charcoal transition-colors placeholder:text-warm-gray disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-r-sm bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white hover:bg-charcoal transition-colors cursor-pointer border-0 disabled:opacity-60 disabled:cursor-wait"
            >
              {status === 'loading' ? 'Please wait…' : 'Subscribe'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
