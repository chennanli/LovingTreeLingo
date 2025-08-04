'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Box,
  Button,
  Container,
  Input,
  VStack,
  Text,
  Heading,
  Link as ChakraLink,
} from '@chakra-ui/react'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const { user, error } = await signIn({ email, password })
      
      if (error) {
        setError(error.message || 'An error occurred during login')
      } else if (user) {
        router.push('/dashboard')
      }
    } catch {
      setError('An unexpected error occurred')
    }
    
    setLoading(false)
  }

  return (
    <Container maxW="md" py={8}>
      <Box bg="white" p={8} borderRadius="lg" boxShadow="lg">
        <VStack gap={6} align="stretch">
          <Heading textAlign="center" size="lg" color="teal.600">
            Welcome Back to LovingTree Lingo
          </Heading>
          
          <Text textAlign="center" color="gray.600">
            Sign in to continue your Chinese learning journey
          </Text>

          {error && (
            <Box bg="red.50" color="red.600" p={3} borderRadius="md" borderWidth="1px" borderColor="red.200">
              {error}
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <VStack gap={4}>
              <Box w="full">
                <Text mb={2} fontWeight="medium">Email</Text>
                <Input
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  size="lg"
                  required
                />
              </Box>

              <Box w="full">
                <Text mb={2} fontWeight="medium">Password</Text>
                <Input
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  size="lg"
                  required
                />
              </Box>

              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                width="full"
                loading={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" color="gray.600">
            Don&apos;t have an account?{' '}
            <ChakraLink as={Link} href="/signup" color="teal.600" fontWeight="semibold">
              Sign up here
            </ChakraLink>
          </Text>
        </VStack>
      </Box>
    </Container>
  )
}