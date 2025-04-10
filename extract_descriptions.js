// Function to extract descriptions from principles array
function extractDescriptions(principles) {
  return principles.map((principle) => principle.description);
}

// Example usage:
const principles = [
  {
    title: "Focus on Convictions",
    badge: "Truth-Seeking",
    description:
      "Build your family's foundation on biblical truth and eternal values.",
    color: "color1",
    id: "TRUTH-SEEKING",
  },
  {
    title: "Model Christlike Behavior",
    badge: "Exemplifying",
    description:
      "Live out the values and character you want your child to internalize.",
    color: "color2",
    id: "EXEMPLIFYING",
  },
  {
    title: "Practice Compassionate Listening",
    badge: "Empathizing",
    description:
      "Engage in open, empathetic communication to validate your child's feelings and build trust.",
    color: "color3",
    id: "COMMUNICATING",
  },
  {
    title: "Prioritize Quality Time",
    badge: "Attending",
    description:
      "Dedicate undivided attention to your child to foster a strong, lasting relationship.",
    color: "color4",
    id: "ENGAGING",
  },
  {
    title: "Encourage and Uplift",
    badge: "Affirming",
    description:
      "Regularly affirm your child's worth through positive, life-giving words that reflect their identity in Christ.",
    color: "color5",
    id: "AFFIRMING",
  },
  {
    title: "Show Unconditional Love",
    badge: "Loving",
    description:
      "Express love consistently and authentically, mirroring the love God shows us.",
    color: "color6",
    id: "LOVING",
  },
  {
    title: "Teach the Essential",
    badge: "Teaching",
    description:
      "Equip your child with the knowledge and skills to navigate life's challenges.",
    color: "color7",
    id: "TEACHING",
  },
  {
    title: "Discipline with Grace",
    badge: "Training",
    description:
      "Set clear, loving boundaries that guide behavior while nurturing growth and maturity.",
    color: "color8",
    id: "TRAINING",
  },
  {
    title: "Foster Healthy Conflict Resolution",
    badge: "Peacemaking",
    description:
      "Cultivate a home environment where conflicts are resolved constructively and relationships are strengthened.",
    color: "color9",
    id: "PEACEMAKING",
  },
  {
    title: "Yield to God's Guidance",
    badge: "Yielding",
    description:
      "Surrender your parenting journey to God, trusting and resting in His wisdom and provision.",
    color: "color10",
    id: "ENTRUSTING",
  },
];

// Get the list of descriptions
const descriptions = extractDescriptions(principles);

// Print the descriptions
console.log(descriptions);

// If you want to format as a numbered list:
const formattedList = descriptions.map(
  (desc, index) => `${index + 1}. ${desc}`
);
console.log(formattedList);

module.exports = { extractDescriptions };
