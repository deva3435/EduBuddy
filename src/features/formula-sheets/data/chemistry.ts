import { Formula } from '../types';

export const CHEMISTRY_FORMULAS: Formula[] = [
  {
    id: 'chem-mole-concept',
    title: 'The Mole Concept & Avogadro Relations',
    subject: 'chemistry',
    grades: ['Class 9', 'Class 10', 'Class 11'],
    chapter: 'Some Basic Concepts of Chemistry',
    category: 'Stoichiometry & Solutions',
    expression: {
      latex: 'n = \\frac{m}{M} = \\frac{N}{N_A} = \\frac{V_{\\text{STP}}}{22.4\\,\\text{L}}',
      text: 'n = m / M = N / N_A = V_STP / 22.4 L',
      formatted: 'n = m / M = N / N_A'
    },
    variables: [
      { symbol: 'n', name: 'Number of moles', unit: 'mol', description: 'Amount of substance' },
      { symbol: 'm', name: 'Given mass', unit: 'g', description: 'Sample mass in grams' },
      { symbol: 'M', name: 'Molar mass', unit: 'g/mol', description: 'Mass of one mole of substance' },
      { symbol: 'N', name: 'Number of entities', unit: 'particles', description: 'Atoms, molecules, or ions' },
      { symbol: 'N_A', name: "Avogadro's constant", unit: 'mol⁻¹', description: '6.02214 × 10²³ entities/mol' },
      { symbol: 'V_STP', name: 'Gas volume at STP', unit: 'L', description: 'Ideal gas volume at standard T and P' }
    ],
    explanation: 'The fundamental unit bridge connecting macroscopic measurable masses and volumes with microscopic particle counts (atoms, molecules, ions).',
    conditions: 'Gas molar volume 22.4 L holds strictly at standard temperature and pressure (0 °C, 1 atm).',
    example: {
      problem: 'How many molecules are in 36 grams of pure water (H₂O)?',
      given: { m: '36 g', 'M(H₂O)': '18 g/mol', 'N_A': '6.022 × 10²³' },
      steps: [
        'Moles of water: n = m / M = 36 / 18 = 2.0 mol',
        'Number of molecules: N = n × N_A = 2.0 × (6.022 × 10²³) = 1.2044 × 10²⁴ molecules'
      ],
      result: '1.2044 × 10²⁴ molecules'
    },
    keywords: ['mole', 'avogadro', 'stoichiometry', 'molar mass', 'molecules', 'gas volume'],
    isFundamental: true
  },
  {
    id: 'chem-molarity-molality',
    title: 'Molarity & Molality of Solutions',
    subject: 'chemistry',
    grades: ['Class 11', 'Class 12'],
    chapter: 'Solutions',
    category: 'Stoichiometry & Solutions',
    expression: {
      latex: 'M = \\frac{n_{\\text{solute}}}{V_{\\text{solution (L)}}}, \\quad m = \\frac{n_{\\text{solute}}}{w_{\\text{solvent (kg)}}}',
      text: 'Molarity M = n_solute / V_solution(L) ;  Molality m = n_solute / w_solvent(kg)',
      formatted: 'M = n / V_L'
    },
    variables: [
      { symbol: 'M', name: 'Molarity', unit: 'mol/L (or M)', description: 'Temperature-dependent volume concentration' },
      { symbol: 'm', name: 'Molality', unit: 'mol/kg (or m)', description: 'Temperature-independent mass concentration' },
      { symbol: 'n_solute', name: 'Moles of solute', unit: 'mol', description: 'm / M_solute' },
      { symbol: 'V_solution', name: 'Solution volume', unit: 'L', description: 'Total volume of solution in liters' },
      { symbol: 'w_solvent', name: 'Solvent mass', unit: 'kg', description: 'Mass of pure solvent in kilograms' }
    ],
    explanation: 'Quantitative measures of solution concentration. Molarity changes with temperature due to thermal expansion/contraction of liquid volume, whereas molality is strictly invariant with temperature.',
    example: {
      problem: 'Find the molarity of a solution prepared by dissolving 4.0 g of NaOH in water to make 250 mL of solution (Molar mass of NaOH = 40 g/mol).',
      given: { 'm(NaOH)': '4.0 g', 'M(NaOH)': '40 g/mol', 'V': '250 mL = 0.250 L' },
      steps: [
        'Moles of NaOH: n = 4.0 / 40 = 0.10 mol',
        'Molarity M = n / V = 0.10 mol / 0.250 L = 0.40 M'
      ],
      result: 'M = 0.40 mol/L (0.40 M)'
    },
    keywords: ['molarity', 'molality', 'concentration', 'solution', 'solute', 'solvent'],
    isFundamental: true
  },
  {
    id: 'chem-ideal-gas-equation',
    title: 'Ideal Gas Equation',
    subject: 'chemistry',
    grades: ['Class 11'],
    chapter: 'States of Matter / Chemical Thermodynamics',
    category: 'Physical Chemistry',
    expression: {
      latex: 'P V = n R T = \\frac{m}{M} R T = \\frac{\\rho R T}{M}',
      text: 'P·V = n·R·T',
      formatted: 'P V = n R T'
    },
    variables: [
      { symbol: 'P', name: 'Absolute pressure', unit: 'Pa or atm', description: 'Force per unit area exerted by gas molecules' },
      { symbol: 'V', name: 'Volume of container', unit: 'm³ or L', description: 'Space occupied by gas' },
      { symbol: 'n', name: 'Moles of gas', unit: 'mol', description: 'Amount of substance' },
      { symbol: 'R', name: 'Universal Gas Constant', unit: 'J/(mol·K) or L·atm/(mol·K)', description: '8.314 J/(mol·K) = 0.0821 L·atm/(mol·K)' },
      { symbol: 'T', name: 'Absolute temperature', unit: 'K (Kelvin)', description: 'T(K) = T(°C) + 273.15' }
    ],
    explanation: 'Equation of state describing hypothetical ideal gases where intermolecular forces and molecular volumes are negligible. Combines Boyle’s, Charles’s, and Avogadro’s laws.',
    conditions: 'Accurate at high temperatures and low pressures where real gas intermolecular attractions are negligible.',
    example: {
      problem: 'Find the volume occupied by 2.0 moles of an ideal gas at 300 K under 2.0 atm pressure (R = 0.0821 L·atm/(mol·K)).',
      given: { n: '2.0 mol', T: '300 K', P: '2.0 atm', R: '0.0821 L·atm/(mol·K)' },
      steps: [
        'Rearrange for V: V = nRT / P',
        'Substitute: V = (2.0 × 0.0821 × 300) / 2.0',
        'Calculate: V = 0.0821 × 300 = 24.63 L'
      ],
      result: 'V = 24.63 L'
    },
    keywords: ['ideal gas', 'pressure', 'volume', 'temperature', 'gas constant', 'states of matter'],
    isFundamental: true
  },
  {
    id: 'chem-ph-poh',
    title: 'pH, pOH & Ionic Product of Water',
    subject: 'chemistry',
    grades: ['Class 10', 'Class 11'],
    chapter: 'Acids, Bases and Salts / Equilibrium',
    category: 'Inorganic & Physical Chemistry',
    expression: {
      latex: '\\text{pH} = -\\log_{10}[\\text{H}^+], \\quad \\text{pOH} = -\\log_{10}[\\text{OH}^-], \\quad \\text{pH} + \\text{pOH} = 14',
      text: 'pH = -log₁₀[H⁺] ;  pOH = -log₁₀[OH⁻] ;  pH + pOH = 14 (at 25°C)',
      formatted: 'pH = -log₁₀[H⁺]'
    },
    variables: [
      { symbol: 'pH', name: 'Potential of Hydrogen', unit: 'dimensionless', description: 'Logarithmic scale of acidity (0–14)' },
      { symbol: '[H⁺]', name: 'Hydronium concentration', unit: 'mol/L', description: 'Molar concentration of aqueous H⁺ ions' },
      { symbol: '[OH⁻]', name: 'Hydroxide concentration', unit: 'mol/L', description: 'Molar concentration of aqueous OH⁻ ions' },
      { symbol: 'K_w', name: 'Ionic product of water', unit: 'mol²/L²', description: '[H⁺][OH⁻] = 1.0 × 10⁻¹⁴ at 25 °C' }
    ],
    explanation: 'Sørensen scale measuring acidity or basicity of aqueous solutions. Solutions with pH < 7 are acidic, pH = 7 are neutral, and pH > 7 are alkaline.',
    conditions: 'pH + pOH = 14 holds strictly at 25 °C (298 K). At higher temperatures, Kw increases.',
    example: {
      problem: 'Calculate the pH of a 0.001 M HCl solution.',
      given: { '[HCl]': '0.001 M = 1.0 × 10⁻³ M', ionization: 'Complete (strong acid)' },
      steps: [
        'Since HCl is a strong acid, [H⁺] = 1.0 × 10⁻³ M',
        'pH = -log₁₀(1.0 × 10⁻³) = -(-3) = 3.0'
      ],
      result: 'pH = 3.0 (Acidic)'
    },
    keywords: ['ph', 'poh', 'acid', 'base', 'hydronium', 'equilibrium', 'water ionization'],
    isFundamental: true
  },
  {
    id: 'chem-first-law-thermo',
    title: 'First Law of Thermodynamics',
    subject: 'chemistry',
    grades: ['Class 11'],
    chapter: 'Chemical Thermodynamics',
    category: 'Thermodynamics',
    expression: {
      latex: '\\Delta U = q + w = q - P_{\\text{ext}} \\Delta V',
      text: 'ΔU = q + w = q - P_ext · ΔV (IUPAC convention)',
      formatted: 'ΔU = q + w'
    },
    variables: [
      { symbol: 'ΔU', name: 'Change in internal energy', unit: 'J or kJ', description: 'U_final - U_initial of the thermodynamic system' },
      { symbol: 'q', name: 'Heat supplied to system', unit: 'J', description: 'Positive if absorbed by system (endothermic)' },
      { symbol: 'w', name: 'Work done on system', unit: 'J', description: 'Positive if done on system, negative if done by system' },
      { symbol: 'P_ext ΔV', name: 'Expansion work', unit: 'J', description: 'Work against external pressure' }
    ],
    explanation: 'The principle of conservation of energy applied to thermodynamic systems: energy can be converted from one form to another, but cannot be created or destroyed.',
    conditions: 'Closed thermodynamic system.',
    example: {
      problem: 'A gas absorbs 400 J of heat and does 150 J of work by expansion on its surroundings. Find ΔU.',
      given: { q: '+400 J (heat absorbed)', w: '-150 J (work done by gas)' },
      steps: [
        'Under IUPAC convention: w = -150 J',
        'ΔU = q + w = 400 + (-150) = 250 J'
      ],
      result: 'ΔU = +250 J'
    },
    keywords: ['thermodynamics', 'internal energy', 'heat', 'work', 'first law', 'conservation of energy'],
    isFundamental: true
  },
  {
    id: 'chem-gibbs-free-energy',
    title: 'Gibbs Free Energy & Spontaneity',
    subject: 'chemistry',
    grades: ['Class 11', 'Class 12'],
    chapter: 'Chemical Thermodynamics',
    category: 'Thermodynamics',
    expression: {
      latex: '\\Delta G = \\Delta H - T \\Delta S, \\quad \\Delta G^\\circ = -R T \\ln K',
      text: 'ΔG = ΔH - T·ΔS ;  ΔG° = -R·T·ln(K)',
      formatted: 'ΔG = ΔH - T ΔS'
    },
    variables: [
      { symbol: 'ΔG', name: 'Gibbs free energy change', unit: 'kJ/mol', description: 'Criteria for spontaneity: ΔG < 0 is spontaneous' },
      { symbol: 'ΔH', name: 'Enthalpy change', unit: 'kJ/mol', description: 'Heat released or absorbed at constant pressure' },
      { symbol: 'T', name: 'Absolute temperature', unit: 'K', description: 'System temperature in Kelvin' },
      { symbol: 'ΔS', name: 'Entropy change', unit: 'J/(mol·K)', description: 'Change in disorder or randomness' },
      { symbol: 'K', name: 'Equilibrium constant', unit: 'dimensionless', description: 'Equilibrium ratio of products to reactants' }
    ],
    explanation: 'Determines whether a chemical reaction or physical process can occur spontaneously at constant temperature and pressure. ΔG < 0 signifies a spontaneous exergonic process.',
    example: {
      problem: 'For a reaction, ΔH = -28.0 kJ/mol and ΔS = -80.0 J/(mol·K). Is the reaction spontaneous at 298 K?',
      given: { 'ΔH': '-28,000 J/mol', 'ΔS': '-80 J/(mol·K)', T: '298 K' },
      steps: [
        'T × ΔS = 298 K × (-80 J/(mol·K)) = -23,840 J/mol = -23.84 kJ/mol',
        'ΔG = ΔH - TΔS = -28.0 - (-23.84) = -28.0 + 23.84 = -4.16 kJ/mol'
      ],
      result: 'ΔG = -4.16 kJ/mol (Spontaneous, since ΔG < 0)'
    },
    keywords: ['gibbs', 'free energy', 'enthalpy', 'entropy', 'spontaneity', 'equilibrium constant'],
    isFundamental: true
  },
  {
    id: 'chem-arrhenius-equation',
    title: 'Arrhenius Equation for Reaction Rates',
    subject: 'chemistry',
    grades: ['Class 12'],
    chapter: 'Chemical Kinetics',
    category: 'Physical Chemistry',
    expression: {
      latex: 'k = A e^{-\\frac{E_a}{RT}}, \\quad \\ln\\left(\\frac{k_2}{k_1}\\right) = \\frac{E_a}{R} \\left( \\frac{1}{T_1} - \\frac{1}{T_2} \\right)',
      text: 'k = A · e^(-E_a / RT) ;  ln(k₂ / k₁) = (E_a / R) · (1/T₁ - 1/T₂)',
      formatted: 'k = A · e^(-E_a / RT)'
    },
    variables: [
      { symbol: 'k', name: 'Rate constant', unit: 's⁻¹ (or mol⁻¹·L·s⁻¹)', description: 'Specific reaction rate at temperature T' },
      { symbol: 'A', name: 'Frequency / Pre-exponential factor', unit: 'same as k', description: 'Frequency of collisions with favorable orientation' },
      { symbol: 'E_a', name: 'Activation energy', unit: 'J/mol or kJ/mol', description: 'Minimum energy barrier molecules must overcome to react' },
      { symbol: 'R', name: 'Universal Gas Constant', unit: '8.314 J/(mol·K)', description: 'Gas constant' },
      { symbol: 'T', name: 'Absolute temperature', unit: 'K', description: 'Temperature in Kelvin' }
    ],
    explanation: 'Quantifies the temperature dependence of chemical reaction rate constants. Shows that reaction rates increase exponentially with temperature as a greater fraction of collisions possess energy ≥ Ea.',
    example: {
      problem: 'The rate constant doubles when temperature increases from 300 K to 310 K. Estimate activation energy Ea (R = 8.314 J/mol·K).',
      given: { 'k₂/k₁': '2.0', T1: '300 K', T2: '310 K', R: '8.314 J/mol·K' },
      steps: [
        'ln(k₂/k₁) = ln(2) ≈ 0.693',
        '(1/T₁ - 1/T₂) = (310 - 300)/(300 × 310) = 10 / 93,000 = 1.075 × 10⁻⁴ K⁻¹',
        'E_a = (0.693 × 8.314) / (1.075 × 10⁻⁴) ≈ 5.762 / 1.075 × 10⁻⁴ ≈ 53,600 J/mol = 53.6 kJ/mol'
      ],
      result: 'E_a ≈ 53.6 kJ/mol'
    },
    keywords: ['arrhenius', 'kinetics', 'activation energy', 'rate constant', 'temperature dependence']
  },
  {
    id: 'chem-first-order-kinetics',
    title: 'First-Order Reaction Rate & Half-Life',
    subject: 'chemistry',
    grades: ['Class 12'],
    chapter: 'Chemical Kinetics',
    category: 'Physical Chemistry',
    expression: {
      latex: 'k = \\frac{2.303}{t} \\log_{10}\\left(\\frac{[A]_0}{[A]_t}\\right), \\quad t_{1/2} = \\frac{\\ln 2}{k} = \\frac{0.693}{k}',
      text: 'k = (2.303 / t) · log₁₀([A]₀ / [A]_t) ;  t_1/2 = 0.693 / k',
      formatted: 't_1/2 = 0.693 / k'
    },
    variables: [
      { symbol: 'k', name: 'First order rate constant', unit: 's⁻¹ or min⁻¹', description: 'Specific rate' },
      { symbol: '[A]₀', name: 'Initial reactant concentration', unit: 'mol/L', description: 'Concentration at t = 0' },
      { symbol: '[A]_t', name: 'Remaining concentration', unit: 'mol/L', description: 'Concentration at time t' },
      { symbol: 't_1/2', name: 'Half-life period', unit: 's or min', description: 'Time taken for concentration to halve (independent of [A]₀)' }
    ],
    explanation: 'For a first-order chemical reaction, the rate depends linearly on only one reactant concentration. A distinctive hallmark is that half-life t_1/2 is completely independent of initial reactant concentration.',
    example: {
      problem: 'A first-order reaction has a rate constant k = 0.0231 min⁻¹. Find its half-life and time needed for 75% completion.',
      given: { k: '0.0231 min⁻¹' },
      steps: [
        'Half-life: t_1/2 = 0.693 / k = 0.693 / 0.0231 = 30 minutes',
        'For 75% completion, remaining concentration is 25% (half of 50%, i.e., 2 half-lives)',
        't_75% = 2 × t_1/2 = 2 × 30 = 60 minutes'
      ],
      result: 't_1/2 = 30 min, t_75% = 60 min'
    },
    keywords: ['first order', 'half life', 'kinetics', 'rate constant', 'radioactive decay'],
    isFundamental: true
  },
  {
    id: 'chem-nernst-equation',
    title: 'Nernst Equation for Electrochemical Cells',
    subject: 'chemistry',
    grades: ['Class 12'],
    chapter: 'Electrochemistry',
    category: 'Electrochemistry',
    expression: {
      latex: 'E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{2.303 R T}{n F} \\log_{10} Q = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log_{10} Q \\quad (\\text{at } 298\\,\\text{K})',
      text: 'E_cell = E°_cell - (0.0591 / n) · log₁₀(Q)  at 298 K',
      formatted: 'E_cell = E°_cell - (0.0591 / n) log₁₀ Q'
    },
    variables: [
      { symbol: 'E_cell', name: 'Non-standard cell EMF', unit: 'V (Volts)', description: 'Cell potential under arbitrary concentrations' },
      { symbol: 'E°_cell', name: 'Standard cell potential', unit: 'V', description: 'EMF under standard conditions (1 M, 1 atm, 298 K)' },
      { symbol: 'n', name: 'Number of electrons transferred', unit: 'mol e⁻', description: 'Balanced redox stoichiometric electron count' },
      { symbol: 'Q', name: 'Reaction quotient', unit: 'dimensionless', description: '[Products]^c / [Reactants]^a' },
      { symbol: 'F', name: "Faraday's constant", unit: 'C/mol', description: '96485 C/mol of electrons' }
    ],
    explanation: 'Relates standard reduction electrode potential to actual cell potential at non-standard electrolyte concentrations and temperatures.',
    example: {
      problem: 'Calculate EMF of Daniel cell at 298 K: Zn(s) | Zn²⁺(0.01 M) || Cu²⁺(1.0 M) | Cu(s), given E°_cell = 1.10 V.',
      given: { "E°_cell": '1.10 V', n: '2 (Zn + Cu²⁺ → Zn²⁺ + Cu)', '[Zn²⁺]': '0.01 M', '[Cu²⁺]': '1.0 M' },
      steps: [
        'Reaction quotient Q = [Zn²⁺] / [Cu²⁺] = 0.01 / 1.0 = 10⁻²',
        'log₁₀(Q) = log₁₀(10⁻²) = -2',
        'E_cell = 1.10 - (0.0591 / 2) × (-2) = 1.10 + 0.0591 = 1.1591 V'
      ],
      result: 'E_cell ≈ 1.16 V'
    },
    keywords: ['nernst', 'electrochemistry', 'emf', 'cell potential', 'faraday', 'reaction quotient', 'redox'],
    isFundamental: true
  },
  {
    id: 'chem-raoults-law',
    title: "Raoult's Law & Colligative Properties",
    subject: 'chemistry',
    grades: ['Class 12'],
    chapter: 'Solutions',
    category: 'Stoichiometry & Solutions',
    expression: {
      latex: 'P_1 = x_1 P_1^\\circ, \\quad \\frac{P_1^\\circ - P_1}{P_1^\\circ} = x_2 = \\frac{n_2}{n_1 + n_2}',
      text: 'P₁ = x₁ · P₁° ;  (P₁° - P₁) / P₁° = x₂ (relative lowering of vapor pressure)',
      formatted: '(P° - P) / P° = x₂'
    },
    variables: [
      { symbol: 'P₁', name: 'Vapor pressure of solvent above solution', unit: 'mmHg or kPa', description: 'Partial vapor pressure' },
      { symbol: 'P₁°', name: 'Vapor pressure of pure solvent', unit: 'mmHg or kPa', description: 'Vapor pressure of neat liquid at temperature T' },
      { symbol: 'x₁', name: 'Mole fraction of solvent', unit: 'dimensionless', description: 'n₁ / (n₁ + n₂)' },
      { symbol: 'x₂', name: 'Mole fraction of non-volatile solute', unit: 'dimensionless', description: 'n₂ / (n₁ + n₂)' }
    ],
    explanation: 'States that the partial vapor pressure of each volatile component in an ideal solution is directly proportional to its mole fraction. The relative lowering of vapor pressure is a colligative property.',
    example: {
      problem: 'Pure water has vapor pressure 23.8 mmHg at 25°C. Calculate vapor pressure when 1 mole of glucose is dissolved in 100 moles of water.',
      given: { "P₁°": '23.8 mmHg', 'n(glucose)': '1 mol', 'n(water)': '100 mol' },
      steps: [
        'Solute mole fraction x₂ = 1 / (100 + 1) = 1 / 101 ≈ 0.0099',
        'Relative lowering: (P₁° - P₁) / P₁° = x₂ → P₁° - P₁ = 23.8 × 0.0099 ≈ 0.236 mmHg',
        'P₁ = 23.8 - 0.236 = 23.56 mmHg'
      ],
      result: 'P₁ ≈ 23.56 mmHg'
    },
    keywords: ['raoult', 'vapor pressure', 'colligative', 'mole fraction', 'solutions', 'boiling point']
  }
];
