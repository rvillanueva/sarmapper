import { useState } from 'react';

export default function Subscribe() {
  const [email, setEmail] = useState('');

  return (
    <div>
      <p className="text-sm text-gray-600 mb-2">
        Sign up below to hear about feature releases.
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
            placeholder="email address"
            required
            className="flex-1 rounded-l-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
          />
          <div className="absolute -left-[5000px]" aria-hidden="true">
            <input type="text" name="b_65b955fa7c92f8be66eec94cc_b2b2fef9ac" tabIndex={-1} defaultValue="" />
          </div>
          <input
            type="submit"
            value="Subscribe"
            name="subscribe"
            className="rounded-r-md bg-gray-800 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors cursor-pointer border-0"
          />
        </div>
      </form>
    </div>
  );
}
