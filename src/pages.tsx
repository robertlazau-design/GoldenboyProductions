// Standalone pages: one per project (/work/<slug>), one per service
// (/services/<slug>) and /about. Styled to match the tabs in App.tsx.
import React from 'react';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { biography, clientApproach, finishedProjects, services, sunStar, type Project, type Service } from './data';
import { ABOUT_PATH, TAB_ROUTES, projectPath, servicePath } from './seo';
import { isDriveVideo } from './media';

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

function ProjectCard({ project, link }: { project: Project; link: LinkTo; key?: React.Key }) {
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
    </a>
  );
}

function ContactCta({ link, heading }: { link: LinkTo; heading: string }) {
  return (
    <section className="py-20 border-t border-white/5 text-center" aria-label="Get in touch">
      <h2 className="font-serif italic text-3xl md:text-5xl text-[#f5f5f5] mb-6">{heading}</h2>
      <p className="max-w-xl mx-auto text-sm text-white/50 font-light leading-relaxed mb-10">
        Tell Robert about your project, your audience and your timeline. He reads every message himself.
      </p>
      <a
        {...link(TAB_ROUTES.contact.path)}
        className="inline-flex items-center gap-3 px-8 py-4 border border-[#dfb86c]/40 text-[#dfb86c] text-[10px] uppercase tracking-[0.25em] hover:bg-[#dfb86c] hover:text-[#060606] transition-all duration-300"
      >
        Start a project <ArrowRight size={14} />
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
  return isDriveVideo(project.video) ? (
    <iframe
      src={project.video}
      allow="autoplay; fullscreen"
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
        {...link('/#projects')}
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

export function ServicePage({ service, link }: { service: Service; link: LinkTo }) {
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
      </header>

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
        <section className="py-20 border-t border-white/5" aria-label="Selected work">
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
          {clientApproach.points.map((point, i) => (
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

      <ContactCta link={link} heading="Let's make something together" />
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
        <TextLink link={link} to="/#projects">See the work</TextLink>
      </nav>

      <ContactCta link={link} heading="Work with Robert" />
    </article>
  );
}
