'use client'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Exchange from "./Exchange"
import { useState } from "react"


export function ExchangeTabs() {
    const [activeTab, setActiveTab] = useState("fixed")
    const activeTabStyle = "text-white"; // Style for active tab
  const inactiveTabStyle = "text-white"; // Style for inactive tabs
  return (
    <Tabs defaultValue="fixed" className="w-full" onValueChange={(value) => {
        setActiveTab(value)
    }}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger className={`${activeTab === "fixed" ? activeTabStyle : inactiveTabStyle}`} value="fixed">Fixed Rate</TabsTrigger>
        <TabsTrigger className={`${activeTab === "fixed" ? activeTabStyle : inactiveTabStyle}`} value="variable">Variable Rate</TabsTrigger>
      </TabsList>
      <TabsContent value="fixed" className="mt-8">
        <Exchange />
      </TabsContent>
      <TabsContent value="variable">
        
      </TabsContent>
    </Tabs>
  )
}
