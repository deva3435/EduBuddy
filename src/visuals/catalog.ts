import type { VisualizationExperience } from './types';

export const VISUAL_CATALOG: VisualizationExperience[] = [
  {
    id: 'solar-system',
    title: 'The Solar System & Planetary Orbits',
    subject: 'Science',
    category: 'Astronomy',
    gradeRange: 'Class 4–10',
    grades: ['Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
    description: 'Explore the Sun and eight planets. Observe relative orbital velocities, elliptical paths, and inspect individual planetary details in 2D or 3D.',
    badge: '3D Simulation',
    has3D: true,
    disclaimer: 'Orbital distances and planetary diameters are simplified for educational clarity and are not to true astronomical scale.',
    funFact: 'One year on Mercury takes only 88 Earth days, while Neptune takes nearly 165 Earth years to complete a single orbit around the Sun!',
    formulaOrRule: "Kepler's Third Law: T² ∝ r³ (The square of orbital period is proportional to the cube of orbital radius)",
    components: [
      { id: 'sun', name: 'The Sun', role: 'Central Star', description: 'A yellow dwarf star at the center of our solar system, containing 99.86% of the solar system’s total mass.', fact: 'Surface temperature is approximately 5,500°C (10,000°F), powered by hydrogen fusion in its core.', scientificDetail: 'Spectral type G2V; mass is ~333,000 times that of Earth.', color: '#f59e0b' },
      { id: 'mercury', name: 'Mercury', role: 'Terrestrial Planet', description: 'The smallest and closest planet to the Sun. It has virtually no atmosphere to trap heat.', fact: 'Temperatures swing wildly from 430°C in sunlight to -180°C at night.', scientificDetail: 'Average distance: 57.9 million km; orbital period: 88 days; moons: 0.', color: '#9ca3af' },
      { id: 'venus', name: 'Venus', role: 'Terrestrial Planet', description: 'The hottest planet in the solar system due to a runaway greenhouse effect from a dense CO2 atmosphere.', fact: 'Venus rotates in the opposite direction (retrograde) compared to most planets.', scientificDetail: 'Average distance: 108.2 million km; orbital period: 225 days; surface temp: 465°C.', color: '#eab308' },
      { id: 'earth', name: 'Earth', role: 'Terrestrial Planet', description: 'Our home planet and the only known world in the universe that harbors liquid water oceans and life.', fact: 'The atmosphere is 78% nitrogen, 21% oxygen, and 1% other trace gases.', scientificDetail: 'Average distance: 149.6 million km (1 AU); orbital period: 365.25 days; 1 natural satellite.', color: '#3b82f6' },
      { id: 'mars', name: 'Mars', role: 'Terrestrial Planet', description: 'The "Red Planet," colored by iron oxide (rust) on its dusty surface with giant dormant volcanoes and canyons.', fact: 'Olympus Mons on Mars is the tallest volcano in the solar system, nearly 3 times taller than Mt. Everest.', scientificDetail: 'Average distance: 227.9 million km; orbital period: 687 days; moons: Phobos and Deimos.', color: '#ef4444' },
      { id: 'jupiter', name: 'Jupiter', role: 'Gas Giant', description: 'The largest planet in the solar system, with a mass more than double that of all other planets combined.', fact: 'Its iconic Great Red Spot is a persistent anticyclonic storm larger than planet Earth.', scientificDetail: 'Average distance: 778.6 million km; orbital period: 11.9 Earth years; over 90 confirmed moons.', color: '#d97706' },
      { id: 'saturn', name: 'Saturn', role: 'Gas Giant', description: 'Famous for its stunning, expansive ring system composed of billions of chunks of ice and rocky debris.', fact: 'Saturn is the least dense planet—it is less dense than water and would theoretically float!', scientificDetail: 'Average distance: 1.43 billion km; orbital period: 29.5 Earth years; over 140 moons.', color: '#fbbf24' },
      { id: 'uranus', name: 'Uranus', role: 'Ice Giant', description: 'An ice giant with a pale cyan color caused by atmospheric methane gas absorbing red light.', fact: 'Uranus rotates tilted on its side at an extreme angle of 98 degrees, rolling like a bowling ball.', scientificDetail: 'Average distance: 2.87 billion km; orbital period: 84 Earth years; 28 known moons.', color: '#06b6d4' },
      { id: 'neptune', name: 'Neptune', role: 'Ice Giant', description: 'The outermost major planet, an ice giant with supersonic winds reaching over 2,000 km/h.', fact: 'Takes 165 Earth years to orbit the Sun; only completed its first full orbit since discovery in 2011.', scientificDetail: 'Average distance: 4.5 billion km; orbital period: 164.8 Earth years; 16 known moons.', color: '#2563eb' }
    ],
    steps: [
      { stepNumber: 1, title: 'The Gravitational Anchor', description: 'The Sun exerts gravitational pull holding all 8 planets in elliptical orbits.', activeComponentId: 'sun', explanation: 'The Sun accounts for 99.86% of the solar system’s mass. Its gravitational field dictates planetary trajectories following Kepler’s and Newton’s laws.', visualCue: 'Sun highlighted at center of system.' },
      { stepNumber: 2, title: 'Inner Terrestrial Planets', description: 'Mercury, Venus, Earth, and Mars are dense, rocky worlds close to the Sun.', activeComponentId: 'earth', explanation: 'Solar heat during the early solar system stripped lighter volatile gases away from the inner region, leaving rocky and metallic materials.', visualCue: 'Four inner planet orbits highlighted.' },
      { stepNumber: 3, title: 'The Gas & Ice Giants', description: 'Jupiter, Saturn, Uranus, and Neptune orbit much farther out.', activeComponentId: 'jupiter', explanation: 'Beyond the frost line, cooler temperatures allowed hydrogen, helium, ammonia, and water ices to accumulate into massive gas and ice giants.', visualCue: 'Outer gas giants illuminated.' },
      { stepNumber: 4, title: 'Orbital Period & Velocity', description: 'Planets closer to the Sun move much faster than distant worlds.', activeComponentId: 'mercury', explanation: 'Mercury orbits at ~47 km/s, while distant Neptune travels at just ~5.4 km/s. The further out a planet is, the weaker the gravitational acceleration and the longer its orbital path.', visualCue: 'Observe the relative speeds of Mercury versus Neptune.' }
    ],
    relatedConcepts: [
      { title: 'Gravitation & Orbits', topic: 'Gravitation and Planetary Motion', subject: 'Physics' },
      { title: 'Stars and the Universe', topic: 'Stars and Solar System', subject: 'Science' }
    ]
  },
  {
    id: 'human-heart',
    title: 'The Human Heart & Blood Circulation',
    subject: 'Biology',
    category: 'Biology',
    gradeRange: 'Class 6–12',
    grades: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    description: 'An interactive cross-section of the human heart. Follow oxygenated and deoxygenated blood through the four chambers, valves, and pulmonary and systemic loops.',
    badge: 'Interactive SVG',
    funFact: 'Your heart beats around 100,000 times each day, pumping roughly 7,500 liters of blood through 96,000 kilometers of blood vessels!',
    formulaOrRule: 'Cardiac Output = Heart Rate (beats/min) × Stroke Volume (mL/beat) ≈ 5 L/min at rest',
    components: [
      { id: 'right-atrium', name: 'Right Atrium', role: 'Receiving Chamber (Deoxygenated)', description: 'Receives oxygen-poor blood returning from all parts of the body via the Superior and Inferior Vena Cava.', fact: 'Contracts gently to push blood through the tricuspid valve into the right ventricle.', scientificDetail: 'Low pressure chamber (~2-6 mmHg); contains the SA node (natural pacemaker).', color: '#1e40af' },
      { id: 'right-ventricle', name: 'Right Ventricle', role: 'Pumping Chamber to Lungs', description: 'Pumps deoxygenated blood out through the pulmonary artery directly to the lungs for gas exchange.', fact: 'Has thinner muscular walls than the left ventricle because the lungs are nearby and need lower pressure.', scientificDetail: 'Systolic pressure ~25 mmHg; sends blood to pulmonary capillary beds.', color: '#2563eb' },
      { id: 'pulmonary-artery', name: 'Pulmonary Artery', role: 'Vessel to Lungs', description: 'The only major artery in the adult body that carries deoxygenated blood. It branches to the left and right lungs.', fact: 'In the lungs, blood releases carbon dioxide (CO2) and absorbs fresh oxygen (O2).', scientificDetail: 'Guarded by the pulmonary semilunar valve.', color: '#3b82f6' },
      { id: 'pulmonary-veins', name: 'Pulmonary Veins', role: 'Vessel from Lungs', description: 'Veins carrying freshly oxygen-rich, bright red blood from the lungs back into the left atrium of the heart.', fact: 'The only veins in the adult body that carry high-oxygen blood.', scientificDetail: 'Normally four pulmonary veins enter the posterior left atrium.', color: '#ef4444' },
      { id: 'left-atrium', name: 'Left Atrium', role: 'Receiving Chamber (Oxygenated)', description: 'Collects newly oxygenated blood arriving from the lungs and sends it through the mitral (bicuspid) valve.', fact: 'Acts as a holding chamber before high-pressure contraction in the left ventricle.', scientificDetail: 'Pressure ~8-12 mmHg; smooth-walled interior chamber.', color: '#dc2626' },
      { id: 'left-ventricle', name: 'Left Ventricle', role: 'Main Pumping Chamber', description: 'The thickest and most powerful chamber of the heart. It pumps oxygenated blood through the aorta to the entire body.', fact: 'Its muscular wall is about three times thicker than the right ventricle to generate systemic pressure.', scientificDetail: 'Systolic pressure reaches 120 mmHg in healthy adults to overcome systemic vascular resistance.', color: '#b91c1c' },
      { id: 'aorta', name: 'Aorta', role: 'Primary Systemic Artery', description: 'The largest blood vessel in the body, distributing oxygen-rich blood to the brain, vital organs, and muscles.', fact: 'Blood rushes out of the aorta at velocities up to 40 cm/second during peak ventricular contraction.', scientificDetail: 'Branches into ascending aorta, aortic arch, and descending thoracic/abdominal aorta.', color: '#e11d48' },
      { id: 'valves', name: 'Cardiac Valves (Tricuspid & Mitral)', role: 'One-Way Gatekeepers', description: 'Flaps of fibrous tissue that open and snap shut to guarantee blood flows in one direction only and prevent backflow.', fact: 'The characteristic "lub-dub" heartbeat sound is caused by valves snapping shut, not heart muscle flexing!', scientificDetail: 'AV valves (tricuspid/bicuspid) close during systole ("lub"); semilunar valves close during diastole ("dub").', color: '#9333ea' }
    ],
    steps: [
      { stepNumber: 1, title: 'Deoxygenated Blood Returns', description: 'Oxygen-depleted blood from body tissues flows into the Right Atrium via the Vena Cava.', activeComponentId: 'right-atrium', explanation: 'Tissues throughout the body consume oxygen for cellular respiration and release carbon dioxide into the venous blood.', visualCue: 'Blue deoxygenated blood fills the Right Atrium.' },
      { stepNumber: 2, title: 'Filling the Right Ventricle', description: 'The tricuspid valve opens, and blood moves into the Right Ventricle.', activeComponentId: 'right-ventricle', explanation: 'Ventricular diastole (relaxation) allows the chamber to fill, followed by atrial contraction to top it off.', visualCue: 'Blood passes through the tricuspid valve.' },
      { stepNumber: 3, title: 'Pulmonary Circulation (To the Lungs)', description: 'The Right Ventricle contracts, pumping blood through the Pulmonary Artery to the lungs.', activeComponentId: 'pulmonary-artery', explanation: 'In lung alveoli, carbon dioxide diffuses out of the blood and fresh inhaled oxygen binds to hemoglobin molecules.', visualCue: 'Blood flows toward lungs to absorb oxygen.' },
      { stepNumber: 4, title: 'Return of Oxygen-Rich Blood', description: 'Pulmonary Veins deliver bright red, oxygenated blood into the Left Atrium.', activeComponentId: 'left-atrium', explanation: 'Oxygen saturation jumps from ~75% up to 98–100%. The blood is now ready to nourish the body.', visualCue: 'Bright red oxygenated blood enters the Left Atrium.' },
      { stepNumber: 5, title: 'Left Ventricle Contraction', description: 'Blood enters the Left Ventricle and is pumped with high pressure into the Aorta.', activeComponentId: 'left-ventricle', explanation: 'The massive myocardium of the left ventricle squeezes, creating the pulse felt at your wrist and driving blood through the systemic circuit.', visualCue: 'Oxygenated blood surges through the Aorta to the entire body.' }
    ],
    relatedConcepts: [
      { title: 'Circulatory System Notes', topic: 'Human Circulatory System', subject: 'Biology' },
      { title: 'Respiration & Gas Exchange', topic: 'Respiration in Organisms', subject: 'Biology' }
    ]
  },
  {
    id: 'photosynthesis',
    title: 'Photosynthesis: The Plant Energy Factory',
    subject: 'Biology',
    category: 'Biology',
    gradeRange: 'Class 6–10',
    grades: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
    description: 'Witness how green leaves capture sunlight, absorb water through xylem and carbon dioxide via stomata, and synthesize glucose while releasing oxygen.',
    badge: 'Interactive SVG',
    funFact: 'Over half of the world’s oxygen is actually produced not by land trees, but by microscopic oceanic phytoplankton performing photosynthesis!',
    formulaOrRule: '6CO₂ (Carbon Dioxide) + 6H₂O (Water) + Light Energy → C₆H₁₂O₆ (Glucose) + 6O₂ (Oxygen)',
    components: [
      { id: 'sunlight', name: 'Solar Radiation (Photons)', role: 'Energy Source', description: 'Electromagnetic energy emitted by the sun, particularly red and blue wavelengths absorbed by chlorophyll pigment.', fact: 'Chlorophyll reflects green light, which is why most plant leaves appear green to human eyes!', scientificDetail: 'Photons excite electrons in Photosystem II within the thylakoid membrane.', color: '#f59e0b' },
      { id: 'chloroplast', name: 'Chloroplast & Thylakoid', role: 'Cellular Organelle', description: 'Specialized plant cell organelle where both light-dependent reactions and the Calvin cycle take place.', fact: 'Chloroplasts have their own circular DNA, inherited from ancient photosynthetic bacteria via endosymbiosis.', scientificDetail: 'Contains stacked membranous discs called thylakoids (grana) surrounded by fluid stroma.', color: '#16a34a' },
      { id: 'water-input', name: 'Water (H₂O) via Xylem', role: 'Electron & Proton Donor', description: 'Water absorbed from the soil by roots travels up the stem through microscopic xylem vessels into leaf mesophyll.', fact: 'Water molecules are split through photolysis into protons, electrons, and oxygen gas.', scientificDetail: '2H₂O → 4H⁺ + 4e⁻ + O₂ in the oxygen-evolving complex of Photosystem II.', color: '#0284c7' },
      { id: 'co2-input', name: 'Carbon Dioxide (CO₂) via Stomata', role: 'Carbon Building Block', description: 'Atmospheric CO₂ enters through microscopic adjustable pores called stomata on the leaf underside.', fact: 'Guard cells swell with water to open stomata during daylight and shrink to close them during droughts.', scientificDetail: 'CO₂ is fixed by the enzyme RuBisCO (the most abundant enzyme on Earth) into 3-PGA.', color: '#64748b' },
      { id: 'glucose-output', name: 'Glucose (C₆H₁₂O₆)', role: 'Chemical Food & Starch', description: 'The primary sugar synthesized during the Calvin cycle, used for cellular energy or stored as starch.', fact: 'Plants convert glucose into cellulose to construct rigid cell walls, allowing trees to grow tall.', scientificDetail: 'Produced in the stroma using chemical energy stored in ATP and NADPH molecules.', color: '#ea580c' },
      { id: 'oxygen-output', name: 'Oxygen (O₂) Gas', role: 'Byproduct of Photolysis', description: 'Oxygen gas released into the atmosphere through stomatal pores as a vital byproduct.', fact: 'Virtually all free oxygen gas in Earth’s atmosphere was generated by photosynthetic organisms!', scientificDetail: 'Diffuses out down concentration gradient through stomata.', color: '#06b6d4' }
    ],
    steps: [
      { stepNumber: 1, title: 'Light Energy Absorption', description: 'Chlorophyll pigments inside leaf chloroplasts capture solar photons.', activeComponentId: 'sunlight', explanation: 'Light energizes electrons in chlorophyll molecules, initiating electron transport across the thylakoid membrane.', visualCue: 'Sunbeams strike the green leaf surface.' },
      { stepNumber: 2, title: 'Water Uptake & Photolysis', description: 'Water absorbed by roots is transported to leaves and split by light energy.', activeComponentId: 'water-input', explanation: 'Splitting H₂O releases electrons to replenish chlorophyll and yields oxygen gas (O₂) as a byproduct.', visualCue: 'Water molecules rise through xylem and are split.' },
      { stepNumber: 3, title: 'Carbon Dioxide Influx', description: 'Stomata pores open to take in carbon dioxide gas from the atmosphere.', activeComponentId: 'co2-input', explanation: 'Guard cells regulate stomatal opening to balance CO₂ intake against water loss via transpiration.', visualCue: 'CO₂ molecules diffuse through stomata into the leaf.' },
      { stepNumber: 4, title: 'The Calvin Cycle (Sugar Synthesis)', description: 'Enzymes combine carbon with hydrogen to produce glucose (sugar).', activeComponentId: 'glucose-output', explanation: 'ATP and NADPH from the light reaction drive the enzymatic fixation of CO₂ into glucose (C₆H₁₂O₆).', visualCue: 'Glucose molecules form inside the chloroplast stroma.' },
      { stepNumber: 5, title: 'Oxygen Release', description: 'Surplus oxygen gas diffuses out of the leaf into the atmosphere.', activeComponentId: 'oxygen-output', explanation: 'The oxygen sustains aerobic cellular respiration for animals and humans across the planet.', visualCue: 'Oxygen bubbles emerge from stomata pores.' }
    ],
    relatedConcepts: [
      { title: 'Photosynthesis Notes', topic: 'Photosynthesis in Higher Plants', subject: 'Biology' },
      { title: 'Plant Cell Structure', topic: 'Plant Cells and Tissues', subject: 'Biology' }
    ]
  },
  {
    id: 'electric-circuit',
    title: 'Electric Circuits: Current, Voltage & Resistance',
    subject: 'Physics',
    category: 'Physics',
    gradeRange: 'Class 5–10',
    grades: ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
    description: 'Build an electrical circuit with battery, switch, resistor, and bulb. Open and close the switch to observe electron flow, current direction, and bulb illumination.',
    badge: 'Interactive SVG',
    funFact: 'Electrons in a standard copper wire actually drift at less than 1 millimeter per second, but the electromagnetic energy wave travels at nearly the speed of light!',
    formulaOrRule: "Ohm's Law: V = I × R (Voltage = Current × Resistance); Electric Power: P = V × I = I²R",
    components: [
      { id: 'battery', name: 'Battery (DC Voltage Source)', role: 'Potential Difference Provider', description: 'Converts chemical energy into electrical potential energy, creating a voltage push between terminals.', fact: 'The positive terminal is at higher electric potential; the negative terminal has surplus electrons.', scientificDetail: 'Generates electromotive force (EMF) measured in Volts (V).', color: '#f59e0b' },
      { id: 'switch', name: 'Knife / Toggle Switch', role: 'Circuit Controller', description: 'An interactive contact switch that opens (breaks) or closes (completes) the electrical conductive pathway.', fact: 'When open, air acts as an insulator with extremely high resistance, stopping current instantly.', scientificDetail: 'Open circuit: R → ∞, I = 0; Closed circuit: R_contact ≈ 0 Ω.', color: '#64748b' },
      { id: 'bulb', name: 'Filament Light Bulb', role: 'Electrical Load / Resistor', description: 'Converts electrical energy into thermal energy and visible light as current forces its way through the thin filament.', fact: 'Tungsten is used for filaments because its melting point is an astonishing 3,422°C (6,192°F).', scientificDetail: 'Bulb luminosity is proportional to power dissipation (P = I²R_filament).', color: '#eab308' },
      { id: 'wires', name: 'Copper Connecting Wires', role: 'Conductor Path', description: 'Low-resistance metallic wires containing abundant free conduction electrons that drift when voltage is applied.', fact: 'Copper is used because it has one loosely bound valence electron per atom that moves freely.', scientificDetail: 'Electrical resistivity of copper is only 1.68 × 10⁻⁸ Ω·m at room temperature.', color: '#10b981' },
      { id: 'current', name: 'Charge Carriers (Electrons & Current)', role: 'Energy Carrier', description: 'Electrons physically flow from Negative (-) to Positive (+), while conventional current is defined as flowing from (+) to (-).', fact: 'Benjamin Franklin originally guessed the direction of charge flow before the discovery of electrons!', scientificDetail: 'Current I = Q / t (Coulombs per second = Amperes).', color: '#06b6d4' }
    ],
    steps: [
      { stepNumber: 1, title: 'Open Circuit (Switch Off)', description: 'With the switch open, the conductive loop is broken.', activeComponentId: 'switch', explanation: 'Electrons cannot jump across the open air gap. No current flows, and the light bulb remains dark.', visualCue: 'Switch contacts separated; no electron motion.' },
      { stepNumber: 2, title: 'Closing the Circuit (Switch On)', description: 'Closing the switch creates an unbroken conductive pathway.', activeComponentId: 'switch', explanation: 'An electric field is established throughout the wire almost instantaneously, exerting force on conduction electrons.', visualCue: 'Switch makes contact; conductive loop is complete.' },
      { stepNumber: 3, title: 'Current Flow & Electron Drift', description: 'Electrons circulate continuously through the closed loop.', activeComponentId: 'wires', explanation: 'Electrons exit the negative battery terminal, pass through the switch, bulb filament, and enter the positive terminal.', visualCue: 'Animated electron dots begin drifting around the wire loop.' },
      { stepNumber: 4, title: 'Energy Dissipation in the Bulb', description: 'Electrical energy is converted to light and heat in the filament.', activeComponentId: 'bulb', explanation: 'Collisions between drifting electrons and tungsten atoms cause thermal excitation, making the filament glow incandescently.', visualCue: 'Bulb filament shines with yellow glow.' }
    ],
    relatedConcepts: [
      { title: 'Electricity & Ohm’s Law', topic: 'Electricity and Ohm’s Law', subject: 'Physics' },
      { title: 'Heating Effects of Current', topic: 'Heating Effect of Electric Current', subject: 'Physics' }
    ]
  },
  {
    id: 'reflection-refraction',
    title: 'Reflection & Refraction of Light (Optics)',
    subject: 'Physics',
    category: 'Physics',
    gradeRange: 'Class 7–12',
    grades: ['Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    description: 'Direct a laser beam across medium boundaries (Air, Water, Glass, Diamond). Adjust the angle of incidence to test the Law of Reflection, Snell’s Law of Refraction, and Total Internal Reflection.',
    badge: 'Interactive SVG',
    funFact: 'Diamonds sparkle so intensely because diamond has a very high refractive index (2.42), which creates a tiny critical angle (24.4°) that traps light inside via multiple total internal reflections!',
    formulaOrRule: "Snell's Law: n₁ sin(θ₁) = n₂ sin(θ₂); Law of Reflection: θ_r = θ_i; Critical Angle: sin(θ_c) = n₂ / n₁",
    components: [
      { id: 'laser', name: 'Laser Light Source', role: 'Collimated Beam Generator', description: 'Emits a narrow, coherent monochromatic ray of light aimed toward the boundary interface.', fact: 'Light travels at approximately 300,000 km/s in vacuum or air, but slows down in denser transparent media.', scientificDetail: 'Wavelength in medium λ_m = λ_0 / n.', color: '#ef4444' },
      { id: 'normal', name: 'Normal Line', role: 'Reference Perpendicular', description: 'An imaginary dashed line drawn perpendicular (90°) to the surface interface at the point of ray incidence.', fact: 'All optical angles (incidence, reflection, refraction) are always measured from the Normal, not the surface!', scientificDetail: 'Perpendicular baseline normal vector N̂ = (0, 1).', color: '#94a3b8' },
      { id: 'reflected-ray', name: 'Reflected Ray', role: 'Bounced Light', description: 'The ray of light that bounces back into the initial medium following the Law of Reflection.', fact: 'The angle of reflection θ_r is always exactly equal to the angle of incidence θ_i.', scientificDetail: 'θ_reflected = θ_incident in all smooth specular surfaces.', color: '#f59e0b' },
      { id: 'refracted-ray', name: 'Refracted Ray', role: 'Transmitted & Bent Light', description: 'The ray that penetrates into the second medium, bending toward or away from the normal due to a change in speed.', fact: 'When entering a denser medium (higher n), light bends TOWARDS the normal; when entering a rarer medium, it bends AWAY.', scientificDetail: 'Angle of refraction calculated by arcsin((n₁/n₂) × sin(θ₁)).', color: '#10b981' },
      { id: 'interface', name: 'Medium Boundary (Interface)', role: 'Optical Boundary', description: 'The surface separating Medium 1 (e.g. Air, n=1.0) and Medium 2 (e.g. Glass n=1.52 or Water n=1.33).', fact: 'Mirages in hot deserts are caused by light refracting continuously through layers of hot, lower-density air near the ground.', scientificDetail: 'Fresnel equations dictate the split between reflected and transmitted power amplitudes.', color: '#3b82f6' }
    ],
    steps: [
      { stepNumber: 1, title: 'The Normal & Angle of Incidence', description: 'Aim the incident light ray toward the boundary point of incidence.', activeComponentId: 'normal', explanation: 'The angle between the incoming ray and the perpendicular dashed normal is the Angle of Incidence (θ₁).', visualCue: 'Incident ray strikes interface at normal intersection.' },
      { stepNumber: 2, title: 'The Law of Reflection', description: 'Part of the beam bounces back into medium 1 at the exact same angle.', activeComponentId: 'reflected-ray', explanation: 'The angle of reflection θ_r equals θ_i. Both rays and the normal lie in the same geometric plane.', visualCue: 'Reflected ray appears with matching angle arc.' },
      { stepNumber: 3, title: 'Snell’s Law of Refraction', description: 'The transmitted ray enters medium 2 and bends.', activeComponentId: 'refracted-ray', explanation: 'Because light moves slower in glass (n=1.52) than in air (n=1.00), the wavefront bends toward the normal line (θ₂ < θ₁).', visualCue: 'Refracted ray travels deeper at a reduced angle.' },
      { stepNumber: 4, title: 'Total Internal Reflection (TIR)', description: 'When going from dense to rare media beyond the critical angle, all light reflects!', activeComponentId: 'interface', explanation: 'Optical fiber cables use Total Internal Reflection to transmit internet data across oceans with zero light leaking out!', visualCue: 'Refracted ray disappears; 100% of light reflects back.' }
    ],
    relatedConcepts: [
      { title: 'Light: Reflection & Refraction', topic: 'Light - Reflection and Refraction', subject: 'Physics' },
      { title: 'Human Eye & Colourful World', topic: 'The Human Eye and the Colourful World', subject: 'Physics' }
    ]
  },
  {
    id: 'atomic-structure',
    title: 'Atomic Structure & Bohr Shell Model',
    subject: 'Chemistry',
    category: 'Chemistry',
    gradeRange: 'Class 8–11',
    grades: ['Class 8', 'Class 9', 'Class 10', 'Class 11'],
    description: 'Construct and examine atoms from Hydrogen to Chlorine. Inspect protons, neutrons, and electrons configured in discrete K, L, M quantum shells.',
    badge: 'Interactive SVG',
    disclaimer: 'The Bohr planetary model is a simplified educational representation. In quantum mechanics, electrons exist in 3D probabilistic orbital clouds rather than rigid planetary rings.',
    funFact: 'An atom is more than 99.999999999% empty space! If the nucleus were the size of a marble in the center of a stadium, the electrons would be gnats buzzing in the top bleachers.',
    formulaOrRule: 'Shell Electron Capacity = 2n² (K shell n=1 holds 2; L shell n=2 holds 8; M shell n=3 holds 18); Atomic Number Z = Protons',
    components: [
      { id: 'nucleus', name: 'Dense Atomic Nucleus', role: 'Mass Center', description: 'The ultra-dense core containing almost all the atom’s mass, held together by the Strong Nuclear Force.', fact: 'Discovered by Ernest Rutherford in 1911 during the famous gold foil experiment.', scientificDetail: 'Diameter is roughly 10⁻¹⁵ m, about 100,000 times smaller than the atom itself.', color: '#dc2626' },
      { id: 'protons', name: 'Protons (p⁺)', role: 'Positive Charge & Elemental Identity', description: 'Positively charged subatomic particles (+1 elementary charge) located inside the nucleus.', fact: 'The number of protons (Atomic Number Z) uniquely determines which chemical element an atom is!', scientificDetail: 'Rest mass = 1.6726 × 10⁻²⁷ kg (~1.0073 amu); composed of two up quarks and one down quark (uud).', color: '#ef4444' },
      { id: 'neutrons', name: 'Neutrons (n⁰)', role: 'Neutral Stabilizers', description: 'Neutral subatomic particles (0 electrical charge) that provide nuclear binding force to buffer proton repulsion.', fact: 'Discovered by James Chadwick in 1932. Atoms of the same element with different neutron counts are called isotopes.', scientificDetail: 'Rest mass = 1.6749 × 10⁻²⁷ kg (~1.0087 amu); composed of one up quark and two down quarks (udd).', color: '#64748b' },
      { id: 'electrons', name: 'Electrons (e⁻)', role: 'Negative Charge & Chemical Bonding', description: 'Negatively charged particles (-1 elementary charge) that occupy quantum energy levels around the nucleus.', fact: 'Electrons are elementary leptons with no known sub-structure, discovered by J.J. Thomson in 1897.', scientificDetail: 'Rest mass is only 9.109 × 10⁻³¹ kg (~1/1836 the mass of a proton).', color: '#3b82f6' },
      { id: 'shells', name: 'Electron Energy Shells (K, L, M)', role: 'Quantized Orbitals', description: 'Concentric energy levels designated by principal quantum number n (n=1 is K shell, n=2 is L shell, n=3 is M shell).', fact: 'Electrons fill the lowest available energy shells first, following the Aufbau principle.', scientificDetail: 'Capacity of shell n is given by 2n²; valence electrons in the outermost shell govern chemical reactivity.', color: '#a855f7' }
    ],
    steps: [
      { stepNumber: 1, title: 'The Central Nucleus', description: 'Protons and neutrons cluster tightly at the center of the atom.', activeComponentId: 'nucleus', explanation: 'The strong nuclear force overcomes electrical electrostatic repulsion between positive protons to keep the nucleus stable.', visualCue: 'Red protons and gray neutrons cluster in the center.' },
      { stepNumber: 2, title: 'The Innermost K Shell (n=1)', description: 'The first energy level can hold a maximum of 2 electrons.', activeComponentId: 'shells', explanation: 'Because n=1, capacity = 2(1)² = 2. Hydrogen has 1 electron here, while Helium fills this shell with 2.', visualCue: 'First inner orbit ring is filled.' },
      { stepNumber: 3, title: 'The L Shell (n=2)', description: 'The second energy shell holds up to 8 electrons.', activeComponentId: 'shells', explanation: 'Capacity = 2(2)² = 8. Elements from Lithium (Z=3) through Neon (Z=10) place electrons into this shell.', visualCue: 'Second orbit ring populates with electrons.' },
      { stepNumber: 4, title: 'Valence Electrons & Octet Rule', description: 'The outermost shell determines chemical bonding behavior.', activeComponentId: 'electrons', explanation: 'Atoms tend to gain, lose, or share electrons to achieve a stable outer octet of 8 electrons, mimicking noble gases.', visualCue: 'Outermost valence shell highlighted.' }
    ],
    relatedConcepts: [
      { title: 'Structure of the Atom', topic: 'Structure of the Atom', subject: 'Chemistry' },
      { title: 'Periodic Table & Valency', topic: 'Periodic Classification of Elements', subject: 'Chemistry' }
    ]
  },
  {
    id: 'geometry-explorer',
    title: 'Geometry Explorer: Shapes, Area & Perimeter',
    subject: 'Mathematics',
    category: 'Mathematics',
    gradeRange: 'Class 5–10',
    grades: ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
    description: 'Manipulate dimensions of Triangles, Rectangles, Squares, Circles, and Parallelograms in real time. Watch area and perimeter update dynamically with step-by-step formula breakdowns.',
    badge: 'Interactive SVG',
    funFact: 'Among all 2D shapes with the exact same perimeter length, a circle always encloses the maximum possible area (the isoperimetric inequality)!',
    formulaOrRule: 'Rectangle: A = l × w, P = 2(l + w); Triangle: A = ½ × b × h; Circle: A = πr², C = 2πr',
    components: [
      { id: 'dimensions', name: 'Dimension Controls', role: 'Interactive Parameters', description: 'Adjust length, width, base, height, or radius using responsive sliders.', fact: 'Changing dimensions dynamically scales SVG paths proportionally in real time.', scientificDetail: 'Coordinates update in an SVG viewBox.', color: '#3b82f6' },
      { id: 'area-fill', name: 'Enclosed Area', role: 'Surface Measurement', description: 'The 2-dimensional surface area enclosed inside the shape boundaries, measured in square units (cm²).', fact: 'Area represents how many 1×1 unit squares fit inside the boundary.', scientificDetail: 'Calculated via integration or algebraic geometry formulas.', color: '#10b981' },
      { id: 'perimeter-outline', name: 'Boundary Perimeter', role: 'Outer Boundary Length', description: 'The total distance around the outside edge of the polygon or curved circumference.', fact: 'If you were to unroll the boundary into a straight string, its length would equal the perimeter.', scientificDetail: 'P = sum of edge vectors |e_i|.', color: '#f59e0b' },
      { id: 'formula-box', name: 'Geometric Formula', role: 'Mathematical Rule', description: 'Explicit mathematical formula proving how the calculation works with real values plugged in.', fact: 'The formula for triangle area (½ b h) comes directly from cutting a rectangle in half diagonally!', scientificDetail: 'Derived using Euclidean geometry axioms.', color: '#8b5cf6' }
    ],
    steps: [
      { stepNumber: 1, title: 'Choose a Geometric Shape', description: 'Select between Rectangle, Square, Triangle, Circle, or Parallelogram.', activeComponentId: 'dimensions', explanation: 'Each shape has unique geometric symmetry, angle rules, and area relationships.', visualCue: 'Current shape rendered on canvas.' },
      { stepNumber: 2, title: 'Modify Shape Dimensions', description: 'Use the interactive sliders to alter side lengths or radius.', activeComponentId: 'dimensions', explanation: 'Watch how doubling a dimension affects perimeter linearly (2×) versus area quadratically (4×)!', visualCue: 'Shape expands or contracts on screen.' },
      { stepNumber: 3, title: 'Observe the Area Calculation', description: 'The filled region shows the 2D space enclosed.', activeComponentId: 'area-fill', explanation: 'For a rectangle, area = length × width. For a triangle, area = ½ × base × height because two identical triangles form a parallelogram.', visualCue: 'Filled area highlighted with formula breakdown.' },
      { stepNumber: 4, title: 'Examine the Perimeter / Circumference', description: 'The perimeter measures the boundary distance.', activeComponentId: 'perimeter-outline', explanation: 'For a circle of radius r, circumference is 2πr where π ≈ 3.14159...', visualCue: 'Boundary line illuminated.' }
    ],
    relatedConcepts: [
      { title: 'Perimeter and Area Notes', topic: 'Perimeter and Area', subject: 'Mathematics' },
      { title: 'Triangles & Coordinate Geometry', topic: 'Triangles and Coordinate Geometry', subject: 'Mathematics' }
    ]
  },
  {
    id: 'water-cycle',
    title: 'The Water Cycle (Hydrological Cycle)',
    subject: 'Geography',
    category: 'Geography',
    gradeRange: 'Class 4–9',
    grades: ['Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9'],
    description: 'An animated natural landscape illustrating how water circulates continuously between oceans, atmosphere, mountains, and rivers through evaporation, condensation, and precipitation.',
    badge: 'Animated Model',
    funFact: 'The total amount of water on Earth has remained almost exactly constant for billions of years—the water you drank today may have once been drunk by a Tyrannosaurus rex!',
    formulaOrRule: 'Hydrological Balance: Precipitation = Evaporation + Transpiration + Runoff (Conservation of Mass)',
    components: [
      { id: 'sun-heat', name: 'Solar Heating', role: 'Engine of the Water Cycle', description: 'Solar radiation heats ocean, lake, and soil surfaces, providing latent heat to convert liquid water into vapor.', fact: 'The sun evaporates approximately 1,000 cubic kilometers of water into the atmosphere every single day.', scientificDetail: 'Latent heat of vaporization of water is 2.26 × 10⁶ J/kg.', color: '#f59e0b' },
      { id: 'evaporation', name: 'Evaporation & Transpiration', role: 'Vapor Phase Transition', description: 'Water transforms from liquid into invisible water vapor gas, rising into the atmosphere.', fact: 'A single large oak tree can transpire up to 150,000 liters of water into the air annually!', scientificDetail: 'Transpiration accounts for ~10% of total atmospheric moisture.', color: '#38bdf8' },
      { id: 'condensation', name: 'Condensation & Cloud Formation', role: 'Phase Shift to Liquid Droplets', description: 'Rising water vapor cools in higher altitudes, condensing around microscopic dust aerosols (cloud condensation nuclei).', fact: 'An average fluffy cumulus cloud weighs approximately 500,000 kg (over 1 million pounds), equivalent to 100 elephants!', scientificDetail: 'Relative humidity reaches 100% at the dew point temperature.', color: '#94a3b8' },
      { id: 'precipitation', name: 'Precipitation (Rain & Snow)', role: 'Return to Earth', description: 'Cloud water droplets coalesce into droplets too heavy to be supported by rising air updrafts, falling under gravity.', fact: 'Depending on atmospheric temperature, precipitation falls as rain, snow, sleet, or hail.', scientificDetail: 'Terminal velocity of large raindrops reaches ~9 m/s (20 mph).', color: '#0284c7' },
      { id: 'collection', name: 'Runoff, Infiltration & Ocean Collection', role: 'Reservoir Return', description: 'Precipitation collects in streams, rivers, and groundwater aquifers, ultimately flowing back into the ocean.', fact: 'Oceans store about 96.5% of all Earth’s water, with only 2.5% existing as fresh water.', scientificDetail: 'Groundwater feeds subterranean water tables that sustain baseflow in rivers during dry seasons.', color: '#1d4ed8' }
    ],
    steps: [
      { stepNumber: 1, title: 'Solar Evaporation', description: 'Sunlight warms water bodies, causing water molecules to evaporate into vapor.', activeComponentId: 'sun-heat', explanation: 'Molecules gain thermal kinetic energy, break intermolecular hydrogen bonds, and enter the air as gas.', visualCue: 'Warm sunrays shine down and vapor particles rise from the ocean.' },
      { stepNumber: 2, title: 'Plant Transpiration', description: 'Vegetation absorbs groundwater through roots and releases vapor through leaves.', activeComponentId: 'evaporation', explanation: 'Transpiration pulls nutrients up tree trunks and adds significant humidity to regional weather systems.', visualCue: 'Moisture rises from forest foliage.' },
      { stepNumber: 3, title: 'Condensation into Clouds', description: 'Vapor rises, cools, and coalesces into dense cloud formations.', activeComponentId: 'condensation', explanation: 'At higher altitudes, low pressure and temperatures drop air below its dew point, forming visible clouds.', visualCue: 'Clouds swell and darken with moisture.' },
      { stepNumber: 4, title: 'Precipitation (Rainfall)', description: 'Droplets become too heavy and fall under gravity onto mountain peaks and valleys.', activeComponentId: 'precipitation', explanation: 'Collision-coalescence causes tiny droplets to combine into raindrops that fall to the ground.', visualCue: 'Rain falls across mountains and valleys.' },
      { stepNumber: 5, title: 'Collection & Surface Runoff', description: 'Rainwater flows into mountain streams and rivers back into the ocean.', activeComponentId: 'collection', explanation: 'Some water infiltrates deep into soil aquifers, while rivers transport runoff back to the sea, completing the perpetual cycle.', visualCue: 'River currents flow down to the ocean.' }
    ],
    relatedConcepts: [
      { title: 'The Water Cycle Notes', topic: 'Water: A Precious Resource', subject: 'Geography' },
      { title: 'Weather & Climate', topic: 'Weather, Climate and Adaptations of Animals', subject: 'Science' }
    ]
  }
];

export const CATEGORIES = [
  'All',
  'Biology',
  'Physics',
  'Chemistry',
  'Mathematics',
  'Astronomy',
  'Geography',
  'General Science'
] as const;
