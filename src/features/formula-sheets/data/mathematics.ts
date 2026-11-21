import { Formula } from '../types';

export const MATHEMATICS_FORMULAS: Formula[] = [
  {
    id: 'math-quadratic-formula',
    title: 'Quadratic Formula',
    subject: 'mathematics',
    grades: ['Class 10', 'Class 11', 'Class 12'],
    chapter: 'Quadratic Equations',
    category: 'Algebra',
    expression: {
      latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
      text: 'x = (-b ± √(b² - 4ac)) / (2a)',
      formatted: 'x = (-b ± √(b² - 4ac)) / (2a)'
    },
    variables: [
      { symbol: 'x', name: 'Roots of equation', description: 'Solutions satisfying ax² + bx + c = 0' },
      { symbol: 'a', name: 'Coefficient of x²', description: 'Non-zero leading quadratic coefficient' },
      { symbol: 'b', name: 'Coefficient of x', description: 'Linear coefficient' },
      { symbol: 'c', name: 'Constant term', description: 'Constant numerical term' }
    ],
    explanation: 'Gives the solutions to any standard quadratic equation ax² + bx + c = 0. The expression under the square root, (b² - 4ac), is called the Discriminant (Δ).',
    conditions: 'Valid for all quadratic equations where a ≠ 0.',
    example: {
      problem: 'Solve 2x² - 7x + 3 = 0 using the quadratic formula.',
      given: { a: '2', b: '-7', c: '3' },
      steps: [
        'Calculate Discriminant Δ = b² - 4ac = (-7)² - 4(2)(3) = 49 - 24 = 25',
        'Substitute into formula: x = [-(-7) ± √25] / (2 × 2) = (7 ± 5) / 4',
        'Root 1: x = (7 + 5) / 4 = 12 / 4 = 3',
        'Root 2: x = (7 - 5) / 4 = 2 / 4 = 0.5'
      ],
      result: 'x = 3 or x = 0.5',
      note: 'Since Δ > 0, the equation has two distinct real roots.'
    },
    keywords: ['quadratic', 'roots', 'algebra', 'discriminant', 'polynomial', 'equation', 'parabola'],
    isFundamental: true
  },
  {
    id: 'math-discriminant',
    title: 'Discriminant & Nature of Roots',
    subject: 'mathematics',
    grades: ['Class 10', 'Class 11', 'Class 12'],
    chapter: 'Quadratic Equations',
    category: 'Algebra',
    expression: {
      latex: '\\Delta = b^2 - 4ac',
      text: 'Δ = b² - 4ac',
      formatted: 'Δ = b² - 4ac'
    },
    variables: [
      { symbol: 'Δ', name: 'Discriminant', description: 'Indicator of the nature of roots' },
      { symbol: 'b', name: 'Linear coefficient', description: 'Coefficient of x' },
      { symbol: 'a', name: 'Quadratic coefficient', description: 'Coefficient of x² (a ≠ 0)' },
      { symbol: 'c', name: 'Constant term', description: 'Constant in ax² + bx + c = 0' }
    ],
    explanation: 'Determines the character of the solutions: if Δ > 0, two distinct real roots exist; if Δ = 0, two equal real roots exist; if Δ < 0, roots are complex conjugates.',
    conditions: 'For real coefficients a, b, c with a ≠ 0.',
    example: {
      problem: 'Determine the nature of roots of 3x² - 6x + 3 = 0.',
      given: { a: '3', b: '-6', c: '3' },
      steps: [
        'Compute Δ = (-6)² - 4(3)(3)',
        'Δ = 36 - 36 = 0'
      ],
      result: 'Two equal real roots (x = -b / 2a = 1)',
      note: 'When Δ = 0, the parabola touches the x-axis at exactly one point.'
    },
    keywords: ['discriminant', 'roots', 'delta', 'nature', 'algebra', 'quadratic'],
    relatedFormulaIds: ['math-quadratic-formula'],
    isFundamental: true
  },
  {
    id: 'math-ap-nth-term',
    title: 'Arithmetic Progression (AP) nth Term',
    subject: 'mathematics',
    grades: ['Class 10', 'Class 11'],
    chapter: 'Arithmetic Progressions',
    category: 'Algebra',
    expression: {
      latex: 'a_n = a + (n - 1)d',
      text: 'aₙ = a + (n - 1)d',
      formatted: 'aₙ = a + (n - 1)d'
    },
    variables: [
      { symbol: 'aₙ', name: 'nth Term', description: 'Value of the term at position n' },
      { symbol: 'a', name: 'First term', description: 'Initial term of the sequence (a₁)' },
      { symbol: 'n', name: 'Term position', description: 'Positive integer index (n ≥ 1)' },
      { symbol: 'd', name: 'Common difference', description: 'Difference between consecutive terms: d = aₖ - aₖ₋₁' }
    ],
    explanation: 'Finds any arbitrary term in an arithmetic sequence without having to write out every intermediate number.',
    conditions: 'Applies to sequences with a constant additive difference d.',
    example: {
      problem: 'Find the 20th term of the AP: 3, 7, 11, 15, ...',
      given: { a: '3', d: '7 - 3 = 4', n: '20' },
      steps: [
        'Identify a = 3, d = 4, n = 20',
        'Apply formula: a₂₀ = 3 + (20 - 1) × 4',
        'Calculate: a₂₀ = 3 + 19 × 4 = 3 + 76 = 79'
      ],
      result: 'a₂₀ = 79'
    },
    keywords: ['arithmetic progression', 'ap', 'sequence', 'series', 'nth term', 'difference'],
    isFundamental: true
  },
  {
    id: 'math-ap-sum',
    title: 'Sum of First n Terms of an AP',
    subject: 'mathematics',
    grades: ['Class 10', 'Class 11'],
    chapter: 'Arithmetic Progressions',
    category: 'Algebra',
    expression: {
      latex: 'S_n = \\frac{n}{2}[2a + (n - 1)d] = \\frac{n}{2}(a + l)',
      text: 'Sₙ = (n / 2) × [2a + (n - 1)d] = (n / 2) × (a + l)',
      formatted: 'Sₙ = (n/2)[2a + (n - 1)d]'
    },
    variables: [
      { symbol: 'Sₙ', name: 'Sum of n terms', description: 'Total sum from a₁ to aₙ' },
      { symbol: 'n', name: 'Number of terms', description: 'Count of terms being summed' },
      { symbol: 'a', name: 'First term', description: 'Starting value of the AP' },
      { symbol: 'd', name: 'Common difference', description: 'Difference between terms' },
      { symbol: 'l', name: 'Last term', description: 'Value of the nth term (aₙ)' }
    ],
    explanation: 'Calculates the sum of consecutive terms of an arithmetic progression. When the last term l is known, the compact form (n/2)(a + l) can be used directly.',
    conditions: 'Valid for any AP with constant common difference.',
    example: {
      problem: 'Find the sum of the first 10 terms of the AP: 2, 5, 8, 11, ...',
      given: { a: '2', d: '3', n: '10' },
      steps: [
        'Substitute into formula: S₁₀ = (10 / 2) × [2(2) + (10 - 1)(3)]',
        'Simplify brackets: 5 × [4 + 9(3)] = 5 × [4 + 27] = 5 × 31',
        'Calculate: S₁₀ = 155'
      ],
      result: 'S₁₀ = 155'
    },
    keywords: ['arithmetic progression', 'sum', 'series', 'gauss', 'ap sum'],
    relatedFormulaIds: ['math-ap-nth-term'],
    isFundamental: true
  },
  {
    id: 'math-distance-formula',
    title: 'Distance Formula in 2D Plane',
    subject: 'mathematics',
    grades: ['Class 9', 'Class 10', 'Class 11'],
    chapter: 'Coordinate Geometry',
    category: 'Coordinate Geometry',
    expression: {
      latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}',
      text: 'd = √((x₂ - x₁)² + (y₂ - y₁)²)',
      formatted: 'd = √((x₂ - x₁)² + (y₂ - y₁)²)'
    },
    variables: [
      { symbol: 'd', name: 'Distance', description: 'Euclidean distance between two points' },
      { symbol: '(x₁, y₁)', name: 'First point', description: 'Coordinates of point A' },
      { symbol: '(x₂, y₂)', name: 'Second point', description: 'Coordinates of point B' }
    ],
    explanation: 'Derived from the Pythagorean theorem, this formula determines the straight-line distance between two points in a Cartesian coordinate system.',
    conditions: 'Valid in standard Euclidean 2D plane.',
    example: {
      problem: 'Find the distance between P(1, 2) and Q(4, 6).',
      given: { 'x₁, y₁': '(1, 2)', 'x₂, y₂': '(4, 6)' },
      steps: [
        'Difference in x: x₂ - x₁ = 4 - 1 = 3',
        'Difference in y: y₂ - y₁ = 6 - 2 = 4',
        'Apply formula: d = √(3² + 4²) = √(9 + 16) = √25 = 5'
      ],
      result: 'd = 5 units'
    },
    keywords: ['distance', 'coordinates', 'geometry', 'pythagorean', 'cartesian', 'points'],
    isFundamental: true
  },
  {
    id: 'math-section-formula',
    title: 'Section Formula (Internal Division)',
    subject: 'mathematics',
    grades: ['Class 10', 'Class 11'],
    chapter: 'Coordinate Geometry',
    category: 'Coordinate Geometry',
    expression: {
      latex: 'P(x, y) = \\left( \\frac{m_1 x_2 + m_2 x_1}{m_1 + m_2}, \\frac{m_1 y_2 + m_2 y_1}{m_1 + m_2} \\right)',
      text: 'P = ((m₁x₂ + m₂x₁)/(m₁ + m₂), (m₁y₂ + m₂y₁)/(m₁ + m₂))',
      formatted: 'P(x, y) = ((m₁x₂ + m₂x₁)/(m₁ + m₂), (m₁y₂ + m₂y₁)/(m₁ + m₂))'
    },
    variables: [
      { symbol: 'P(x, y)', name: 'Dividing point', description: 'Point dividing the segment internally' },
      { symbol: '(x₁, y₁), (x₂, y₂)', name: 'Endpoints', description: 'Coordinates of the line segment endpoints' },
      { symbol: 'm₁ : m₂', name: 'Division ratio', description: 'Ratio into which segment is divided' }
    ],
    explanation: 'Calculates the coordinates of a point P that divides the directed line segment joining A(x₁, y₁) and B(x₂, y₂) internally in the ratio m₁ : m₂. If m₁ = m₂ = 1, it yields the midpoint formula.',
    conditions: 'Valid for internal division with m₁ + m₂ ≠ 0.',
    example: {
      problem: 'Find the coordinates of the point dividing segment A(1, 3) and B(4, 6) in the ratio 2 : 1.',
      given: { A: '(1, 3)', B: '(4, 6)', ratio: '2 : 1 (m₁=2, m₂=1)' },
      steps: [
        'x-coordinate: x = [2(4) + 1(1)] / (2 + 1) = (8 + 1) / 3 = 9 / 3 = 3',
        'y-coordinate: y = [2(6) + 1(3)] / (2 + 1) = (12 + 3) / 3 = 15 / 3 = 5'
      ],
      result: 'P = (3, 5)'
    },
    keywords: ['section formula', 'ratio', 'coordinate geometry', 'midpoint', 'line segment']
  },
  {
    id: 'math-pythagorean-identities',
    title: 'Fundamental Trigonometric Identities',
    subject: 'mathematics',
    grades: ['Class 10', 'Class 11', 'Class 12'],
    chapter: 'Introduction to Trigonometry',
    category: 'Trigonometry',
    expression: {
      latex: '\\sin^2\\theta + \\cos^2\\theta = 1, \\quad 1 + \\tan^2\\theta = \\sec^2\\theta, \\quad 1 + \\cot^2\\theta = \\csc^2\\theta',
      text: 'sin²θ + cos²θ = 1,  1 + tan²θ = sec²θ,  1 + cot²θ = cosec²θ',
      formatted: 'sin²θ + cos²θ = 1'
    },
    variables: [
      { symbol: 'θ', name: 'Angle', description: 'Angle in degrees or radians' },
      { symbol: 'sin θ', name: 'Sine', description: 'Ratio of opposite side to hypotenuse' },
      { symbol: 'cos θ', name: 'Cosine', description: 'Ratio of adjacent side to hypotenuse' },
      { symbol: 'tan θ', name: 'Tangent', description: 'Ratio of opposite side to adjacent side' }
    ],
    explanation: 'The three fundamental Pythagorean identities relating the primary trigonometric functions. Derived directly from the right-angled triangle Pythagorean theorem on a unit circle.',
    conditions: 'tan θ and sec θ defined when θ ≠ (2k + 1)π/2; cot θ and csc θ defined when θ ≠ kπ.',
    example: {
      problem: 'If sin θ = 3/5 and θ is acute, find cos θ and tan θ.',
      given: { 'sin θ': '3/5' },
      steps: [
        'Apply identity: cos²θ = 1 - sin²θ = 1 - (3/5)² = 1 - 9/25 = 16/25',
        'Since θ is acute, cos θ = √(16/25) = 4/5',
        'Calculate tan θ = sin θ / cos θ = (3/5) / (4/5) = 3/4'
      ],
      result: 'cos θ = 4/5, tan θ = 3/4'
    },
    keywords: ['trigonometry', 'sine', 'cosine', 'tangent', 'pythagorean identity', 'secant'],
    isFundamental: true
  },
  {
    id: 'math-compound-angles',
    title: 'Compound Angle Addition Formulas',
    subject: 'mathematics',
    grades: ['Class 11', 'Class 12'],
    chapter: 'Trigonometric Functions',
    category: 'Trigonometry',
    expression: {
      latex: '\\sin(A \\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B, \\quad \\cos(A \\pm B) = \\cos A\\cos B \\mp \\sin A\\sin B',
      text: 'sin(A ± B) = sin A cos B ± cos A sin B ; cos(A ± B) = cos A cos B ∓ sin A sin B',
      formatted: 'sin(A + B) = sin A cos B + cos A sin B'
    },
    variables: [
      { symbol: 'A, B', name: 'Angles', description: 'Arbitrary angles in radians or degrees' },
      { symbol: 'sin, cos', name: 'Trig ratios', description: 'Standard circular functions' }
    ],
    explanation: 'Enables computing trigonometric values of compound angles (sums or differences) from the individual component angles.',
    example: {
      problem: 'Evaluate sin(75°) using exact values.',
      given: { split: '75° = 45° + 30°' },
      steps: [
        'sin(75°) = sin(45° + 30°) = sin 45° cos 30° + cos 45° sin 30°',
        'Substitute known values: (1/√2)(√3/2) + (1/√2)(1/2)',
        'Simplify: (√3 + 1) / (2√2)'
      ],
      result: 'sin(75°) = (√6 + √2) / 4 ≈ 0.9659'
    },
    keywords: ['compound angle', 'trigonometry', 'addition formula', 'sine', 'cosine']
  },
  {
    id: 'math-herons-formula',
    title: "Heron's Formula for Triangle Area",
    subject: 'mathematics',
    grades: ['Class 9', 'Class 10', 'Class 11'],
    chapter: "Areas Related to Circles & Heron's Formula",
    category: 'Mensuration',
    expression: {
      latex: 'A = \\sqrt{s(s - a)(s - b)(s - c)}, \\quad s = \\frac{a + b + c}{2}',
      text: 'Area = √(s(s - a)(s - b)(s - c))  where  s = (a + b + c) / 2',
      formatted: 'A = √(s(s - a)(s - b)(s - c))'
    },
    variables: [
      { symbol: 'A', name: 'Area', unit: 'sq units', description: 'Surface area of the triangle' },
      { symbol: 's', name: 'Semi-perimeter', unit: 'units', description: 'Half of the perimeter: (a + b + c)/2' },
      { symbol: 'a, b, c', name: 'Side lengths', unit: 'units', description: 'Lengths of the three triangle sides' }
    ],
    explanation: 'Calculates the area of any general scalene triangle when the lengths of all three sides are known, without requiring height or interior angles.',
    conditions: 'Triangle inequality must hold: a + b > c, b + c > a, a + c > b.',
    example: {
      problem: 'Find the area of a triangle with side lengths 7 cm, 8 cm, and 9 cm.',
      given: { a: '7 cm', b: '8 cm', c: '9 cm' },
      steps: [
        'Semi-perimeter s = (7 + 8 + 9) / 2 = 24 / 2 = 12 cm',
        's - a = 12 - 7 = 5 ; s - b = 12 - 8 = 4 ; s - c = 12 - 9 = 3',
        'Area A = √(12 × 5 × 4 × 3) = √(720) = √(144 × 5) = 12√5 cm²'
      ],
      result: 'A = 12√5 ≈ 26.83 cm²'
    },
    keywords: ['heron', 'triangle', 'area', 'semiperimeter', 'mensuration', 'geometry'],
    isFundamental: true
  },
  {
    id: 'math-binomial-theorem',
    title: 'Binomial Theorem Expansion',
    subject: 'mathematics',
    grades: ['Class 11', 'Class 12'],
    chapter: 'Binomial Theorem',
    category: 'Algebra',
    expression: {
      latex: '(a + b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n - k} b^k',
      text: '(a + b)ⁿ = Σ [C(n, k) × aⁿ⁻ᵏ × bᵏ] from k=0 to n',
      formatted: '(a + b)ⁿ = Σ [ⁿCₖ · aⁿ⁻ᵏ · bᵏ]'
    },
    variables: [
      { symbol: 'n', name: 'Index / Power', description: 'Non-negative integer power' },
      { symbol: 'a, b', name: 'Terms', description: 'Real or complex binomial terms' },
      { symbol: 'ⁿCₖ', name: 'Binomial Coefficient', description: 'Combinations: n! / [k!(n - k)!]' },
      { symbol: 'k', name: 'Term index', description: 'Running index from 0 to n' }
    ],
    explanation: 'Provides the algebraic expansion of powers of a binomial sum. The expansion contains exactly (n + 1) terms with symmetric Pascal triangle coefficients.',
    example: {
      problem: 'Expand (x + 2)³ using the binomial theorem.',
      given: { a: 'x', b: '2', n: '3' },
      steps: [
        'Term 0: ³C₀ x³ (2)⁰ = 1 × x³ × 1 = x³',
        'Term 1: ³C₁ x² (2)¹ = 3 × x² × 2 = 6x²',
        'Term 2: ³C₂ x¹ (2)² = 3 × x × 4 = 12x',
        'Term 3: ³C₃ x⁰ (2)³ = 1 × 1 × 8 = 8'
      ],
      result: '(x + 2)³ = x³ + 6x² + 12x + 8'
    },
    keywords: ['binomial', 'expansion', 'combinations', 'pascal', 'series', 'algebra']
  },
  {
    id: 'math-derivative-rules',
    title: 'Derivative Rules (Power, Product & Chain)',
    subject: 'mathematics',
    grades: ['Class 11', 'Class 12'],
    chapter: 'Continuity and Differentiability',
    category: 'Calculus',
    expression: {
      latex: '\\frac{d}{dx}[x^n] = n x^{n-1}, \\quad (uv)\' = u\'v + uv\', \\quad \\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)',
      text: 'd/dx(xⁿ) = n·xⁿ⁻¹ ;  (uv)\' = u\'v + uv\' ;  d/dx[f(g(x))] = f\'(g(x)) · g\'(x)',
      formatted: 'd/dx(xⁿ) = n·xⁿ⁻¹'
    },
    variables: [
      { symbol: 'd/dx', name: 'Derivative operator', description: 'Rate of change with respect to x' },
      { symbol: 'u, v', name: 'Differentiable functions', description: 'Functions u(x) and v(x)' },
      { symbol: "f'(g(x))", name: 'Outer derivative', description: 'Derivative of outer function evaluated at inner function' }
    ],
    explanation: 'Foundational operational rules in differential calculus that allow computing derivatives of polynomials, products, and composite functions.',
    example: {
      problem: 'Differentiate y = (3x² + 1)⁴ with respect to x.',
      given: { 'Outer f(u)': 'u⁴', 'Inner g(x)': '3x² + 1' },
      steps: [
        'Differentiate outer function: f\'(u) = 4u³ = 4(3x² + 1)³',
        'Differentiate inner function: g\'(x) = d/dx[3x² + 1] = 6x',
        'Multiply via Chain Rule: dy/dx = 4(3x² + 1)³ × (6x) = 24x(3x² + 1)³'
      ],
      result: 'dy/dx = 24x(3x² + 1)³'
    },
    keywords: ['calculus', 'derivative', 'chain rule', 'product rule', 'differentiation', 'power rule'],
    isFundamental: true
  },
  {
    id: 'math-integration-by-parts',
    title: 'Integration by Parts',
    subject: 'mathematics',
    grades: ['Class 12'],
    chapter: 'Integrals',
    category: 'Calculus',
    expression: {
      latex: '\\int u \\, dv = u v - \\int v \\, du',
      text: '∫ u dv = u·v - ∫ v du',
      formatted: '∫ u dv = u·v - ∫ v du'
    },
    variables: [
      { symbol: 'u', name: 'First function', description: 'Chosen according to the ILATE priority rule' },
      { symbol: 'dv', name: 'Second differential', description: 'Easily integrable function: dv = v\' dx' },
      { symbol: 'du', name: 'Differential of u', description: 'du = u\' dx' },
      { symbol: 'v', name: 'Integral of dv', description: 'v = ∫ dv' }
    ],
    explanation: 'Inverse of the product rule of differentiation. The choice of function u follows the ILATE rule: Inverse, Logarithmic, Algebraic, Trigonometric, Exponential.',
    example: {
      problem: 'Evaluate ∫ x eˣ dx.',
      given: { u: 'x (Algebraic)', dv: 'eˣ dx (Exponential)' },
      steps: [
        'Compute du = dx',
        'Compute v = ∫ eˣ dx = eˣ',
        'Apply formula: ∫ x eˣ dx = x eˣ - ∫ eˣ dx',
        'Complete integration: x eˣ - eˣ + C = eˣ(x - 1) + C'
      ],
      result: 'eˣ(x - 1) + C'
    },
    keywords: ['integration', 'calculus', 'by parts', 'integral', 'ilate']
  },
  {
    id: 'math-bayes-theorem',
    title: "Bayes' Theorem of Conditional Probability",
    subject: 'mathematics',
    grades: ['Class 12'],
    chapter: 'Probability',
    category: 'Probability & Statistics',
    expression: {
      latex: 'P(A_i | B) = \\frac{P(B | A_i) P(A_i)}{\\sum_{j=1}^{n} P(B | A_j) P(A_j)}',
      text: 'P(Aᵢ|B) = [P(B|Aᵢ) × P(Aᵢ)] / Σ [P(B|Aⱼ) × P(Aⱼ)]',
      formatted: 'P(A|B) = [P(B|A) · P(A)] / P(B)'
    },
    variables: [
      { symbol: 'P(Aᵢ|B)', name: 'Posterior probability', description: 'Probability of cause Aᵢ given evidence B' },
      { symbol: 'P(B|Aᵢ)', name: 'Likelihood', description: 'Probability of evidence B given cause Aᵢ' },
      { symbol: 'P(Aᵢ)', name: 'Prior probability', description: 'Initial probability of cause Aᵢ' },
      { symbol: 'P(B)', name: 'Total probability', description: 'Total probability of evidence B occurring' }
    ],
    explanation: 'Calculates the updated conditional probability of an event given that another related event or piece of evidence has already occurred.',
    example: {
      problem: 'Bag 1 has 3 red and 4 black balls. Bag 2 has 5 red and 6 black balls. One ball is drawn and found red. Find probability it came from Bag 1.',
      given: { 'P(Bag 1)': '0.5', 'P(Bag 2)': '0.5', 'P(Red|Bag 1)': '3/7', 'P(Red|Bag 2)': '5/11' },
      steps: [
        'Total Probability P(Red) = (0.5 × 3/7) + (0.5 × 5/11) = 3/14 + 5/22 = (33 + 35)/154 = 68/154',
        'Numerator = P(Bag 1) × P(Red|Bag 1) = 0.5 × 3/7 = 3/14 = 33/154',
        'Bayes formula: P(Bag 1|Red) = (33/154) / (68/154) = 33 / 68'
      ],
      result: 'P(Bag 1|Red) = 33/68 ≈ 0.485'
    },
    keywords: ['bayes', 'probability', 'conditional', 'posterior', 'prior', 'likelihood']
  },
  {
    id: 'math-vector-dot-cross',
    title: 'Vector Dot & Cross Product',
    subject: 'mathematics',
    grades: ['Class 12'],
    chapter: 'Vector Algebra',
    category: 'Vectors & 3D Geometry',
    expression: {
      latex: '\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta, \\quad |\\vec{a} \\times \\vec{b}| = |\\vec{a}||\\vec{b}|\\sin\\theta',
      text: 'a·b = |a||b|cos θ ;  |a × b| = |a||b|sin θ',
      formatted: 'a · b = |a||b|cos θ'
    },
    variables: [
      { symbol: 'a · b', name: 'Scalar (Dot) Product', description: 'Produces a scalar magnitude' },
      { symbol: 'a × b', name: 'Vector (Cross) Product', description: 'Produces a vector perpendicular to both a and b' },
      { symbol: '|a|, |b|', name: 'Vector magnitudes', description: 'Lengths of vectors a and b' },
      { symbol: 'θ', name: 'Angle between vectors', description: 'Angle (0 ≤ θ ≤ π)' }
    ],
    explanation: 'The dot product measures parallelism (zero when perpendicular). The cross product measures perpendicularity and defines the normal to the plane containing both vectors.',
    example: {
      problem: 'Find the dot product of a = 2i + 3j + 4k and b = i - 2j + 3k.',
      given: { a: '(2, 3, 4)', b: '(1, -2, 3)' },
      steps: [
        'a · b = (a₁b₁) + (a₂b₂) + (a₃b₃)',
        'a · b = (2)(1) + (3)(-2) + (4)(3)',
        'a · b = 2 - 6 + 12 = 8'
      ],
      result: 'a · b = 8'
    },
    keywords: ['vectors', 'dot product', 'cross product', 'algebra', 'angle']
  }
];
