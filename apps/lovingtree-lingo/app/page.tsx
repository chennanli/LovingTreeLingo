'use client'

import { 
  Box, 
  Container, 
  Stack,
  Heading, 
  Text, 
  Button,
  HStack
} from '@chakra-ui/react'
import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'

function BookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
      <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
    </svg>
  )
}

export default function Home() {
  const { user, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="md" py={8}>
        {/* Auth Navigation */}
        <HStack justify="space-between" mb={8}>
          <Text fontSize="sm" color="gray.600">
            {loading ? 'Loading...' : user ? `Welcome, ${user.email}` : 'Welcome!'}
          </Text>
          {!loading && (
            <HStack>
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button size="sm" colorScheme="teal">
                      Dashboard
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} size="sm" variant="outline">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button size="sm" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" colorScheme="teal">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </HStack>
          )}
        </HStack>

        <Stack gap={8} align="center" textAlign="center">
          <Box>
            <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
              <BookIcon />
              <Heading size="2xl" color="gray.800">
                LovingTree Lingo
              </Heading>
            </Box>
            <Text fontSize="xl" color="gray.600" maxW="2xl">
              Learn Chinese characters with our interactive, mobile-first approach.
              Master pinyin, stroke order, and vocabulary with personalized lessons.
            </Text>
          </Box>

          <Stack gap={4} w="full" maxW="sm">
            {user ? (
              <>
                <Link href="/library">
                  <Button 
                    colorScheme="teal" 
                    size="lg" 
                    w="full"
                  >
                    Character Library
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    w="full"
                  >
                    My Progress
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/signup">
                  <Button 
                    colorScheme="teal" 
                    size="lg" 
                    w="full"
                  >
                    Start Learning Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    w="full"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </Stack>

          <Box pt={8} borderTopWidth="1px" borderColor="gray.200" w="full">
            <Text fontSize="sm" color="gray.500">
              Built with Next.js, Chakra UI, and Supabase
            </Text>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
