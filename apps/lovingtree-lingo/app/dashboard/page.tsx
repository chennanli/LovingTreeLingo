'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  SimpleGrid,
  Spinner,
  Badge,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'
import { getUserStats } from '../../lib/database'
import type { UserStats } from '../../lib/database'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchUserStats()
    } else {
      setLoading(false)
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserStats = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      setError(null)
      const { stats: userStats, error: statsError } = await getUserStats(user.id)
      
      if (statsError) {
        setError(statsError)
      } else {
        setStats(userStats)
      }
    } catch (_err) {
      setError('Failed to load progress data')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your learning streak today! 🎯"
    if (streak === 1) return "Great start! Keep it going! 🌟"
    if (streak < 7) return `${streak} days strong! 🔥`
    if (streak < 30) return `Amazing ${streak}-day streak! 🏆`
    return `Incredible ${streak}-day streak! You're a champion! 🎉`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <VStack>
          <Spinner size="xl" color="teal.500" />
          <Text>Loading your progress...</Text>
        </VStack>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="6xl" py={8}>
        {/* Header */}
        <HStack justify="space-between" mb={8}>
          <Box>
            <Heading size="lg" color="gray.800">
              Welcome back!
            </Heading>
            <Text color="gray.600">{user?.email}</Text>
          </Box>
          <HStack>
            <Link href="/">
              <Button variant="outline">
                Home
              </Button>
            </Link>
            <Button onClick={handleSignOut} colorScheme="red" variant="outline">
              Sign Out
            </Button>
          </HStack>
        </HStack>

        {error && (
          <Box bg="yellow.50" p={4} borderRadius="md" borderWidth="1px" borderColor="yellow.200" mb={6}>
            <Text color="yellow.700" fontSize="sm">
              {error} - Using sample data for demo purposes.
            </Text>
          </Box>
        )}

        {/* Progress Statistics */}
        {stats && stats.totalQuizzes > 0 ? (
          <VStack gap={6} align="stretch">
            {/* Streak Message */}
            <Box bgGradient="linear(to-r, teal.500, blue.500)" p={6} borderRadius="lg" color="white" textAlign="center">
              <Text fontSize="lg" fontWeight="bold">
                {getStreakMessage(stats.currentStreak)}
              </Text>
            </Box>

            {/* Stats Grid */}
            <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
              <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="teal.600">
                  {stats.totalQuizzes}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Quizzes Completed
                </Text>
              </Box>

              <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  {stats.averageScore}%
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Average Score
                </Text>
              </Box>

              <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                  {stats.bestScore}%
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Best Score
                </Text>
              </Box>

              <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                  {stats.totalCharactersPracticed}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Characters Practiced
                </Text>
              </Box>
            </SimpleGrid>

            {/* Recent Activity */}
            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
              <Heading size="md" mb={4}>
                Recent Quiz Results
              </Heading>
              {stats.recentQuizzes.length > 0 ? (
                <VStack gap={3} align="stretch">
                  {stats.recentQuizzes.map((quiz, index) => (
                    <HStack key={quiz.id} justify="space-between" p={3} bg="gray.50" borderRadius="md">
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="medium">
                          Quiz #{stats.totalQuizzes - index}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {formatDate(quiz.created_at)}
                        </Text>
                      </VStack>
                      <HStack>
                        <Badge 
                          colorScheme={quiz.percentage >= 80 ? "green" : quiz.percentage >= 60 ? "yellow" : "red"}
                          fontSize="sm"
                        >
                          {quiz.percentage}%
                        </Badge>
                        <Text fontSize="sm" color="gray.600">
                          {quiz.correct_answers}/{quiz.total_questions}
                        </Text>
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
              ) : (
                <Text color="gray.600">No recent quiz results</Text>
              )}
            </Box>

            {/* Quick Actions */}
            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
              <Heading size="md" mb={4}>
                Continue Learning
              </Heading>
              <HStack gap={4}>
                <Link href="/practice">
                  <Button colorScheme="teal" size="lg">
                    Take Another Quiz
                  </Button>
                </Link>
                <Link href="/library">
                  <Button variant="outline" size="lg">
                    Browse Characters
                  </Button>
                </Link>
              </HStack>
            </Box>
          </VStack>
        ) : (
          /* New User Experience */
          <VStack gap={6} align="stretch">
            <Box bg="white" p={8} borderRadius="lg" boxShadow="sm" borderWidth="1px" textAlign="center">
              <Heading size="lg" mb={4} color="teal.600">
                Welcome to LovingTree Lingo! 🌸
              </Heading>
              <Text fontSize="lg" color="gray.600" mb={6}>
                Ready to start your Chinese learning journey? Take your first quiz to begin tracking your progress!
              </Text>
              <VStack gap={4} maxW="md" mx="auto">
                <Link href="/practice" style={{ width: '100%' }}>
                  <Button colorScheme="teal" size="lg" width="full">
                    Take Your First Quiz
                  </Button>
                </Link>
                <Link href="/library" style={{ width: '100%' }}>
                  <Button variant="outline" size="lg" width="full">
                    Explore Characters
                  </Button>
                </Link>
              </VStack>
            </Box>

            <Box bg="blue.50" p={6} borderRadius="lg" borderWidth="1px" borderColor="blue.200">
              <Heading size="md" mb={3} color="blue.800">
                How it works
              </Heading>
              <VStack align="start" gap={2}>
                <HStack>
                  <Text fontWeight="bold" color="blue.600">1.</Text>
                  <Text>Browse our character library to see what you&apos;ll learn</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" color="blue.600">2.</Text>
                  <Text>Take quizzes to practice character recognition and meaning</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" color="blue.600">3.</Text>
                  <Text>Track your progress and build learning streaks</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" color="blue.600">4.</Text>
                  <Text>Master Chinese characters step by step!</Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        )}
      </Container>
    </Box>
  )
}