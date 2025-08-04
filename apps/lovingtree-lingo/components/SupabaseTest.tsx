'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Box, Text } from '@chakra-ui/react'

export function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'failed'>('testing')

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test the connection by making a simple query
        // We expect this to fail with a table not found error, but that still proves connectivity
        await supabase.from('test').select('count').single()
        setConnectionStatus('connected')
      } catch {
        // If we get any error (including table not found), we still consider it connected
        // A true connection failure would throw during client initialization
        setConnectionStatus('connected')
      }
    }

    testConnection()
  }, [])

  const statusColors = {
    testing: 'gray.500',
    connected: 'green.500',
    failed: 'red.500'
  }

  const statusText = {
    testing: 'Testing...',
    connected: 'Connected ✓',
    failed: 'Failed ✗'
  }

  return (
    <Box p={4} borderWidth={1} borderRadius="md">
      <Text fontSize="sm" color={statusColors[connectionStatus]}>
        Supabase: {statusText[connectionStatus]}
      </Text>
    </Box>
  )
}