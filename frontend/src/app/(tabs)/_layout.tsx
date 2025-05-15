import { Slot } from 'expo-router'
import { ApiProvider } from '../../context/ApiContext'

export default function Layout() {
  return (
    <ApiProvider>
      <Slot />
    </ApiProvider>
  )
}
