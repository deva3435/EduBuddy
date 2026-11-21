import type { DailyChallengeDefinition } from './types';

export const demoDailyChallenge: DailyChallengeDefinition = {
  title: 'The Everyday Science Sprint',
  subject: 'Science',
  description: 'Explore a few big ideas hiding in everyday life. Read each question, choose an answer, and learn from the explanation.',
  questions: [
    {
      question: 'Which part of a plant takes in most of the water from the soil?',
      options: ['The flowers', 'The roots', 'The fruit', 'The leaves'],
      answer: 1,
      explanation: 'Roots absorb water and minerals from the soil. The water then travels through the stem to the rest of the plant.',
    },
    {
      question: 'What happens to liquid water when it is heated enough?',
      options: ['It becomes a gas called water vapour', 'It turns into soil', 'It becomes a metal', 'It disappears forever'],
      answer: 0,
      explanation: 'Heating gives water particles more energy, so some escape into the air as water vapour. This change is called evaporation.',
    },
    {
      question: 'Which force pulls objects toward Earth?',
      options: ['Magnetism', 'Friction', 'Gravity', 'Sound'],
      answer: 2,
      explanation: 'Gravity is the attractive force between objects with mass. Earth’s gravity pulls nearby objects toward its centre.',
    },
    {
      question: 'Which material is usually the best electrical conductor?',
      options: ['Rubber', 'Copper', 'Dry wood', 'Plastic'],
      answer: 1,
      explanation: 'Copper lets electric charge move through it easily, which is why it is commonly used in electrical wires.',
    },
    {
      question: 'What is the main source of energy for Earth’s water cycle?',
      options: ['The Moon', 'The Sun', 'Ocean waves', 'The soil'],
      answer: 1,
      explanation: 'Energy from the Sun warms surface water and drives evaporation, helping keep the water cycle moving.',
    },
  ],
};
