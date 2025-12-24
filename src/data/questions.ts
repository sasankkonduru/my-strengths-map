import { Question } from '@/types/strengths';
import { STRENGTHS } from './strengths';

// Generate 5 questions per strength (170 total)
// Questions are designed to assess behaviors without revealing the strength name

const QUESTION_TEMPLATES: Record<string, string[]> = {
  // EXECUTING
  achiever: [
    "I feel restless on days when I haven't accomplished anything tangible.",
    "I have a strong internal drive that pushes me to get things done.",
    "I take satisfaction from being busy and productive throughout the day.",
    "I set high standards for my output and work hard to meet them.",
    "At the end of the day, I measure my worth by what I've achieved.",
  ],
  arranger: [
    "I enjoy organizing resources and people for maximum efficiency.",
    "When things change, I can quickly reconfigure plans to adapt.",
    "I naturally see how different pieces can fit together in better ways.",
    "I find satisfaction in coordinating complex projects with many moving parts.",
    "I am comfortable managing multiple variables and making real-time adjustments.",
  ],
  belief: [
    "My core values guide most of my important life decisions.",
    "I am drawn to work that aligns with what I believe is meaningful.",
    "I find it difficult to compromise on matters that conflict with my values.",
    "My sense of purpose comes from contributing to something I believe in.",
    "I feel most fulfilled when my work reflects my personal values.",
  ],
  consistency: [
    "I believe everyone should be treated the same, regardless of their position.",
    "I prefer clear rules that apply equally to everyone.",
    "Fairness and equality are extremely important to me.",
    "I am uncomfortable when people receive special treatment.",
    "I strive to create predictable, transparent processes.",
  ],
  deliberative: [
    "I carefully consider the risks before making important decisions.",
    "I tend to anticipate obstacles and plan for them in advance.",
    "I prefer to think things through thoroughly before taking action.",
    "I am naturally cautious and take my time with big choices.",
    "I identify potential problems that others often overlook.",
  ],
  discipline: [
    "I create order and structure in my environment.",
    "I work best when I have routines and deadlines to follow.",
    "I break down projects into specific, manageable steps.",
    "I feel uncomfortable when things are disorganized or unpredictable.",
    "I impose structure to create predictability and precision.",
  ],
  focus: [
    "I am skilled at setting priorities and sticking to them.",
    "I can concentrate on goals without getting distracted.",
    "I help others stay on track toward important objectives.",
    "I filter out activities that don't align with my main priorities.",
    "Once I set a direction, I follow through with determination.",
  ],
  responsibility: [
    "When I commit to something, I follow through no matter what.",
    "I feel a strong sense of ownership for my promises and obligations.",
    "People know they can count on me to deliver what I say I will.",
    "I hold myself accountable even when no one is watching.",
    "I take psychological ownership of outcomes I'm involved in.",
  ],
  restorative: [
    "I enjoy figuring out what's wrong and fixing it.",
    "I am drawn to problems that others find frustrating.",
    "I get satisfaction from diagnosing issues and finding solutions.",
    "I notice things that are broken and feel compelled to repair them.",
    "Troubleshooting and problem-solving energize me.",
  ],

  // INFLUENCING
  activator: [
    "I am impatient to get started and make things happen.",
    "I believe action is the best way to learn and make progress.",
    "I push to begin projects even when plans aren't perfect.",
    "I energize others to stop talking and start doing.",
    "I would rather try something and adjust than wait for perfect conditions.",
  ],
  command: [
    "I naturally take charge in situations that need clear direction.",
    "I am comfortable making tough decisions that others avoid.",
    "I am not intimidated by confrontation when it's necessary.",
    "I have a strong presence that others notice and respond to.",
    "I bring clarity to confusing situations by stating things directly.",
  ],
  communication: [
    "I find it easy to put my thoughts into words that others understand.",
    "I enjoy presenting ideas and capturing people's attention.",
    "I use stories and examples to make information come alive.",
    "I can explain complex topics in ways that engage people.",
    "Conversations and public speaking come naturally to me.",
  ],
  competition: [
    "I constantly compare my performance to others.",
    "I am driven to outperform my peers and win.",
    "I pay attention to how I rank against other people.",
    "Contests and competitions bring out my best effort.",
    "I feel energized when I have someone to measure myself against.",
  ],
  maximizer: [
    "I prefer to focus on strengths rather than fix weaknesses.",
    "I am drawn to excellence and helping things reach their potential.",
    "I find it more rewarding to refine what's good than fix what's average.",
    "I notice when something good could become great with the right focus.",
    "I believe excellence is a better measure than merely meeting standards.",
  ],
  'self-assurance': [
    "I trust my own instincts when making decisions.",
    "I feel confident in my ability to take on challenges.",
    "I have an inner certainty that guides me, even when others doubt.",
    "I am comfortable taking calculated risks based on my judgment.",
    "I believe I can handle whatever situations come my way.",
  ],
  significance: [
    "I want to be recognized for my unique contributions.",
    "It's important to me that my work makes a real impact.",
    "I want to stand out and be seen as valuable by others.",
    "I am motivated by doing work that will be remembered.",
    "I seek opportunities to be recognized for my achievements.",
  ],
  woo: [
    "I enjoy meeting new people and making a good first impression.",
    "I can break the ice and start conversations easily with strangers.",
    "I feel energized after meeting and connecting with new people.",
    "I naturally draw people in and make them feel comfortable.",
    "I take pleasure in winning others over and building rapport quickly.",
  ],

  // RELATIONSHIP BUILDING
  adaptability: [
    "I go with the flow and respond well to unexpected changes.",
    "I live in the present moment rather than worrying about the future.",
    "I am comfortable when plans change at the last minute.",
    "I discover my future one day at a time rather than planning far ahead.",
    "I stay calm and flexible when things don't go as expected.",
  ],
  connectedness: [
    "I believe everything happens for a reason.",
    "I see how all people and events are linked in a larger picture.",
    "I feel a sense of connection to something bigger than myself.",
    "I believe my actions affect others in ways I may never see.",
    "I can bridge different groups because I see what connects them.",
  ],
  developer: [
    "I see potential in others that they often don't see in themselves.",
    "I get great satisfaction from helping others grow and improve.",
    "I notice and celebrate small signs of progress in people.",
    "I invest time in developing the abilities of others.",
    "I believe everyone has the capacity to grow and develop.",
  ],
  empathy: [
    "I can sense how others are feeling without them telling me.",
    "I naturally imagine myself in other people's situations.",
    "I am often the one people come to when they need to feel understood.",
    "I pick up on emotional cues that others seem to miss.",
    "I feel what others feel as if their emotions were my own.",
  ],
  harmony: [
    "I seek areas of agreement and common ground in conflicts.",
    "I try to reduce friction and build consensus among people.",
    "I am uncomfortable when there is tension or disagreement.",
    "I look for practical solutions that everyone can accept.",
    "I believe more can be accomplished through cooperation than conflict.",
  ],
  includer: [
    "I notice when someone is being left out and try to include them.",
    "I instinctively welcome outsiders and make them feel accepted.",
    "I believe everyone deserves a chance to be part of the group.",
    "I go out of my way to ensure all voices are heard.",
    "I create a sense of belonging for those who feel like outsiders.",
  ],
  individualization: [
    "I am intrigued by what makes each person unique.",
    "I customize my approach based on each person's individual qualities.",
    "I can figure out how different people can work together productively.",
    "I observe and appreciate the distinct strengths of each individual.",
    "I resist treating everyone the same because I value their uniqueness.",
  ],
  positivity: [
    "I bring energy and enthusiasm that lifts others' spirits.",
    "I naturally focus on what's good in any situation.",
    "I celebrate successes and look for reasons to be optimistic.",
    "My enthusiasm is contagious and gets others excited.",
    "I help people see the bright side even in difficult circumstances.",
  ],
  relator: [
    "I prefer deep relationships with a few people over many acquaintances.",
    "I am most comfortable with people I already know well.",
    "I invest heavily in close friendships and working relationships.",
    "I value genuine, authentic connections over surface-level interactions.",
    "I find deep satisfaction in working closely with trusted friends.",
  ],

  // STRATEGIC THINKING
  analytical: [
    "I require evidence and data before accepting claims.",
    "I naturally look for reasons, causes, and patterns.",
    "I challenge ideas by asking 'Prove it' or 'Why?'",
    "I am rigorous in my thinking and demand logical explanations.",
    "I analyze situations to understand how factors influence outcomes.",
  ],
  context: [
    "I look to the past to understand the present.",
    "I believe you can't plan the future without understanding history.",
    "I find value in studying how things came to be the way they are.",
    "I consider the background and precedents before making decisions.",
    "I learn from history to avoid repeating mistakes.",
  ],
  futuristic: [
    "I am inspired by what could be possible in the future.",
    "I often imagine and describe vivid visions of what lies ahead.",
    "I get energized thinking about future possibilities.",
    "I inspire others by painting pictures of a better tomorrow.",
    "I naturally think long-term and anticipate future needs.",
  ],
  ideation: [
    "I am fascinated by ideas and love brainstorming.",
    "I find connections between things that seem unrelated.",
    "I get excited when I come up with a new concept or approach.",
    "I thrive when generating creative solutions to problems.",
    "I am drawn to innovative thinking and fresh perspectives.",
  ],
  input: [
    "I have a craving to collect and learn new information.",
    "I often archive resources, articles, or facts for future use.",
    "I am the person people come to when they need information.",
    "I find value in gathering knowledge, even if the use isn't clear yet.",
    "I love researching and accumulating insights on topics that interest me.",
  ],
  intellection: [
    "I enjoy time alone to think and reflect.",
    "I process ideas deeply through extended mental activity.",
    "I appreciate intellectual discussions and mental challenges.",
    "I am introspective and spend considerable time in thought.",
    "Thinking is one of my favorite activities.",
  ],
  learner: [
    "I am energized by the process of learning something new.",
    "I continuously seek opportunities to grow and improve.",
    "I enjoy the journey of learning as much as the outcome.",
    "I thrive when taking on new challenges that require me to learn.",
    "I embrace new subjects and skills with enthusiasm.",
  ],
  strategic: [
    "I quickly see patterns and the best path forward in complex situations.",
    "I can anticipate obstacles and find ways around them.",
    "I instinctively generate multiple alternatives before deciding.",
    "I sort through clutter to find the core issue and the optimal route.",
    "I think several steps ahead and see where different choices lead.",
  ],
};

// Generate all 170 questions with shuffled order
export function generateQuestions(): Question[] {
  const questions: Question[] = [];
  let questionId = 1;

  STRENGTHS.forEach(strength => {
    const templates = QUESTION_TEMPLATES[strength.id];
    if (templates) {
      templates.forEach(text => {
        questions.push({
          id: questionId++,
          strengthId: strength.id,
          text,
        });
      });
    }
  });

  // Shuffle questions so same-strength questions aren't adjacent
  return shuffleArray(questions);
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    // Use a seeded shuffle for consistency
    const j = Math.floor(seededRandom(i) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Simple seeded random for consistent shuffle
let seed = 12345;
function seededRandom(max: number): number {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

// Pre-generate and export the shuffled questions
export const QUESTIONS = generateQuestions();
