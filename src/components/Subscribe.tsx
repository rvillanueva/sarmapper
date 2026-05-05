import { useState } from 'react';

export default function Subscribe() {
  const [email, setEmail] = useState('');

  return (
    <div>
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-warm-gray mb-2">
        Stay in the loop
      </div>
      <p className="text-[13px] text-slate-warm font-light mb-3 leading-relaxed">
        Sign up to hear about feature releases.
      </p>
      <form
        action="https://sarmapper.us20.list-manage.com/subscribe/post?u=65b955fa7c92f8be66eec94cc&amp;id=b2b2fef9ac"
        method="post"
        name="mc-embedded-subscribe-form"
        target="_blank"
        noValidate
      >
        <div className="flex">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="EMAIL"
            placeholder="email@address"
            required
            className="flex-1 rounded-l-sm border border-rule-strong border-r-0 bg-white px-3 py-2 font-mono text-[12px] text-charcoal outline-none focus:border-charcoal transition-colors placeholder:text-warm-gray"
          />
          <div className="absolute -left-[5000px]" aria-hidden="true">
            <input type="text" name="b_65b955fa7c92f8be66eec94cc_b2b2fef9ac" tabIndex={-1} defaultValue="" />
          </div>
          <input
            type="submit"
            value="Subscribe"
            name="subscribe"
            className="rounded-r-sm bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white hover:bg-charcoal transition-colors cursor-pointer border-0"
          />
        </div>
      </form>
    </div>
  );
}
