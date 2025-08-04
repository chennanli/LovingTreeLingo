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
  Badge,
  Spinner,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Simple admin check - in a real app, this would check user roles from database
  useEffect(() => {
    if (user) {
      // For demo purposes, treat first user or specific emails as admin
      const adminEmails = ['admin@lovingtree.com', 'admin@example.com']
      const userIsAdmin = adminEmails.includes(user.email || '') || (user.email?.includes('admin') ?? false)
      setIsAdmin(userIsAdmin)
      setLoading(false)
      
      if (!userIsAdmin) {
        // Redirect non-admin users
        router.push('/dashboard')
      }
    } else {
      router.push('/login')
    }
  }, [user, router])

  const handleSignOut = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <VStack>
          <Spinner size="xl" color="teal.500" />
          <Text>Checking admin access...</Text>
        </VStack>
      </Box>
    )
  }

  if (!isAdmin) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <Box bg="red.50" color="red.600" p={4} borderRadius="md" borderWidth="1px" borderColor="red.200" maxW="md">
          <Text fontWeight="medium">Access denied. Admin privileges required.</Text>
        </Box>
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
              Admin Dashboard
            </Heading>
            <Text color="gray.600">System management and overview</Text>
          </Box>
          <HStack>
            <Link href="/dashboard">
              <Button variant="outline">
                User Dashboard
              </Button>
            </Link>
            <Button onClick={handleSignOut} colorScheme="red" variant="outline">
              Sign Out
            </Button>
          </HStack>
        </HStack>

        {/* Admin Alert */}
        <Box bg="blue.50" color="blue.700" p={4} borderRadius="md" borderWidth="1px" borderColor="blue.200" mb={6}>
          <Text fontWeight="medium">You are logged in as an administrator. Handle sensitive data with care.</Text>
        </Box>

        <VStack gap={6} align="stretch">
          {/* System Statistics */}
          <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
            <Heading size="md" mb={4}>
              System Overview
            </Heading>
            <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
              <Box textAlign="center" p={4} bg="blue.50" borderRadius="md">
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  12
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Total Characters
                </Text>
              </Box>
              <Box textAlign="center" p={4} bg="green.50" borderRadius="md">
                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                  15
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Total Users
                </Text>
              </Box>
              <Box textAlign="center" p={4} bg="purple.50" borderRadius="md">
                <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                  127
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Quiz Sessions
                </Text>
              </Box>
              <Box textAlign="center" p={4} bg="orange.50" borderRadius="md">
                <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                  85%
                </Text>
                <Text fontSize="sm" color="gray.600">
                  System Health
                </Text>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Recent Activity */}
          <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
            <Heading size="md" mb={4}>
              Recent User Activity
            </Heading>
            <VStack gap={3} align="stretch">
              <Box bg="gray.50" p={4} borderRadius="md">
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">user1@example.com</Text>
                    <Text fontSize="sm" color="gray.600">Completed Quiz - 85% score</Text>
                  </VStack>
                  <VStack align="end" spacing={1}>
                    <Badge colorScheme="green">Active</Badge>
                    <Text fontSize="xs" color="gray.500">2 hours ago</Text>
                  </VStack>
                </HStack>
              </Box>
              <Box bg="gray.50" p={4} borderRadius="md">
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">user2@example.com</Text>
                    <Text fontSize="sm" color="gray.600">Character Study</Text>
                  </VStack>
                  <VStack align="end" spacing={1}>
                    <Badge colorScheme="blue">Learning</Badge>
                    <Text fontSize="xs" color="gray.500">4 hours ago</Text>
                  </VStack>
                </HStack>
              </Box>
              <Box bg="gray.50" p={4} borderRadius="md">
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">user3@example.com</Text>
                    <Text fontSize="sm" color="gray.600">Completed Quiz - 92% score</Text>
                  </VStack>
                  <VStack align="end" spacing={1}>
                    <Badge colorScheme="green">Active</Badge>
                    <Text fontSize="xs" color="gray.500">1 day ago</Text>
                  </VStack>
                </HStack>
              </Box>
            </VStack>
          </Box>

          {/* Admin Actions */}
          <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
            <Heading size="md" mb={4}>
              Administration Tools
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              <Button colorScheme="blue" size="lg" isDisabled>
                Manage Characters
              </Button>
              <Button colorScheme="green" size="lg" isDisabled>
                Manage Vocabulary
              </Button>
              <Button colorScheme="purple" size="lg" isDisabled>
                User Management
              </Button>
              <Button colorScheme="orange" size="lg" isDisabled>
                System Settings
              </Button>
              <Button colorScheme="teal" size="lg" isDisabled>
                Export Data
              </Button>
              <Button colorScheme="red" size="lg" isDisabled>
                System Maintenance
              </Button>
            </SimpleGrid>
            <Text fontSize="xs" color="gray.500" mt={4}>
              Advanced admin features will be implemented in Stories 3.2 and 3.3
            </Text>
          </Box>

          {/* Database Status */}
          <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
            <Heading size="md" mb={4}>
              Database Status
            </Heading>
            <VStack align="start" gap={2}>
              <HStack>
                <Badge colorScheme="green">Connected</Badge>
                <Text fontSize="sm">Supabase Database</Text>
              </HStack>
              <HStack>
                <Badge colorScheme="yellow">Partial</Badge>
                <Text fontSize="sm">Quiz Results Tables (Setup Required)</Text>
              </HStack>
              <HStack>
                <Badge colorScheme="green">Active</Badge>
                <Text fontSize="sm">Authentication System</Text>
              </HStack>
              <HStack>
                <Badge colorScheme="blue">Ready</Badge>
                <Text fontSize="sm">Sample Data</Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}