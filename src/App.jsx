import { useState, useEffect } from "react";
import { D } from "./data";

const KEY = "portfolio_email";
const ENDPOINT = import.meta.env.VITE_EMAIL_ENDPOINT;
const RESUME = "/Yugendhar_G_Resume.pdf";

function useTyped(words) {
  const [t, setT] = useState("");
  useEffect(() => {
    let i = 0, j = 0, del = false, id;
    const tick = () => {
      const w = words[i];
      setT(w.slice(0, j));
      if (!del && j === w.length) { del = true; id = setTimeout(tick, 1400); return; }
      if (del && j === 0) { del = false; i = (i + 1) % words.length; }
      j += del ? -1 : 1;
      id = setTimeout(tick, del ? 40 : 80);
    };
    tick();
    return () => clearTimeout(id);
  }, []);
  return t;
}

function Gate({ onDone }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setErr("Enter a valid email address, like name@example.com.");
    setBusy(true);
    try {
      if (ENDPOINT) await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ email: email.trim() }) });
    } catch {}
    try { localStorage.setItem(KEY, email.trim()); } catch {}
    onDone();
  };
  return (
    <div className="gate">
      <div className="blob b1" /><div className="blob b2" />
      <form className="gate-card" onSubmit={submit}>
        <img src="/photo.jpg" alt="Yugendhar G" className="gate-img" />
        <h1 className="grad">Yugendhar G</h1>
        <p className="muted">Java Full Stack Developer. Enter your email to view my portfolio.</p>
        <input type="email" placeholder="you@company.com" value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} aria-label="Email address" required />
        {err && <p className="err" role="alert">{err}</p>}
        <button className="btn primary" disabled={busy}>{busy ? "Opening…" : "View portfolio"}</button>
      </form>
    </div>
  );
}

function ResumeModal({ onClose }) {
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, []);
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-box" role="dialog" aria-label="Resume preview" onClick={(e) => e.stopPropagation()}>
        <div className="modal-bar">
          <b>Resume preview</b>
          <div>
            <a className="btn primary sm" href={RESUME} download="Yugendhar_G_Resume.pdf">Download PDF</a>
            <a className="btn sm" href={RESUME} target="_blank" rel="noreferrer">Open in new tab</a>
            <button className="btn sm" onClick={onClose}>Close</button>
          </div>
        </div>
        <iframe title="Resume" src={RESUME + "#toolbar=0&navpanes=0"} />
      </div>
    </div>
  );
}

export default function App() {
  const [ok, setOk] = useState(() => { try { return !!localStorage.getItem(KEY); } catch { return false; } });
  const [show, setShow] = useState(false);
  const role = useTyped(D.roles);
  useEffect(() => {
    const m = (e) => { const s = document.documentElement.style; s.setProperty("--x", e.clientX + "px"); s.setProperty("--y", e.clientY + "px"); };
    addEventListener("mousemove", m);
    return () => removeEventListener("mousemove", m);
  }, []);
  if (!ok) return <Gate onDone={() => setOk(true)} />;
  return (
    <>
      <div className="spot" /><div className="blob b1" /><div className="blob b2" />
      <nav>
        <span className="logo grad">Yugendhar G</span>
        <ul>{["about", "skills", "experience", "projects", "education", "contact"].map((s) => <li key={s}><a href={"#" + s}>{s[0].toUpperCase() + s.slice(1)}</a></li>)}</ul>
        <button className="btn primary sm" onClick={() => setShow(true)}>View resume</button>
      </nav>

      <section className="hero" id="home">
        <div className="hero-text">
          <p className="muted">Hi, I'm</p>
          <h1 className="grad">Yugendhar G</h1>
          <p className="role">{role}</p>
          <p className="lead">{D.about}</p>
          <div className="cta">
            <a className="btn primary" href="#projects">See my projects</a>
            <button className="btn" onClick={() => setShow(true)}>Preview resume</button>
          </div>
        </div>
        <div className="photo"><img src="/photo.jpg" alt="Yugendhar G" /></div>
      </section>

      <section id="about">
        <h2>About me</h2>
        <div className="stats">{D.stats.map(([a, b]) => <div className="card stat" key={b}><b className="grad">{a}</b><span className="muted">{b}</span></div>)}</div>
      </section>

      <section id="skills">
        <h2>Skills</h2>
        <div className="grid">{Object.entries(D.skills).map(([g, list], gi) => (
          <div className="card" key={g}><h3>{g}</h3>
            <div className="chips">{list.map((s) => <span key={s} className={"chip" + (gi % 2 ? " o" : "")}>{s}</span>)}</div></div>
        ))}</div>
      </section>

      <section id="experience">
        <h2>Experience</h2>
        <div className="timeline card">
          <h3>{D.job.role}</h3>
          <p className="muted">{D.job.org}, {D.job.where} · {D.job.date}</p>
          <ul className="pts">{D.job.pts.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
      </section>

      <section id="projects">
        <h2>Projects</h2>
        <div className="grid">{D.projects.map((p) => (
          <article className="card" key={p.t}>
            <div className="banner" style={{ background: `linear-gradient(135deg, ${p.c[0]}, ${p.c[1]})` }}><span className="wm">{p.t}</span></div>
            <h3>{p.t}</h3><p className="muted">{p.k}</p>
            <p className="desc">{p.d}</p>
            <div className="chips">{p.stack.map((s) => <span className="chip" key={s}>{s}</span>)}</div>
          </article>
        ))}</div>
      </section>

      <section id="education">
        <h2>Education</h2>
        <div className="grid">{D.edu.map(([a, b, c]) => <div className="card" key={a}><h3>{a}</h3><p>{b}</p><p className="muted">{c}</p></div>)}</div>
      </section>

      <section id="contact" className="contact">
        <h2>Let's work together</h2>
        <p className="lead">I'm looking for an entry-level Java Backend or Junior Full Stack Developer role.</p>
        <div className="links">
          <a className="btn primary" href={"mailto:" + D.email}>{D.email}</a>
          <a className="btn" href={"tel:" + D.phone.replace(/\s/g, "")}>{D.phone}</a>
          <a className="btn" href={D.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="btn" href={D.github} target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </section>
      <footer>© {new Date().getFullYear()} Yugendhar G · Built with React + Vite</footer>
      {show && <ResumeModal onClose={() => setShow(false)} />}
    </>
  );
}
