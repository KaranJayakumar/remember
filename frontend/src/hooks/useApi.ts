import { getConnections } from '../api/connections'
import { useApiContext } from '../context/ApiContext'
export function useApi() {
  const client = useApiContext()
  return {
    getConnections: () => getConnections(client),
  }
}
