'use client'

import { useState, useEffect } from 'react'
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
  Spinner,
} from '@chakra-ui/react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

interface Character {
  id: string
  character: string
  pinyin: string
  meaning: string
  stroke_count: number
  difficulty_level: number
}

export default function LibraryPage() {
  const { user, signOut } = useAuth()
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCharacters()
  }, [])

  const fetchCharacters = async () => {
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('difficulty_level', { ascending: true })
        .order('stroke_count', { ascending: true })

      if (error) {
        // If table doesn't exist or any database error, show sample data
        console.log('Database error, using sample data:', error.message)
        setCharacters(getSampleCharacters())
      } else {
        setCharacters(data || [])
      }
    } catch (err) {
      console.log('Fetch error, using sample data:', err)
      setCharacters(getSampleCharacters())
    } finally {
      setLoading(false)
    }
  }

  const getSampleCharacters = () => [
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

  const handleSignOut = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <VStack>
          <Spinner size="xl" color="teal.500" />
          <Text>Loading characters...</Text>
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
              Character Library
            </Heading>
            <Text color="gray.600">Choose a character to start learning</Text>
          </Box>
          <HStack>
            <Link href="/practice">
              <Button colorScheme="teal">
                Practice Quiz
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">
                Dashboard
              </Button>
            </Link>
            <Button onClick={handleSignOut} colorScheme="red" variant="outline">
              Sign Out
            </Button>
          </HStack>
        </HStack>

        {error && (
          <Box bg="red.50" color="red.600" p={4} borderRadius="md" borderWidth="1px" borderColor="red.200" mb={6}>
            {error}
          </Box>
        )}

        {characters.length === 0 ? (
          <Box bg="white" p={8} borderRadius="lg" textAlign="center">
            <Text fontSize="lg" color="gray.600">
              No characters available yet. Check back soon!
            </Text>
          </Box>
        ) : (
          <>
            <Text fontSize="sm" color="gray.500" mb={4}>
              {characters.length} characters available
              {characters.some(c => c.id === '1') && ' (Sample data - database not yet configured)'}
            </Text>
            
            <Grid 
              templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }}
              gap={4}
            >
              {characters.map((char) => (
                <Link key={char.id} href={`/character/${char.id}`}>
                  <Box
                    bg="white"
                    p={6}
                    borderRadius="lg"
                    boxShadow="sm"
                    borderWidth="1px"
                    borderColor="gray.200"
                    textAlign="center"
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                      borderColor: 'teal.300',
                    }}
                  >
                    <Text fontSize="3xl" fontWeight="bold" color="gray.800" mb={2}>
                      {char.character}
                    </Text>
                    <Text fontSize="lg" color="teal.600" fontWeight="medium" mb={1}>
                      {char.pinyin}
                    </Text>
                    <Text fontSize="sm" color="gray.600" mb={3}>
                      {char.meaning}
                    </Text>
                    <HStack justify="center" fontSize="xs" color="gray.500">
                      <Text>{char.stroke_count} strokes</Text>
                      <Text>•</Text>
                      <Text>Level {char.difficulty_level}</Text>
                    </HStack>
                  </Box>
                </Link>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  )
}