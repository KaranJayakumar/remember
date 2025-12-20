import { TabList } from "expo-router/ui"
import { ReactNode } from "react"

interface Props{
  children : ReactNode
}
export const CustomTabList = ({children} : Props) => {
  return (
    <TabList className="justify-center gap-x-4">
      {children}
    </TabList>
  )
}

