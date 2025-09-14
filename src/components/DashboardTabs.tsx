"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideIcon } from "lucide-react";

interface TabItem {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface DashboardTabsProps {
  items: TabItem[];
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export default function DashboardTabs({
  items,
  activeTab,
  setActiveTab,
}: DashboardTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="relative py-4">
        <div className="overflow-x-auto no-scrollbar">
          <TabsList className="flex min-w-max gap-2 px-2">
            {items.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-md flex-shrink-0 data-[state=active]:bg-card data-[state=active]:shadow-soft"
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="text-sm">{item.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>
    </Tabs>
  );
}
