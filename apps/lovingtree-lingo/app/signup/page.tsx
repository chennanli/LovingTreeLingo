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

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    if (!email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp({ email, password })
      
      if (error) {
        setError(error.message || 'An error occurred during signup')
      } else {
        setSuccess(true)
        // Note: In development, Supabase might auto-confirm
        // In production, user would need to confirm email first
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
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
            Join LovingTree Lingo
          </Heading>
          
          <Text textAlign="center" color="gray.600">
            Create your account and start learning Chinese
          </Text>

          {error && (
            <Box bg="red.50" color="red.600" p={3} borderRadius="md" borderWidth="1px" borderColor="red.200">
              {error}
            </Box>
          )}

          {success && (
            <Box bg="green.50" color="green.600" p={3} borderRadius="md" borderWidth="1px" borderColor="green.200">
              Account created successfully! Redirecting to dashboard...
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
                  placeholder="Create a password (min 6 characters)"
                  size="lg"
                  required
                />
              </Box>

              <Box w="full">
                <Text mb={2} fontWeight="medium">Confirm Password</Text>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
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
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" color="gray.600">
            Already have an account?{' '}
            <ChakraLink as={Link} href="/login" color="teal.600" fontWeight="semibold">
              Sign in here
            </ChakraLink>
          </Text>
        </VStack>
      </Box>
    </Container>
  )
}