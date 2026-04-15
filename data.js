// The Tapestry — data for the knowledge tower.
// Every law is one rung. "deps" tells us which rungs it stands on.
// The app computes each rung's layer from the longest chain of deps,
// so the tower is literal: height = how deep the idea's roots run.
//
// Each law has five levels of explanation so anyone — a curious child,
// a student, or a working scientist — finds a way in:
//   eli5          a playful analogy a five-year-old can follow
//   intermediate  a clear story for a curious teenager or adult
//   expert        technical formalism for a graduate-level reader
//   surprise      one punchy, astonishing consequence
//   history       who discovered it, when, and how

const DOMAINS = {
  math:      { label: 'Mathematics & Logic',       color: '#f7b733' },
  principle: { label: 'Deep Principles',           color: '#c471ed' },
  mechanics: { label: 'Classical Mechanics',       color: '#4facfe' },
  thermo:    { label: 'Thermodynamics',            color: '#ff8a65' },
  em:        { label: 'Electromagnetism',          color: '#ffd166' },
  relativity:{ label: 'Relativity',                color: '#06d6a0' },
  quantum:   { label: 'Quantum',                   color: '#e91e63' },
  forces:    { label: 'Fundamental Forces',        color: '#b388ff' },
  chemistry: { label: 'Chemistry',                 color: '#64ffda' },
  biology:   { label: 'Biology & Evolution',       color: '#8bc34a' },
  info:      { label: 'Information & Computation', color: '#00e5ff' },
  emergence: { label: 'Emergence & Complexity',    color: '#ff6f91' },
  cosmos:    { label: 'Cosmology',                 color: '#7986cb' },
};

const LAWS = [

  // ───────────────────────────── FOUNDATIONS: LOGIC & MATH ──────────────────

  {
    id: 'logic', name: 'Logic', domain: 'math', symbol: '∧ ∨ ¬',
    tagline: 'The rules of thinking itself.',
    equation: 'P → Q',
    deps: [], sim: null,
    eli5: `Before anyone can know anything, we need a way to think straight. Logic is the game of "if this, then that." If all puppies are fluffy and Rex is a puppy, then Rex is fluffy. These rules work the same for everyone, everywhere — on Earth, on Mars, even for aliens we've never met. Logic is the ground floor of the whole building of knowledge.`,
    intermediate: `Classical logic stands on three laws: identity (A is A), non-contradiction (something can't be both A and not-A at once), and excluded middle (it's either A or not-A). From these, mathematicians build proofs, computers execute programs, and scientists test theories. "True" almost always means: assuming the premises, the conclusion follows by logical steps. Every other branch of human knowledge — from arithmetic to quantum field theory — has logic as its ultimate grammar.`,
    expert: `First-order logic (FOL) formalises reasoning with quantifiers, predicates and connectives, and is sound and complete (Gödel's completeness theorem, 1929). Peano arithmetic embedded in FOL is, by Gödel's first incompleteness theorem (1931), either incomplete or inconsistent: there exist true arithmetic sentences unprovable within it. Tarski's undefinability theorem forbids a consistent theory from defining its own truth predicate. Alternative logics (intuitionistic, modal, linear, paraconsistent) adjust which classical laws hold — e.g. intuitionistic logic drops excluded middle and underpins constructive mathematics and the Curry–Howard correspondence between proofs and programs.`,
    surprise: `Gödel proved that any consistent system rich enough to do arithmetic contains true statements it cannot prove. Mathematics, the citadel of certainty, has unreachable rooms.`,
    history: `Aristotle (~350 BCE) compiled the first syllogistic system in the Organon. Frege (1879) invented modern symbolic logic. Russell and Whitehead's Principia Mathematica (1910) tried to reduce all maths to logic. Gödel demolished that dream in 1931 with his incompleteness theorems.`,
  },

  {
    id: 'sets', name: 'Set Theory', domain: 'math', symbol: '∈',
    tagline: 'The language mathematics speaks.',
    equation: 'ℵ₀ < 2^ℵ₀',
    deps: ['logic'], sim: null,
    eli5: `A set is just a bag of things — any things. A bag of apples. A bag of all cats. A bag of all numbers. Once you can talk about bags, you can talk about almost anything: bags inside bags, bags that have the same count, bags that are bigger than other bags — even bags of infinity!`,
    intermediate: `In the late 1800s, Georg Cantor showed something shocking: there are different sizes of infinity. The whole numbers are infinite, but the real numbers are *more* infinite — you can't pair them up one-to-one. Modern maths is built on a tiny handful of rules about sets (the ZFC axioms), from which everything else — numbers, functions, geometry, calculus — can be constructed. Set theory is the common language every branch of mathematics is translated into.`,
    expert: `Zermelo–Fraenkel set theory with Choice (ZFC) is the standard foundation. Cantor's diagonal argument proves |ℝ| > |ℕ|; the continuum hypothesis (is there a cardinality strictly between?) was shown independent of ZFC by Gödel (consistency, 1940) and Cohen (independence, 1963) using forcing. The axiom of choice is equivalent to Zorn's lemma and the well-ordering theorem but has paradoxical consequences (Banach–Tarski decomposition). Alternative foundations include NBG, MK, topos theory and Univalent Foundations / HoTT, each trading subtly different expressive power.`,
    surprise: `Some infinities are bigger than others. Infinite decimals outnumber integers — there's no way to list all real numbers, no matter how clever your scheme.`,
    history: `Georg Cantor invented set theory in the 1870s, was ridiculed, hospitalised, and vindicated. Russell's paradox (1901) nearly broke the subject; Zermelo's axiomatisation (1908) rescued it. Paul Cohen's 1963 forcing technique won a Fields Medal for showing the continuum hypothesis is undecidable.`,
  },

  {
    id: 'numbers', name: 'Numbers & Counting', domain: 'math', symbol: 'ℕ',
    tagline: 'The first act of abstraction.',
    equation: '1, 2, 3, … ∞',
    deps: ['logic', 'sets'], sim: null,
    eli5: `Numbers are what you get when you forget everything about a pile of stuff except how many things there are. Three apples, three rocks, three friends — they all share the idea of "three." Once we had numbers, we could count, trade, measure, and build everything made of maths.`,
    intermediate: `The natural numbers (1, 2, 3…) were humanity's first abstract objects. From them we build integers (add negatives), rationals (add fractions), reals (add limits like π and √2), and complex numbers (add i = √-1). Each extension solves a problem the previous set couldn't — integers let us subtract freely, reals let us take limits, complex numbers let us solve every polynomial equation. The whole tower of modern mathematics balances on this staircase of number systems.`,
    expert: `Peano's axioms define ℕ via zero and a successor function. The reals ℝ are constructed as Dedekind cuts of ℚ, or equivalence classes of Cauchy sequences, uniquely realising a complete ordered field. The complex numbers ℂ form the algebraic closure of ℝ; the quaternions ℍ and octonions 𝕆 extend further at the price of commutativity and associativity. Number theory — the study of ℤ — contains some of mathematics' deepest open problems: the Riemann hypothesis, the abc conjecture, the distribution of primes.`,
    surprise: `Almost every real number is "uncomputable" — no algorithm can ever write it down. We can only name a tiny handful.`,
    history: `Sumerian accountants (c. 3000 BCE) invented place-value notation. Brahmagupta formalised zero and negatives in 628 CE. Complex numbers were "imaginary" until Gauss gave them a geometric home in the 1800s. Peano's axioms came in 1889.`,
  },

  {
    id: 'geometry', name: 'Geometry', domain: 'math', symbol: '△',
    tagline: 'The shape of space.',
    equation: 'a² + b² = c²',
    deps: ['numbers', 'logic'], sim: 'pythagoras',
    eli5: `Geometry is the maths of shapes. Stretch a string tight and you get a straight line. Spin a string around a pin and you get a circle. These rules are so reliable that the Egyptians used them to rebuild farm boundaries after the Nile flooded — and we use them today to aim rockets at Mars.`,
    intermediate: `Around 300 BCE Euclid showed you could derive almost all of geometry from just five axioms. Later mathematicians discovered his fifth (the parallel postulate) was optional — drop it and you get new geometries for curved surfaces like the sphere and the hyperbolic plane. This was the first time humans fully appreciated the power of axioms: pick a few simple rules and an entire universe of truths tumbles out.`,
    expert: `Euclidean geometry is the model of ℝⁿ with its standard inner product; Gauss's *Theorema Egregium* showed curvature is intrinsic. Non-Euclidean geometries (Bolyai, Lobachevsky) arose from negating the parallel postulate. Riemann generalised to arbitrary manifolds with metric tensors; Einstein used this machinery for general relativity. Modern differential geometry — fibre bundles, connections, gauge fields — underlies both the Standard Model and attempts at quantum gravity.`,
    surprise: `On the surface of the Earth, a triangle's angles add up to more than 180°. Pythagoras's theorem is only exactly true in perfectly flat space.`,
    history: `Euclid wrote the *Elements* around 300 BCE — the most influential mathematical text in history, used as a textbook for 2,300 years. Gauss, Bolyai and Lobachevsky discovered non-Euclidean geometry independently in the early 1800s. Riemann introduced modern differential geometry in 1854.`,
  },

  {
    id: 'algebra', name: 'Algebra', domain: 'math', symbol: 'x',
    tagline: 'Letting numbers be unknown.',
    equation: '2x + 3 = 11',
    deps: ['numbers', 'logic'], sim: null,
    eli5: `Sometimes you don't know a number yet, but you know something about it. "I'm thinking of a number. Double it, add three, and you get eleven. What is it?" Algebra is the trick of calling the unknown number x and bossing it around with rules until it reveals itself.`,
    intermediate: `Algebra turns arithmetic into a toolkit for reasoning about relationships. Once you can manipulate symbols with rules, you can express laws that hold for *any* number — not just specific ones — which is exactly what physics needs. The language of science, from F = ma to E = mc², is algebra. Abstract algebra studies the structures themselves: groups, rings, fields. These structures turn out to describe the symmetries of space and the behaviour of atoms.`,
    expert: `Abstract algebra classifies structures by their operations. Groups axiomatise symmetry: Sophus Lie's continuous groups parametrise physical symmetries, and their Lie algebras encode infinitesimal generators. Galois theory links field extensions to groups, proving the unsolvability of quintic equations by radicals. Rings, modules, categories and schemes underpin algebraic geometry (Grothendieck) and number theory (Wiles' proof of Fermat's Last Theorem). Representation theory — how groups act linearly — is the backbone of particle physics.`,
    surprise: `You cannot solve a general polynomial equation of degree 5 or higher with a formula involving only roots. Évariste Galois proved this at age 20 and died in a duel three years later.`,
    history: `Al-Khwārizmī's *al-Kitāb al-mukhtaṣar fī ḥisāb al-jabr wa-l-muqābala* (c. 820 CE) gave us the word "algebra." Viète (1591) introduced letters for unknowns. Galois (1832) invented group theory the night before he was killed in a duel.`,
  },

  {
    id: 'euler', name: "Euler's Identity", domain: 'math', symbol: 'eⁱᵖ',
    tagline: 'Five constants, one equation.',
    equation: 'e^(iπ) + 1 = 0',
    deps: ['algebra', 'calculus'], sim: null,
    eli5: `Imagine spinning round and round on a roundabout. Leonhard Euler found a single sentence that connects spinning, growing, circles, imaginary numbers and zero — all at once. Many mathematicians call it the most beautiful equation ever written, because it shouldn't be so short, but it is.`,
    intermediate: `Euler's identity unites the five most important numbers in mathematics: 0 and 1 (the additive and multiplicative identities), π (geometry of circles), e (the base of natural growth), and i (the imaginary unit). The identity e^(iπ) + 1 = 0 says that rotating by π radians in the complex plane lands you at −1. More generally, e^(iθ) = cos θ + i sin θ — the exponential function is a rotation, which is why complex numbers describe waves, oscillations, and quantum amplitudes so elegantly.`,
    expert: `Euler's formula arises from comparing Taylor series: e^(ix) = Σ (ix)ⁿ/n! separates into real (cos x) and imaginary (sin x) parts. It maps the real line to the unit circle and is the simplest example of Lie group theory (U(1) ≅ S¹). In physics, wave functions are complex exponentials e^(i(kx − ωt)); Fourier analysis decomposes arbitrary functions into such exponentials. The analogous exponential map for non-abelian Lie groups generates gauge transformations in the Standard Model.`,
    surprise: `Raising a real number to an imaginary power makes it spin. That single fact — eⁱᵗ rotates through the complex plane — is why every wave, orbit, and quantum state in physics is most naturally written with complex numbers.`,
    history: `Leonhard Euler published the formula in 1748 in his *Introductio in analysin infinitorum*. Euler produced so much mathematics in his lifetime that his collected works fill 92 volumes; he continued working for 17 years after going completely blind.`,
  },

  {
    id: 'calculus', name: 'Calculus', domain: 'math', symbol: '∫ d/dt',
    tagline: 'The mathematics of change.',
    equation: 'f′(x) = lim (f(x+h) − f(x))/h',
    deps: ['algebra', 'geometry'], sim: 'calculus',
    eli5: `Imagine rolling a ball down a hill. It speeds up. How fast is it going right *now*, at this exact instant? Calculus is the amazing trick that lets you answer "right now." It slices time into impossibly thin slivers and asks: over a sliver this small, how much did things change?`,
    intermediate: `Newton and Leibniz independently invented calculus in the late 1600s. It has two halves: the derivative (the instantaneous rate of change — speed is the derivative of position) and the integral (the total accumulation — distance is the integral of speed). The fundamental theorem of calculus says these operations are inverses of each other. With calculus, any process that changes smoothly — orbits, heat flow, populations, currents, fluid motion — can be written down and solved.`,
    expert: `Real analysis rigorises calculus using ε–δ limits (Weierstrass) and measure theory (Lebesgue). Differential equations generalise to partial differential equations (PDEs) for functions of several variables: the heat equation, wave equation, Laplace equation and Navier–Stokes govern much of classical physics. Variational calculus extremises functionals and gives rise to the Euler–Lagrange equations, the bedrock of Lagrangian mechanics. Complex analysis, stochastic calculus (Itô) and functional analysis extend the machinery in directions crucial to physics and finance.`,
    surprise: `A function can be continuous everywhere and yet differentiable nowhere — a jagged curve with no smooth spots anywhere. Weierstrass built the first example in 1872 and mathematicians were appalled.`,
    history: `Newton developed the "method of fluxions" around 1666 during the plague-year he spent at home from Cambridge. Leibniz reached the same ideas independently in 1674 and invented the modern notation (∫, d/dx). A bitter priority dispute between them soured British and Continental mathematics for a century.`,
  },

  {
    id: 'probability', name: 'Probability', domain: 'math', symbol: 'P(x)',
    tagline: 'The mathematics of not knowing.',
    equation: 'P(A|B) = P(B|A)·P(A) / P(B)',
    deps: ['algebra', 'sets'], sim: null,
    eli5: `When you roll a die, you don't know which face will land up — but you know each face is equally likely, so each has a 1-in-6 chance. Probability is the maths of "I don't know exactly, but I know how likely." It turns out this maths runs everything from insurance to quantum physics.`,
    intermediate: `Probability measures uncertainty on a scale from 0 (impossible) to 1 (certain). From Kolmogorov's three axioms we get a whole calculus of uncertainty: conditional probability, Bayes' theorem, expectations, distributions. Statistics applies probability to data: given what we observed, what should we believe? Probability is essential for statistical mechanics (many particles), quantum theory (the laws themselves are probabilistic), machine learning, finance, and any science that has to infer from noisy measurements.`,
    expert: `Kolmogorov's 1933 axiomatisation defines a probability space (Ω, ℱ, P) where ℱ is a σ-algebra of events. Random variables are measurable functions, expectations are Lebesgue integrals. Key theorems: the law of large numbers, the central limit theorem, the strong ergodic theorem. Bayesian inference treats probabilities as degrees of belief updated via Bayes' rule; frequentist statistics treats them as long-run frequencies. Stochastic processes (Markov chains, Brownian motion) extend the framework to time-dependent randomness; martingale theory underpins modern finance.`,
    surprise: `In a room of just 23 people, there's a better than 50% chance that two share a birthday. Human intuition is breathtakingly bad at probability.`,
    history: `Pascal and Fermat exchanged letters in 1654 about gambling odds — the birth of probability theory. Bayes' posthumous essay (1763) introduced conditional reasoning. Kolmogorov's axioms (1933) put the whole field on rigorous ground.`,
  },

  // ───────────────────────────── DEEP PRINCIPLES ────────────────────────────

  {
    id: 'symmetry', name: 'Symmetry', domain: 'principle', symbol: '↺',
    tagline: 'Change without difference.',
    equation: 'symmetry ↔ conservation',
    deps: ['algebra', 'geometry'], sim: null,
    eli5: `A circle looks the same no matter how you turn it. A starfish looks the same if you rotate it by a fifth. Symmetry is when something stays the same after you change it. The incredible thing is: the deepest laws of nature *are* symmetries. If the rules don't care what time it is, energy is conserved. If they don't care where you are, momentum is conserved. Symmetries *are* the laws.`,
    intermediate: `In 1915, Emmy Noether proved one of the most beautiful theorems in all of science: every continuous symmetry of the laws of physics gives rise to a conserved quantity. Time-translation symmetry → conservation of energy. Space-translation symmetry → conservation of momentum. Rotation symmetry → conservation of angular momentum. Gauge symmetries → conservation of charge. This one theorem welded geometry, algebra and physics together. Modern physics is largely a search for the symmetries of nature.`,
    expert: `Noether's theorem associates to every 1-parameter group of transformations of an action functional a divergence-free current J^μ whose integral over a spacelike slice is conserved. In the Hamiltonian formalism, symmetries correspond to functions on phase space that Poisson-commute with the Hamiltonian. Gauge symmetries (U(1), SU(2), SU(3) in the Standard Model) are local: their "conserved quantities" are more subtle, encoded in constraint algebras and Ward identities. Spontaneous symmetry breaking (Goldstone, Higgs) generates massless bosons or, coupled to gauge fields, massive ones.`,
    surprise: `The reason energy is conserved is not a separate law — it follows automatically from the fact that the laws of physics are the same today as tomorrow. Noether proved it.`,
    history: `Emmy Noether published her theorem in 1918 at Hilbert's invitation in Göttingen, but as a woman she was initially barred from formal academic positions. Einstein called her the most significant creative mathematical genius since women's higher education began.`,
  },

  {
    id: 'action', name: 'Principle of Least Action', domain: 'principle', symbol: 'δS = 0',
    tagline: 'Nature is lazy — beautifully.',
    equation: 'S = ∫L dt,   δS = 0',
    deps: ['calculus', 'symmetry'], sim: 'action',
    eli5: `If you throw a ball, it traces a curve through the air. Of all the possible paths it could have taken, why *that* one? The magical answer: nature always picks the path that makes a special quantity called "action" as small as possible. A ball, a ray of light, a tumbling planet — they all find the "laziest" path. From this one rule you can derive nearly all of physics.`,
    intermediate: `The principle of stationary action says a physical system evolves along the path that makes the integral of its Lagrangian (kinetic energy minus potential energy) stationary. From this single principle you can derive Newton's laws, Maxwell's equations, Einstein's general relativity, and even quantum field theory. In Feynman's path-integral formulation, a quantum particle literally "tries" every path; most cancel by interference, and the classical path is the one where they all add up. It's the closest physics gets to a single deep principle everything else flows from.`,
    expert: `Euler–Lagrange equations are the necessary conditions for δS = 0 where S[q] = ∫ L(q, q̇, t) dt. The Legendre transform moves us to Hamiltonian mechanics: H = pq̇ − L, with phase-space flow generated by the symplectic form. In field theory the action is ∫ ℒ(φ, ∂φ) d⁴x, and Lorentz invariance of ℒ guarantees relativistic consistency. Feynman's path integral Z = ∫ 𝒟φ e^(iS/ℏ) is the quantum-mechanical version: the classical limit is ℏ → 0, stationary phase. Gauge theories arise by demanding local symmetry of ℒ.`,
    surprise: `A single principle — "minimise the action" — gives you Newtonian mechanics, relativity and quantum field theory. It is as close as physics has come to a theory of everything.`,
    history: `Maupertuis stated an early form in 1744 and declared it proof of God's parsimony. Euler, Lagrange, and later Hamilton rigorised it. Richard Feynman's 1942 PhD thesis reformulated quantum mechanics as a sum over histories using the same principle.`,
  },

  {
    id: 'conservation', name: 'Conservation Laws', domain: 'principle', symbol: 'ΔE = 0',
    tagline: 'Some things never change.',
    equation: 'E, p, L, Q = const',
    deps: ['symmetry', 'action'], sim: 'collision',
    eli5: `Some quantities in nature are like a magic bank balance — you can move them around, turn them into different forms, but the total never changes. Energy is like that. So is momentum (how hard things are moving). So is electric charge. No matter what happens, the universe's totals stay exactly the same.`,
    intermediate: `Conservation laws are the most reliable laws we have. By Noether's theorem, each one comes from a symmetry: energy from time-symmetry, momentum from space-symmetry, angular momentum from rotation, charge from a gauge symmetry. They let physicists solve problems without knowing the details — "whatever messy stuff happens, the totals before and after must match." That's why they're the first tool you reach for in any physics problem, from billiard balls to galaxy collisions.`,
    expert: `In general relativity, energy is conserved only locally because time-translation symmetry is broken by cosmic expansion — the cosmological redshift literally dilutes photon energy. The stress–energy tensor T^μν satisfies ∇_μ T^μν = 0, not a global conservation law. Gauge symmetries yield conserved currents via Noether's second theorem, and in QFT quantum anomalies can break classical conservation laws (e.g. the chiral anomaly in QED). Topological charges (winding number, Chern class) provide conserved quantities not associated with any local symmetry.`,
    surprise: `Energy is *not* conserved in general relativity on cosmological scales. The expansion of space stretches photons, literally stealing their energy. The universe is a slight cheat.`,
    history: `Leibniz championed an early form ("vis viva," 1686). Joule's paddlewheel experiments (1845) established the mechanical equivalent of heat. The law of conservation of energy was finally articulated by Helmholtz (1847) and Kelvin.`,
  },

  // ───────────────────────────── CLASSICAL MECHANICS ────────────────────────

  {
    id: 'newton', name: "Newton's Laws of Motion", domain: 'mechanics', symbol: 'F = ma',
    tagline: 'How stuff moves when pushed.',
    equation: 'F = m·a',
    deps: ['calculus', 'conservation', 'action'], sim: 'newton',
    eli5: `Three simple rules. One: things keep doing what they're doing unless something pushes them — a hockey puck on perfect ice slides forever. Two: how fast something speeds up depends on how hard you push and how heavy it is. Three: if you push something, it pushes you back just as hard. That's why rockets work — they shove gas out the back and the gas shoves the rocket forward.`,
    intermediate: `Newton published his three laws in 1687 in the *Principia Mathematica*: inertia, F = ma, and action–reaction. Together with his law of universal gravitation they explained falling apples, orbiting planets, tides, and comets in a single unified theory. For 200 years Newton's mechanics *was* physics. Even today, for anything slow compared to light and big compared to atoms — which is most of engineering — Newton is still the right answer.`,
    expert: `Newtonian mechanics is the Galilean-covariant limit of special relativity (v ≪ c) and the classical limit of quantum mechanics (ℏ → 0). Its Lagrangian formulation L = T − V and Hamiltonian reformulation H = T + V reveal phase-space structure and the deep role of symmetries. Non-inertial frames require fictitious forces (centrifugal, Coriolis) which in GR become geodesic curvature. Chaos (Poincaré, Lorenz) shows that even simple deterministic Newtonian systems can exhibit exponential sensitivity to initial conditions, limiting long-term predictability.`,
    surprise: `Newton invented calculus specifically because he couldn't write down his laws of motion without it. Physics demanded a new mathematics, and he produced it.`,
    history: `Newton formulated his laws during the plague year 1665–66 when Cambridge was closed and he retreated to the family farm. The *Principia* was published in 1687, funded by Edmond Halley because the Royal Society had spent its budget on a book about fish.`,
  },

  {
    id: 'kepler', name: "Kepler's Laws", domain: 'mechanics', symbol: '☉',
    tagline: 'How planets really move.',
    equation: 'T² ∝ a³',
    deps: ['geometry', 'newton'], sim: null,
    eli5: `Planets don't go around the Sun in perfect circles. Johannes Kepler worked out they actually go in stretched-out ovals called ellipses, with the Sun sitting at one squished side. They go fastest when they're closest to the Sun and slowest when they're farthest. And small planets whip around fast while big outer ones plod. Three simple rules describe the entire clockwork of a solar system.`,
    intermediate: `(1) Planets travel in ellipses with the Sun at one focus. (2) A line from Sun to planet sweeps equal areas in equal times — so orbits speed up near the Sun and slow down far from it. (3) The square of a planet's year is proportional to the cube of its average distance — Mars's 1.88-year year and 1.52-AU orbit are linked by exactly this formula. Kepler extracted these rules from naked-eye observations before Newton explained *why* they held.`,
    expert: `Kepler's laws are rigorous consequences of the 1/r² force law combined with conservation of angular momentum. Equal areas follow from L = mr² θ̇ = const. The elliptic orbit is a conic section arising from the Laplace–Runge–Lenz vector, which is conserved for inverse-square potentials only; this hidden symmetry (SO(4) in the bound-state case) explains the accidental degeneracy of hydrogen's energy levels. General relativity corrects Kepler's third law at order (v/c)² — the anomalous perihelion precession of Mercury (43″ per century) was the first classical test of GR.`,
    surprise: `Kepler spent 20 years trying to fit Mars's orbit to a circle before he gave up and tried an ellipse. The "failure" of circles to fit the data to within 8 arcminutes overturned two millennia of astronomy.`,
    history: `Kepler used Tycho Brahe's meticulous pre-telescope observations of Mars. He published the first two laws in *Astronomia Nova* (1609) and the third in *Harmonices Mundi* (1619), alongside his attempt to relate planetary orbits to the five Platonic solids.`,
  },

  {
    id: 'gravity', name: 'Universal Gravitation', domain: 'mechanics', symbol: 'G',
    tagline: 'Everything pulls on everything.',
    equation: 'F = G m₁m₂ / r²',
    deps: ['newton', 'kepler'], sim: 'orbit',
    eli5: `Every piece of stuff in the universe tugs on every other piece. The tug gets stronger when things are heavier and weaker when they're farther apart — a lot weaker, fast. Earth tugs on you, you tug back on Earth (equally!), the Moon tugs on the oceans and makes tides, and the Sun tugs the whole Earth around in a big loop. Same rule everywhere.`,
    intermediate: `Newton's law of universal gravitation: F = G·m₁·m₂ / r². Two masses attract along the line between them, proportional to the product of the masses and inversely proportional to the square of their distance. The inverse-square law matters — double the distance, quarter the force. From this single equation Newton derived Kepler's three laws and explained the tides. For anything short of black holes, Newton's gravity is still the right tool.`,
    expert: `G ≈ 6.674 × 10⁻¹¹ N·m²/kg² is the least precisely known fundamental constant. Newton's gravity is the weak-field static limit of Einstein's general relativity: the Newtonian potential Φ satisfies Poisson's equation ∇²Φ = 4πGρ, which is the c → ∞ limit of the Einstein field equations. The equivalence principle (inertial = gravitational mass) is tested to parts per 10¹⁵ and is the empirical seed of GR. Open problems: dark matter (galaxy rotation curves), dark energy (accelerating expansion), and the quantum description of gravity.`,
    surprise: `Gravity is absurdly weak — 10³⁶ times weaker than the electric force. A single fridge magnet can overpower the gravity of the entire Earth. Nobody really knows why.`,
    history: `Newton's theory was published in the *Principia* (1687). Henry Cavendish measured G in 1798 using a torsion balance so sensitive he called it "weighing the Earth." Le Verrier predicted Neptune's existence from anomalies in Uranus's orbit in 1846, confirming Newton's law to spectacular accuracy.`,
  },

  // ───────────────────────────── THERMODYNAMICS ─────────────────────────────

  {
    id: 'thermo', name: 'Laws of Thermodynamics', domain: 'thermo', symbol: 'dS ≥ 0',
    tagline: 'Why time goes forward.',
    equation: 'dU = TdS − PdV',
    deps: ['conservation', 'probability', 'newton'], sim: 'entropy',
    eli5: `Drop an ice cube in hot tea. The tea cools, the ice melts. It never, ever runs backwards — you never see cold tea spontaneously heat up while freezing a cube. This is the deepest "arrow of time" in physics. Heat spreads out, and spread-out heat is much more likely than concentrated heat, just like shuffled cards are more likely than sorted ones. Energy can't be made or destroyed, but it always gets more spread out.`,
    intermediate: `Four laws: (0) Temperature is transitive — A in equilibrium with B and B with C means A with C. (1) Energy is conserved — you can't get out more than you put in. (2) Entropy (a measure of spread-out-ness) never decreases — you can't even break even. (3) As T → 0, S → S₀, a minimum value. The second law is especially profound: it's purely statistical — there are vastly more disordered states than ordered ones, so systems drift toward disorder. This gives time its direction.`,
    expert: `The first law is dU = TdS − PdV + μdN. Entropy S = k_B ln Ω counts accessible microstates (Boltzmann). The second law is a statement about probability: macroscopic decreases in S are not impossible but stupefyingly improbable (relative probabilities ~e^−ΔS/k_B). Free energies F = U − TS (Helmholtz) and G = U − TS + PV (Gibbs) govern equilibria. Near critical points, universality classes emerge: the Ising model, renormalization-group flow, and scaling exponents. Black-hole thermodynamics (Bekenstein–Hawking) extends the laws into gravity, with S = A/4ℓ_P².`,
    surprise: `The entropy of a black hole equals one quarter of its surface area in Planck units. Gravity, which we thought had nothing to do with thermodynamics, obeys the same laws.`,
    history: `Sadi Carnot studied steam engines in 1824 and discovered the ultimate efficiency limit. Clausius coined "entropy" in 1865. Boltzmann gave it a statistical interpretation (S = k log W) engraved on his tombstone. The 1927 Solvay conference cemented the modern framework.`,
  },

  {
    id: 'statmech', name: 'Statistical Mechanics', domain: 'thermo', symbol: 'k_B ln W',
    tagline: 'Temperature is just counting microstates.',
    equation: 'S = k_B ln W',
    deps: ['thermo', 'probability', 'newton'], sim: null,
    eli5: `Imagine a million tiny bouncing balls in a box. You can't track them all — but you don't need to. You can just ask, on average, how fast they're bouncing, how spread out they are, how much energy they share. That averaging trick is statistical mechanics. It's how a jar of air "knows" to be at room temperature without anyone telling it.`,
    intermediate: `Ludwig Boltzmann and Josiah Gibbs showed that the laws of thermodynamics emerge from the statistics of enormous numbers of particles. Temperature is the average energy per particle. Pressure is the average rate of momentum transfer. Entropy counts how many microscopic arrangements (microstates) correspond to the same macroscopic description. Phase transitions — ice to water, iron magnetising — are collective effects of these statistics. The bridge from microscopic determinism to macroscopic thermodynamics was one of the great achievements of 19th-century physics.`,
    expert: `The microcanonical ensemble fixes energy; the canonical ensemble (Boltzmann distribution, P(E) ∝ e^(−E/k_BT)) fixes temperature; the grand canonical fixes chemical potential. Partition functions Z encode all thermodynamics via F = −k_BT ln Z. The ergodic hypothesis connects time and ensemble averages. The renormalization group (Wilson) explains universality at critical points and Wilson won the 1982 Nobel. Non-equilibrium statistical mechanics — fluctuation theorems (Jarzynski, Crooks), large deviations, active matter — is still an open frontier.`,
    surprise: `If you tracked every air molecule in a room and ran time backwards, each one would retrace its path perfectly. The laws of motion have no preferred direction. Yet the room as a whole forgets its past. Directionality is a statistical illusion of large numbers.`,
    history: `Maxwell distributed molecular velocities in 1860. Boltzmann wrote down S = k log W in the 1870s, was fiercely attacked by Mach and Ostwald for his "atom hypothesis," and died by suicide in 1906 — just as Einstein's Brownian motion paper vindicated him.`,
  },

  // ───────────────────────────── ELECTROMAGNETISM ───────────────────────────

  {
    id: 'maxwell', name: "Maxwell's Equations", domain: 'em', symbol: '∇·E, ∇×B',
    tagline: 'Light is a wave in the electric field.',
    equation: '∇·E = ρ/ε₀, ∇×B − ∂E/∂t = μ₀J',
    deps: ['calculus', 'newton', 'conservation'], sim: 'wave',
    eli5: `Rub a balloon on your hair — it sticks to the wall. Swing a magnet past a wire — electricity flows. For ages these seemed like different things. Then James Maxwell figured out they're the same thing, dancing together. When they dance, they make ripples. Those ripples travel at exactly the speed of light — because light *is* those ripples. Radio, Wi-Fi, X-rays, the visible glow you're reading by: all the same wave, just at different frequencies.`,
    intermediate: `Four equations describe all classical electricity and magnetism: Gauss's law (charges make electric fields), Gauss's law for magnetism (no magnetic monopoles), Faraday's law (changing magnetic fields make electric fields), and Ampère–Maxwell (currents and changing electric fields make magnetic fields). From these, Maxwell derived that oscillating electric and magnetic fields propagate as waves at a specific speed — 1/√(ε₀μ₀) ≈ 3 × 10⁸ m/s, exactly the speed of light. Electricity, magnetism and light are one phenomenon.`,
    expert: `In covariant form, Maxwell's equations are ∂_μ F^(μν) = J^ν and ∂_[μ F_(νρ)] = 0 where F = dA is the curvature of a U(1) connection. This is the simplest gauge theory. Quantisation yields QED, the most precisely tested theory in physics (g-2 agrees with experiment to 12 decimal places). Duality between E and B hints at electric–magnetic self-duality, broken in our universe by the apparent absence of magnetic monopoles. Maxwell's equations are not Galilean-invariant — that tension is what led Einstein to special relativity.`,
    surprise: `Maxwell derived his equations in 1861 using a mechanical picture of the aether — tiny vortices and ball bearings. The mechanical model was wrong; the equations were immortal.`,
    history: `Faraday's experiments and intuitions about "lines of force" gave Maxwell his starting point. Maxwell published his treatise *A Dynamical Theory of the Electromagnetic Field* in 1865. Heinrich Hertz produced and detected radio waves in 1887, confirming the theory. Marconi made a radio fortune; Einstein built special relativity on Maxwell's foundation.`,
  },

  // ───────────────────────────── RELATIVITY ─────────────────────────────────

  {
    id: 'special', name: 'Special Relativity', domain: 'relativity', symbol: 'E = mc²',
    tagline: 'Time and space bend to keep light constant.',
    equation: 'E² = (mc²)² + (pc)²',
    deps: ['maxwell', 'symmetry'], sim: 'lightclock',
    eli5: `If you run next to a beam of light, how fast does the light seem to move? You'd think: light-speed minus your speed, like running next to a car. Nope. Light always looks like it's moving at the same speed — no matter how fast you're chasing. For this to work, time itself has to slow down for you as you speed up, and lengths have to shrink. Einstein figured out the weird consequences, and it turned out mass and energy are the same thing: E = mc².`,
    intermediate: `Einstein's 1905 theory has two postulates: (1) the laws of physics look the same in any non-accelerating frame; (2) the speed of light in vacuum is the same for all observers. From these come time dilation (moving clocks run slow), length contraction (moving rulers shrink), relativity of simultaneity (observers disagree on which events happened at the same time), and mass-energy equivalence E = mc². A tiny mass contains an enormous energy — which is why nuclear reactors and stars work.`,
    expert: `Lorentz transformations form the group SO(1,3) acting on Minkowski spacetime with metric η = diag(−,+,+,+). Four-vectors and tensors ensure manifest Lorentz covariance. The invariant interval ds² = −c²dt² + dx² + dy² + dz² replaces separate space and time. Mass and energy satisfy E² = p²c² + m²c⁴. Massless particles (photons, gluons) move on null geodesics. Relativistic mass is a historical misnomer; invariant mass is what appears in dynamics. GPS satellites correct for special-relativistic time dilation (~7 μs/day) and gravitational blueshift (~45 μs/day).`,
    surprise: `If you travel to a star 10 light-years away at 99.9 % of light speed, your clocks say the trip took only about 5 months. Relativity isn't just theory — astronauts on the ISS are measurably younger than they would have been on Earth.`,
    history: `Einstein published *Zur Elektrodynamik bewegter Körper* in 1905 — his *annus mirabilis* — while working as a clerk in the Swiss patent office. He was 26. He didn't get the Nobel Prize for relativity (too controversial); he got it for the photoelectric effect.`,
  },

  {
    id: 'general', name: 'General Relativity', domain: 'relativity', symbol: 'Gμν',
    tagline: 'Gravity is the shape of spacetime.',
    equation: 'G_μν = 8πG · T_μν',
    deps: ['special', 'gravity', 'geometry'], sim: 'spacetime',
    eli5: `Imagine a stretched trampoline. Drop a bowling ball in the middle — it sinks, and the fabric curves. Roll a marble nearby; it spirals in toward the ball, not because the ball is pulling it, but because the fabric is bent. That's gravity. Heavy things like stars and planets bend the fabric of space and time itself, and everything else just rolls along the curves. Even light does.`,
    intermediate: `In 1915 Einstein replaced Newton's force of gravity with geometry. Matter and energy curve spacetime, and objects in free fall follow the straightest possible paths (geodesics) through this curved geometry. Einstein's field equations G_μν = 8πG·T_μν relate the curvature of spacetime to the matter-energy content. The theory predicts gravitational lensing, Mercury's perihelion precession, gravitational waves (detected directly in 2015), black holes, and the expanding universe. It is the most accurately tested theory of gravity we have.`,
    expert: `GR is a second-order nonlinear PDE system for the metric g_μν. The Einstein–Hilbert action S = (1/16πG) ∫ R √−g d⁴x yields the field equations via variational principle. Schwarzschild, Kerr, Reissner–Nordström, and Friedmann–Lemaître–Robertson–Walker are exact solutions describing non-rotating/rotating/charged black holes and homogeneous cosmologies. Singularity theorems (Penrose, Hawking) show that geodesic incompleteness is generic. Quantum gravity remains unsolved: loop quantum gravity, string theory, asymptotic safety and causal dynamical triangulations are the main contenders. LIGO's 2015 detection of GW150914 confirmed gravitational waves and launched multi-messenger astronomy.`,
    surprise: `Time runs measurably slower closer to Earth. Your head ages faster than your feet. GPS satellites have to correct for this or your navigation would drift by kilometres per day.`,
    history: `Einstein worked on GR for a decade, aided crucially by his friend Marcel Grossmann on differential geometry. He presented the final field equations to the Prussian Academy in November 1915, just days before Hilbert independently reached the same equations. Eddington's 1919 eclipse expedition confirmed gravitational light-bending and made Einstein a global celebrity.`,
  },

  // ───────────────────────────── QUANTUM ────────────────────────────────────

  {
    id: 'quantum', name: 'Quantum Mechanics', domain: 'quantum', symbol: 'Ψ',
    tagline: 'Everything is waves of probability.',
    equation: 'iℏ ∂Ψ/∂t = ĤΨ',
    deps: ['maxwell', 'probability', 'calculus', 'action'], sim: 'doubleslit',
    eli5: `Zoom way, way in, down to the level of atoms. Things stop behaving like little balls and start behaving like ripples. An electron isn't "here" or "there" — it's a cloud of "how likely" that fills the whole area. Only when you actually look does it settle on one spot. How likely it is to be spotted anywhere follows a wave pattern. That's why atoms exist, why chemistry works, why the Sun shines.`,
    intermediate: `Quantum mechanics describes matter at atomic scales. Key ideas: (1) wave-particle duality — electrons and photons act as both; (2) the wave function Ψ encodes all possible outcomes, and its squared magnitude gives probabilities; (3) the Schrödinger equation governs how Ψ evolves; (4) measurement "collapses" Ψ to a definite outcome; (5) energy and other quantities come in discrete lumps (quanta). This framework explains atomic structure, the periodic table, chemical bonding, lasers, semiconductors — essentially all of modern technology.`,
    expert: `States live in a complex Hilbert space ℋ; observables are Hermitian operators; measurement outcomes are eigenvalues with Born-rule probabilities |⟨n|ψ⟩|². The Schrödinger picture has time-dependent states; the Heisenberg picture, time-dependent operators; the interaction picture, both. The canonical commutation relation [x̂, p̂] = iℏ generates a Heisenberg uncertainty relation Δx·Δp ≥ ℏ/2. Entanglement produces non-classical correlations quantified by Bell inequality violations (Aspect 1982, Nobel 2022). Measurement remains unresolved: Copenhagen, many-worlds, de Broglie–Bohm, GRW and consistent histories are the main interpretations.`,
    surprise: `A single electron passing through a double slit interferes *with itself*. Run one electron per minute and after enough hours you still get an interference pattern, built one dot at a time. Nobody actually knows what that means.`,
    history: `Planck's 1900 blackbody formula introduced quanta as a desperate mathematical trick. Einstein (1905), Bohr (1913), de Broglie (1924), Heisenberg (1925), Schrödinger (1926) and Born (1926) built the theory in a wild rush. The 1927 Solvay Conference debated its meaning — a debate still running today.`,
  },

  {
    id: 'uncertainty', name: 'Uncertainty Principle', domain: 'quantum', symbol: 'Δx·Δp ≥ ℏ/2',
    tagline: 'Knowing one thing costs knowing another.',
    equation: 'Δx·Δp ≥ ℏ/2',
    deps: ['quantum'], sim: null,
    eli5: `At the tiniest scales, nature has a weird rule: the more precisely you know *where* something is, the less you can know *how fast* it's moving — and vice versa. It's not that our instruments are bad. It's baked into reality. A particle with a very definite position is a very fuzzy wave of speeds. A particle with a very definite speed is spread out across all space.`,
    intermediate: `Heisenberg's uncertainty principle says that for certain pairs of quantities (position/momentum, energy/time), the product of their uncertainties has a lower bound: Δx·Δp ≥ ℏ/2. This isn't about measurement technology — it's a mathematical consequence of describing particles as waves. A wave tightly localised in space is a sum of many wavelengths; a wave of a single wavelength is infinitely spread out. Since momentum relates to wavelength, precise position forces fuzzy momentum. This is why atoms don't collapse — an electron squeezed to a point would have infinite momentum.`,
    expert: `For any two Hermitian operators, σ_A σ_B ≥ ½ |⟨[Â, B̂]⟩|. The position–momentum case is minimised by Gaussian wavepackets. Energy–time uncertainty is subtler (time is not an operator in non-relativistic QM); the correct statement is that states with a sharply defined energy evolve slowly. The quantum vacuum is fluctuating: virtual particles of energy ΔE can exist for time ~ℏ/ΔE, producing the Casimir effect, Lamb shift and Hawking radiation. Squeezed states saturate the bound in one variable at the cost of the other and are used in LIGO to beat the standard quantum limit.`,
    surprise: `Because of the energy–time uncertainty, empty space is never truly empty. Virtual particle pairs pop in and out of existence constantly, and we can measure their effects — the Casimir force between two close metal plates is one.`,
    history: `Heisenberg derived it in 1927 on vacation in Heligoland, where he'd fled his hay-fever. Bohr and Heisenberg then spent weeks at Bohr's institute in Copenhagen arguing about what it meant — and in the process nailed down the "Copenhagen interpretation" of quantum mechanics.`,
  },

  {
    id: 'pauli', name: 'Pauli Exclusion Principle', domain: 'quantum', symbol: '≠',
    tagline: 'No two electrons in the same seat.',
    equation: 'Ψ(1,2) = −Ψ(2,1)',
    deps: ['quantum'], sim: null,
    eli5: `Electrons have a weird rule: no two of them in the same atom can be in exactly the same state at exactly the same time. It's like a game of musical chairs where every chair can only hold one electron. This is why atoms have shells, why the periodic table exists, why you don't fall through your chair, why stars eventually hold themselves up against their own gravity. One tiny rule — and matter stays matter.`,
    intermediate: `Electrons (and all other fermions) obey a strict antisocial rule: two of them cannot occupy the same quantum state. Swap two identical fermions and their combined wave function changes sign — which forces them to avoid each other. This single constraint builds the periodic table: electrons fill atomic shells one at a time because they can't pile up. It's the reason chemistry works, the reason ordinary matter is rigid, and the reason white dwarfs and neutron stars don't immediately collapse under their own gravity.`,
    expert: `For identical fermions in a many-body wave function, antisymmetrisation under particle exchange forces Ψ(...,i,...,j,...) = −Ψ(...,j,...,i,...). This is encoded in the spin-statistics theorem (Pauli 1940, rigorised by Lüders & Zumino), a deep consequence of Lorentz invariance, causality, and positive energy in QFT. Fermionic many-body states are Slater determinants; bosonic states are permanents. Degenerate Fermi pressure scales as n^(5/3) and supports white dwarfs up to the Chandrasekhar limit M ≈ 1.4 M_⊙. The exchange interaction it generates is the origin of ferromagnetism and covalent bonding.`,
    surprise: `The reason your hand doesn't pass through a table is not electromagnetism. It's because the electrons in your hand refuse to share quantum states with the electrons in the table. Solidity is fermion stubbornness.`,
    history: `Wolfgang Pauli proposed the exclusion principle in 1925 to explain atomic spectra. He won the 1945 Nobel Prize. Pauli was famous for his brutal criticism — "This isn't right. It isn't even wrong" — and for the "Pauli effect" (equipment mysteriously failing when he entered a lab).`,
  },

  {
    id: 'qft', name: 'Quantum Field Theory', domain: 'quantum', symbol: 'φ̂(x)',
    tagline: 'Particles are ripples in fields.',
    equation: 'ℒ = ψ̄(iγ^μ∂_μ − m)ψ',
    deps: ['quantum', 'special', 'action'], sim: null,
    eli5: `Imagine the whole universe is filled with invisible, jiggling fields — one for electrons, one for photons, one for every kind of particle. A "particle" is just a little wave on its field. Smash two particles together and you're really smashing two waves — new waves can pop out. That's where new particles come from in colliders. Every particle you've ever heard of is a ripple on one of these fields.`,
    intermediate: `Quantum field theory marries quantum mechanics with special relativity. Instead of a fixed number of particles, it treats fields as the fundamental objects; particles are localised excitations of these fields. QFT predicts antimatter, explains why all electrons are identical (they're all ripples on the same field), and provides the framework for the Standard Model. It has produced some of the most precise predictions in all of science — the electron's magnetic moment is calculated and measured to better than one part in a trillion.`,
    expert: `Canonical quantisation promotes fields to operators satisfying [φ̂(x), π̂(y)] = iℏδ³(x−y). Path-integral quantisation expresses amplitudes as ⟨f|i⟩ = ∫ 𝒟φ e^(iS[φ]/ℏ). Renormalisation absorbs UV divergences into running couplings; the Wilsonian view treats QFTs as effective theories valid up to a cutoff. Gauge theories quantise constrained systems via Faddeev–Popov ghosts or BRST. The CPT theorem, spin-statistics, and Haag's theorem constrain consistent QFTs. Open problems include confinement in QCD, the mass gap for Yang–Mills (a Clay Millennium Prize problem), and non-perturbative quantum gravity.`,
    surprise: `The theoretical and experimental values of the electron's magnetic moment agree to 12 decimal places. This is like measuring the distance from New York to Los Angeles and being accurate to the width of a human hair.`,
    history: `Dirac wrote his relativistic electron equation in 1928 and predicted antimatter before it was found. Feynman, Schwinger and Tomonaga independently built QED in the late 1940s (shared 1965 Nobel). 't Hooft and Veltman proved renormalisability of non-abelian gauge theories in 1972, opening the door to the Standard Model.`,
  },

  // ───────────────────────────── FUNDAMENTAL FORCES ─────────────────────────

  {
    id: 'standard', name: 'Standard Model', domain: 'forces', symbol: 'u d c s t b',
    tagline: 'The periodic table of everything.',
    equation: 'SU(3) × SU(2) × U(1)',
    deps: ['qft', 'pauli'], sim: null,
    eli5: `Zoom all the way down and everything is made of just a few kinds of tiny things. Quarks (which clump into protons and neutrons), electrons (and their cousins), and force carriers (photons, gluons, the W and Z bosons) that let particles push and pull each other. There's also the Higgs, which gives other particles their weight. That's the complete kit — every stone, every star, every cell, every you is built from it.`,
    intermediate: `The Standard Model organises elementary particles into three generations of matter (six quarks, six leptons), four force carriers (photon, gluon, W, Z), and the Higgs boson. It describes three of the four fundamental forces — electromagnetism, the weak nuclear force, the strong nuclear force — in the framework of quantum field theory. It's spectacularly successful: nearly every measurement in particle physics matches its predictions to many decimal places. It's also known to be incomplete: it doesn't include gravity, dark matter, neutrino masses (in the minimal version) or why the constants have their values.`,
    expert: `Gauge group SU(3)_c × SU(2)_L × U(1)_Y, spontaneously broken by the Higgs field to SU(3)_c × U(1)_em. 19 free parameters (masses, mixing angles, CKM phases, α_s, θ_QCD). Anomaly cancellation constrains the fermion content per generation. The Higgs discovery at LHC in 2012 (ATLAS and CMS) confirmed the last predicted ingredient. Beyond-Standard-Model physics motivated by hierarchy problem, strong-CP problem, matter–antimatter asymmetry, neutrino masses, dark matter, dark energy. Leading candidates: supersymmetry, extra dimensions, composite Higgs, string theory — none yet confirmed.`,
    surprise: `The theory contains 19 numbers that we have to measure — the masses of particles, the strength of each force — and nobody knows why they have the values they do. Changing the top quark's mass by 5% might make the universe collapse into a different vacuum. It's as if the universe were carefully fine-tuned for its own stability.`,
    history: `Glashow, Salam and Weinberg unified electromagnetism with the weak force in the 1960s (shared 1979 Nobel). Quarks were proposed by Gell-Mann and Zweig in 1964 and confirmed by SLAC deep-inelastic scattering. The W and Z bosons were found at CERN in 1983. The top quark arrived in 1995, the tau neutrino in 2000, and the Higgs in 2012.`,
  },

  {
    id: 'higgs', name: 'Higgs Mechanism', domain: 'forces', symbol: 'ϕ',
    tagline: 'How particles got their mass.',
    equation: '|Φ|² = v²/2',
    deps: ['standard', 'qft'], sim: null,
    eli5: `Imagine the universe is filled with invisible jelly. Some particles slide through easily — those are "light." Others get stuck and drag through — those are "heavy." The Higgs field is the jelly, and how much it sticks to each kind of particle is what we call mass. Scientists found the jelly by watching it ripple when they smashed protons together at enormous speeds. A ripple in the jelly is the Higgs boson.`,
    intermediate: `Before the Higgs field "switched on" in the early universe, all particles were massless and flew at the speed of light. A spontaneous symmetry-breaking event gave the Higgs field a constant, nonzero value everywhere — and particles interacting with it behave as though they were heavy. The heavier a particle's coupling to the Higgs, the more mass it has. This mechanism was essential to unify the electromagnetic and weak forces while still allowing the W and Z bosons to be heavy and the photon to be massless. Finding the Higgs boson in 2012 confirmed the theory.`,
    expert: `The Higgs field is a complex SU(2) doublet with potential V(Φ) = −μ²|Φ|² + λ|Φ|⁴. Minimising yields |Φ| = v/√2 with v ≈ 246 GeV. Expanding around the VEV breaks SU(2)_L × U(1)_Y to U(1)_em; three Goldstone modes become longitudinal components of W^± and Z (Anderson–Higgs mechanism). Fermion masses come from Yukawa couplings ℒ_Y = −y ψ̄Φψ. The Higgs boson itself is the radial excitation of |Φ|. The measured mass m_H ≈ 125 GeV puts the electroweak vacuum in a metastable regime — it may be very long-lived but not the true minimum.`,
    surprise: `Only about 1% of your body's mass comes from the Higgs field directly. The other 99% is the kinetic energy of quarks bound inside your protons and neutrons — E = mc² made of raw motion.`,
    history: `Peter Higgs, François Englert, Robert Brout, Guralnik, Hagen and Kibble all independently proposed the mechanism in 1964. CERN's ATLAS and CMS collaborations jointly announced the boson's discovery on 4 July 2012. Higgs and Englert shared the 2013 Nobel; Brout had died the year before.`,
  },

  // ───────────────────────────── CHEMISTRY ──────────────────────────────────

  {
    id: 'atoms', name: 'Atomic Structure', domain: 'chemistry', symbol: '⚛',
    tagline: 'Tiny solar systems of charge.',
    equation: 'Z = # protons',
    deps: ['quantum', 'standard'], sim: null,
    eli5: `An atom is a nucleus — a tiny ball of protons and neutrons — surrounded by a fuzzy cloud of electrons. The number of protons decides what kind of atom it is: one is hydrogen, six is carbon, eight is oxygen, 79 is gold. The electrons arrange themselves in shells, like seats in a theatre, and how they fill those seats decides how the atom will play with others.`,
    intermediate: `Atoms consist of a dense nucleus of positively charged protons and neutral neutrons, bound by the strong nuclear force and surrounded by orbitals — quantum clouds — of negatively charged electrons. Orbital shapes and energies are set by the Schrödinger equation. Elements are ordered by atomic number (proton count), and their chemical behaviour depends on how many electrons sit in the outermost shell. The patterns of the periodic table — metals on the left, noble gases on the right — are a direct consequence of electron shell quantum mechanics.`,
    expert: `The hydrogen Schrödinger equation has exact solutions labelled by (n, ℓ, m, s). Relativistic corrections (Dirac equation) and QED (Lamb shift) refine the spectrum. For many-electron atoms, the Hartree–Fock self-consistent field approximation is the starting point; density functional theory (Hohenberg–Kohn–Sham) provides a tractable route to larger systems. Hyperfine splitting, Zeeman effect, fine structure and quantum electrodynamic corrections all arise from interactions between electron spin, orbital motion, nuclear spin, and external fields. Atomic clocks based on ^133Cs or optical transitions define the SI second to 18 decimal places.`,
    surprise: `An atom is about 99.9999999999 % empty space. If you removed all the space out of every atom in every human being on Earth, all of humanity would fit in the volume of a sugar cube — and that cube would weigh as much as Mount Everest.`,
    history: `Rutherford's 1911 gold-foil experiment discovered the nucleus. Bohr's 1913 model quantised electron orbits. Chadwick discovered the neutron in 1932. Quantum mechanics (1925–26) provided the modern picture. Individual atoms were first imaged directly with scanning tunnelling microscopes in the 1980s.`,
  },

  {
    id: 'periodic', name: 'Periodic Table', domain: 'chemistry', symbol: 'Fe Au',
    tagline: 'Chemistry by counting electrons.',
    equation: 'Aufbau: 1s 2s 2p 3s 3p …',
    deps: ['atoms', 'pauli'], sim: null,
    eli5: `All the stuff in the universe is made of just 118 different kinds of atoms. Line them up in order of how many protons they have and a magical pattern appears: every few steps, you come back to an atom that behaves just like a much smaller one in the row above. So chemistry repeats. That's why Mendeleev could line them up in a table — and predict ones nobody had ever seen yet.`,
    intermediate: `The periodic table arranges elements by atomic number. Its rows and columns are a direct consequence of how electrons fill atomic orbitals in order of increasing energy (1s, 2s, 2p, 3s, 3p, …). Elements in the same column have the same number of outer-shell electrons and so share chemical behaviour. The noble gases have full shells and barely react; alkali metals have one lonely outer electron they love to give away. Mendeleev, drawing the first table in 1869, left gaps for elements he predicted must exist — and they were found exactly where he said.`,
    expert: `The Aufbau principle fills subshells in order determined by the Madelung rule (n+ℓ), with the Pauli exclusion principle forbidding double occupancy of quantum states. Transition metals arise from the late filling of d orbitals; lanthanides and actinides from f orbitals. Relativistic effects matter for heavy elements: gold's colour and mercury's low melting point are relativistic consequences of a contracted 6s orbital. The "island of stability" around Z ≈ 114 predicts superheavy isotopes with relatively long half-lives; oganesson (Z = 118) is the current end of the table.`,
    surprise: `Mendeleev predicted three undiscovered elements — gallium, scandium, germanium — and even estimated their atomic weights and chemical properties. All three were found within 15 years, each almost exactly as he had specified.`,
    history: `Dmitri Mendeleev published the first periodic table in 1869, leaving gaps where he believed elements must exist. His prediction of gallium (1875) and germanium (1886) turned sceptics into believers. The quantum-mechanical explanation came in the 1920s, decades after the table was in textbooks.`,
  },

  {
    id: 'bonding', name: 'Chemical Bonds', domain: 'chemistry', symbol: 'H-O-H',
    tagline: 'How atoms hold hands.',
    equation: 'ΔG = ΔH − TΔS',
    deps: ['atoms', 'periodic', 'thermo'], sim: null,
    eli5: `Atoms are happiest when their outermost electron shell is full. So they trade or share electrons with other atoms to make everyone happy. When they do, they stick together — that's a bond. Water is two hydrogens sharing electrons with one oxygen. Salt is sodium and chlorine swapping an electron. Every material you've ever touched is atoms holding hands in some way.`,
    intermediate: `Chemical bonds form when atoms share or transfer electrons to reach more stable configurations. Covalent bonds share electrons (H₂O, DNA, plastics); ionic bonds transfer them (NaCl); metallic bonds delocalise electrons across a lattice (copper wire); hydrogen bonds are weaker electrostatic attractions holding water cohesive and proteins folded. All bonding is ultimately electromagnetic and governed by quantum mechanics of overlapping orbitals. From these rules emerge all 100 million-plus known chemical substances.`,
    expert: `Molecular orbitals form from linear combinations of atomic orbitals (LCAO). Hybridisation (sp, sp², sp³) explains molecular geometry; VSEPR predicts shapes from electron-pair repulsion. Crystal field theory and ligand field theory handle transition-metal complexes. Ab initio methods (Hartree–Fock, coupled cluster, configuration interaction) compute molecular energies; DFT provides a scalable compromise. Van der Waals forces (London dispersion, Debye, Keesom) dominate intermolecular interactions and arise from correlated electron fluctuations. Supramolecular chemistry exploits non-covalent bonds to build designed molecular assemblies.`,
    surprise: `Graphene is a single-atom-thick sheet of carbon atoms held together by covalent bonds, and it is the strongest material ever measured — about 200 times stronger than steel for the same weight. A hammock of it one square metre in area would hold a domestic cat, but weigh as much as one of its whiskers.`,
    history: `Gilbert Lewis introduced electron-pair covalent bonding in 1916. Pauling's *The Nature of the Chemical Bond* (1939) unified quantum mechanics and chemistry; he won the 1954 Nobel for it. Hoffmann and Fukui (1981 Nobel) used molecular orbital theory to explain reaction pathways.`,
  },

  // ───────────────────────────── BIOLOGY ────────────────────────────────────

  {
    id: 'selfrep', name: 'Self-Replication', domain: 'biology', symbol: '⟳ DNA',
    tagline: 'Molecules that copy themselves.',
    equation: 'DNA → 2×DNA',
    deps: ['bonding'], sim: null,
    eli5: `Some molecules have a magical property: drop them in a soup of the right raw materials, and they make copies of themselves. DNA is the most famous. It's a twisted ladder whose rungs spell out instructions. The ladder can unzip, and each half builds its missing side. This one trick — a molecule that copies itself — is what makes life possible.`,
    intermediate: `Self-replicating molecules are the precondition for biology. DNA's double helix carries genetic information as a sequence of four bases — A, T, C, G — complementary in pairs. When the helix unwinds, each strand is a template for a new partner, producing two identical copies. Replicators with variation are the substrate natural selection acts on. The origin of such replicators from non-living chemistry (abiogenesis) remains one of science's great open questions.`,
    expert: `DNA replication is semi-conservative (Meselson–Stahl 1958), carried out by DNA polymerases with 3′→5′ exonuclease proofreading and mismatch repair giving error rates ≈ 10⁻⁹. Origin-of-life scenarios include RNA world (Gilbert 1986), metabolism-first, mineral surface catalysis, and the more recent GADV-hypothesis and serpentinite-hosted alkaline hydrothermal systems (Russell, Martin). Ribozymes (catalytic RNAs) support the RNA-world idea: RNA can both store information and catalyse reactions. Miller–Urey (1953) showed amino acids can form from inorganic precursors under plausible prebiotic conditions.`,
    surprise: `If you stretched the DNA in a single one of your cells end-to-end, it would be about 2 metres long. Stretch out the DNA in all your cells and it would reach to the Sun and back over 100 times. You contain roughly 75 trillion metres of genetic tape.`,
    history: `Watson and Crick modelled the double helix in 1953 using Rosalind Franklin's X-ray crystallography. Meselson and Stahl confirmed semi-conservative replication in 1958 in what's been called the most beautiful experiment in biology. The human genome was first sequenced in 2003.`,
  },

  {
    id: 'centraldogma', name: 'Central Dogma of Biology', domain: 'biology', symbol: 'DNA→RNA→🧬',
    tagline: 'Information flows one way.',
    equation: 'DNA → RNA → Protein',
    deps: ['selfrep'], sim: null,
    eli5: `DNA is a recipe book locked inside every cell. The cell makes a working copy of a recipe (that's RNA), carries it to a tiny kitchen (a ribosome), and follows the recipe to cook up a protein — the molecule that actually does the job. DNA writes the instructions, RNA delivers them, proteins do the work. That's the entire basis of life on Earth.`,
    intermediate: `Francis Crick's "central dogma" (1957) states that biological information flows DNA → RNA → protein. Transcription copies a DNA gene into messenger RNA; translation reads that mRNA at the ribosome and strings together amino acids into a protein. The genetic code — triplets of bases spelling out amino acids — is nearly universal across all life, strong evidence of common ancestry. Proteins then do essentially all the active work in a cell: catalysing reactions, transporting molecules, building structures, sensing the environment.`,
    expert: `RNA polymerase transcribes DNA with ~1 mistake per 10⁴–10⁵ bases. mRNA is processed (5′ cap, 3′ poly-A tail, splicing of introns) before export. Translation proceeds 5′→3′, with tRNAs charged by aminoacyl-tRNA synthetases reading codons via wobble pairing. The genetic code is degenerate but optimised against point-mutation errors. Exceptions to the dogma: reverse transcription (retroviruses, telomerase — Baltimore 1970), prion propagation (protein to protein), and RNA-mediated epigenetic inheritance. The CRISPR–Cas9 system is a bacterial adaptive immunity co-opted for programmable genome editing.`,
    surprise: `Almost every living thing on Earth — bacterium, mushroom, whale, human — uses the same genetic code. A strand of DNA from a petunia will spell the same amino acids in a ribosome from an elephant.`,
    history: `Crick coined "central dogma" in 1957 (he later said he meant "consensus," not "scripture"). Nirenberg and Matthaei cracked the genetic code in 1961. Reverse transcriptase was discovered by Baltimore and Temin in 1970, forcing an amendment to the dogma. CRISPR was characterised by Doudna and Charpentier (2012 Nobel 2020).`,
  },

  {
    id: 'evolution', name: 'Natural Selection', domain: 'biology', symbol: '🧬',
    tagline: 'Copies that make more copies win.',
    equation: 'Δp = p·q·(w_A − w_B)/w̄',
    deps: ['selfrep', 'centraldogma', 'probability'], sim: 'evolution',
    eli5: `If creatures make copies of themselves, but the copies are sometimes slightly different, then whichever differences help make *more* copies will get more common. Over millions of years, tiny changes stack up into eyes, wings, brains, you. It's not magic, and there's no designer — it's arithmetic applied to copies across an enormous amount of time.`,
    intermediate: `Natural selection needs only three ingredients: variation (individuals differ), heredity (offspring resemble parents), differential reproductive success (some variants leave more descendants). From these three conditions, evolution follows inescapably — almost a mathematical theorem. Given time and a fitness landscape, populations accumulate adaptations and diversify into species. Modern evolutionary biology adds genetic drift, sexual selection, and molecular mechanisms, but Darwin's insight stands: differential reproduction of heritable variation produces design without a designer.`,
    expert: `Population genetics formalises selection, drift, mutation and migration through equations like the Hardy–Weinberg equilibrium and Fisher's fundamental theorem (ΔW̄ = Var(W)/W̄). The coalescent theory runs time backwards to ancestral populations. Neutral theory (Kimura) explains most molecular variation. Evolutionary game theory (Maynard Smith) models frequency-dependent selection via evolutionarily stable strategies. Modern synthesis integrates genetics and evolution; extended synthesis adds development, epigenetics, niche construction. Adaptive dynamics and evolvability connect short-term selection to macroevolutionary trends.`,
    surprise: `Evolution has independently "invented" eyes at least 40 times — in insects, squids, vertebrates, jellyfish and more. Given enough generations, certain useful solutions are essentially inevitable.`,
    history: `Darwin and Wallace presented the theory jointly in 1858; Darwin's *Origin of Species* followed in 1859. Mendel's peas (1866) provided the unit of heredity. Fisher, Haldane and Wright fused Mendelian genetics with Darwinian selection in the 1920s–30s modern synthesis.`,
  },

  {
    id: 'ecosystems', name: 'Ecosystems', domain: 'biology', symbol: '🌿',
    tagline: 'Everything eats everything.',
    equation: 'NPP = GPP − R',
    deps: ['evolution', 'thermo'], sim: null,
    eli5: `Plants eat sunlight. Bugs eat plants. Birds eat bugs. Foxes eat birds. Fungi eat foxes when they die. And it all goes round and round, with energy flowing in from the Sun and carbon and water cycling through everything. No creature stands alone; the living world is one giant tangled web.`,
    intermediate: `Ecosystems are networks of organisms linked by flows of energy and matter. Sunlight enters through primary producers (plants, algae, cyanobacteria) that fix carbon via photosynthesis. Energy moves up food chains, dissipating as heat at each step (obeying thermodynamics). Nutrients cycle through biogeochemical loops (carbon, nitrogen, phosphorus, water). Feedback between species — predation, competition, symbiosis — produces the dynamic stability of healthy ecosystems. Ecology is, in a sense, thermodynamics applied to life.`,
    expert: `Lotka–Volterra equations model predator–prey oscillations; May's 1973 paper showed complex ecosystems can be dynamically unstable unless structured. Trophic efficiency is typically ~10% per level. Island biogeography (MacArthur & Wilson) predicts species richness from area and isolation. Network theory applied to food webs reveals power-law degree distributions, modularity, and keystone species. Ecosystem services are valued in trillions of dollars per year; their collapse is a leading driver of the Sixth Mass Extinction. Planetary boundaries (Rockström) quantify safe operating limits for humanity.`,
    surprise: `Every atom of oxygen you breathe was exhaled by a plant, bacterium or alga. Every atom of carbon in your body was pulled out of the air by a photosynthesising ancestor organism.`,
    history: `Ernst Haeckel coined "ecology" in 1866. Tansley introduced "ecosystem" in 1935. Lindeman's 1942 paper on trophic dynamics quantified energy flow through food webs. Rachel Carson's *Silent Spring* (1962) launched modern environmentalism.`,
  },

  // ───────────────────────────── INFORMATION & COMPUTATION ──────────────────

  {
    id: 'information', name: 'Information Theory', domain: 'info', symbol: 'bits',
    tagline: 'How much surprise is in a message.',
    equation: 'H = −Σ p log₂ p',
    deps: ['probability', 'thermo'], sim: null,
    eli5: `If I tell you "the sun rose today," that's not really news — you already knew. But if I tell you "a comet will hit tomorrow," that's a lot of news. Information is how much a message reduces your uncertainty. Claude Shannon figured out how to measure it in bits — the smallest possible yes/no question. Every phone call, text, photo and streamed movie is made of bits.`,
    intermediate: `Shannon's 1948 theory defines information as a reduction in uncertainty, measured in bits. A source's entropy H = −Σ p log₂ p gives the minimum average bits needed to encode its messages. Shannon also proved that noisy channels can transmit information reliably as long as you stay below their capacity C, through clever coding. His work founded modern telecommunications, the internet, data compression and cryptography. Information turns out to be deeply connected to physical entropy — erasing one bit of information dissipates at least kT ln 2 of heat (Landauer's principle).`,
    expert: `Mutual information I(X;Y) = H(X) + H(Y) − H(X,Y) quantifies dependence. Shannon's channel coding theorem gives capacity C = max_p I(X;Y) with low-density parity-check and polar codes saturating it in practice. Kolmogorov complexity K(x) defines the absolute information content of a string as its shortest program. The Landauer–Bennett bound links logical reversibility to thermodynamic dissipation, clarifying Maxwell's demon. Quantum information generalises classical information: qubits, Holevo bound, no-cloning theorem, entanglement entropy. BB84 and related protocols enable information-theoretically secure cryptography.`,
    surprise: `You cannot compress a truly random file. The shortest description of randomness is the randomness itself. Kolmogorov complexity makes precise the idea that some patterns really are unfathomable.`,
    history: `Shannon's *A Mathematical Theory of Communication* (1948) appeared while he worked at Bell Labs. He also juggled, unicycled, and built a machine whose only purpose was to turn itself off. Kolmogorov, Solomonoff and Chaitin independently formalised algorithmic information theory in the 1960s.`,
  },

  {
    id: 'computation', name: 'Computation', domain: 'info', symbol: '01',
    tagline: 'Everything computable in principle.',
    equation: 'U(⟨M⟩, x) = M(x)',
    deps: ['logic', 'information'], sim: null,
    eli5: `A computer is just a box that follows simple instructions very, very fast. Alan Turing showed that with a surprisingly small set of instructions, you can do *any* calculation that's possible to do — not just one kind of maths, but all of it. Your phone, a supercomputer, and a human brain are all doing the same basic kind of thing: shuffling symbols by rules.`,
    intermediate: `Turing's 1936 paper defined a universal model — the Turing machine — and proved that a single simple machine can simulate any other: the universal Turing machine. Church and Turing independently conjectured that this captures all effectively computable functions. But Turing also proved fundamental limits: some problems (like the halting problem) cannot be solved by any algorithm. Modern computer science builds on this: complexity theory classifies problems by time or space needed, and we still don't know whether P = NP — one of the greatest open questions in maths.`,
    expert: `Church–Turing thesis: λ-calculus, Turing machines, μ-recursive functions and general-recursive functions all compute the same class of functions. The arithmetical hierarchy classifies uncomputable problems (halting is Σ₀₁-complete). Complexity classes P ⊆ NP ⊆ PSPACE ⊆ EXPTIME, with P ≠ EXPTIME known but P vs NP open. Quantum computation (BQP) can factor integers in polynomial time (Shor) and search in O(√n) (Grover), though BQP's relationship to NP is unclear. The Church–Turing–Deutsch principle proposes that any physically realisable process is efficiently simulable by a quantum computer.`,
    surprise: `Most real numbers are not computable — you cannot write a program that prints them. There are only countably many programs but uncountably many numbers. Almost every number in the universe is permanently beyond any algorithm.`,
    history: `Alan Turing published *On Computable Numbers, with an Application to the Entscheidungsproblem* in 1936 at age 24. His wartime work at Bletchley Park shortened WWII by an estimated two years. He was prosecuted in 1952 for homosexuality and died in 1954. The UK government formally apologised in 2009; he received a posthumous royal pardon in 2013.`,
  },

  // ───────────────────────────── EMERGENCE & COMPLEXITY ─────────────────────

  {
    id: 'emergence', name: 'Emergence', domain: 'emergence', symbol: '🐜',
    tagline: 'The whole is stranger than its parts.',
    equation: '∞ × simple → novel',
    deps: ['computation', 'probability', 'evolution'], sim: 'life',
    eli5: `One ant is just a little bug following simple rules. A million ants are a colony that farms fungus, builds bridges, wages war, and solves problems no single ant could. You don't find "colony" by looking really hard at one ant. New properties appear when parts team up. A single water molecule is not wet; a pool of them is. Your neurons don't think alone; together, they do.`,
    intermediate: `Emergence is the phenomenon where the collective behaviour of many simple parts produces qualitatively new properties not present in any single part. Examples: the wetness of water, the flocking of birds, the solidity of matter, the consciousness of brains, the price of a market. Emergent properties are in principle derivable from the parts' laws, but often not in practice — they need their own descriptive language. Emergence is why biology is not "just physics," even though it doesn't break any law of physics. It's how nature builds layers of complexity.`,
    expert: `Weak emergence: macro-behaviour derivable from micro-laws but requiring simulation (e.g. Conway's Game of Life, universal at Turing-level). Strong emergence: macro-behaviour irreducible even in principle (controversial). Effective field theories formalise emergence in physics — decoupling of scales means we rarely need UV completions for IR physics. Spontaneous symmetry breaking produces emergent quasiparticles (phonons, magnons) and order parameters. Renormalisation group flow shows why certain large-scale behaviours are universal and insensitive to microscopic details. Integrated Information Theory (Tononi) is one attempt to quantify emergence in the context of consciousness.`,
    surprise: `Conway's Game of Life has just four rules and is Turing-complete. Gliders, eaters, guns, and eventually universal computers emerge from those four rules, played on a grid of dead or alive cells. Complexity, in principle, comes free.`,
    history: `Philip Anderson's 1972 essay "More Is Different" argued reductionism has limits: each level of complexity has its own laws. Conway's Game of Life appeared in 1970. Stuart Kauffman, the Santa Fe Institute (founded 1984), and complexity scientists like Ilya Prigogine (1977 Nobel) made emergence a respectable subject.`,
  },

  {
    id: 'complexity', name: 'Complex Systems', domain: 'emergence', symbol: '⚙',
    tagline: 'Simple rules, wild results.',
    equation: 'x_(n+1) = r·x_n·(1−x_n)',
    deps: ['emergence', 'computation'], sim: null,
    eli5: `Some things are simple — a clock, a falling rock. Some are random — a shuffled deck. But the most interesting things in the world are in between: weather, economies, brains, ecosystems. They follow rules, but the rules interact so much that you can't predict everything. Small changes explode into big ones (a butterfly flaps its wings in Brazil and months later there's a storm in Texas). Complex systems are where the universe gets surprising.`,
    intermediate: `Complex systems consist of many interacting components whose collective behaviour cannot be simply inferred from the components alone. They typically exhibit non-linear dynamics, sensitivity to initial conditions (chaos), self-organisation, feedback loops, and power-law distributions. Examples include weather, economies, ecosystems, brains, the internet. Complexity science develops tools — dynamical systems, network science, statistical mechanics, agent-based models — to understand them. It sits at the intersection of maths, physics, biology, and the social sciences.`,
    expert: `Lorenz's 1963 atmospheric model showed deterministic chaos: bounded, aperiodic trajectories with exponential divergence of nearby orbits (positive Lyapunov exponents). Strange attractors have fractal dimension. The logistic map x → rx(1 − x) exhibits period-doubling bifurcations with universal Feigenbaum constants. Scale-free networks (Barabási–Albert) emerge via preferential attachment. Self-organised criticality (Bak, Tang, Wiesenfeld) explains power laws from sandpile avalanches to earthquakes. Computational mechanics and ε-machines quantify structure in sequences. The Santa Fe Institute coordinates much of the field.`,
    surprise: `Edward Lorenz discovered chaos theory by accident. He was running a weather simulation and rounded an input from 0.506127 to 0.506 — a difference of 1 part in 10,000. The predicted weather changed completely within a few simulated weeks. Tiny causes, vast effects.`,
    history: `Poincaré glimpsed chaos in 1890 studying the three-body problem. Lorenz discovered it numerically in 1961. Mandelbrot coined "fractal" in 1975. Per Bak proposed self-organised criticality in 1987. The field grew alongside the computers that could simulate it.`,
  },

  {
    id: 'gametheory', name: 'Game Theory', domain: 'emergence', symbol: '♟',
    tagline: 'The maths of strategy.',
    equation: 'u_i(s*) ≥ u_i(s_i, s_{−i}*)',
    deps: ['probability', 'emergence'], sim: null,
    eli5: `When you play a game like rock-paper-scissors, your best choice depends on what the other person will do — and their best choice depends on what *you'll* do. It's a loop. Game theory is the maths of working out what to do when other people are also thinking about what to do. It turns out evolution, economics, traffic, war, cooperation — all of it — can be described with the same rules.`,
    intermediate: `Game theory was founded by John von Neumann and Oskar Morgenstern in 1944. A "game" is any situation where each player's payoff depends on everyone's choices. The Nash equilibrium (proven in 1950 by John Nash, age 22) is a set of strategies where no player can unilaterally improve. Prisoner's dilemma shows how individually rational choices can produce collectively bad outcomes — the root of many social problems. Evolutionary game theory applies the same ideas to populations of competing strategies, explaining cooperation, altruism, and signalling in biology.`,
    expert: `Nash's theorem: every finite game with mixed strategies has at least one equilibrium. Zero-sum games admit minimax solutions (von Neumann). Cooperative game theory studies coalitions via the Shapley value and the core. Mechanism design works backwards: given desired outcomes, design rules that elicit them (Vickrey, Myerson, Maskin — Nobel 2007). Evolutionarily stable strategies (Maynard Smith) generalise Nash equilibria to replicator dynamics. Bounded rationality (Simon), behavioural game theory and quantal response equilibria soften the perfect-rationality assumption. Algorithmic game theory studies computational complexity of equilibria (PPAD-completeness of Nash).`,
    surprise: `In the "iterated prisoner's dilemma" tournaments run by Robert Axelrod, the winner wasn't the cleverest strategy — it was "tit-for-tat," a four-line program: cooperate first, then copy whatever your opponent did last. Kindness and forgiveness, it turns out, are mathematically winning moves.`,
    history: `Von Neumann proved the minimax theorem in 1928. His 1944 book with Morgenstern founded the field. John Nash's 1950 PhD thesis introduced Nash equilibrium. Axelrod's 1980s tournaments made cooperation a central topic. Nash, Schelling, Aumann, Maskin, Myerson, Roth and Shapley all won Nobels for game-theoretic work.`,
  },

  // ───────────────────────────── COSMOLOGY ──────────────────────────────────

  {
    id: 'bigbang', name: 'Big Bang Cosmology', domain: 'cosmos', symbol: '💥',
    tagline: 'The universe had a beginning.',
    equation: 'H² = (8πG/3)ρ − k/a²',
    deps: ['general', 'thermo', 'standard'], sim: 'expansion',
    eli5: `About 13.8 billion years ago, everything — every bit of matter, every bit of space itself — was squished into a tiny hot point. Then it started expanding and cooling. As it cooled, particles formed, then atoms, then stars, then galaxies, then solar systems, then planets, then us. The universe is still expanding today, and you can literally see the leftover heat from the Big Bang with a radio telescope.`,
    intermediate: `The observable universe began 13.8 billion years ago in an extremely hot, dense state and has been expanding and cooling ever since. Key evidence: the cosmic microwave background (CMB) — the leftover radiation at 2.725 K; Hubble's law (distant galaxies recede faster the farther they are); and the abundance of light elements, matching Big Bang nucleosynthesis predictions. General relativity naturally describes an expanding universe. Open questions include inflation, dark matter, dark energy, and what, if anything, came "before."`,
    expert: `The Friedmann equations describe a homogeneous and isotropic universe governed by GR. Concordance ΛCDM has Ω_m ≈ 0.315, Ω_Λ ≈ 0.685, H₀ ≈ 67–73 km/s/Mpc (the Hubble tension is a live controversy). Big Bang nucleosynthesis at t ≈ 1–20 min produced ¾ H, ¼ ⁴He and trace ²H, ³He, ⁷Li in beautiful agreement with observation. Recombination at z ≈ 1100 released the CMB, whose tiny anisotropies were measured to exquisite precision by COBE, WMAP and Planck. Inflation (Guth, Linde, Albrecht & Steinhardt, early 1980s) explains horizon, flatness and structure-seed problems. Pre-inflationary physics remains speculative.`,
    surprise: `Every time you tune an old TV between channels, about 1% of the static you see and hear is leftover light from the Big Bang, detected by your antenna. You're looking at the afterglow of the beginning of time.`,
    history: `Lemaître proposed the expanding universe in 1927. Hubble's 1929 redshift data confirmed expansion. Gamow predicted the CMB in 1948; Penzias and Wilson accidentally discovered it in 1964 while cleaning "pigeon droppings" from a radio antenna (1978 Nobel). Guth proposed inflation in 1980. Planck's 2013–2018 all-sky CMB maps are the most detailed cosmological data ever collected.`,
  },

  {
    id: 'darkmatter', name: 'Dark Matter & Dark Energy', domain: 'cosmos', symbol: 'Λ',
    tagline: '95 % of the universe is missing.',
    equation: 'Ω_Λ ≈ 0.69, Ω_DM ≈ 0.26',
    deps: ['bigbang', 'general'], sim: null,
    eli5: `When astronomers weigh galaxies and watch how they spin, the answer is always wrong — unless the galaxies contain about five times as much invisible stuff as visible stuff. We call this "dark matter." And on top of *that*, something seems to be pushing the whole universe apart faster and faster — we call that "dark energy." Together they make up 95 % of the universe. We have no idea what they actually are.`,
    intermediate: `Observations — galaxy rotation curves, galaxy cluster dynamics, gravitational lensing, the cosmic microwave background, large-scale structure — all demand that about 26 % of the universe's energy density is some kind of matter that doesn't interact with light. Another 69 % is dark energy, a form of energy that stays uniform as space expands and drives that expansion to accelerate. Only 5 % is ordinary atoms. We don't know what dark matter is made of; we don't know why dark energy has the value it does (it's 120 orders of magnitude off naïve theoretical expectations). These are the two biggest outstanding puzzles in physics.`,
    expert: `Dark matter candidates: WIMPs (m ~ GeV–TeV, weakly interacting), axions (m ~ μeV–meV, solving strong CP), sterile neutrinos, primordial black holes, warm dark matter. Direct detection (XENON, LZ, PandaX), indirect detection (Fermi, IceCube), and collider searches have produced null results so far. MOND modifies gravity instead of adding mass but struggles with cluster dynamics and CMB. Dark energy is parameterised as an equation of state w ≈ −1; a cosmological constant Λ with vacuum energy ~10⁻¹²³ M_P⁴ matches data but is fine-tuning-catastrophic. Quintessence and modified gravity are alternatives. DESI and Euclid are mapping the expansion history to discriminate.`,
    surprise: `Every time you walk across a room you pass through trillions of dark-matter particles. They stream through your body without interacting — you are a ghost to them and they are a ghost to you.`,
    history: `Fritz Zwicky inferred dark matter from the Coma cluster in 1933 but was ignored. Vera Rubin's 1970s rotation-curve measurements made the case undeniable. The accelerating expansion was discovered by Perlmutter, Schmidt and Riess in 1998 using Type Ia supernovae (2011 Nobel). The nature of both remains unknown in 2026.`,
  },

  {
    id: 'stars', name: 'Stars & Nucleosynthesis', domain: 'cosmos', symbol: '★',
    tagline: 'You are made of stars.',
    equation: '4 ¹H → ⁴He + 2e⁺ + 2ν + γ',
    deps: ['bigbang', 'standard', 'general'], sim: null,
    eli5: `Stars are giant nuclear furnaces. Deep in their cores, hydrogen squishes into helium and releases huge amounts of energy — that's why they shine. When big stars run out of fuel, they explode. The explosion forges heavier atoms — iron, gold, uranium — and scatters them across space. All those atoms eventually clump together into new stars and planets. Every atom of iron in your blood and every calcium atom in your bones was forged inside a star that died before our Sun was born. You are literally made of stardust.`,
    intermediate: `Stars are self-regulating fusion reactors: gravity pulls mass inward, nuclear fusion pushes energy outward, and the balance determines their size, brightness, and lifespan. Light elements fuse into heavier ones up to iron; beyond iron, fusion requires energy rather than releasing it, so iron marks the end of fusion. Elements heavier than iron are forged in supernovae and neutron-star mergers, then dispersed into interstellar clouds from which new stars and planets form. The carbon, oxygen, nitrogen, and iron in your body were all cooked inside ancient stars. Cosmic recycling is the reason life is possible.`,
    expert: `The proton–proton chain dominates for M ≤ 1.3 M_⊙; the CNO cycle for heavier stars. Main-sequence lifetimes scale as M/L ~ M^{−2.5}. Post-main-sequence evolution proceeds through helium burning (triple-alpha), carbon/neon/oxygen/silicon burning in onion shells for massive stars. Core collapse at M ≥ 8 M_⊙ yields Type II supernovae, producing neutron stars or black holes; the r-process in neutron-star mergers (confirmed by GW170817) dominates the production of heavy elements like gold and platinum. White dwarfs are supported by electron-degeneracy pressure up to the Chandrasekhar limit. Type Ia supernovae are standardisable candles used for cosmology.`,
    surprise: `The gold in your wedding ring was made when two neutron stars collided billions of years ago. LIGO and Virgo detected one such event in 2017; follow-up telescopes saw exactly the kind of heavy-element fingerprint the theory predicted.`,
    history: `Hans Bethe worked out stellar fusion cycles in 1939 (1967 Nobel). Fred Hoyle, Willy Fowler, Margaret and Geoffrey Burbidge published the landmark B²FH paper in 1957 on stellar nucleosynthesis. The 2017 LIGO/Virgo detection of GW170817 plus electromagnetic follow-up confirmed neutron-star mergers as the r-process source.`,
  },

];

// ─── HERO IMAGERY ──────────────────────────────────────────────────────────
// Public-domain imagery sourced from Wikimedia Commons. The hero card's
// gradient falls back gracefully if any particular image fails to load.
const WM = (file, w = 900) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${w}`;

const IMAGES = {
  logic:         { image: WM('Aristotle_Altemps_Inv8575.jpg'),
                   caption: 'Aristotle — the first systematic logician' },
  sets:          { image: WM('Georg_Cantor3.jpg'),
                   caption: 'Georg Cantor — founder of set theory' },
  numbers:       { image: WM('Plimpton_322.jpg'),
                   caption: 'Plimpton 322 — a 3800-year-old Babylonian number tablet' },
  geometry:      { image: WM('P._Oxy._I_29.jpg'),
                   caption: "Papyrus fragment of Euclid's Elements (P. Oxy. 29)" },
  algebra:       { image: WM('Image-Al-Kit%C4%81b_al-mu%E1%B8%ABta%E1%B9%A3ar_f%C4%AB_%E1%B8%A5is%C4%81b_al-%C4%9Fabr_wa-l-muq%C4%81bala.jpg'),
                   caption: "Al-Khwārizmī's Algebra, c. 820 CE" },
  euler:         { image: WM('Leonhard_Euler.jpg'),
                   caption: 'Leonhard Euler — most prolific mathematician in history' },
  calculus:      { image: WM('Newtons_waste_book.jpg'),
                   caption: "Newton's own notebook — calculus invented here" },
  probability:   { image: WM('Pierre-Simon%2C_marquis_de_Laplace_%281745-1827%29_-_Guerin.jpg'),
                   caption: 'Laplace — chief architect of probability theory' },
  symmetry:      { image: WM('Noether.jpg'),
                   caption: 'Emmy Noether — proved symmetry is conservation' },
  action:        { image: WM('Pendulum_animation.gif'),
                   caption: 'A pendulum always finds its laziest swing' },
  conservation:  { image: WM('Newtons_cradle_animation_book_2.gif'),
                   caption: "Newton's cradle — energy and momentum, preserved" },
  newton:        { image: WM('GodfreyKneller-IsaacNewton-1689.jpg'),
                   caption: 'Isaac Newton (Kneller, 1689)' },
  kepler:        { image: WM('Johannes_Kepler_1610.jpg'),
                   caption: 'Johannes Kepler — the celestial legislator' },
  gravity:       { image: WM('The_Earth_seen_from_Apollo_17.jpg'),
                   caption: 'The Blue Marble — Apollo 17, 1972' },
  thermo:        { image: WM('Maquina_vapor_Watt_ETSIIM.jpg'),
                   caption: 'Watt steam engine — thermodynamics in iron' },
  statmech:      { image: WM('Boltzmann2.jpg'),
                   caption: 'Ludwig Boltzmann — S = k log W on his tombstone' },
  maxwell:       { image: WM('James_Clerk_Maxwell.png'),
                   caption: 'James Clerk Maxwell — electricity, magnetism, light unified' },
  special:       { image: WM('Einstein_1921_by_F_Schmutzer_-_restoration.jpg'),
                   caption: 'Einstein, 1921 — E = mc²' },
  general:       { image: WM('Black_hole_-_Messier_87_crop_max_res.jpg'),
                   caption: 'M87* — first-ever image of a black hole (EHT, 2019)' },
  quantum:       { image: WM('Solvay_conference_1927.jpg'),
                   caption: '1927 Solvay Conference — 17 Nobel laureates debating quanta' },
  uncertainty:   { image: WM('Bundesarchiv_Bild183-R57262,_Werner_Heisenberg.jpg'),
                   caption: 'Werner Heisenberg — you can\'t know both where and how fast' },
  pauli:         { image: WM('Pauli.jpg'),
                   caption: 'Wolfgang Pauli — no two electrons alike' },
  qft:           { image: WM('RichardFeynman-PaineMansionWoods1984_copyrightTamikoThiel_bw.jpg'),
                   caption: 'Richard Feynman — diagrams that tamed quantum fields' },
  standard:      { image: WM('CERN_LHC_Tunnel1.jpg'),
                   caption: 'The LHC tunnel at CERN — where particles meet' },
  higgs:         { image: WM('CMS_Higgs-event.jpg'),
                   caption: 'CMS detector event consistent with a Higgs boson' },
  atoms:         { image: WM('Atomic_resolution_Au100.JPG'),
                   caption: 'Individual gold atoms, scanning tunnelling microscope' },
  periodic:      { image: WM('Dmitri_Mendeleev_1897.jpg'),
                   caption: 'Dmitri Mendeleev — predicted elements before they were found' },
  bonding:       { image: WM('Water_molecule_dimensions.svg'),
                   caption: 'Water — two hydrogens sharing with one oxygen' },
  selfrep:       { image: WM('DNA_Structure%2BKey%2BLabelled.pn_NoBB.png'),
                   caption: 'DNA double helix — the molecule that copies itself' },
  centraldogma:  { image: WM('Francis_Crick.png'),
                   caption: 'Francis Crick — information flows DNA → RNA → protein' },
  evolution:     { image: WM('Charles_Darwin_seated_crop.jpg'),
                   caption: 'Charles Darwin — design without a designer' },
  ecosystems:    { image: WM('Amazon_Manaus_forest.jpg'),
                   caption: 'The Amazon — thermodynamics made alive' },
  information:   { image: WM('ClaudeShannon_MFO3807.jpg'),
                   caption: 'Claude Shannon — invented the bit' },
  computation:   { image: WM('Alan_Turing_Aged_16.jpg'),
                   caption: 'Alan Turing — the universal machine' },
  emergence:     { image: WM('Sturnus_vulgaris_-starling_murmuration_-_geograph.org.uk_-_124697.jpg'),
                   caption: 'A starling murmuration — no leader, pure emergence' },
  complexity:    { image: WM('Mandel_zoom_00_mandelbrot_set.jpg'),
                   caption: 'The Mandelbrot set — a single rule, endless detail' },
  gametheory:    { image: WM('John_Forbes_Nash%2C_Jr._by_Peter_Badge.jpg'),
                   caption: 'John Nash — equilibria where nobody gains by deviating' },
  bigbang:       { image: WM('Ilc_9yr_moll4096.png'),
                   caption: 'Cosmic microwave background — afterglow of the Big Bang' },
  darkmatter:    { image: WM('Dark_matter_halo.png'),
                   caption: 'Simulated dark-matter halo structure' },
  stars:         { image: WM('Pillars_2014_HST_WFC3-UVIS_full-res_denoised.jpg'),
                   caption: "Hubble's Pillars of Creation — a star nursery" },
};

LAWS.forEach(l => {
  const img = IMAGES[l.id];
  if (img) {
    l.image = img.image;
    l.caption = img.caption;
  }
});
