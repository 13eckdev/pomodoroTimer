const randomizeParticleLocation = (p) => {
  p.style.setProperty("left", `${Math.floor(Math.random() * 80) + 10}vw`);
  p.style.setProperty("top", `${Math.floor(Math.random() * 90) + 10}vh`);
  p.style.setProperty("--speed", Math.max( 0.2, Math.random()));
  p.style.setProperty("--delay", Math.random());
}

const makeParticle = () => {
  const p = document.createElement("div");
  p.classList.add("particle");
  return p;
}

const particleList = Array.from({length: 100}, () => {
  const p = makeParticle();
  p.dataset.emoji = "🖥️";
  p.style.setProperty("animation-name", "floatingEmoji");
  randomizeParticleLocation(p);
  particles.append(p);
});


particles.addEventListener("animationend", (e) =>{
  const currentAnimation = e.target.style.animationName;
  // e.target.style.setProperty("animation-name", "none");
  randomizeParticleLocation(e.target);
  e.target.style.setProperty("animation-name", currentAnimation === "floatingEmoji" ? "floatingEmoji2" : "floatingEmoji");  
});