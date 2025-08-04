'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Container,
  VStack,
  Text,
  Heading,
  HStack,
  Flex,
  SimpleGrid,
  Progress,
} from '@chakra-ui/react'
import { 
  generateQuiz, 
  calculateQuizResult, 
  getPerformanceMessage,
  type QuizQuestion, 
  type QuizAnswer, 
  type QuizResult 
} from '../../lib/quiz'
import { saveQuizResult, checkDatabaseSetup } from '../../lib/database'
import { useAuth } from '../../hooks/useAuth'

export default function PracticePage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [startTime, setStartTime] = useState<number>(0)
  const [questionStartTime, setQuestionStartTime] = useState<number>(0)
  const [savingResult, setSavingResult] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ success?: boolean; message?: string } | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  // Initialize quiz
  useEffect(() => {
    const newQuestions = generateQuiz([], 10) // Use sample data, 10 questions
    setQuestions(newQuestions)
    setStartTime(Date.now())
    setQuestionStartTime(Date.now())
  }, [])

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return // Prevent changing answer after feedback
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return

    const timeSpent = Date.now() - questionStartTime
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent
    }

    setAnswers(prev => [...prev, newAnswer])
    setShowFeedback(true)
  }

  const handleNextQuestion = async () => {
    if (isLastQuestion) {
      // Calculate final results
      const finalAnswers = [...answers, {
        questionId: currentQuestion.id,
        selectedAnswer: selectedAnswer || '',
        isCorrect: selectedAnswer === currentQuestion.correctAnswer,
        timeSpent: Date.now() - questionStartTime
      }]
      const result = calculateQuizResult(questions, finalAnswers)
      setQuizResult(result)

      // Save result to database if user is authenticated
      if (user) {
        setSavingResult(true)
        setSaveStatus(null)
        
        try {
          const { success, error } = await saveQuizResult(user.id, result, questions)
          if (success) {
            if (error) {
              setSaveStatus({ success: true, message: `Saved with warning: ${error}` })
            } else {
              setSaveStatus({ success: true, message: 'Quiz result saved successfully!' })
            }
          } else {
            setSaveStatus({ success: false, message: error || 'Failed to save quiz result' })
          }
        } catch (_error) {
          setSaveStatus({ success: false, message: 'An unexpected error occurred while saving' })
        } finally {
          setSavingResult(false)
        }
      }
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
      setQuestionStartTime(Date.now())
    }
  }

  const handleTryAgain = () => {
    // Reset quiz state
    const newQuestions = generateQuiz([], 10)
    setQuestions(newQuestions)
    setCurrentQuestionIndex(0)
    setAnswers([])
    setSelectedAnswer(null)
    setShowFeedback(false)
    setQuizResult(null)
    setSavingResult(false)
    setSaveStatus(null)
    setStartTime(Date.now())
    setQuestionStartTime(Date.now())
  }

  const handleBackToLibrary = () => {
    router.push('/library')
  }

  // Loading state
  if (questions.length === 0) {
    return (
      <Container maxW="4xl" py={8}>
        <Box textAlign="center">
          <Text>Loading quiz...</Text>
        </Box>
      </Container>
    )
  }

  // Results screen
  if (quizResult) {
    return (
      <Container maxW="4xl" py={8}>
        <Box bg="white" p={8} borderRadius="lg" boxShadow="lg">
          <VStack gap={6} align="stretch">
            <Heading textAlign="center" size="lg" color="teal.600">
              Quiz Complete! 🎉
            </Heading>

            <Box textAlign="center">
              <Text fontSize="6xl" fontWeight="bold" color="teal.500">
                {quizResult.percentage}%
              </Text>
              <Text fontSize="lg" color="gray.600">
                {quizResult.correctAnswers} out of {quizResult.totalQuestions} correct
              </Text>
            </Box>

            <Box bg="blue.50" p={4} borderRadius="md" textAlign="center">
              <Text fontSize="lg" fontWeight="medium" color="blue.800">
                {getPerformanceMessage(quizResult.percentage)}
              </Text>
            </Box>

            {/* Save Status */}
            {savingResult && (
              <Box bg="yellow.50" p={3} borderRadius="md" textAlign="center" borderWidth="1px" borderColor="yellow.200">
                <Text fontSize="sm" color="yellow.700">
                  Saving your results...
                </Text>
              </Box>
            )}

            {saveStatus && (
              <Box 
                bg={saveStatus.success ? "green.50" : "red.50"} 
                p={3} 
                borderRadius="md" 
                textAlign="center"
                borderWidth="1px"
                borderColor={saveStatus.success ? "green.200" : "red.200"}
              >
                <Text fontSize="sm" color={saveStatus.success ? "green.700" : "red.700"}>
                  {saveStatus.message}
                </Text>
              </Box>
            )}

            {!user && (
              <Box bg="gray.50" p={3} borderRadius="md" textAlign="center" borderWidth="1px" borderColor="gray.200">
                <Text fontSize="sm" color="gray.600">
                  Sign in to save your quiz results and track progress over time.
                </Text>
              </Box>
            )}

            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3}>
                Review your answers:
              </Text>
              <VStack gap={3} align="stretch">
                {questions.map((question, index) => {
                  const answer = quizResult.answers[index]
                  return (
                    <Box 
                      key={question.id} 
                      p={3} 
                      borderRadius="md" 
                      bg={answer.isCorrect ? 'green.50' : 'red.50'}
                      borderWidth="1px"
                      borderColor={answer.isCorrect ? 'green.200' : 'red.200'}
                    >
                      <HStack justify="space-between" align="start">
                        <Box flex={1}>
                          <Text fontSize="sm" fontWeight="medium">
                            Q{index + 1}: {question.question}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            Your answer: {answer.selectedAnswer}
                          </Text>
                          {!answer.isCorrect && (
                            <Text fontSize="sm" color="green.600">
                              Correct answer: {question.correctAnswer}
                            </Text>
                          )}
                        </Box>
                        <Text fontSize="sm" color={answer.isCorrect ? 'green.600' : 'red.600'}>
                          {answer.isCorrect ? '✓' : '✗'}
                        </Text>
                      </HStack>
                    </Box>
                  )
                })}
              </VStack>
            </Box>

            <HStack gap={4} justify="center">
              <Button colorScheme="teal" onClick={handleTryAgain}>
                Try Again
              </Button>
              <Button variant="outline" onClick={handleBackToLibrary}>
                Back to Library
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Container>
    )
  }

  // Quiz interface  
  return (
    <Container maxW="4xl" py={8}>
      <Box bg="white" p={8} borderRadius="lg" boxShadow="lg">
        <VStack gap={6} align="stretch">
          {/* Header */}
          <Flex justify="space-between" align="center">
            <Heading size="md" color="teal.600">
              Chinese Practice Quiz
            </Heading>
            <Text color="gray.600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Text>
          </Flex>

          {/* Progress bar */}
          <Progress.Root value={progress} colorScheme="teal" size="sm" borderRadius="full">
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>

          {/* Question */}
          <Box textAlign="center" py={6}>
            <Text fontSize="2xl" fontWeight="bold" mb={4} color="gray.800">
              {currentQuestion.question}
            </Text>
            
            {/* Show the character being asked about */}
            {currentQuestion.type !== 'meaning-to-character' && (
              <Text fontSize="6xl" fontWeight="bold" color="teal.600" mb={4}>
                {currentQuestion.character.character}
              </Text>
            )}
          </Box>

          {/* Answer options */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option
              const isCorrect = option === currentQuestion.correctAnswer
              const isWrong = showFeedback && isSelected && !isCorrect
              
              let bgColor = 'gray.50'
              let borderColor = 'gray.200'
              let textColor = 'gray.800'
              
              if (showFeedback) {
                if (isCorrect) {
                  bgColor = 'green.50'
                  borderColor = 'green.200'
                  textColor = 'green.700'
                } else if (isWrong) {
                  bgColor = 'red.50'
                  borderColor = 'red.200'
                  textColor = 'red.700'
                }
              } else if (isSelected) {
                bgColor = 'teal.50'
                borderColor = 'teal.200'
                textColor = 'teal.700'
              }

              return (
                <Box
                  key={index}
                  p={4}
                  borderRadius="md"
                  borderWidth="2px"
                  borderColor={borderColor}
                  bg={bgColor}
                  cursor="pointer"
                  transition="all 0.2s"
                  onClick={() => handleAnswerSelect(option)}
                  _hover={!showFeedback ? { borderColor: 'teal.300', bg: 'teal.25' } : {}}
                >
                  <Text 
                    fontSize="lg" 
                    fontWeight="medium" 
                    textAlign="center"
                    color={textColor}
                  >
                    {option}
                  </Text>
                  {showFeedback && isCorrect && (
                    <Text textAlign="center" fontSize="sm" color="green.600" mt={2}>
                      ✓ Correct!
                    </Text>
                  )}
                  {showFeedback && isWrong && (
                    <Text textAlign="center" fontSize="sm" color="red.600" mt={2}>
                      ✗ Incorrect
                    </Text>
                  )}
                </Box>
              )
            })}
          </SimpleGrid>

          {/* Action buttons */}
          <HStack justify="center" gap={4}>
            {!showFeedback ? (
              <Button
                colorScheme="teal"
                size="lg"
                onClick={handleSubmitAnswer}
                isDisabled={!selectedAnswer}
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                colorScheme="teal"
                size="lg"
                onClick={handleNextQuestion}
              >
                {isLastQuestion ? 'View Results' : 'Next Question'}
              </Button>
            )}
            
            <Button variant="outline" onClick={handleBackToLibrary}>
              Back to Library
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Container>
  )
}