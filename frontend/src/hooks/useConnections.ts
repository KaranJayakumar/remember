import { useQuery } from '@tanstack/react-query'
import { useApi } from './useApi'

export const useConnections = () => {
  const { getConnections } = useApi()

  const { data: connections, isLoading } = useQuery({
    queryKey: ['connections'],
    queryFn: () => {
      console.log("Fetching")
      return getConnections()
    },
  })

  return {
    connections,
    isLoading
  }
}

