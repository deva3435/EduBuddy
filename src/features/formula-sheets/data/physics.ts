import { Formula } from '../types';

export const PHYSICS_FORMULAS: Formula[] = [
  {
    id: 'phys-motion-equations',
    title: 'Kinematic Equations of Uniformly Accelerated Motion',
    subject: 'physics',
    grades: ['Class 9', 'Class 11'],
    chapter: 'Motion in a Straight Line',
    category: 'Mechanics',
    expression: {
      latex: 'v = u + at, \\quad s = ut + \\frac{1}{2}at^2, \\quad v^2 = u^2 + 2as',
      text: 'v = u + at ;  s = ut + (1/2)at² ;  v² = u² + 2as',
      formatted: 'v = u + at'
    },
    variables: [
      { symbol: 'v', name: 'Final velocity', unit: 'm/s', description: 'Velocity of object at time t' },
      { symbol: 'u', name: 'Initial velocity', unit: 'm/s', description: 'Velocity at t = 0' },
      { symbol: 'a', name: 'Uniform acceleration', unit: 'm/s²', description: 'Constant rate of change of velocity' },
      { symbol: 't', name: 'Time elapsed', unit: 's', description: 'Duration of accelerated motion' },
      { symbol: 's', name: 'Displacement', unit: 'm', description: 'Change in position over interval t' }
    ],
    explanation: 'Fundamental relationships describing one-dimensional linear motion under constant (uniform) acceleration. Each equation omits one of the five kinematic parameters.',
    conditions: 'Valid strictly when acceleration a is constant in magnitude and direction.',
    example: {
      problem: 'A train accelerates uniformly from rest at 2.5 m/s² for 8 seconds. Find its final speed and distance traveled.',
      given: { u: '0 m/s', a: '2.5 m/s²', t: '8 s' },
      steps: [
        'Final velocity: v = u + at = 0 + (2.5)(8) = 20 m/s',
        'Distance: s = ut + (1/2)at² = 0 + (0.5)(2.5)(8²) = 1.25 × 64 = 80 m'
      ],
      result: 'v = 20 m/s, s = 80 m',
      note: 'Using v² = u² + 2as as a check: 20² = 0 + 2(2.5)(80) → 400 = 400 (confirmed).'
    },
    keywords: ['kinematics', 'motion', 'acceleration', 'velocity', 'displacement', 'suvat', 'mechanics'],
    isFundamental: true
  },
  {
    id: 'phys-newton-second-law',
    title: "Newton's Second Law of Motion",
    subject: 'physics',
    grades: ['Class 9', 'Class 11'],
    chapter: 'Laws of Motion',
    category: 'Mechanics',
    expression: {
      latex: '\\vec{F}_{\\text{net}} = m \\vec{a} = \\frac{d\\vec{p}}{dt}',
      text: 'F_net = m·a = dp/dt',
      formatted: 'F = m · a'
    },
    variables: [
      { symbol: 'F_net', name: 'Net external force', unit: 'N (kg·m/s²)', description: 'Vector sum of all applied forces' },
      { symbol: 'm', name: 'Inertial mass', unit: 'kg', description: 'Measure of body’s resistance to acceleration' },
      { symbol: 'a', name: 'Acceleration', unit: 'm/s²', description: 'Rate of change of velocity vector' },
      { symbol: 'p', name: 'Linear momentum', unit: 'kg·m/s', description: 'Product of mass and velocity: p = mv' }
    ],
    explanation: 'The time rate of change of linear momentum of a body is directly proportional to the applied net external force and occurs in the direction of the force.',
    conditions: 'Valid in inertial reference frames. When mass is constant, F = ma.',
    example: {
      problem: 'What net force is required to accelerate a 1200 kg car from 10 m/s to 25 m/s in 5 seconds?',
      given: { m: '1200 kg', u: '10 m/s', v: '25 m/s', t: '5 s' },
      steps: [
        'Calculate acceleration: a = (v - u) / t = (25 - 10) / 5 = 15 / 5 = 3 m/s²',
        'Apply Newton’s law: F = m × a = 1200 kg × 3 m/s² = 3600 N'
      ],
      result: 'F = 3,600 N (3.6 kN)'
    },
    keywords: ['newton', 'force', 'mass', 'acceleration', 'momentum', 'dynamics', 'mechanics'],
    isFundamental: true
  },
  {
    id: 'phys-universal-gravitation',
    title: "Newton's Law of Universal Gravitation",
    subject: 'physics',
    grades: ['Class 9', 'Class 11'],
    chapter: 'Gravitation',
    category: 'Mechanics',
    expression: {
      latex: 'F = G \\frac{m_1 m_2}{r^2}',
      text: 'F = G · (m₁ · m₂) / r²',
      formatted: 'F = G · (m₁ m₂) / r²'
    },
    variables: [
      { symbol: 'F', name: 'Gravitational attraction force', unit: 'N', description: 'Mutual attractive force between masses' },
      { symbol: 'G', name: 'Universal Gravitational Constant', unit: 'N·m²/kg²', description: '6.67430 × 10⁻¹¹ N·m²/kg²' },
      { symbol: 'm₁, m₂', name: 'Point masses', unit: 'kg', description: 'Interacting mass values' },
      { symbol: 'r', name: 'Separation distance', unit: 'm', description: 'Distance between centers of mass' }
    ],
    explanation: 'Every particle in the universe attracts every other particle with a force proportional to the product of their masses and inversely proportional to the square of their separation.',
    conditions: 'Applies to point masses or spherically symmetric bodies.',
    example: {
      problem: 'Find the gravitational force between two 50 kg lead spheres placed 0.5 m apart.',
      given: { m1: '50 kg', m2: '50 kg', r: '0.5 m', G: '6.67 × 10⁻¹¹ N·m²/kg²' },
      steps: [
        'Product of masses: 50 × 50 = 2500 kg²',
        'Square of distance: r² = (0.5)² = 0.25 m²',
        'Force F = (6.67 × 10⁻¹¹) × (2500 / 0.25) = (6.67 × 10⁻¹¹) × 10000 = 6.67 × 10⁻⁷ N'
      ],
      result: 'F ≈ 6.67 × 10⁻⁷ N'
    },
    keywords: ['gravitation', 'gravity', 'attraction', 'mass', 'inverse square law', 'kepler'],
    isFundamental: true
  },
  {
    id: 'phys-kinetic-energy-work',
    title: 'Work-Energy Theorem & Kinetic Energy',
    subject: 'physics',
    grades: ['Class 9', 'Class 11'],
    chapter: 'Work, Energy and Power',
    category: 'Mechanics',
    expression: {
      latex: 'K = \\frac{1}{2} m v^2, \\quad W_{\\text{net}} = \\Delta K = K_f - K_i',
      text: 'K = (1/2) m v² ;  W_net = ΔK = K_final - K_initial',
      formatted: 'K = (1/2) m v²'
    },
    variables: [
      { symbol: 'K', name: 'Kinetic energy', unit: 'J (Joules)', description: 'Energy possessed due to motion' },
      { symbol: 'W_net', name: 'Net work done', unit: 'J', description: 'Line integral of net force over displacement' },
      { symbol: 'm', name: 'Mass of body', unit: 'kg', description: 'Inertial mass' },
      { symbol: 'v', name: 'Speed', unit: 'm/s', description: 'Magnitude of velocity' }
    ],
    explanation: 'Work done by the net force acting on a particle equals the change in its kinetic energy. Work is scalar product: W = F · s = F s cos θ.',
    example: {
      problem: 'Find the kinetic energy of a 0.15 kg baseball traveling at 40 m/s.',
      given: { m: '0.15 kg', v: '40 m/s' },
      steps: [
        'Square velocity: v² = 40² = 1600 m²/s²',
        'K = (0.5) × (0.15) × 1600 = 0.5 × 240 = 120 J'
      ],
      result: 'K = 120 J'
    },
    keywords: ['kinetic energy', 'work', 'energy', 'power', 'work-energy theorem', 'joules'],
    isFundamental: true
  },
  {
    id: 'phys-simple-pendulum',
    title: 'Time Period of a Simple Pendulum',
    subject: 'physics',
    grades: ['Class 11'],
    chapter: 'Oscillations',
    category: 'Oscillations & Waves',
    expression: {
      latex: 'T = 2\\pi \\sqrt{\\frac{L}{g}}',
      text: 'T = 2π √(L / g)',
      formatted: 'T = 2π √(L / g)'
    },
    variables: [
      { symbol: 'T', name: 'Time period', unit: 's', description: 'Time taken for one complete oscillation' },
      { symbol: 'L', name: 'Effective length', unit: 'm', description: 'Distance from pivot to center of bob' },
      { symbol: 'g', name: 'Acceleration due to gravity', unit: 'm/s²', description: 'Local gravity (≈ 9.8 m/s² on Earth)' }
    ],
    explanation: 'Describes the period of small-angle harmonic oscillation of an idealized bob hanging from a massless string. The period is independent of the mass of the bob and amplitude.',
    conditions: 'Valid for small angular displacements (θ < 15° where sin θ ≈ θ).',
    example: {
      problem: 'Calculate the period of a seconds pendulum having length L = 0.993 m where g = 9.8 m/s².',
      given: { L: '0.993 m', g: '9.8 m/s²' },
      steps: [
        'Ratio L / g = 0.993 / 9.8 ≈ 0.1013',
        'Square root: √(0.1013) ≈ 0.3183',
        'T = 2 × 3.1416 × 0.3183 ≈ 2.00 s'
      ],
      result: 'T = 2.0 s'
    },
    keywords: ['pendulum', 'oscillation', 'shm', 'time period', 'harmonic motion', 'gravity']
  },
  {
    id: 'phys-ohms-law-power',
    title: "Ohm's Law & Electric Power",
    subject: 'physics',
    grades: ['Class 10', 'Class 12'],
    chapter: 'Electricity & Current Electricity',
    category: 'Electromagnetism',
    expression: {
      latex: 'V = I R, \\quad P = V I = I^2 R = \\frac{V^2}{R}',
      text: 'V = I·R ;  P = V·I = I²·R = V² / R',
      formatted: 'V = I · R'
    },
    variables: [
      { symbol: 'V', name: 'Potential difference', unit: 'V (Volts)', description: 'Voltage drop across conductor' },
      { symbol: 'I', name: 'Current', unit: 'A (Amperes)', description: 'Rate of charge flow: I = q/t' },
      { symbol: 'R', name: 'Resistance', unit: 'Ω (Ohms)', description: 'Opposition to charge flow' },
      { symbol: 'P', name: 'Electric power', unit: 'W (Watts)', description: 'Rate of electrical energy dissipation' }
    ],
    explanation: 'Current flowing through an ohmic conductor is directly proportional to potential difference across its terminals at constant temperature. Electric power measures Joule heating: H = I²Rt.',
    conditions: 'Valid for Ohmic conductors at constant temperature and physical dimensions.',
    example: {
      problem: 'An electric heater connected to a 220 V supply draws a current of 5 A. Find its resistance and power rating.',
      given: { V: '220 V', I: '5 A' },
      steps: [
        'Resistance: R = V / I = 220 / 5 = 44 Ω',
        'Power: P = V × I = 220 × 5 = 1100 W (1.1 kW)'
      ],
      result: 'R = 44 Ω, P = 1100 W (1.1 kW)'
    },
    keywords: ['ohm', 'electricity', 'voltage', 'current', 'resistance', 'power', 'joule heating'],
    isFundamental: true
  },
  {
    id: 'phys-resistance-resistivity',
    title: 'Resistance, Length, Area and Resistivity',
    subject: 'physics',
    grades: ['Class 10', 'Class 12'],
    chapter: 'Current Electricity',
    category: 'Electromagnetism',
    expression: {
      latex: 'R = \\rho \\frac{L}{A}',
      text: 'R = ρ · (L / A)',
      formatted: 'R = ρ (L / A)'
    },
    variables: [
      { symbol: 'R', name: 'Resistance', unit: 'Ω', description: 'Overall conductor resistance' },
      { symbol: 'ρ', name: 'Resistivity', unit: 'Ω·m', description: 'Intrinsic material property' },
      { symbol: 'L', name: 'Length of conductor', unit: 'm', description: 'Conductor length' },
      { symbol: 'A', name: 'Cross-sectional area', unit: 'm²', description: 'Transverse cross-sectional area' }
    ],
    explanation: 'Resistance of a uniform conductor is proportional to its length and inversely proportional to its cross-sectional area. Resistivity ρ depends only on material and temperature.',
    example: {
      problem: 'A copper wire of length 2 m and cross-section 1.0 × 10⁻⁶ m² has resistivity 1.7 × 10⁻⁸ Ω·m. Find its resistance.',
      given: { L: '2 m', A: '1.0 × 10⁻⁶ m²', 'ρ': '1.7 × 10⁻⁸ Ω·m' },
      steps: [
        'R = (1.7 × 10⁻⁸) × [2 / (1.0 × 10⁻⁶)]',
        'R = (1.7 × 10⁻⁸) × (2 × 10⁶) = 3.4 × 10⁻² = 0.034 Ω'
      ],
      result: 'R = 0.034 Ω (34 mΩ)'
    },
    keywords: ['resistance', 'resistivity', 'conductor', 'wire', 'ohm meter']
  },
  {
    id: 'phys-coulombs-law',
    title: "Coulomb's Law of Electrostatics",
    subject: 'physics',
    grades: ['Class 12'],
    chapter: 'Electric Charges and Fields',
    category: 'Electromagnetism',
    expression: {
      latex: 'F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{|q_1 q_2|}{r^2} = k_e \\frac{|q_1 q_2|}{r^2}',
      text: 'F = [1 / (4πε₀)] × (|q₁·q₂| / r²)  where 1/(4πε₀) ≈ 9 × 10⁹ N·m²/C²',
      formatted: 'F = k · (|q₁ q₂| / r²)'
    },
    variables: [
      { symbol: 'F', name: 'Electrostatic force', unit: 'N', description: 'Force along the line joining charges' },
      { symbol: 'q₁, q₂', name: 'Electric charges', unit: 'C (Coulombs)', description: 'Magnitudes of interacting point charges' },
      { symbol: 'r', name: 'Distance between charges', unit: 'm', description: 'Separation distance' },
      { symbol: 'ε₀', name: 'Permittivity of free space', unit: 'C²/(N·m²)', description: '8.854 × 10⁻¹² C²/(N·m²)' }
    ],
    explanation: 'Quantifies the electrostatic force between two stationary point charges. Like charges repel; opposite charges attract. The constant 1/(4πε₀) equals 8.98755 × 10⁹ N·m²/C².',
    example: {
      problem: 'Find the repulsive force between two charges of +2 μC and +3 μC separated by 0.3 m in vacuum.',
      given: { q1: '2 × 10⁻⁶ C', q2: '3 × 10⁻⁶ C', r: '0.3 m', k: '9 × 10⁹ N·m²/C²' },
      steps: [
        'q₁ × q₂ = (2 × 10⁻⁶) × (3 × 10⁻⁶) = 6 × 10⁻¹² C²',
        'r² = (0.3)² = 0.09 m²',
        'F = (9 × 10⁹) × (6 × 10⁻¹² / 0.09) = (9 × 10⁹) × (6.67 × 10⁻¹¹) = 0.6 N'
      ],
      result: 'F = 0.6 N'
    },
    keywords: ['coulomb', 'electrostatics', 'charge', 'permittivity', 'electric force', 'field'],
    isFundamental: true
  },
  {
    id: 'phys-capacitance-parallel-plate',
    title: 'Capacitance of a Parallel Plate Capacitor',
    subject: 'physics',
    grades: ['Class 12'],
    chapter: 'Electrostatic Potential and Capacitance',
    category: 'Electromagnetism',
    expression: {
      latex: 'C = \\frac{\\varepsilon_0 A}{d}, \\quad C_m = \\frac{\\kappa \\varepsilon_0 A}{d} = \\kappa C_0',
      text: 'C = (ε₀ · A) / d  (in vacuum) ;  C = (κ · ε₀ · A) / d  (with dielectric κ)',
      formatted: 'C = (ε₀ A) / d'
    },
    variables: [
      { symbol: 'C', name: 'Capacitance', unit: 'F (Farads)', description: 'Ratio of stored charge to potential: C = Q/V' },
      { symbol: 'A', name: 'Plate area', unit: 'm²', description: 'Overlap area of capacitor plates' },
      { symbol: 'd', name: 'Plate separation', unit: 'm', description: 'Distance between conductive plates' },
      { symbol: 'κ', name: 'Dielectric constant', unit: 'dimensionless', description: 'Relative permittivity (κ ≥ 1)' }
    ],
    explanation: 'Determines the charge-storage capacity of two parallel conductive plates separated by a vacuum or dielectric medium.',
    example: {
      problem: 'Find the capacitance of plates with area 0.02 m² separated by 1 mm in air.',
      given: { A: '0.02 m²', d: '1.0 × 10⁻³ m', 'ε₀': '8.85 × 10⁻¹² F/m' },
      steps: [
        'C = (8.85 × 10⁻¹² × 0.02) / (1.0 × 10⁻³)',
        'C = (1.77 × 10⁻¹³) / 10⁻³ = 1.77 × 10⁻¹⁰ F = 177 pF'
      ],
      result: 'C = 177 pF (picofarads)'
    },
    keywords: ['capacitance', 'capacitor', 'dielectric', 'farad', 'parallel plate', 'electrostatics']
  },
  {
    id: 'phys-lens-mirror-formula',
    title: 'Mirror & Thin Lens Formulas with Magnification',
    subject: 'physics',
    grades: ['Class 10', 'Class 12'],
    chapter: 'Ray Optics and Optical Instruments',
    category: 'Optics',
    expression: {
      latex: '\\text{Mirror: } \\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}, \\quad \\text{Lens: } \\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}, \\quad m = \\frac{h_i}{h_o}',
      text: 'Mirror: 1/f = 1/v + 1/u ;  Lens: 1/f = 1/v - 1/u ;  m = h_i / h_o',
      formatted: '1/f = 1/v ± 1/u'
    },
    variables: [
      { symbol: 'f', name: 'Focal length', unit: 'm or cm', description: 'Distance from optical center/pole to principal focus' },
      { symbol: 'u', name: 'Object distance', unit: 'm or cm', description: 'Distance of object from optical center (conventionally negative)' },
      { symbol: 'v', name: 'Image distance', unit: 'm or cm', description: 'Distance of image formed' },
      { symbol: 'm', name: 'Linear magnification', unit: 'dimensionless', description: 'Ratio of image height to object height' }
    ],
    explanation: 'Relates focal length, object position, and image formation for spherical mirrors (+ sign) and thin lenses (- sign) following the Cartesian sign convention.',
    conditions: 'Thin lens approximation and paraxial rays close to the principal axis.',
    example: {
      problem: 'An object is placed 30 cm in front of a convex lens of focal length 20 cm. Find the image distance v.',
      given: { f: '+20 cm', u: '-30 cm (Cartesian convention)' },
      steps: [
        'Lens formula: 1/f = 1/v - 1/u → 1/v = 1/f + 1/u',
        '1/v = 1/20 + 1/(-30) = 1/20 - 1/30 = (3 - 2)/60 = 1/60',
        'v = +60 cm (real, inverted image formed 60 cm on opposite side)'
      ],
      result: 'v = +60 cm, m = v/u = 60/(-30) = -2 (enlarged 2×)'
    },
    keywords: ['optics', 'lens', 'mirror', 'focal length', 'magnification', 'refraction', 'reflection'],
    isFundamental: true
  },
  {
    id: 'phys-snells-law',
    title: "Snell's Law of Refraction",
    subject: 'physics',
    grades: ['Class 10', 'Class 12'],
    chapter: 'Ray Optics',
    category: 'Optics',
    expression: {
      latex: 'n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2 = \\frac{c}{v_1} \\sin\\theta_1',
      text: 'n₁ · sin(θ₁) = n₂ · sin(θ₂)',
      formatted: 'n₁ sin θ₁ = n₂ sin θ₂'
    },
    variables: [
      { symbol: 'n₁, n₂', name: 'Refractive indices', unit: 'dimensionless', description: 'Absolute refractive index of medium 1 and 2' },
      { symbol: 'θ₁', name: 'Angle of incidence', unit: 'degrees', description: 'Angle of incident ray with normal' },
      { symbol: 'θ₂', name: 'Angle of refraction', unit: 'degrees', description: 'Angle of refracted ray with normal' }
    ],
    explanation: 'Describes the bending of light rays when crossing the boundary between two isotropic dielectric media with different phase velocities.',
    example: {
      problem: 'A light ray enters water (n₂ = 1.33) from air (n₁ = 1.00) at an incidence angle of 30°. Find angle of refraction.',
      given: { n1: '1.00', n2: '1.33', 'θ₁': '30°' },
      steps: [
        '1.00 × sin(30°) = 1.33 × sin(θ₂)',
        'sin(30°) = 0.50 → sin(θ₂) = 0.50 / 1.33 ≈ 0.3759',
        'θ₂ = arcsin(0.3759) ≈ 22.1°'
      ],
      result: 'θ₂ ≈ 22.1°'
    },
    keywords: ['snell', 'refraction', 'optics', 'light', 'refractive index', 'angle'],
    isFundamental: true
  },
  {
    id: 'phys-photoelectric-effect',
    title: "Einstein's Photoelectric Equation",
    subject: 'physics',
    grades: ['Class 12'],
    chapter: 'Dual Nature of Radiation and Matter',
    category: 'Modern Physics',
    expression: {
      latex: 'h\\nu = \\phi + K_{\\max} = h\\nu_0 + \\frac{1}{2}m v_{\\max}^2 = e V_0',
      text: 'h·ν = φ + K_max = h·ν₀ + e·V₀',
      formatted: 'hν = φ + K_max'
    },
    variables: [
      { symbol: 'hν', name: 'Photon energy', unit: 'J or eV', description: 'Energy of incident electromagnetic photon (E = hν = hc/λ)' },
      { symbol: 'φ', name: 'Work function', unit: 'J or eV', description: 'Minimum energy needed to eject an electron from metal surface' },
      { symbol: 'K_max', name: 'Maximum kinetic energy', unit: 'J or eV', description: 'Kinetic energy of fastest emitted photoelectron' },
      { symbol: 'V₀', name: 'Stopping potential', unit: 'V', description: 'Potential needed to reduce photoelectric current to zero' }
    ],
    explanation: 'Einstein explained the photoelectric effect by quantizing light into discrete packets of energy (photons). Validated Planck’s constant and earned Einstein the 1921 Nobel Prize.',
    example: {
      problem: 'Light of frequency 1.0 × 10¹⁵ Hz strikes a metal with work function 2.5 eV. Find maximum kinetic energy in eV (h = 4.14 × 10⁻¹⁵ eV·s).',
      given: { 'ν': '1.0 × 10¹⁵ Hz', 'φ': '2.5 eV', h: '4.14 × 10⁻¹⁵ eV·s' },
      steps: [
        'Photon energy: E = hν = (4.14 × 10⁻¹⁵ eV·s) × (1.0 × 10¹⁵ s⁻¹) = 4.14 eV',
        'K_max = E - φ = 4.14 eV - 2.50 eV = 1.64 eV'
      ],
      result: 'K_max = 1.64 eV'
    },
    keywords: ['photoelectric', 'einstein', 'photon', 'work function', 'quantum', 'modern physics'],
    isFundamental: true
  },
  {
    id: 'phys-de-broglie-wavelength',
    title: 'De Broglie Matter Wave Equation',
    subject: 'physics',
    grades: ['Class 11', 'Class 12'],
    chapter: 'Dual Nature of Radiation and Matter',
    category: 'Modern Physics',
    expression: {
      latex: '\\lambda = \\frac{h}{p} = \\frac{h}{m v} = \\frac{h}{\\sqrt{2m K}}',
      text: 'λ = h / p = h / (m·v) = h / √(2m·K)',
      formatted: 'λ = h / p'
    },
    variables: [
      { symbol: 'λ', name: 'De Broglie wavelength', unit: 'm', description: 'Wavelength associated with moving particle' },
      { symbol: 'h', name: "Planck's constant", unit: 'J·s', description: '6.626 × 10⁻³⁴ J·s' },
      { symbol: 'p', name: 'Momentum', unit: 'kg·m/s', description: 'Product of mass and speed: p = mv' },
      { symbol: 'K', name: 'Kinetic energy', unit: 'J', description: 'p = √(2mK)' }
    ],
    explanation: 'Proposes that matter exhibits wave-particle duality: every moving material particle has an associated wave nature inversely proportional to its momentum.',
    example: {
      problem: 'Find the de Broglie wavelength of an electron (m = 9.1 × 10⁻³¹ kg) moving at 1.0 × 10⁶ m/s.',
      given: { m: '9.1 × 10⁻³¹ kg', v: '1.0 × 10⁶ m/s', h: '6.63 × 10⁻³⁴ J·s' },
      steps: [
        'Momentum p = m × v = (9.1 × 10⁻³¹) × (10⁶) = 9.1 × 10⁻²⁵ kg·m/s',
        'Wavelength λ = h / p = (6.63 × 10⁻³⁴) / (9.1 × 10⁻²⁵) ≈ 7.28 × 10⁻¹⁰ m'
      ],
      result: 'λ ≈ 0.728 nm (7.28 Å)'
    },
    keywords: ['de broglie', 'wavelength', 'matter waves', 'quantum', 'electron', 'momentum']
  }
];
