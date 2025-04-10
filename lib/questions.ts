// Define the 10 parenting principles
export const dimensions = [
  "TRUTH-SEEKING",
  "EXEMPLIFYING",
  "COMMUNICATING",
  "ENGAGING",
  "AFFIRMING",
  "LOVING",
  "TEACHING",
  "TRAINING",
  "PEACEMAKING",
  "ENTRUSTING",
] as const;

// 10 pages with questions for each principle
export const personalityQuestions = [
  // Page 1: TRUTH-SEEKING
  [
    { question: "I teach my child biblical principles and truths." },
    {
      question:
        "I encourage my child to have personal prayer time and Bible reading.",
    },
    {
      question:
        "I engage my child to talk about how faith applies to everyday situations in our lives.",
    },
    { question: "I make church involvement a priority for my family." },
    {
      question:
        "I answer my child’s spiritual questions with patience and biblical guidance.",
    },
    { question: "I teach my child that obedience to God brings blessing." },
    {
      question:
        "I talk to my child about the importance of framing priorities and pursuits from an eternal perspective – living for heaven rather than making choices that are short-sighted.",
    },
    {
      question:
        "I prioritize my child’s spiritual growth over worldly achievements.",
    },
    { question: "I pray with and for my child daily." },
    {
      question:
        "I teach my child that they are not to copy worldly values, but to act like a citizen of Heaven.",
    },
  ],
  // Page 2: EXEMPLIFYING
  [
    {
      question:
        "I model kindness, generosity, and respect towards others, living out the golden rule of relationships – “Do unto others as you would have them do unto you.”",
    },
    {
      question:
        "I model humility and the commitment to improve by admitting my mistakes and asking for forgiveness.",
    },
    {
      question:
        "I model good habits and discipline in the areas of eating, sleeping, exercise, and digital use.",
    },
    { question: "I model the right order of priorities." },
    {
      question:
        "I model a grateful and joyful attitude, as well as trusting in God, even when faced with challenges and stress.",
    },
    {
      question:
        "I model stewardship of resources by being mindful of my spending and practicing frugality.",
    },
    {
      question:
        "I model speaking positively about people, avoiding gossip and negative talk.",
    },
    {
      question:
        "I model perseverance and grit when I approach tasks and responsibilities.",
    },
    { question: "I demonstrate a strong work ethic and persistence in tasks." },
    {
      question:
        "I model faithfulness and integrity, even when no one is watching.",
    },
  ],
  // Page 3: COMMUNICATING
  [
    {
      question:
        "I listen to my child without interrupting or dismissing their concerns.",
    },
    {
      question:
        "I acknowledge and validate my child’s feelings, even when I disagree.",
    },
    {
      question:
        "I make eye contact and give full attention when my child is speaking.",
    },
    {
      question: "I assure my child that they can open up to me about anything.",
    },
    {
      question:
        "I ask open-ended questions to help my child articulate their thoughts.",
    },
    {
      question:
        "I avoid using an angry tone or manner when responding to my child’s feelings.",
    },
    {
      question:
        "I make time daily to ask my child about their thoughts and experiences.",
    },
    {
      question:
        "I guide my child toward constructive ways to handle conflicts and emotions.",
    },
    { question: "I am open about my own weaknesses and struggles." },
    {
      question:
        "I express empathy by trying to understand situations from my child’s perspective.",
    },
  ],
  // Page 4: ENGAGING
  [
    {
      question:
        "I make it a point to be present during meal times, especially dinner.",
    },
    {
      question:
        "I participate in my child’s interests and activities regularly by “getting into their world.”",
    },
    {
      question:
        "I attend my child’s events and special occasions whenever possible.",
    },
    {
      question:
        "I put away electronic devices and focus fully during family interactions.",
    },
    {
      question:
        "I initiate conversations with my child about their day and experiences to know them more.",
    },
    {
      question:
        "I plan family activities, vacations, or traditions to build memories.",
    },
    {
      question:
        "I make time to play, laugh, and enjoy fun moments with my child.",
    },
    {
      question:
        "I adjust my schedule to ensure I spend quality time with my child regularly.",
    },
    {
      question:
        "I prioritize family time over work and other external commitments.",
    },
    { question: "I use spontaneous moments to connect with my child." },
  ],
  // Page 5: AFFIRMING
  [
    {
      question:
        "I praise my child’s efforts rather than just their accomplishments.",
    },
    {
      question:
        "I use words of encouragement to affirm and appreciate my child daily.",
    },
    {
      question:
        "I avoid negative labels and judgmental statements that tear down my child.",
    },
    {
      question:
        "I recognize and celebrate my child’s unique strengths and gifts.",
    },
    {
      question:
        "I avoid comparing my child to others and instead affirm their individuality.",
    },
    {
      question:
        "I correct my child’s mistakes in a way that builds confidence rather than discourages.",
    },
    {
      question:
        "I express appreciation for my child’s strengths privately and publicly.",
    },
    {
      question:
        "I intentionally speak positive and life-giving words over my child.",
    },
    {
      question:
        "I reassure my child that they are loved, regardless of their performance.",
    },
    {
      question:
        "I provide constructive feedback with kindness and encouragement.",
    },
    {
      question:
        "I avoid shouting and losing my temper when correcting my child.",
    },
  ],
  // Page 6: LOVING
  [
    { question: "I express my love for my child verbally every day." },
    {
      question:
        "I show physical affection (hugs, pats on the back, etc.) consistently.",
    },
    {
      question:
        "I reassure my child that my love is not based on their behavior or achievements.",
    },
    {
      question:
        "I respond with patience and understanding when my child makes mistakes.",
    },
    {
      question:
        "I create an emotionally safe space where my child feels the security of belonging.",
    },
    {
      question:
        "I avoid using love as a reward or withholding affection as punishment.",
    },
    {
      question:
        "I don’t show favoritism in the family; I show equal favor to each child.",
    },
    {
      question:
        "I let my child know I don’t just love them, I like them, and I enjoy their company.",
    },
    {
      question:
        "I demonstrate my love by “speaking” my child’s love language – gifts, words of affirmation, service, time, or affection.",
    },
    {
      question:
        "I point my child to the source of perfect love, who is God himself.",
    },
  ],
  // Page 7: TEACHING
  [
    {
      question:
        "I assign age-appropriate tasks and responsibilities to my child to help them develop independence.",
    },
    {
      question:
        "I teach my child the principles of wise money management, including saving, spending, and giving.",
    },
    {
      question:
        "I encourage my child to think critically, solve problems, and make responsible choices instead of always providing direct answers.",
    },
    {
      question:
        "I involve my child in basic household chores and give them tasks to build their sense of responsibility – to be a contributor rather than a mere consumer.",
    },
    {
      question:
        "I teach my child the importance of healthy eating, hygiene, and personal well-being.",
    },
    {
      question:
        "I help my child develop time management and organizational skills for school, home, and other responsibilities.",
    },
    {
      question:
        "I foster a habit of curiosity by encouraging my child to ask questions, analyze information, and seek truth through a biblical lens.",
    },
    {
      question:
        "I equip my child with the skills to handle conflicts biblically and make ethical decisions in challenging situations.",
    },
    {
      question:
        "I teach my child to engage respectfully and empathetically with people from different backgrounds, beliefs, and cultures.",
    },
    {
      question:
        "I reinforce a love for continuous learning, self-improvement, and spiritual growth.",
    },
  ],
  // Page 8: TRAINING
  [
    {
      question:
        "I set clear and consistent rules and expectations for behavior.",
    },
    {
      question:
        "I follow through with fair and appropriate consequences when rules are broken.",
    },
    {
      question:
        "I remain calm and composed when disciplining my child, and avoid outbursts of anger.",
    },
    {
      question:
        "I explain the reasons behind rules and consequences to my child.",
    },
    {
      question:
        "I enforce discipline with a focus on teaching and training rather than punishment as an end in itself.",
    },
    { question: "I praise and reward my child’s good behavior regularly." },
    { question: "I emphasize one-command obedience and respect." },
    {
      question:
        "I encourage my child to take responsibility for their actions, to apologize, and to make restitution when they are wrong.",
    },
    {
      question:
        "I adapt age-appropriate discipline strategies based on my child’s needs and life-stage.",
    },
    { question: "I balance discipline with grace and loving guidance." },
  ],
  // Page 9: PEACEMAKING
  [
    { question: "I demonstrate humility by apologizing when I make mistakes." },
    { question: "I regularly ask how I can improve." },
    {
      question:
        "I avoid bringing up past mistakes against my child in present conflicts, instead, I identity and address the main issue.",
    },
    {
      question:
        "I encourage my child to resolve disagreements peacefully and respectfully.",
    },
    {
      question:
        "I do not let “the sun go down on my anger,” but seek to resolve conflicts as soon as possible.",
    },
    {
      question:
        "I actively listen to both sides of a conflict before making judgments.",
    },
    {
      question:
        "I do not use words like “always” or “never” or make sweeping generalizations that are inaccurate and judgmental.",
    },
    {
      question:
        "I pray with my child about handling conflicts in a Christlike manner.",
    },
    {
      question:
        "I prioritize relationship-building over being “right” in family discussions.",
    },
    {
      question:
        "I help my child understand that mistakes are learning opportunities rather than failures.",
    },
  ],
  // Page 10: ENTRUSTING
  [
    { question: "I actively seek God’s guidance in my parenting decisions." },
    {
      question: "I pray daily for my child’s spiritual growth and well-being.",
    },
    {
      question:
        "I surrender my fears and anxieties about my child’s future to God.",
    },
    {
      question:
        "I encourage my child to seek God’s will in their own decisions, to focus on pleasing God.",
    },
    { question: "I prioritize my personal spiritual growth as a parent." },
    {
      question:
        "I create opportunities for my child to experience God’s presence in daily life.",
    },
    {
      question:
        "I don’t over-function for my child and make them dependent on me rather than dependent on God.",
    },
    {
      question:
        "I help my child develop habits of prayer, worship, and Bible study.",
    },
    {
      question:
        "I rest in the reality that God is in control and in charge of my child’s journey.",
    },
    {
      question:
        "I trust that God has the best plans for my children, even when I don’t always understand the present.",
    },
  ],
];

// Interpretations for each principle based on score ranges
export const interpretations: Record<string, string[]> = {
  "TRUTH-SEEKING": [
    "Struggling: Consider making this principle a priority.",
    "Seeking: This area needs intentional focus and development.",
    "Growing: You are applying this principle well but may have areas to improve.",
    "Thriving: You are strongly living out this principle. Keep going!",
  ],
  EXEMPLIFYING: [
    "Struggling: Consider making this principle a priority.",
    "Seeking: This area needs intentional focus and development.",
    "Growing: You are applying this principle well but may have areas to improve.",
    "Thriving: You are strongly living out this principle. Keep going!",
  ],
  COMMUNICATING: [
    "Struggling: Consider making this principle a priority.",
    "Seeking: This area needs intentional focus and development.",
    "Growing: You are applying this principle well but may have areas to improve.",
    "Thriving: You are strongly living out this principle. Keep going!",
  ],
  ENGAGING: [
    "Struggling: Consider making this principle a priority.",
    "Seeking: This area needs intentional focus and development.",
    "Growing: You are applying this principle well but may have areas to improve.",
    "Thriving: You are strongly living out this principle. Keep going!",
  ],
  AFFIRMING: [
    "Struggling: Consider making this principle a priority.",
    "Seeking: This area needs intentional focus and development.",
    "Growing: You are applying this principle well but may have areas to improve.",
    "Thriving: You are strongly living out this principle. Keep going!",
  ],
  LOVING: [
    "Struggling: Consider making this principle a priority.",
    "Seeking: This area needs intentional focus and development.",
    "Growing: You are applying this principle well but may have areas to improve.",
    "Thriving: You are strongly living out this principle. Keep going!",
  ],
  TEACHING: [
    "Struggling: Consider making this principle a priority.",
    "Seeking: This area needs intentional focus and development.",
    "Growing: You are applying this principle well but may have areas to improve.",
    "Thriving: You are strongly living out this principle. Keep going!",
  ],
  TRAINING: [
    "Struggling: Consider making this principle a priority.",
    "Seeking: This area needs intentional focus and development.",
    "Growing: You are applying this principle well but may have areas to improve.",
    "Thriving: You are strongly living out this principle. Keep going!",
  ],
  PEACEMAKING: [
    "Struggling: Consider making this principle a priority.",
    "Seeking: This area needs intentional focus and development.",
    "Growing: You are applying this principle well but may have areas to improve.",
    "Thriving: You are strongly living out this principle. Keep going!",
  ],
  ENTRUSTING: [
    "Struggling: Consider making this principle a priority.",
    "Seeking: This area needs intentional focus and development.",
    "Growing: You are applying this principle well but may have areas to improve.",
    "Thriving: You are strongly living out this principle. Keep going!",
  ],
};

// TODO: update colors por dark mode
// Colors for each principle
export const dimensionColors = {
  "TRUTH-SEEKING": {
    color: "text-sky-8 dark:text-blue-400",
    bg: "bg-sky-8",
    bgTranslucent: "bg-sky-8/50",
    bgLight: "bg-blue-100 dark:bg-blue-950",
    border: "border-sky-8",
    fill: "fill-sky-8 dark:fill-blue-400",
    fillOpacity: 0.5,
    stroke: "stroke-sky-8 dark:stroke-blue-400",
  },
  EXEMPLIFYING: {
    color: "text-lime-8 dark:text-emerald-400",
    bg: "bg-lime-8",
    bgTranslucent: "bg-lime-8/50",
    bgLight: "bg-emerald-100 dark:bg-emerald-950",
    border: "border-lime-8",
    fill: "fill-lime-8 dark:fill-emerald-400",
    fillOpacity: 0.5,
    stroke: "stroke-lime-8 dark:stroke-emerald-400",
  },
  COMMUNICATING: {
    color: "text-sage-9 dark:text-purple-400",
    bg: "bg-sage-9",
    bgTranslucent: "bg-sage-9/50",
    bgLight: "bg-purple-100 dark:bg-purple-950",
    border: "border-sage-9",
    fill: "fill-sage-9 dark:fill-purple-400",
    fillOpacity: 0.5,
    stroke: "stroke-sage-9 dark:stroke-purple-400",
  },
  ENGAGING: {
    color: "text-orange-8 dark:text-amber-400",
    bg: "bg-orange-8",
    bgTranslucent: "bg-orange-8/50",
    bgLight: "bg-amber-100 dark:bg-amber-950",
    border: "border-orange-8",
    fill: "fill-orange-8 dark:fill-amber-400",
    fillOpacity: 0.5,
    stroke: "stroke-orange-8 dark:stroke-amber-400",
  },
  AFFIRMING: {
    color: "text-bronze-8 dark:text-pink-400",
    bg: "bg-bronze-8",
    bgTranslucent: "bg-bronze-8/50",
    bgLight: "bg-pink-100 dark:bg-pink-950",
    border: "border-bronze-8",
    fill: "fill-bronze-8 dark:fill-pink-400",
    fillOpacity: 0.5,
    stroke: "stroke-bronze-8 dark:stroke-pink-400",
  },
  LOVING: {
    color: "text-red-8 dark:text-red-400",
    bg: "bg-red-8",
    bgTranslucent: "bg-red-8/50",
    bgLight: "bg-red-100 dark:bg-red-950",
    border: "border-red-8",
    fill: "fill-red-8 dark:fill-red-400",
    fillOpacity: 0.5,
    stroke: "stroke-red-8 dark:stroke-red-400",
  },
  TEACHING: {
    color: "text-willow-8 dark:text-teal-400",
    bg: "bg-willow-8",
    bgTranslucent: "bg-willow-8/50",
    bgLight: "bg-teal-100 dark:bg-teal-950",
    border: "border-willow-8",
    fill: "fill-willow-8 dark:fill-teal-400",
    fillOpacity: 0.5,
    stroke: "stroke-willow-8 dark:stroke-teal-400",
  },
  TRAINING: {
    color: "text-gold-8 dark:text-indigo-400",
    bg: "bg-gold-8",
    bgTranslucent: "bg-gold-8/50",
    bgLight: "bg-indigo-100 dark:bg-indigo-950",
    border: "border-gold-8",
    fill: "fill-gold-8 dark:fill-indigo-400",
    fillOpacity: 0.5,
    stroke: "stroke-gold-8 dark:stroke-indigo-400",
  },
  PEACEMAKING: {
    color: "text-cyan-8 dark:text-orange-400",
    bg: "bg-cyan-8",
    bgTranslucent: "bg-cyan-8/50",
    bgLight: "bg-orange-100 dark:bg-orange-950",
    border: "border-cyan-8",
    fill: "fill-cyan-8 dark:fill-orange-400",
    fillOpacity: 0.5,
    stroke: "stroke-cyan-8 dark:stroke-orange-400",
  },
  ENTRUSTING: {
    color: "text-salmon-8 dark:text-cyan-400",
    bg: "bg-salmon-8",
    bgTranslucent: "bg-salmon-8/50",
    bgLight: "bg-cyan-100 dark:bg-cyan-950",
    border: "border-salmon-8",
    fill: "fill-salmon-8 dark:fill-cyan-400",
    fillOpacity: 0.5,
    stroke: "stroke-salmon-8 dark:stroke-cyan-400",
  },
};
