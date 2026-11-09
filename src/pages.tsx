// Standalone pages: one per project (/work/<slug>), one per service
// (/services/<slug>) and /about. Styled to match the tabs in App.tsx.
import React from 'react';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { biography, clientApproach, currentProjects, featuredExtras, finishedProjects, recentWork, services, sunStar, type Project, type RecentWork, type Service, type WorkKind } from './data';
import { ABOUT_PATH, TAB_ROUTES, WORK_PATH, projectPath, recapPath, servicePath } from './seo';
import { formatRecapDate, recaps, type Recap } from './recaps';
import { isDriveVideo, isYouTubeEmbed } from './media';

export type LinkTo = (to: string) => { href: string; onClick: (e: React.MouseEvent) => void };

const Kicker = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[10px] text-white/40 tracking-[0.3em] uppercase mb-3 block">{children}</span>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-serif text-3xl md:text-5xl text-[#f5f5f5] tracking-tight mb-10">{children}</h2>
);

const TextLink = ({ link, to, children }: { link: LinkTo; to: string; children: React.ReactNode; key?: React.Key }) => (
  <a
    {...link(to)}
    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#dfb86c] hover:text-white transition-colors"
  >
    {children} <ArrowRight size={12} />
  </a>
);

function ProjectCard({ project, link, detailed = false }: { project: Project; link: LinkTo; detailed?: boolean; key?: React.Key }) {
  return (
    <a
      {...link(projectPath(project))}
      className="group block border border-white/5 bg-white/[0.01] p-4 hover:border-white/15 transition-all duration-300"
    >
      <div className="aspect-[16/10] overflow-hidden mb-5 bg-white/5">
        <img
          src={project.image}
          alt={`${project.title}, ${project.type.toLowerCase()} by Golden Boy Productions`}
          loading="lazy"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
        />
      </div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-[9px] uppercase tracking-wider text-white/40">{project.type}</span>
        <span className="text-[9px] text-[#dfb86c] font-semibold">{project.year}</span>
      </div>
      <h3 className="font-serif text-xl text-white/90 group-hover:text-[#dfb86c] transition-colors">{project.title}</h3>
      {detailed && (
        <>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-3 mb-3 font-semibold">Role: {project.role}</p>
          <p className="text-[11px] text-white/50 leading-relaxed font-light">{project.description}</p>
        </>
      )}
    </a>
  );
}

function ContactCta({ link, heading, cta }: { link: LinkTo; heading: string; cta?: { href: string; onClick: (e: React.MouseEvent) => void; label: string } }) {
  return (
    <section className="py-20 border-t border-white/5 text-center" aria-label="Get in touch">
      <h2 className="font-serif italic text-3xl md:text-5xl text-[#f5f5f5] mb-6">{heading}</h2>
      <p className="max-w-xl mx-auto text-sm text-white/50 font-light leading-relaxed mb-10">
        Tell Robert about your project, your audience and your timeline. He reads every message himself.
      </p>
      <a
        {...(cta ? { href: cta.href, onClick: cta.onClick } : link(TAB_ROUTES.contact.path))}
        className="inline-flex items-center gap-3 px-8 py-4 border border-[#dfb86c]/40 text-[#dfb86c] text-[10px] uppercase tracking-[0.25em] hover:bg-[#dfb86c] hover:text-[#060606] transition-all duration-300"
      >
        {cta?.label ?? 'Start a project'} <ArrowRight size={14} />
      </a>
    </section>
  );
}

function ProjectVideo({ project }: { project: Project }) {
  if (!project.video) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-white/40">
        <Play size={40} className="mb-2" />
        <p className="text-xs uppercase tracking-widest">Video coming soon</p>
      </div>
    );
  }
  return isDriveVideo(project.video) || isYouTubeEmbed(project.video) ? (
    <iframe
      src={isYouTubeEmbed(project.video) ? `${project.video}?rel=0` : project.video}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      loading="lazy"
      className="w-full h-full border-0"
      title={`${project.title} — ${project.type}`}
    />
  ) : (
    <video src={project.video} controls playsInline poster={project.image} className="w-full h-full object-cover" />
  );
}

export function ProjectPage({ project, link }: { project: Project; link: LinkTo }) {
  const facts: Array<[string, string]> = [
    ['Type', project.type],
    ['Year', project.year],
    ['Role', project.role],
    ...(project.client ? [['Client', project.client] as [string, string]] : []),
    ...(project.location ? [['Location', project.location] as [string, string]] : []),
  ];
  const more = finishedProjects.filter(p => p.slug !== project.slug).slice(0, 3);
  const videoService = services.find(s => s.slug === 'video-production');

  return (
    <article className="py-16">
      <a
        {...link(WORK_PATH)}
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-[#dfb86c] transition-colors mb-12"
      >
        <ArrowLeft size={12} /> All work
      </a>

      <header className="mb-12">
        <Kicker>{project.type} · {project.year}</Kicker>
        <h1 className="font-serif text-4xl md:text-7xl text-[#f5f5f5] tracking-tight">{project.title}</h1>
      </header>

      <div className="aspect-[16/9] w-full overflow-hidden bg-white/5 border border-white/5 mb-16">
        <ProjectVideo project={project} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-20">
        <div className="md:col-span-7 space-y-6 text-sm md:text-base text-white/60 font-light leading-relaxed">
          <h2 className="font-serif text-2xl text-white/90">About the project</h2>
          <p>{project.description}</p>
          {videoService && (
            <TextLink link={link} to={servicePath(videoService)}>Video production services</TextLink>
          )}
        </div>
        <dl className="md:col-span-5 border-t border-white/10">
          {facts.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-6 py-4 border-b border-white/5">
              <dt className="text-[10px] uppercase tracking-[0.25em] text-white/40">{label}</dt>
              <dd className="text-sm text-white/80 text-right">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section className="py-20 border-t border-white/5" aria-label="More work">
        <Kicker>Portfolio</Kicker>
        <SectionHeading>More work</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {more.map(p => <ProjectCard key={p.slug} project={p} link={link} />)}
        </div>
      </section>

      <ContactCta link={link} heading="Planning something similar?" />
    </article>
  );
}

// `quote` opens the contact form with this service already picked.
export function ServicePage({ service, link, quote }: { service: Service; link: LinkTo; quote?: ReturnType<LinkTo> }) {
  const work = service.projectSlugs
    .map(slug => finishedProjects.find(p => p.slug === slug))
    .filter((p): p is Project => !!p);
  const others = services.filter(s => s.slug !== service.slug);

  return (
    <article className="py-16">
      <header className="max-w-4xl mb-20">
        <Kicker>Services · {service.name}</Kicker>
        <h1 className="font-serif text-4xl md:text-6xl text-[#f5f5f5] tracking-tight mb-10">{service.heading}</h1>
        <div className="space-y-6 text-sm md:text-base text-white/60 font-light leading-relaxed max-w-3xl">
          {service.intro.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="flex flex-wrap items-center gap-6 mt-12">
          <a
            {...(quote ?? link(TAB_ROUTES.contact.path))}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#dfb86c] text-[#060606] text-[10px] uppercase tracking-[0.25em] font-semibold hover:bg-white transition-colors duration-300"
          >
            Get a quote <ArrowRight size={14} />
          </a>
          {(work.length > 0 || (service.sites?.length ?? 0) > 0) && (
            <a
              href="#results"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/60 hover:text-[#dfb86c] transition-colors"
            >
              {service.sites?.length ? 'See client results' : 'See the work'} <ArrowRight size={12} />
            </a>
          )}
        </div>
      </header>

      {service.sites && service.sites.length > 0 && (
        <section className="py-20 border-t border-white/5" id="results" aria-label="Client websites">
          <Kicker>Results for local businesses</Kicker>
          <SectionHeading>Websites Robert builds and manages</SectionHeading>
          <p className="max-w-2xl text-sm md:text-base text-white/50 font-light leading-relaxed -mt-4 mb-16">
            Live sites for real local businesses, designed for the phone first and built to be found on Google.
          </p>
          <div className="space-y-24 md:space-y-32">
            {service.sites.map((site, i) => {
              const page = site.url.endsWith('/') ? site.url : `${site.url}/`;
              const shot = (mobile: boolean) =>
                `https://s.wordpress.com/mshots/v1/${encodeURIComponent(page)}?${mobile ? 'vpw=390&vph=844&w=390&h=844' : 'w=1280&h=800'}`;
              const domain = page.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
              const flip = i % 2 === 1;
              return (
                <article key={site.url} className="group grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener"
                    aria-label={`Visit the ${site.name} website`}
                    className={`relative block md:col-span-7 pr-8 pb-10 ${flip ? 'md:order-2' : ''}`}
                  >
                    <div
                      aria-hidden="true"
                      className="absolute -inset-6 bg-[radial-gradient(ellipse_at_center,rgba(223,184,108,0.14),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    />
                    <div className="relative border border-white/10 bg-[#141414] rounded-lg overflow-hidden shadow-2xl shadow-black/60 group-hover:border-[#dfb86c]/40 transition-colors duration-500">
                      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#1a1a1a]">
                        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#dfb86c]/70" />
                        <span className="ml-3 flex-1 truncate rounded-full bg-black/40 px-4 py-1 text-[10px] tracking-wider text-white/40">{domain}</span>
                      </div>
                      <div className="aspect-[16/10] overflow-hidden bg-white/5">
                        <img
                          src={shot(false)}
                          alt={`${site.name} homepage on desktop, designed by Golden Boy Productions`}
                          loading="lazy"
                          className="w-full h-full object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                        />
                      </div>
                    </div>
                    <div className="absolute right-0 bottom-0 w-[26%] min-w-[90px] rounded-[1.4rem] border-[5px] border-[#1c1c1c] bg-[#1c1c1c] shadow-2xl shadow-black/70 overflow-hidden transition-transform duration-700 group-hover:-translate-y-2">
                      <div className="aspect-[390/844] overflow-hidden rounded-[1rem] bg-white/5">
                        <img
                          src={shot(true)}
                          alt={`${site.name} homepage on a phone`}
                          loading="lazy"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    </div>
                  </a>
                  <div className={`md:col-span-5 ${flip ? 'md:order-1' : ''}`}>
                    <span className="text-[10px] text-[#dfb86c] tracking-widest font-semibold mb-4 block">0{i + 1}/ · {site.location}</span>
                    <h3 className="font-serif text-3xl md:text-5xl text-[#f5f5f5] tracking-tight mb-3">{site.name}</h3>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-6">{site.type}</p>
                    <p className="text-sm text-white/60 leading-relaxed font-light mb-6">{site.desc}</p>
                    {site.result && (
                      <p className="text-sm text-white/85 leading-relaxed border-l-2 border-[#dfb86c] pl-4 mb-8">{site.result}</p>
                    )}
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-2 border border-[#dfb86c]/40 px-5 py-3 text-[10px] uppercase tracking-[0.25em] text-[#dfb86c] hover:bg-[#dfb86c] hover:text-black transition-colors"
                    >
                      Visit {domain} <ArrowRight size={12} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="py-20 border-t border-white/5" aria-label="What's included">
        <Kicker>What Robert offers</Kicker>
        <SectionHeading>What's included</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {service.offerings.map((o, i) => (
            <div key={o.title} className="border border-white/5 bg-white/[0.01] p-6 md:p-8">
              <span className="text-[10px] text-[#dfb86c] tracking-widest font-semibold mb-4 block">0{i + 1}/</span>
              <h3 className="font-serif text-xl text-white/90 mb-4">{o.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed font-light">{o.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {work.length > 0 && (
        <section id={service.sites?.length ? undefined : 'results'} className="py-20 border-t border-white/5" aria-label="Selected work">
          <Kicker>Portfolio</Kicker>
          <SectionHeading>Selected work</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {work.map(p => <ProjectCard key={p.slug} project={p} link={link} />)}
          </div>
        </section>
      )}

      <section className="py-20 border-t border-white/5" aria-label="How it works">
        <Kicker>{clientApproach.subtitle}</Kicker>
        <SectionHeading>How it works</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(service.steps ?? clientApproach.points).map((point, i) => (
            <div key={point.title} className="border-t border-white/10 pt-6">
              <span className="text-[10px] text-[#dfb86c] tracking-widest font-semibold mb-3 block">0{i + 1}/</span>
              <h3 className="font-serif text-lg text-white/90 mb-2">{point.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed font-light">{point.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {others.length > 0 && (
        <nav className="py-12 border-t border-white/5 flex flex-wrap gap-8" aria-label="Other services">
          {others.map(s => <TextLink key={s.slug} link={link} to={servicePath(s)}>{s.name}</TextLink>)}
          <TextLink link={link} to={ABOUT_PATH}>About Robert</TextLink>
        </nav>
      )}

      <ContactCta link={link} heading="Let's make something together" cta={quote && { ...quote, label: 'Get a quote' }} />
    </article>
  );
}

export function AboutPage({ link }: { link: LinkTo }) {
  return (
    <article className="py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center pb-20">
        <div className="aspect-[3/4] overflow-hidden bg-white/5 border border-white/10 max-w-md mx-auto md:ml-0 w-full">
          <img src={biography.image} alt="Portrait of director Robert Lazau" className="w-full h-full object-cover brightness-110" />
        </div>
        <div className="max-w-md mx-auto md:mx-0">
          <Kicker>{biography.year}</Kicker>
          <h1 className="font-serif text-4xl md:text-6xl text-[#f5f5f5] tracking-tight mb-8">About Robert Lazau</h1>
          <div className="space-y-6 text-sm text-white/60 font-light leading-relaxed">
            {biography.text.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
            <p className="italic font-serif text-[#dfb86c]/70 text-lg border-l border-[#dfb86c]/30 pl-4 py-1">
              "{biography.quote}"
            </p>
          </div>
        </div>
      </div>

      <section className="py-20 border-t border-white/5" aria-label={clientApproach.title}>
        <Kicker>{clientApproach.subtitle}</Kicker>
        <SectionHeading>{clientApproach.title}</SectionHeading>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <p className="lg:col-span-5 text-sm md:text-base text-white/50 leading-relaxed font-light">{clientApproach.text}</p>
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8">
            {clientApproach.points.map((point, i) => (
              <div key={point.title} className="border-t border-white/10 pt-6">
                <span className="text-[10px] text-[#dfb86c] tracking-widest font-semibold mb-3 block">0{i + 1}/</span>
                <h3 className="font-serif text-lg text-white/90 mb-2">{point.title}</h3>
                <p className="text-[11px] text-white/40 leading-relaxed font-light">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/5" aria-label={sunStar.title}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-4 flex justify-center">
            <img src="/logo-mark.png" alt="Golden Boy Productions sun star logo" loading="lazy" className="w-40 md:w-56 h-auto opacity-90" />
          </div>
          <div className="md:col-span-8 max-w-2xl">
            <Kicker>The mark</Kicker>
            <SectionHeading>{sunStar.title}</SectionHeading>
            <div className="space-y-6 text-sm md:text-base text-white/60 font-light leading-relaxed">
              {sunStar.text.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </div>
      </section>

      <nav className="py-12 border-t border-white/5 flex flex-wrap gap-8" aria-label="Services">
        {services.map(s => <TextLink key={s.slug} link={link} to={servicePath(s)}>{s.name}</TextLink>)}
        <TextLink link={link} to={WORK_PATH}>See the work</TextLink>
      </nav>

      <ContactCta link={link} heading="Work with Robert" />
    </article>
  );
}

// The big "Newest" card: the video loads only when someone presses play, so the page stays fast.
function FeaturedFilm({ project, link }: { project: Project; link: LinkTo }) {
  const [playing, setPlaying] = React.useState(false);
  const extra = featuredExtras[project.slug];
  const recap = recaps.find(r => r.project === project.slug);
  const canEmbed = isYouTubeEmbed(project.video) || isDriveVideo(project.video);
  const facts: Array<[string, string]> = [
    ...(project.client ? [['Client', project.client] as [string, string]] : []),
    ...(project.location ? [['Location', project.location] as [string, string]] : []),
    ...(extra?.delivered ? [['Delivered', extra.delivered] as [string, string]] : []),
  ];
  return (
    <div>
      <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border border-white/5 bg-white/[0.02] p-4 md:p-5">
        <div className="lg:col-span-7 relative aspect-[16/9] overflow-hidden bg-black">
          {playing && canEmbed ? (
            <iframe
              src={isYouTubeEmbed(project.video) ? `${project.video}?autoplay=1&rel=0` : project.video}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
              title={`${project.title} — ${project.type}`}
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 w-full h-full cursor-pointer"
              aria-label={`Play the ${project.title} film`}
            >
              <img src={project.image} alt="" className="w-full h-full object-cover" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-[#dfb86c] bg-[#060606]/60 flex items-center justify-center group-hover:bg-[#dfb86c] group-hover:text-[#060606] text-white transition-colors">
                <Play size={26} className="ml-1" />
              </span>
            </button>
          )}
        </div>
        <div className="lg:col-span-5 flex flex-col gap-4 pb-2 lg:pr-4">
          <div className="flex justify-between gap-4 text-[10px] uppercase tracking-[0.2em]">
            <span className="text-white/50">{project.type}</span>
            <span className="text-[#dfb86c] font-semibold">{extra?.date ?? project.year}</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#f5f5f5] tracking-tight">{project.title}</h2>
          <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Role: {project.role}</p>
          <p className="text-sm md:text-base text-white/60 font-light leading-relaxed">{project.description}</p>
          {facts.length > 0 && (
            <dl className="border-t border-white/10 pt-4 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
              {facts.map(([label, value]) => (
                <React.Fragment key={label}>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-white/40 pt-1">{label}</dt>
                  <dd className="text-white/80">{value}</dd>
                </React.Fragment>
              ))}
            </dl>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              {...link(projectPath(project))}
              className="inline-flex items-center gap-3 px-6 py-4 bg-[#dfb86c] text-[#060606] text-[10px] uppercase tracking-[0.25em] font-semibold hover:bg-white transition-colors"
            >
              Watch the film <ArrowRight size={14} />
            </a>
            {recap && (
              <a
                {...link(recapPath(recap))}
                className="inline-flex items-center gap-3 px-6 py-4 border border-white/15 text-white/80 text-[10px] uppercase tracking-[0.25em] hover:border-[#dfb86c] hover:text-[#dfb86c] transition-colors"
              >
                Behind the scenes
              </a>
            )}
          </div>
        </div>
      </article>
      {extra && extra.photos.length > 0 && (
        <figure className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {extra.photos.map(ph => (
              <img key={ph.src} src={ph.src} alt={ph.alt} loading="lazy" className="w-full aspect-[3/2] object-cover" />
            ))}
          </div>
          {extra.credit && (
            <figcaption className="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/40">Photos: {extra.credit}</figcaption>
          )}
        </figure>
      )}
    </div>
  );
}

// A phone screenshot in a simple frame, for website cards.
const PhoneShot = ({ src, alt, className = '' }: { src: string; alt: string; className?: string }) => (
  <div className={`aspect-[604/1310] overflow-hidden border-[5px] border-[#1b1b1b] bg-black ${className}`}>
    <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover object-top" />
  </div>
);

function RecentCard({ item }: { item: RecentWork; key?: React.Key }) {
  const domain = item.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  const text = (
    <div className="flex flex-col gap-3 p-6 flex-1">
      <div className="flex justify-between gap-4 text-[10px] uppercase tracking-[0.2em]">
        <span className="text-white/50">{item.label}</span>
        <span className="text-[#dfb86c] font-semibold">{item.date}</span>
      </div>
      <h3 className="font-serif text-2xl text-white/90 group-hover:text-[#dfb86c] transition-colors">{item.title}</h3>
      <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Role: {item.role}</p>
      <p className="text-sm text-white/60 font-light leading-relaxed">{item.description}</p>
      <span className="mt-auto pt-2 text-xs tracking-wider text-[#dfb86c]">{domain} ↗</span>
    </div>
  );
  if (item.wide && item.photo) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener"
        className="group md:col-span-2 flex flex-col md:flex-row border border-white/5 bg-white/[0.02] hover:border-[#dfb86c]/40 transition-colors"
      >
        <div className="relative md:w-[58%] min-h-[260px] md:min-h-[340px] overflow-hidden">
          <img src={item.photo} alt={item.photoAlt ?? ''} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          <PhoneShot src={item.phone} alt={`The ${item.title} website on a phone`} className="absolute right-4 bottom-4 w-24 md:w-28 rounded-[20px]" />
        </div>
        {text}
      </a>
    );
  }
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener"
      className="group flex flex-col border border-white/5 bg-white/[0.02] hover:border-[#dfb86c]/40 transition-colors"
    >
      <div className="h-[300px] bg-[#0a0a0a] flex items-end justify-center overflow-hidden pt-8">
        <PhoneShot
          src={item.phone}
          alt={`The ${item.title} website on a phone`}
          className="w-[150px] rounded-t-[24px] border-b-0 translate-y-10 group-hover:translate-y-6 transition-transform duration-500"
        />
      </div>
      {text}
    </a>
  );
}

type WorkFilter = 'all' | WorkKind;

export function WorkPage({ link }: { link: LinkTo }) {
  const [filter, setFilter] = React.useState<WorkFilter>('all');
  const videoService = services.find(s => s.slug === 'video-production');
  const webService = services.find(s => s.slug === 'web-design');
  const [featured, ...earlier] = finishedProjects;
  const featuredKinds: WorkKind[] = ['film', ...(featuredExtras[featured?.slug ?? '']?.photos.length ? ['photo' as WorkKind] : [])];
  const shows = (kinds: WorkKind[]) => filter === 'all' || kinds.includes(filter);
  const count = (k: WorkFilter) =>
    (featured && (k === 'all' || featuredKinds.includes(k as WorkKind)) ? 1 : 0) +
    recentWork.filter(r => k === 'all' || r.kinds.includes(k as WorkKind)).length +
    (k === 'all' || k === 'film' ? earlier.length : 0);
  const filters: Array<[WorkFilter, string]> = [['all', 'All'], ['film', 'Films'], ['photo', 'Photo'], ['website', 'Websites']];
  const recent = recentWork.filter(r => shows(r.kinds));
  const label = 'text-xs uppercase tracking-[0.25em] text-[#dfb86c] font-medium';

  return (
    <article className="py-16">
      <header className="mb-14">
        <Kicker>Work · Newest first</Kicker>
        <h1 className="font-serif italic text-4xl md:text-6xl text-[#f5f5f5] tracking-tight mb-8">What we've been making lately</h1>
        <p className="max-w-2xl text-sm md:text-base text-white/50 font-light leading-relaxed mb-10">
          Films, photo shoots and websites for businesses, nonprofits and cities around Portland and Gresham, newest first.
        </p>
        <div role="group" aria-label="Filter the work" className="flex flex-wrap gap-3">
          {filters.map(([k, name]) => (
            <button
              key={k}
              type="button"
              aria-pressed={filter === k}
              onClick={() => setFilter(k)}
              className={`inline-flex items-center gap-3 border px-5 py-3 text-[10px] uppercase tracking-[0.25em] transition-colors cursor-pointer ${
                filter === k ? 'border-[#dfb86c] text-white' : 'border-white/15 text-white/70 hover:border-[#dfb86c] hover:text-[#dfb86c]'
              }`}
            >
              {name} <span className="text-[#dfb86c]">{count(k)}</span>
            </button>
          ))}
        </div>
      </header>

      {featured && shows(featuredKinds) && (
        <section className="pb-20" aria-labelledby="newest-work">
          <h2 id="newest-work" className={`${label} border-b border-white/5 pb-4 mb-8`}>Newest</h2>
          <FeaturedFilm project={featured} link={link} />
        </section>
      )}

      {recent.length > 0 && (
        <section className="pb-20" aria-labelledby="recent-work">
          <h2 id="recent-work" className={`${label} border-b border-white/5 pb-4 mb-8`}>The last few months</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recent.map(item => <RecentCard key={item.title} item={item} />)}
          </div>
          {webService && shows(['website']) && (
            <div className="mt-10">
              <TextLink link={link} to={servicePath(webService)}>Website design services</TextLink>
            </div>
          )}
        </section>
      )}

      {currentProjects.length > 0 && filter === 'all' && (
        <section className="pb-20" aria-labelledby="in-production">
          <h2 id="in-production" className={`${label} border-b border-white/5 pb-4 mb-8`}>In production</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentProjects.map(p => (
              <div key={p.id} className="border border-dashed border-[#dfb86c]/40 p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-3">{p.type}</p>
                <h3 className="font-serif italic text-2xl text-white/90 mb-3">{p.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed font-light">{p.description}</p>
                <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#dfb86c]">{p.status}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {earlier.length > 0 && shows(['film']) && (
        <section id="films" className="pb-20 scroll-mt-8" aria-labelledby="earlier-films">
          <h2 id="earlier-films" className={`${label} border-b border-white/5 pb-4 mb-8`}>Earlier films</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {earlier.map(p => <ProjectCard key={p.slug} project={p} link={link} detailed />)}
          </div>
          {videoService && (
            <div className="mt-10">
              <TextLink link={link} to={servicePath(videoService)}>Video production services</TextLink>
            </div>
          )}
        </section>
      )}

      <ContactCta link={link} heading="Have a project in mind?" />
    </article>
  );
}

// /recaps: every project recap, newest first.
export function RecapsPage({ link }: { link: LinkTo }) {
  return (
    <article className="py-16">
      <header className="max-w-4xl mb-20">
        <Kicker>Project Recaps</Kicker>
        <h1 className="font-serif text-4xl md:text-6xl text-[#f5f5f5] tracking-tight mb-10">Behind the work</h1>
        <div className="space-y-6 text-sm md:text-base text-white/60 font-light leading-relaxed max-w-3xl">
          <p>
            After every project, Robert sits down to talk it through: what went right, what surprised him and what caught
            him off guard. Each recap has the interview, behind-the-scenes photos and video from the set, and a link to the
            finished work.
          </p>
        </div>
      </header>

      {recaps.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10" aria-label="All recaps">
          {recaps.map(r => (
            <a
              key={r.slug}
              {...link(recapPath(r))}
              className="group block border border-white/5 bg-white/[0.01] p-4 hover:border-white/15 transition-all duration-300"
            >
              <div className="aspect-[16/10] overflow-hidden mb-5 bg-white/5">
                {r.cover && (
                  <img
                    src={r.cover}
                    alt={`Behind the scenes of ${r.title}`}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                )}
              </div>
              <div className="flex justify-between items-baseline mb-2 gap-4">
                <span className="text-[9px] uppercase tracking-wider text-white/40">{r.client}</span>
                <span className="text-[9px] text-[#dfb86c] font-semibold">{formatRecapDate(r.date)}</span>
              </div>
              <h2 className="font-serif text-2xl text-white/90 group-hover:text-[#dfb86c] transition-colors mb-3">{r.title}</h2>
              {r.summary && <p className="text-xs text-white/50 leading-relaxed font-light">{r.summary}</p>}
            </a>
          ))}
        </section>
      ) : (
        <section className="py-16 border-t border-white/5" aria-label="Coming soon">
          <Kicker>First recaps · January 2027</Kicker>
          <SectionHeading>What every recap covers</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              ['The interview', 'Robert on camera, talking through the project start to finish.'],
              ['Wins', 'What worked, and what the client got out of it.'],
              ['Surprises & curveballs', 'What he didn\'t see coming, and how the team handled it.'],
              ['From the set', 'Behind-the-scenes photos and video from every shoot.'],
            ].map(([title, desc]) => (
              <div key={title} className="border-t border-white/10 pt-6">
                <h3 className="font-serif text-lg text-white/90 mb-2">{title}</h3>
                <p className="text-xs text-white/50 leading-relaxed font-light">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <TextLink link={link} to={WORK_PATH}>See the finished work</TextLink>
          </div>
        </section>
      )}

      <ContactCta link={link} heading="Your project could be next" />
    </article>
  );
}

function RecapVideo({ recap }: { recap: Recap }) {
  const iframe = /youtube-nocookie\.com\/embed\/|drive\.google\.com\/file\/d\/.+\/preview/.test(recap.video);
  return iframe ? (
    <iframe
      src={recap.video}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      loading="lazy"
      className="w-full h-full border-0"
      title={`${recap.title}: project recap interview`}
    />
  ) : (
    <video src={recap.video} controls playsInline preload="metadata" poster={recap.cover || undefined} className="w-full h-full object-cover" />
  );
}

// /recaps/<slug>: one project recap.
export function RecapPage({ recap, link }: { recap: Recap; link: LinkTo }) {
  const project = finishedProjects.find(p => p.slug === recap.project);
  const others = recaps.filter(r => r.slug !== recap.slug).slice(0, 3);
  const meta = [recap.client, formatRecapDate(recap.date)].filter(Boolean).join(' · ');

  return (
    <article className="py-16">
      <a
        {...link(TAB_ROUTES.recaps.path)}
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-[#dfb86c] transition-colors mb-12"
      >
        <ArrowLeft size={12} /> All recaps
      </a>

      <header className="max-w-4xl mb-16">
        <Kicker>Project Recap{meta ? ` · ${meta}` : ''}</Kicker>
        <h1 className="font-serif text-4xl md:text-6xl text-[#f5f5f5] tracking-tight mb-8">{recap.title}</h1>
        {recap.summary && <p className="text-sm md:text-base text-white/60 font-light leading-relaxed max-w-3xl">{recap.summary}</p>}
      </header>

      {recap.video && (
        <section className="mb-20" aria-label="Recap interview">
          <div className="aspect-video w-full bg-white/5 border border-white/5 overflow-hidden">
            <RecapVideo recap={recap} />
          </div>
        </section>
      )}

      {recap.sections.length > 0 && (
        <section className="max-w-3xl space-y-16 mb-20" aria-label="The recap">
          {recap.sections.map(sec => (
            <div key={sec.heading}>
              <h2 className="font-serif text-2xl md:text-3xl text-[#f5f5f5] tracking-tight mb-6">{sec.heading}</h2>
              <div className="space-y-5 text-sm md:text-base text-white/60 font-light leading-relaxed">
                {sec.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          ))}
        </section>
      )}

      {recap.photos.length > 0 && (
        <section className="py-20 border-t border-white/5" aria-label="Behind-the-scenes photos">
          <Kicker>From the set{recap.photographer ? ` · Photos by ${recap.photographer}` : ''}</Kicker>
          <SectionHeading>Behind the scenes</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recap.photos.map(ph => (
              <figure key={ph.src} className="m-0">
                <div className="aspect-[4/3] overflow-hidden bg-white/5">
                  <img
                    src={ph.src}
                    alt={ph.caption || `Behind the scenes of ${recap.title}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                {ph.caption && <figcaption className="text-[11px] text-white/40 font-light mt-3 leading-relaxed">{ph.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}

      {project && (
        <section className="py-20 border-t border-white/5" aria-label="The finished work">
          <Kicker>The finished work</Kicker>
          <div className="max-w-md">
            <ProjectCard project={project} link={link} />
          </div>
        </section>
      )}

      {others.length > 0 && (
        <nav className="py-12 border-t border-white/5 flex flex-wrap gap-8" aria-label="More recaps">
          {others.map(r => <TextLink key={r.slug} link={link} to={recapPath(r)}>{r.title}</TextLink>)}
        </nav>
      )}

      <ContactCta link={link} heading="Your project could be next" />
    </article>
  );
}
