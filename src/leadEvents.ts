import { track } from '@vercel/analytics';

// Lead events for the monthly growth report (Vercel Web Analytics custom events, Pro plan).
// Every event carries two properties at most (Pro's limit): the page and the spot on it.
// Never send names, phone numbers, emails, addresses or message text.

const KINDS: [RegExp, string][] = [
  [/^tel:/i, 'Call Click'],
  [/^sms:/i, 'Text Click'],
  [/^mailto:/i, 'Email Click'],
  // The Google review link and the Google Business Profile come before Directions, so a
  // profile link (maps.google.com/?cid=…) isn't counted as a directions tap.
  [/^https?:\/\/(g\.page\/r\/[^/]+\/review|search\.google\.com\/local\/writereview)/i, 'Review Click'],
  [/^https?:\/\/maps\.google\.com\/\?cid=/i, 'Google Profile Click'],
  [/^https?:\/\/(maps\.google\.|www\.google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps|maps\.apple\.com)/i, 'Directions Click'],
  [/^https?:\/\/(www\.)?instagram\.com\//i, 'Instagram Click'],
];

// Where on the page the link was: a data-spot label if one is set, else footer, header,
// the section's id, or "page". Footer goes first because the footer's links sit in <nav>s.
export function spotOf(el: Element): string {
  const tagged = el.closest('[data-spot]');
  if (tagged) return tagged.getAttribute('data-spot') || 'page';
  if (el.closest('footer')) return 'footer';
  if (el.closest('header, nav')) return 'header';
  return el.closest('section[id]')?.id || 'page';
}

export function trackLead(name: string, el?: Element | null) {
  track(name, { page: window.location.pathname, spot: el ? spotOf(el) : 'page' });
}

// One listener for the whole site, so every call, text, email, review, Google profile, directions
// and Instagram link counts, including ones added later. Capture phase, so it still counts if a handler stops the click.
export function startLeadEvents() {
  document.addEventListener(
    'click',
    (e) => {
      const link = (e.target as Element | null)?.closest?.('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      const kind = KINDS.find(([re]) => re.test(href));
      if (kind) trackLead(kind[1], link);
    },
    { capture: true },
  );
}
