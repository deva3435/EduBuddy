import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
dotenv.config();
const app = express();
const port = Number(process.env.PORT || 3001);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || true }));
app.use(express.json({ limit: '1mb' }));
app.disable('x-powered-by');
const requestWindows = new Map();
app.use('/api/ai', (req, res, next) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const current = requestWindows.get(key);
    if (!current || current.resetAt <= now)
        requestWindows.set(key, { count: 1, resetAt: now + 10 * 60 * 1000 });
    else if (current.count >= 40)
        return res.status(429).json({ error: 'Too many learning requests. Please wait a few minutes and try again.' });
    else
        current.count += 1;
    next();
});
const gradeGuidance = (grade) => `The learner is in ${grade || 'an unspecified class'}. Match vocabulary, depth and examples to this age and school level.`;
const demoQuestions = (topic, count) => Array.from({ length: Math.min(Math.max(Number(count) || 5, 3), 10) }, (_, i) => ({ question: [`What is the main idea behind ${topic}?`, `Which statement best describes ${topic}?`, `Why is understanding ${topic} useful?`, `Which is a good way to explain ${topic}?`, `What should you remember about ${topic}?`, `Which example relates to ${topic}?`, `What is an important feature of ${topic}?`, `How can you apply ${topic}?`, `Which option is most accurate about ${topic}?`, `What is a useful next step when learning ${topic}?`][i], options: [`A clear explanation with a relevant example`, `A guess without checking`, `Memorising unrelated facts`, `Ignoring the basic idea`], answer: 0, explanation: `A clear explanation supported by an example is the strongest way to understand ${topic}.` }));
const demoVisualReply = (topic, grade) => {
    const t = topic.toLowerCase();
    if (t.includes('dna') || t.includes('replicat')) {
        return {
            title: 'How DNA Replication Works',
            subject: 'Biology',
            topic: 'DNA Replication',
            description: 'Explore how a cell unzips its double helix and copies its genetic code with incredible precision.',
            category: 'Biology',
            visualizationType: 'process-pipeline',
            components: [
                { id: 'helicase', name: 'DNA Helicase Enzyme', role: 'Unzipping enzyme', description: 'Breaks hydrogen bonds holding the nitrogenous base pairs together, unwinding the double helix.', detail: 'Forms the Y-shaped replication fork as it separates the two strands.', color: '#3b82f6' },
                { id: 'leading', name: 'Leading Strand (5\' to 3\')', role: 'Continuous template', description: 'Replicated continuously toward the replication fork by DNA polymerase.', detail: 'Requires only an initial RNA primer to start continuous synthesis.', color: '#10b981' },
                { id: 'lagging', name: 'Lagging Strand (3\' to 5\')', role: 'Discontinuous template', description: 'Synthesized discontinuously in short Okazaki fragments away from the fork.', detail: 'Each Okazaki fragment requires a new RNA primer laid down by primase.', color: '#f59e0b' },
                { id: 'polymerase', name: 'DNA Polymerase III', role: 'Builder enzyme', description: 'Reads parent template bases (A, T, C, G) and adds complementary nucleotides (A-T, C-G).', detail: 'Has a 3\' to 5\' exonuclease proofreading function that reduces copy errors.', color: '#8b5cf6' },
                { id: 'ligase', name: 'DNA Ligase', role: 'Glue enzyme', description: 'Seals nicks in the sugar-phosphate backbone, joining Okazaki fragments together.', detail: 'Catalyzes phosphodiester bonds to create two seamless double-stranded DNA molecules.', color: '#ec4899' }
            ],
            steps: [
                { stepNumber: 1, title: 'Unwinding & Unzipping', description: 'Helicase unwinds the double helix at the origin of replication.', activeComponentId: 'helicase', explanation: 'Hydrogen bonds between complementary base pairs are broken, creating two template strands.', visualCue: 'Hydrogen bonds separate, forming the replication fork.' },
                { stepNumber: 2, title: 'Priming', description: 'RNA Primase lays down short primer sequences.', activeComponentId: 'polymerase', explanation: 'DNA polymerase cannot start synthesis from scratch; it requires an existing 3\'-OH group to attach new nucleotides.', visualCue: 'Short RNA primers bind to single strands.' },
                { stepNumber: 3, title: 'Continuous & Discontinuous Synthesis', description: 'Leading strand is built smoothly; lagging strand forms Okazaki fragments.', activeComponentId: 'leading', explanation: 'Because DNA strands are antiparallel (5\'->3\' and 3\'->5\'), polymerase can only build continuously in one direction.', visualCue: 'Nucleotide precursors align with adenine pairing thymine and cytosine pairing guanine.' },
                { stepNumber: 4, title: 'Proofreading & Sealing', description: 'Errors are corrected and DNA Ligase seals the backbone.', activeComponentId: 'ligase', explanation: 'Ligase forms covalent phosphodiester bonds, yielding two identical DNA double helices each with one original and one new strand (semi-conservative replication).', visualCue: 'Okazaki fragments merge into continuous new strands.' }
            ],
            interactiveParameters: [
                { id: 'speed', label: 'Enzyme Activity Rate', min: 1, max: 5, defaultValue: 3, unit: 'x', effectDescription: 'Higher speed increases nucleotide addition rate and fork movement.' },
                { id: 'fidelity', label: 'Proofreading Accuracy', min: 90, max: 100, defaultValue: 99, unit: '%', effectDescription: 'Shows how exonuclease proofreading prevents cellular mutations.' }
            ],
            keyTakeaway: 'DNA replication is semi-conservative: each newly formed double helix contains one original parent strand and one newly synthesized daughter strand.',
            formulaOrRule: 'Base-Pairing Rule: Adenine (A) = Thymine (T) [2 H-bonds]; Guanine (G) ≡ Cytosine (C) [3 H-bonds]',
            funFact: 'Human cells replicate about 3 billion base pairs in just 6-8 hours with less than 1 error per billion bases!'
        };
    }
    if (t.includes('pulley') || t.includes('lever') || t.includes('machine')) {
        return {
            title: 'How Pulleys and Simple Machines Work',
            subject: 'Physics',
            topic: 'Simple Machines: Pulley Systems',
            description: 'See how multiple rope segments trade effort distance for force amplification using mechanical advantage.',
            category: 'Physics',
            visualizationType: 'system-model',
            components: [
                { id: 'fixed-wheel', name: 'Fixed Pulley', role: 'Direction changer', description: 'Anchored to the ceiling. Changes the direction of applied force without multiplying force.', detail: 'Mechanical advantage (MA) = 1. Pulling down lifts the load upward.', color: '#3b82f6' },
                { id: 'movable-wheel', name: 'Movable Pulley', role: 'Force multiplier', description: 'Rides along the rope with the load. Divides the load weight between two rope strands.', detail: 'Each supporting strand carries half the load weight (MA = 2).', color: '#10b981' },
                { id: 'rope', name: 'Rope / Cable', role: 'Tension transmitter', description: 'Distributes tension equally throughout all connected segments in the block-and-tackle.', detail: 'Work in = Force × Distance = Work out (ignoring friction).', color: '#f59e0b' },
                { id: 'load', name: 'Load Mass (W)', role: 'Object to lift', description: 'The gravitational force (weight in Newtons) acting downward on the mass.', detail: 'W = m × g where g is gravitational acceleration (~9.8 m/s²).', color: '#8b5cf6' },
                { id: 'effort', name: 'Effort Force (E)', role: 'Input pull', description: 'The force applied by a person or motor to pull the rope end.', detail: 'Effort needed = Load / Number of supporting rope strands.', color: '#ef4444' }
            ],
            steps: [
                { stepNumber: 1, title: 'Single Fixed Pulley', description: 'Pulling downward raises the weight upward.', activeComponentId: 'fixed-wheel', explanation: 'Forces are equal (Effort = Load). The main benefit is ergonomic: pulling down uses body weight against gravity.', visualCue: 'One rope passes over fixed axle; tension equals load.' },
                { stepNumber: 2, title: 'Adding a Movable Pulley', description: 'Load is supported by two vertical rope strands.', activeComponentId: 'movable-wheel', explanation: 'Weight is shared equally between the anchor strand and the pulled strand. Effort required is cut in half!', visualCue: 'Movable pulley rises as rope is pulled.' },
                { stepNumber: 3, title: 'Block and Tackle (4 Strands)', description: 'Pairing two fixed and two movable pulleys.', activeComponentId: 'rope', explanation: 'With 4 supporting strands, lifting a 400 N weight requires only 100 N of effort force.', visualCue: 'Multiple loops distribute tension evenly.' },
                { stepNumber: 4, title: 'Conservation of Energy', description: 'Force is reduced, but distance pulled increases proportionally.', activeComponentId: 'effort', explanation: 'To lift the load by 1 meter in a 4-strand pulley, you must pull 4 meters of rope. Total work remains unchanged!', visualCue: 'Rope end travels 4× the distance of the load.' }
            ],
            interactiveParameters: [
                { id: 'pulleys', label: 'Number of Supporting Strands', min: 1, max: 6, defaultValue: 2, unit: 'strands', effectDescription: 'Higher strand count decreases required effort force.' },
                { id: 'loadWeight', label: 'Load Weight', min: 50, max: 500, defaultValue: 200, unit: 'N', effectDescription: 'The downward gravitational force to overcome.' }
            ],
            keyTakeaway: 'Pulleys do not create free energy: they reduce the necessary input force by proportionally increasing the distance you must pull.',
            formulaOrRule: 'Mechanical Advantage (MA) = Load / Effort = Number of supporting rope strands; Work = Force × Distance',
            funFact: 'Archimedes famously used a compound pulley system to single-handedly haul a fully loaded warship onto land in Syracuse!'
        };
    }
    if (t.includes('digest') || t.includes('stomach') || t.includes('gut')) {
        return {
            title: 'The Human Digestive System Journey',
            subject: 'Biology',
            topic: 'Digestive System & Nutrient Absorption',
            description: 'Trace how food travels from mouth to cellular fuel through mechanical breakdown and chemical enzymes.',
            category: 'Biology',
            visualizationType: 'process-pipeline',
            components: [
                { id: 'mouth', name: 'Mouth & Salivary Glands', role: 'Mechanical & early chemical digestion', description: 'Teeth masticate food into a bolus while salivary amylase begins starch digestion.', detail: 'Tongue rolls bolus for smooth swallowing down esophagus.', color: '#ef4444' },
                { id: 'esophagus', name: 'Esophagus & Peristalsis', role: 'Transport tube', description: 'Rhythmic muscular wave contractions (peristalsis) propel food down into the stomach.', detail: 'Epiglottis prevents food from entering trachea (windpipe).', color: '#f59e0b' },
                { id: 'stomach', name: 'Stomach & Gastric Acid', role: 'Acidic churn & protein breakdown', description: 'Hydrochloric acid (pH ~1.5-2) kills bacteria while pepsin breaks proteins into peptides.', detail: 'Mucus lining shields stomach wall from self-digestion.', color: '#3b82f6' },
                { id: 'small-intestine', name: 'Small Intestine (Villi & Microvilli)', role: 'Nutrient absorption', description: 'Bile from liver emulsifies fats; pancreatic enzymes digest carbs, proteins, and lipids.', detail: 'Villi and microvilli provide a massive surface area of over 30 m².', color: '#10b981' },
                { id: 'large-intestine', name: 'Large Intestine & Colon', role: 'Water absorption', description: 'Reabsorbs water and mineral ions, compacting undigested fiber into waste.', detail: 'Houses trillions of beneficial gut microbiome bacteria that produce vitamins K and B.', color: '#8b5cf6' }
            ],
            steps: [
                { stepNumber: 1, title: 'Ingestion & Chewing', description: 'Food enters oral cavity and mixes with saliva.', activeComponentId: 'mouth', explanation: 'Amylase breaks complex carbohydrates into maltose sugars.', visualCue: 'Bolus formation in mouth.' },
                { stepNumber: 2, title: 'Peristalsis Transit', description: 'Involuntary smooth muscle waves push food to stomach.', activeComponentId: 'esophagus', explanation: 'Takes roughly 4-8 seconds; works even if swallowing upside down due to active muscular propulsion.', visualCue: 'Rhythmic constriction moving bolus downward.' },
                { stepNumber: 3, title: 'Gastric Churning', description: 'Stomach churns food into semi-liquid chyme.', activeComponentId: 'stomach', explanation: 'Hydrochloric acid activates pepsinogen into pepsin, breaking tough peptide bonds in proteins.', visualCue: 'Acidic churning and protease digestion.' },
                { stepNumber: 4, title: 'Enzymatic Digestion & Absorption', description: 'Chyme enters duodenum and small intestine.', activeComponentId: 'small-intestine', explanation: 'Bile salts emulsify fat droplets, and finger-like villi absorb amino acids, simple sugars, and fatty acids into blood.', visualCue: 'Villi transport nutrients into bloodstream capillaries.' },
                { stepNumber: 5, title: 'Water Reabsorption & Elimination', description: 'Colon extracts water and compacts residues.', activeComponentId: 'large-intestine', explanation: 'Body retains vital hydration and mineral electrolytes before final excretion.', visualCue: 'Water absorption across colon wall.' }
            ],
            interactiveParameters: [
                { id: 'mealType', label: 'Nutrient Composition', min: 1, max: 3, defaultValue: 2, unit: 'type', effectDescription: '1=Carbohydrates (quickest), 2=Balanced, 3=High Fat/Protein (slowest transit).' }
            ],
            keyTakeaway: 'The digestive system transforms complex macromolecules into microscopic nutrients small enough to cross cell membranes into the bloodstream.',
            formulaOrRule: 'Enzymatic Digestion: Amylase -> Starches; Protease/Pepsin -> Proteins; Lipase + Bile -> Lipids/Fats',
            funFact: 'If the microscopic villi and microvilli of your small intestine were ironed out flat, they would cover an entire tennis court!'
        };
    }
    // Generic educational visual model for any query
    return {
        title: `Visual Model: ${topic}`,
        subject: 'Science',
        topic,
        description: `A guided visual breakdown of how ${topic} operates step-by-step for ${grade}.`,
        category: 'General Science',
        visualizationType: 'process-pipeline',
        components: [
            { id: 'source', name: 'Initiator / Input Component', role: 'Starting stimulus or energy source', description: `Provides the initial energy or material input that drives ${topic}.`, detail: 'Acts as the foundation for subsequent transitions.', color: '#3b82f6' },
            { id: 'process', name: 'Transformation Core', role: 'Main operational mechanism', description: `Where the core physical or chemical interactions of ${topic} take place.`, detail: 'Governed by underlying scientific principles and conservation laws.', color: '#10b981' },
            { id: 'transfer', name: 'Transfer & Interaction Medium', role: 'Carrier or connection channel', description: `Transfers forces, particles, or data across different regions of the system.`, detail: 'Regulates rate of flow and stabilizes equilibrium.', color: '#f59e0b' },
            { id: 'result', name: 'Output / Result State', role: 'Final product or observed phenomenon', description: `The observable consequence or output produced by ${topic}.`, detail: 'Completes the cycle or system output state.', color: '#8b5cf6' }
        ],
        steps: [
            { stepNumber: 1, title: 'Initial State & Activation', description: `The primary inputs or conditions for ${topic} assemble.`, activeComponentId: 'source', explanation: `Energy or potential is introduced into the system to start the sequence.`, visualCue: 'Activation of input forces.' },
            { stepNumber: 2, title: 'Transformation in Progress', description: `Core forces or reactions interact inside the mechanism.`, activeComponentId: 'process', explanation: `The central process converts initial state variables according to natural laws.`, visualCue: 'Internal reaction and motion.' },
            { stepNumber: 3, title: 'Propagation & Flow', description: `Effects travel through the system channels.`, activeComponentId: 'transfer', explanation: `Equilibrium shifts as forces and materials move toward the output phase.`, visualCue: 'Dynamic flow of energy or particles.' },
            { stepNumber: 4, title: 'Final Equilibrium & Result', description: `The resulting structure or output is stabilized.`, activeComponentId: 'result', explanation: `The process yields its characteristic outcome or sets up the next cyclical round.`, visualCue: 'Final output reached.' }
        ],
        interactiveParameters: [
            { id: 'intensity', label: 'Reaction Intensity', min: 1, max: 5, defaultValue: 3, unit: 'lvl', effectDescription: 'Controls system speed and output magnitude.' }
        ],
        keyTakeaway: `Understanding ${topic} requires connecting the initial cause to its step-by-step physical or biological mechanism.`,
        formulaOrRule: `Cause -> Mechanism -> Observable Effect`,
        funFact: `Studying ${topic} visually helps retain concepts up to 6× longer than reading pure text descriptions!`
    };
};
const demoReply = (task, input) => {
    const topic = String(input.topic || input.message || 'your topic').slice(0, 120);
    const grade = input.profile?.grade || input.grade || 'your class';
    if (task === 'visualize')
        return demoVisualReply(topic, grade);
    if (task === 'quiz')
        return { title: `Practice: ${topic}`, questions: demoQuestions(topic, input.count) };
    if (task === 'revision')
        return { content: `# Revision: ${topic}\n\n## Quick refresher\n${topic} is worth revisiting because the core ideas are still taking shape. Start with the main idea, then connect it to one example you already know.\n\n## Key definitions\n- **Main idea:** the central point of ${topic}.\n- **Key terms:** learn the important words before the details.\n\n## Important facts & formulas\n- Write down the 2–3 facts you find most useful and check them against your notes.\n\n## Worked example\nTake one simple example and explain ${topic} step by step, the way you would teach a friend.\n\n## Common mistakes\n- Rushing to memorise without understanding the idea.\n- Skipping the example that makes the concept click.\n\n*Demo content:* Add an AI API key in the server environment to get a tailored revision session for ${grade}.`, quiz: { title: `Revision check: ${topic}`, questions: demoQuestions(topic, input.count) } };
    if (task === 'flashcards')
        return { cards: [{ front: `What is ${topic}?`, back: `${topic} is a concept you can understand by identifying its meaning, key features and examples.` }, { front: `Why is ${topic} important?`, back: `It helps connect ideas and apply what you learn to new situations.` }, { front: `How should you revise ${topic}?`, back: `Review the definition, explain it in your own words and practise an example.` }, { front: `What is a good learning strategy for ${topic}?`, back: `Break it into smaller ideas, connect them with examples and test your understanding.` }] };
    if (task === 'plan')
        return { tasks: [{ day: 'Day 1', title: `Understand ${topic}`, detail: 'Read the introduction and write down the key ideas.', type: 'Learn' }, { day: 'Day 2', title: `Review ${topic}`, detail: 'Create short notes and explain the concept in your own words.', type: 'Revise' }, { day: 'Day 3', title: `Practise ${topic}`, detail: 'Solve practice questions and review any mistakes.', type: 'Practice' }, { day: 'Day 4', title: `Check your understanding`, detail: 'Take a short quiz and revisit difficult parts.', type: 'Quiz' }] };
    if (task === 'notes')
        return { content: `# ${topic}\n\n## Overview\n${topic} is a topic worth understanding step by step. Start with its central idea, then connect the smaller details.\n\n## Key points\n- Learn the meaning of the important terms.\n- Identify the main ideas and how they connect.\n- Use a simple real-life example to check your understanding.\n\n## Remember\nExplain the topic in your own words. If you can teach the main idea clearly, you are making progress.\n\n## Check yourself\n1. What is the central idea?\n2. Can you give one example?\n3. Which part would you like to practise more?` };
    if (task === 'explain')
        return { content: `# ${topic}, made understandable\n\nLet's build the idea one step at a time.\n\n**Start with the big idea:** ${topic} is something we can understand by looking at its meaning, its parts and how it works in a real situation.\n\n**Think of an example:** Imagine explaining the idea to a friend using something familiar from everyday life. First describe what happens, then explain why it happens.\n\n**Remember these steps:**\n1. Learn the key meaning.\n2. Break the topic into smaller parts.\n3. Connect each part to an example.\n4. Explain it in your own words.\n\n*Demo content:* Add an AI API key in the server environment to get a tailored explanation for ${grade}.` };
    return { content: `That's a thoughtful question about ${topic}. Let's work through it together. First, identify the main idea, then connect it to an example you already know. Which part would you like to explore first?\n\n*Demo mode:* Connect an AI provider in the server environment for live, personalised tutoring.` };
};
const ytCache = new Map();
const ytNum = (v) => (v === undefined || v === null ? null : Number(v));
const ytDuration = (iso) => { const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso || ''); return m ? Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0) : undefined; };
const ytGet = async (url) => {
    const r = await fetch(url);
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
        const reason = data?.error?.errors?.[0]?.reason || '';
        const err = new Error(data?.error?.message || 'YouTube request failed');
        err.reason = reason;
        err.status = r.status;
        throw err;
    }
    return data;
};
app.get('/api/videos/search', async (req, res) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const { grade = '', board = '', subject = '', topic = '', chapter = '' } = req.query;
    const topicText = [topic, chapter].map(s => String(s).trim()).filter(Boolean).join(' ');
    if (!apiKey)
        return res.json({ mode: 'fallback' });
    if (!topicText)
        return res.status(400).json({ error: 'Add a topic or chapter to search for videos.' });
    const cacheKey = [grade, board, subject, topicText].join('|').toLowerCase();
    const hit = ytCache.get(cacheKey);
    if (hit && Date.now() - hit.at < 15 * 60 * 1000)
        return res.json(hit.data);
    try {
        const queries = [
            [grade, board, subject, topicText, 'explained'].filter(Boolean).join(' '),
            [grade, subject, topicText, 'lecture'].filter(Boolean).join(' '),
        ];
        const videoIds = [];
        const playlistIds = [];
        for (const q of queries) {
            const sv = await ytGet(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&videoDuration=medium&order=relevance&safeSearch=strict&q=${encodeURIComponent(q)}&key=${apiKey}`);
            videoIds.push(...(sv.items || []).map((i) => i.id?.videoId).filter(Boolean));
            const sp = await ytGet(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&maxResults=5&order=relevance&safeSearch=strict&q=${encodeURIComponent(q + ' playlist')}&key=${apiKey}`);
            playlistIds.push(...(sp.items || []).map((i) => i.id?.playlistId).filter(Boolean));
        }
        const uniqV = [...new Set(videoIds)].slice(0, 12);
        const uniqP = [...new Set(playlistIds)].slice(0, 8);
        let videos = [];
        let playlists = [];
        if (uniqV.length) {
            const vd = await ytGet(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${uniqV.join(',')}&key=${apiKey}`);
            videos = (vd.items || []).map((v) => ({ id: v.id, title: v.snippet.title, channel: v.snippet.channelTitle, publishedAt: v.snippet.publishedAt, durationSec: ytDuration(v.contentDetails?.duration), views: ytNum(v.statistics?.viewCount), likes: ytNum(v.statistics?.likeCount), comments: ytNum(v.statistics?.commentCount), thumb: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`, url: `https://www.youtube.com/watch?v=${v.id}` }));
        }
        if (uniqP.length) {
            const pd = await ytGet(`https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${uniqP.join(',')}&key=${apiKey}`);
            playlists = (pd.items || []).map((p) => ({ id: p.id, title: p.snippet.title, channel: p.snippet.channelTitle, itemCount: ytNum(p.contentDetails?.itemCount), thumb: p.snippet.thumbnails?.medium?.url || p.snippet.thumbnails?.default?.url, url: `https://www.youtube.com/playlist?list=${p.id}` }));
        }
        const data = { mode: 'youtube', videos, playlists, fetchedAt: new Date().toISOString() };
        if (ytCache.size > 200)
            ytCache.clear();
        ytCache.set(cacheKey, { at: Date.now(), data });
        res.json(data);
    }
    catch (e) {
        if (['quotaExceeded', 'dailyLimitExceeded', 'keyInvalid', 'forbidden'].includes(e.reason) || e.status === 403)
            return res.status(429).json({ error: 'YouTube API quota exceeded or the key was rejected. Try again later or check YOUTUBE_API_KEY.' });
        console.error('YouTube search failed:', e);
        res.status(502).json({ error: 'Could not reach YouTube right now. Please try again.' });
    }
});
app.get('/api/health', (_req, res) => res.json({ ok: true, aiConfigured: Boolean(process.env.OPENAI_API_KEY), mode: process.env.OPENAI_API_KEY ? 'live' : 'demo' }));
app.post('/api/ai', async (req, res) => {
    const { task, input = {} } = req.body || {};
    const allowed = ['chat', 'explain', 'notes', 'quiz', 'plan', 'flashcards', 'revision', 'visualize'];
    if (!allowed.includes(task))
        return res.status(400).json({ error: 'Unsupported learning task.' });
    if (!process.env.OPENAI_API_KEY)
        return res.json({ ...demoReply(task, input), demo: true });
    try {
        const system = `You are Buddy, a patient, supportive educational tutor for students in Classes 1–12. ${gradeGuidance(input.profile?.grade)} Board: ${input.profile?.board || 'not specified'}. Preferred subjects: ${(input.profile?.subjects || []).join(', ') || 'not specified'}. Explain rather than merely give answers. Never shame a learner. Do not claim to know exact textbook coverage unless supplied. Be age-appropriate and transparent about uncertainty. Current mode: ${input.mode || task}. For quiz, plan, flashcards, revision and visualize tasks, return valid JSON only, matching the requested structure.`;
        const taskPrompts = {
            chat: `Respond to this student message. Keep context from the conversation.\n${JSON.stringify(input)}`,
            explain: `Explain the topic: ${input.topic}. Level: ${input.level || 'school'}. Subject: ${input.subject || 'not specified'}. Give a clear, class-appropriate explanation with examples.`,
            notes: `Create concise, well-structured revision notes for ${input.topic}, subject ${input.subject || 'not specified'}. Use Markdown headings, definitions, key points, examples and a short recap.`,
            quiz: `Generate ${input.count || 5} distinct ${input.difficulty || 'medium'} multiple-choice questions about ${input.topic} for ${input.profile?.grade || 'the student class'}. Return JSON: {"title":string,"questions":[{"question":string,"options":[string,string,string,string],"answer":number 0-3,"explanation":string}]}.`,
            plan: `Create a realistic short study plan for these topics: ${input.topic}. Available time: ${input.minutes || 45} minutes per day. Target date: ${input.targetDate || 'not specified'}. Return JSON {"tasks":[{"day":string,"title":string,"detail":string,"type":"Learn|Revise|Practice|Quiz"}]}.`,
            flashcards: `Create 8 useful flashcards about ${input.topic}. Return JSON {"cards":[{"front":string,"back":string}]}.`,
            revision: `Create a short, focused revision session for the topic "${input.topic}" (subject: ${input.subject || 'not specified'}) for a student in ${input.profile?.grade || 'an unspecified class'}. Keep it concise — this is a quick refresher, not a full lesson. Return JSON {"content": string, "quiz": {"title": string, "questions": [...]}}. The "content" must be Markdown with exactly these sections: "## Quick refresher" (2-3 sentences on the core idea), "## Key definitions" (bullet list of 3-5 key terms), "## Important facts & formulas" (only if relevant, otherwise say "No formulas needed — focus on the concepts."), "## Worked example" (one short example), "## Common mistakes" (2-3 typical misconceptions to avoid). The quiz must contain ${input.count || 5} distinct multiple-choice questions targeting the core concepts of ${input.topic}, with special attention to: ${input.focus || 'the ideas the student found difficult'}. Each question needs 4 options, an "answer" index 0-3, and a short "explanation".`,
            visualize: `Create a structured visual learning model for "${input.topic}" (subject: ${input.subject || 'Science'}, student: ${input.profile?.grade || 'Class 10'}). Break the concept down into interactive visual parts, steps and parameters. Return valid JSON only with this schema:\n{"title":string,"subject":string,"topic":string,"description":string,"category":"Biology"|"Physics"|"Chemistry"|"Mathematics"|"Astronomy"|"Geography"|"General Science","visualizationType":"process-pipeline"|"system-model"|"cycle-model"|"interactive-diagram","components":[{"id":string,"name":string,"role":string,"description":string,"detail":string,"color":string}],"steps":[{"stepNumber":number,"title":string,"description":string,"activeComponentId":string,"explanation":string,"visualCue":string}],"interactiveParameters":[{"id":string,"label":string,"min":number,"max":number,"defaultValue":number,"unit":string,"effectDescription":string}],"keyTakeaway":string,"formulaOrRule":string,"funFact":string}`
        };
        const response = await fetch(process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions', {
            method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', temperature: 0.6, messages: [{ role: 'system', content: system }, { role: 'user', content: taskPrompts[task] }] })
        });
        if (!response.ok) {
            const detail = await response.text();
            console.error('AI provider error:', response.status, detail.slice(0, 500));
            return res.status(502).json({ error: 'Buddy could not reach the AI service. Please try again.' });
        }
        const data = await response.json();
        let content = data.choices?.[0]?.message?.content;
        if (typeof content !== 'string' || !content.trim())
            return res.status(502).json({ error: 'The AI service returned an empty response.' });
        if (['quiz', 'plan', 'flashcards', 'revision', 'visualize'].includes(task)) {
            content = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
            try {
                return res.json({ ...JSON.parse(content), demo: false });
            }
            catch {
                return res.status(502).json({ error: 'Buddy returned an invalid structured response. Please retry.' });
            }
        }
        return res.json({ content, demo: false });
    }
    catch (error) {
        console.error('AI request failed:', error);
        return res.status(500).json({ error: 'Something went wrong while generating your learning material.' });
    }
});
const dist = path.resolve(__dirname, process.env.NODE_ENV === 'production' ? '../dist' : 'dist');
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(dist));
    app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}
app.listen(port, () => console.log(`EduBuddy server listening on :${port}`));
