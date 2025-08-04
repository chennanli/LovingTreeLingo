export interface Character {
  id: string
  character: string
  pinyin: string
  meaning: string
  stroke_count: number
  difficulty_level: number
}

export interface QuizQuestion {
  id: string
  type: 'character-to-meaning' | 'character-to-pinyin' | 'meaning-to-character'
  question: string
  correctAnswer: string
  options: string[]
  character: Character
}

export interface QuizAnswer {
  questionId: string
  selectedAnswer: string
  isCorrect: boolean
  timeSpent: number
}

export interface QuizResult {
  totalQuestions: number
  correctAnswers: number
  percentage: number
  answers: QuizAnswer[]
  duration: number
}

// Sample characters for quiz generation
const SAMPLE_CHARACTERS: Character[] = [
  { id: '1', character: '你', pinyin: 'nǐ', meaning: 'you', stroke_count: 7, difficulty_level: 1 },
  { id: '2', character: '好', pinyin: 'hǎo', meaning: 'good', stroke_count: 6, difficulty_level: 1 },
  { id: '3', character: '我', pinyin: 'wǒ', meaning: 'I, me', stroke_count: 7, difficulty_level: 1 },
  { id: '4', character: '是', pinyin: 'shì', meaning: 'to be', stroke_count: 9, difficulty_level: 1 },
  { id: '5', character: '的', pinyin: 'de', meaning: 'possessive particle', stroke_count: 8, difficulty_level: 1 },
  { id: '6', character: '人', pinyin: 'rén', meaning: 'person', stroke_count: 2, difficulty_level: 1 },
  { id: '7', character: '中', pinyin: 'zhōng', meaning: 'middle, China', stroke_count: 4, difficulty_level: 1 },
  { id: '8', character: '国', pinyin: 'guó', meaning: 'country', stroke_count: 8, difficulty_level: 1 },
  { id: '9', character: '大', pinyin: 'dà', meaning: 'big', stroke_count: 3, difficulty_level: 1 },
  { id: '10', character: '学', pinyin: 'xué', meaning: 'study, learn', stroke_count: 8, difficulty_level: 1 },
  { id: '11', character: '生', pinyin: 'shēng', meaning: 'life, birth', stroke_count: 5, difficulty_level: 1 },
  { id: '12', character: '会', pinyin: 'huì', meaning: 'can, meeting', stroke_count: 6, difficulty_level: 2 },
]

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Generate wrong answers for multiple choice
 */
function generateWrongAnswers(
  correctAnswer: string,
  answerType: 'meaning' | 'pinyin' | 'character',
  allCharacters: Character[]
): string[] {
  const wrongAnswers: string[] = []
  const shuffledChars = shuffleArray(allCharacters.filter(c => {
    switch (answerType) {
      case 'meaning': return c.meaning !== correctAnswer
      case 'pinyin': return c.pinyin !== correctAnswer
      case 'character': return c.character !== correctAnswer
      default: return false
    }
  }))

  for (let i = 0; i < Math.min(3, shuffledChars.length); i++) {
    switch (answerType) {
      case 'meaning':
        wrongAnswers.push(shuffledChars[i].meaning)
        break
      case 'pinyin':
        wrongAnswers.push(shuffledChars[i].pinyin)
        break
      case 'character':
        wrongAnswers.push(shuffledChars[i].character)
        break
    }
  }

  // If we don't have enough wrong answers, add some generic ones
  while (wrongAnswers.length < 3) {
    switch (answerType) {
      case 'meaning':
        const genericMeanings = ['water', 'fire', 'tree', 'mountain', 'river', 'sun', 'moon']
        wrongAnswers.push(genericMeanings[wrongAnswers.length % genericMeanings.length])
        break
      case 'pinyin':
        const genericPinyin = ['má', 'tā', 'lái', 'qù', 'yǒu', 'méi', 'duō']
        wrongAnswers.push(genericPinyin[wrongAnswers.length % genericPinyin.length])
        break
      case 'character':
        const genericChars = ['水', '火', '木', '山', '河', '日', '月']
        wrongAnswers.push(genericChars[wrongAnswers.length % genericChars.length])
        break
    }
  }

  return wrongAnswers
}

/**
 * Generate a quiz question for a character
 */
function generateQuestion(character: Character, allCharacters: Character[]): QuizQuestion {
  const questionTypes: QuizQuestion['type'][] = [
    'character-to-meaning',
    'character-to-pinyin', 
    'meaning-to-character'
  ]
  
  const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)]
  const questionId = `${character.id}-${questionType}-${Date.now()}`

  switch (questionType) {
    case 'character-to-meaning':
      const meaningOptions = [
        character.meaning,
        ...generateWrongAnswers(character.meaning, 'meaning', allCharacters)
      ]
      return {
        id: questionId,
        type: questionType,
        question: `What does "${character.character}" mean?`,
        correctAnswer: character.meaning,
        options: shuffleArray(meaningOptions),
        character
      }

    case 'character-to-pinyin':
      const pinyinOptions = [
        character.pinyin,
        ...generateWrongAnswers(character.pinyin, 'pinyin', allCharacters)
      ]
      return {
        id: questionId,
        type: questionType,
        question: `How do you pronounce "${character.character}"?`,
        correctAnswer: character.pinyin,
        options: shuffleArray(pinyinOptions),
        character
      }

    case 'meaning-to-character':
      const characterOptions = [
        character.character,
        ...generateWrongAnswers(character.character, 'character', allCharacters)
      ]
      return {
        id: questionId,
        type: questionType,
        question: `Which character means "${character.meaning}"?`,
        correctAnswer: character.character,
        options: shuffleArray(characterOptions),
        character
      }

    default:
      throw new Error(`Unknown question type: ${questionType}`)
  }
}

/**
 * Generate a quiz with specified number of questions
 */
export function generateQuiz(
  characters: Character[] = SAMPLE_CHARACTERS,
  questionCount: number = 10
): QuizQuestion[] {
  const availableCharacters = characters.length > 0 ? characters : SAMPLE_CHARACTERS
  const shuffledCharacters = shuffleArray(availableCharacters)
  const selectedCharacters = shuffledCharacters.slice(0, Math.min(questionCount, shuffledCharacters.length))
  
  // If we need more questions than characters, repeat some characters
  while (selectedCharacters.length < questionCount) {
    const additionalChars = shuffleArray(availableCharacters).slice(0, questionCount - selectedCharacters.length)
    selectedCharacters.push(...additionalChars)
  }

  return selectedCharacters.map(char => generateQuestion(char, availableCharacters))
}

/**
 * Calculate quiz results
 */
export function calculateQuizResult(
  questions: QuizQuestion[],
  answers: QuizAnswer[]
): QuizResult {
  const correctAnswers = answers.filter(answer => answer.isCorrect).length
  const totalQuestions = questions.length
  const percentage = Math.round((correctAnswers / totalQuestions) * 100)
  const duration = answers.reduce((total, answer) => total + answer.timeSpent, 0)

  return {
    totalQuestions,
    correctAnswers,
    percentage,
    answers,
    duration
  }
}

/**
 * Get performance message based on score
 */
export function getPerformanceMessage(percentage: number): string {
  if (percentage >= 90) return "Excellent! 优秀! You're mastering Chinese characters!"
  if (percentage >= 80) return "Great job! 很好! You're doing really well!"
  if (percentage >= 70) return "Good work! 不错! Keep practicing!"
  if (percentage >= 60) return "Not bad! 还可以! You're making progress!"
  if (percentage >= 50) return "Keep trying! 加油! Practice makes perfect!"
  return "Don't give up! 别放弃! Every expert was once a beginner!"
}