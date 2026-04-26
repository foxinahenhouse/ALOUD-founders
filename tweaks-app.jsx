/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakColor, TweakSlider */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVariant": "black",
  "heroBg": "#0A0A0A",
  "heroAccent": "#F2055C",
  "displayFont": "Cinzel",
  "showMarquee": true,
  "showFAQ": true,
  "showLineup": true,
  "rotateO": true,
  "spotsLeft": 13
}/*EDITMODE-END*/;

const FONT_STACKS = {
  "Cinzel": "'Cinzel', 'Playfair Display', serif",
  "Playfair": "'Playfair Display', 'Cinzel', serif",
};

const HERO_VARIANTS = {
  black:    { bg: "#0A0A0A", fg: "#FFFFFF", accent: "#F2055C" },
  white:    { bg: "#FFFFFF", fg: "#0A0A0A", accent: "#F2055C" },
  pink:     { bg: "#F2055C", fg: "#FFFFFF", accent: "#C1F257" },
  green:    { bg: "#7BAF00", fg: "#FFFFFF", accent: "#F2055C" },
  red:      { bg: "#FE001A", fg: "#FFFFFF", accent: "#C1F257" },
  lime:     { bg: "#C1F257", fg: "#0A0A0A", accent: "#F2055C" },
};

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Clear any stale inline background-color from previous sessions on mount
  React.useEffect(() => {
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.removeProperty('background-color');
      hero.style.removeProperty('background');
      hero.style.removeProperty('color');
    }
  }, []);

  // Hero variant — preset bundle
  React.useEffect(() => {
    const v = HERO_VARIANTS[t.heroVariant] || HERO_VARIANTS.black;
    const hero = document.querySelector('.hero');
    if (!hero) return;
    hero.style.setProperty('--hero-bg', v.bg);
    hero.style.setProperty('--hero-fg', v.fg);
    hero.style.setProperty('--hero-accent', v.accent);
  }, [t.heroVariant]);

  // Custom overrides (apply on top of variant)
  React.useEffect(() => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    if (t.heroBg) hero.style.setProperty('--hero-bg', t.heroBg);
    if (t.heroAccent) hero.style.setProperty('--hero-accent', t.heroAccent);
  }, [t.heroBg, t.heroAccent]);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--font-display', FONT_STACKS[t.displayFont] || FONT_STACKS.Cinzel);
  }, [t.displayFont]);

  React.useEffect(() => {
    const m = document.querySelector('.marquee');
    if (m) m.style.display = t.showMarquee ? '' : 'none';
  }, [t.showMarquee]);

  React.useEffect(() => {
    const f = document.querySelector('.faq');
    if (f) f.style.display = t.showFAQ ? '' : 'none';
  }, [t.showFAQ]);

  React.useEffect(() => {
    const l = document.querySelector('.lineup');
    if (l) l.style.display = t.showLineup ? '' : 'none';
  }, [t.showLineup]);

  React.useEffect(() => {
    const o = document.querySelector('.wordmark .o');
    if (o) o.classList.toggle('spin', t.rotateO);
  }, [t.rotateO]);

  React.useEffect(() => {
    const left = Math.max(0, Math.min(25, t.spotsLeft));
    const taken = 25 - left;
    const heroStatus = document.querySelector('.hero-meta-item:nth-child(4) strong');
    if (heroStatus) heroStatus.textContent = `${left} of 25 left`;
    const fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = `${(left / 25) * 100}%`;
    const lbl = document.querySelector('.number-progress-label');
    if (lbl) lbl.textContent = `${left} of 25 places open · closing when full`;
    const minus = document.querySelector('.number-display .minus');
    if (minus) minus.textContent = `minus ${taken} spoken for`;
  }, [t.spotsLeft]);

  // When the variant radio changes, also reset the custom colors to match
  const setVariant = (v) => {
    const preset = HERO_VARIANTS[v];
    setTweak('heroVariant', v);
    if (preset) {
      setTweak('heroBg', preset.bg);
      setTweak('heroAccent', preset.accent);
    }
  };

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Hero" />
      <TweakRadio label="Variant" value={t.heroVariant}
        options={['black', 'white', 'pink', 'green', 'red', 'lime']}
        onChange={setVariant} />
      <TweakColor label="Hero bg" value={t.heroBg} onChange={(v) => setTweak('heroBg', v)} />
      <TweakColor label="Hero accent" value={t.heroAccent} onChange={(v) => setTweak('heroAccent', v)} />

      <TweakSection label="Type" />
      <TweakRadio label="Display font" value={t.displayFont}
        options={['Cinzel', 'Playfair']}
        onChange={(v) => setTweak('displayFont', v)} />

      <TweakSection label="Composition" />
      <TweakToggle label="Marquee ticker" value={t.showMarquee} onChange={(v) => setTweak('showMarquee', v)} />
      <TweakToggle label="Lineup grid" value={t.showLineup} onChange={(v) => setTweak('showLineup', v)} />
      <TweakToggle label="FAQ section" value={t.showFAQ} onChange={(v) => setTweak('showFAQ', v)} />
      <TweakToggle label="Rotate the O" value={t.rotateO} onChange={(v) => setTweak('rotateO', v)} />

      <TweakSection label="Scarcity" />
      <TweakSlider label="Spots left" value={t.spotsLeft} min={0} max={25} step={1}
        onChange={(v) => setTweak('spotsLeft', v)} />
    </TweaksPanel>
  );
}

const tweaksMount = document.createElement('div');
document.body.appendChild(tweaksMount);
ReactDOM.createRoot(tweaksMount).render(<TweaksApp />);
