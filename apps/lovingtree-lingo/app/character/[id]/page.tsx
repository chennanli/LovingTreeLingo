'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Grid,
  GridItem,
  Spinner,
  Badge,
} from '@chakra-ui/react'
import { useAuth } from '../../../hooks/useAuth'
import { supabase } from '../../../lib/supabase'

interface Character {
  id: string
  character: string
  pinyin: string
  meaning: string
  stroke_count: number
  difficulty_level: number
  stroke_order?: string
  example_words?: VocabularyWord[]
}

interface VocabularyWord {
  id: string
  word: string
  pinyin: string
  meaning: string
}

export default function CharacterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [character, setCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const characterId = params.id as string

  useEffect(() => {
    if (characterId) {
      fetchCharacterDetails()
    }
  }, [characterId])

  const fetchCharacterDetails = async () => {
    try {
      // Try to fetch from database first
      const { data, error } = await supabase
        .from('characters')
        .select(`
          *,
          character_vocabulary (
            id,
            word,
            pinyin,
            meaning
          )
        `)
        .eq('id', characterId)
        .single()

      if (error) {
        // If database doesn't exist, use sample data
        if (error.message.includes('relation "characters" does not exist')) {
          const sampleChar = getSampleCharacter(characterId)
          if (sampleChar) {
            setCharacter(sampleChar)
          } else {
            setError('Character not found')
          }
        } else {
          setError('Failed to load character: ' + error.message)
        }
      } else {
        setCharacter({
          ...data,
          example_words: data.character_vocabulary || []
        })
      }
    } catch (err) {
      setError('An error occurred while loading the character')
    } finally {
      setLoading(false)
    }
  }

  const getSampleCharacter = (id: string): Character | null => {
    const sampleCharacters: Record<string, Character> = {
      '1': {
        id: '1',
        character: '你',
        pinyin: 'nǐ',
        meaning: 'you',
        stroke_count: 7,
        difficulty_level: 1,
        stroke_order: 'A visual stroke order diagram would appear here',
        example_words: [
          { id: '1', word: '你好', pinyin: 'nǐ hǎo', meaning: 'hello' },
          { id: '2', word: '你们', pinyin: 'nǐ men', meaning: 'you (plural)' },
          { id: '3', word: '你的', pinyin: 'nǐ de', meaning: 'your' }
        ]
      },
      '2': {
        id: '2',
        character: '好',
        pinyin: 'hǎo',
        meaning: 'good',
        stroke_count: 6,
        difficulty_level: 1,
        stroke_order: 'A visual stroke order diagram would appear here',
        example_words: [
          { id: '4', word: '你好', pinyin: 'nǐ hǎo', meaning: 'hello' },
          { id: '5', word: '很好', pinyin: 'hěn hǎo', meaning: 'very good' },
          { id: '6', word: '好的', pinyin: 'hǎo de', meaning: 'okay' }
        ]
      },
      '3': {
        id: '3',
        character: '我',
        pinyin: 'wǒ',
        meaning: 'I, me',
        stroke_count: 7,
        difficulty_level: 1,
        stroke_order: 'A visual stroke order diagram would appear here',
        example_words: [
          { id: '7', word: '我是', pinyin: 'wǒ shì', meaning: 'I am' },
          { id: '8', word: '我的', pinyin: 'wǒ de', meaning: 'my' },
          { id: '9', word: '我们', pinyin: 'wǒ men', meaning: 'we' }
        ]
      }
    }
    return sampleCharacters[id] || null
  }

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <VStack>
          <Spinner size="xl" color="teal.500" />
          <Text>Loading character details...</Text>
        </VStack>
      </Box>
    )
  }

  if (error || !character) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="4xl" py={8}>
          <VStack spacing={6}>
            <Box bg="red.50" color="red.600" p={4} borderRadius="md" borderWidth="1px" borderColor="red.200">
              {error || 'Character not found'}
            </Box>
            <Link href="/library">
              <Button colorScheme="teal">
                ← Back to Library
              </Button>
            </Link>
          </VStack>
        </Container>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="4xl" py={8}>
        {/* Header */}
        <HStack justify="space-between" mb={8}>
          <Link href="/library">
            <Button variant="outline">
              ← Back to Library
            </Button>
          </Link>
          <HStack>
            <Link href="/practice">
              <Button colorScheme="teal">
                Practice Quiz
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </HStack>
        </HStack>

        {/* Character Details */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
          {/* Main Character Display */}
          <GridItem>
            <Box bg="white" p={8} borderRadius="lg" boxShadow="sm" borderWidth="1px" textAlign="center">
              <Text fontSize="8xl" fontWeight="bold" color="gray.800" mb={4}>
                {character.character}
              </Text>
              <Text fontSize="2xl" color="teal.600" fontWeight="medium" mb={2}>
                {character.pinyin}
              </Text>
              <Text fontSize="lg" color="gray.600" mb={6}>
                {character.meaning}
              </Text>
              <HStack justify="center" spacing={4}>
                <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
                  {character.stroke_count} strokes
                </Badge>
                <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
                  Level {character.difficulty_level}
                </Badge>
              </HStack>
            </Box>
          </GridItem>

          {/* Stroke Order */}
          <GridItem>
            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
              <Heading size="md" mb={4} color="gray.800">
                Stroke Order
              </Heading>
              <Box 
                bg="gray.100" 
                p={8} 
                borderRadius="md" 
                textAlign="center"
                border="2px dashed gray.300"
                minH="200px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <VStack>
                  <Text color="gray.600" fontSize="lg" fontWeight="medium">
                    Stroke Order Animation
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    {character.stroke_order || 'Interactive stroke order animation will be implemented here'}
                  </Text>
                </VStack>
              </Box>
            </Box>
          </GridItem>
        </Grid>

        {/* Vocabulary Examples */}
        {character.example_words && character.example_words.length > 0 && (
          <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" mt={8}>
            <Heading size="md" mb={6} color="gray.800">
              Example Vocabulary
            </Heading>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
              {character.example_words.map((word) => (
                <Box
                  key={word.id}
                  p={4}
                  bg="gray.50"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="gray.200"
                >
                  <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={1}>
                    {word.word}
                  </Text>
                  <Text fontSize="md" color="teal.600" mb={1}>
                    {word.pinyin}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {word.meaning}
                  </Text>
                </Box>
              ))}
            </Grid>
          </Box>
        )}

        {/* Learning Actions */}
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" mt={8}>
          <Heading size="md" mb={4} color="gray.800">
            Start Learning
          </Heading>
          <HStack spacing={4}>
            <Link href="/practice">
              <Button colorScheme="teal" size="lg">
                Take Quiz
              </Button>
            </Link>
            <Button variant="outline" size="lg" disabled>
              Practice Writing
            </Button>
            <Button variant="outline" size="lg" disabled>
              Listen to Pronunciation
            </Button>
          </HStack>
          <Text fontSize="xs" color="gray.500" mt={2}>
            Quiz feature is now available! Other interactive features coming soon.
          </Text>
        </Box>
      </Container>
    </Box>
  )
}