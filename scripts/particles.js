const randomizeParticleLocation = (p) => {
  p.style.setProperty("left", `${Math.floor(Math.random() * 80) + 10}vw`);
  p.style.setProperty("top", `${Math.floor(Math.random() * 90) + 10}vh`);
  p.style.setProperty("--speed", Math.max( 0.2, Math.random()));
  p.style.setProperty("--delay", Math.random());
  p.dataset.emoji = "🖥️";
}

const makeParticle = () => {
  const p = document.createElement("div");
  p.classList.add("particle");
  return p;
}

const particleList = Array.from({length: 100}, () => {
  const p = makeParticle();
  randomizeParticleLocation(p);
  particles.append(p);
});


// particles.addEventListener("animationend", (e) =>{
//   particles.removeChild(e.target);
//   const p = makeParticle();
//   randomizeParticleLocation(p);
//   particles.append(p);
// });