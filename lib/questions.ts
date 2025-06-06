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
// Colors for each principle
export const dimensionColors = {
  "TRUTH-SEEKING": {
    color: "text-orange-800 dark:text-orange-400",
    bg: "bg-orange-100",
    bgTranslucent: "bg-orange-100/50",
    bgLight: "bg-orange-50",
    border: "border-orange-800",
    fill: "fill-orange-800 dark:fill-orange-400",
    fillOpacity: 0.5,
    stroke: "stroke-orange-800 dark:stroke-orange-400",
  },
  EXEMPLIFYING: {
    color: "text-violet-800 dark:text-violet-400",
    bg: "bg-violet-200",
    bgTranslucent: "bg-violet-200/50",
    bgLight: "bg-violet-100",
    border: "border-violet-800",
    fill: "fill-violet-800 dark:fill-violet-400",
    fillOpacity: 0.5,
    stroke: "stroke-violet-800 dark:stroke-violet-400",
  },
  COMMUNICATING: {
    color: "text-bluegreen-800 dark:text-bluegreen-400",
    bg: "bg-bluegreen-100",
    bgTranslucent: "bg-bluegreen-100/50",
    bgLight: "bg-bluegreen-50",
    border: "border-bluegreen-800",
    fill: "fill-bluegreen-800 dark:fill-bluegreen-400",
    fillOpacity: 0.5,
    stroke: "stroke-bluegreen-800 dark:stroke-bluegreen-400",
  },
  ENGAGING: {
    color: "text-yellowgreen-800 dark:text-yellowgreen-400",
    bg: "bg-yellowgreen-100",
    bgTranslucent: "bg-yellowgreen-100/50",
    bgLight: "bg-yellowgreen-50",
    border: "border-yellowgreen-800",
    fill: "fill-yellowgreen-800 dark:fill-yellowgreen-400",
    fillOpacity: 0.5,
    stroke: "stroke-yellowgreen-800 dark:stroke-yellowgreen-400",
  },
  AFFIRMING: {
    color: "text-pink-800 dark:text-pink-400",
    bg: "bg-pink-100",
    bgTranslucent: "bg-pink-100/50",
    bgLight: "bg-pink-50",
    border: "border-pink-800",
    fill: "fill-pink-800 dark:fill-pink-400",
    fillOpacity: 0.5,
    stroke: "stroke-pink-800 dark:stroke-pink-400",
  },
  LOVING: {
    color: "text-blueviolet-800 dark:text-blueviolet-400",
    bg: "bg-blueviolet-100",
    bgTranslucent: "bg-blueviolet-100/50",
    bgLight: "bg-blueviolet-50",
    border: "border-blueviolet-800",
    fill: "fill-blueviolet-800 dark:fill-blueviolet-400",
    fillOpacity: 0.5,
    stroke: "stroke-blueviolet-800 dark:stroke-blueviolet-400",
  },
  TEACHING: {
    color: "text-green-800 dark:text-green-400",
    bg: "bg-green-200",
    bgTranslucent: "bg-green-200/50",
    bgLight: "bg-green-100",
    border: "border-green-800",
    fill: "fill-green-800 dark:fill-green-400",
    fillOpacity: 0.5,
    stroke: "stroke-green-800 dark:stroke-green-400",
  },
  TRAINING: {
    color: "text-brown-800 dark:text-brown-400",
    bg: "bg-brown-200",
    bgTranslucent: "bg-brown-200/50",
    bgLight: "bg-brown-100",
    border: "border-brown-800",
    fill: "fill-brown-800 dark:fill-brown-400",
    fillOpacity: 0.5,
    stroke: "stroke-brown-800 dark:stroke-brown-400",
  },
  PEACEMAKING: {
    color: "text-blue-800 dark:text-blue-400",
    bg: "bg-blue-100",
    bgTranslucent: "bg-blue-100/50",
    bgLight: "bg-blue-50",
    border: "border-blue-800",
    fill: "fill-blue-800 dark:fill-blue-400",
    fillOpacity: 0.5,
    stroke: "stroke-blue-800 dark:stroke-blue-400",
  },
  ENTRUSTING: {
    color: "text-champagne-800 dark:text-champagne-400",
    bg: "bg-champagne-100",
    bgTranslucent: "bg-champagne-100/50",
    bgLight: "bg-champagne-50",
    border: "border-champagne-800",
    fill: "fill-champagne-800 dark:fill-champagne-400",
    fillOpacity: 0.5,
    stroke: "stroke-champagne-800 dark:stroke-champagne-400",
  },
};
