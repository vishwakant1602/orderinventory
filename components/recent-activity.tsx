import { ScrollArea } from "@/components/ui/scroll-area"

// Mock activity data
const activities = [
  {
    id: 1,
    type: "order",
    action: "created",
    subject: "Order #ORD-002",
    timestamp: "10 minutes ago",
    user: "Jane Smith",
  },
  {
    id: 2,
    type: "inventory",
    action: "updated",
    subject: "Product C",
    timestamp: "25 minutes ago",
    user: "Admin",
  },
  {
    id: 3,
    type: "order",
    action: "shipped",
    subject: "Order #ORD-001",
    timestamp: "1 hour ago",
    user: "System",
  },
  {
    id: 4,
    type: "inventory",
    action: "added",
    subject: "Product G",
    timestamp: "2 hours ago",
    user: "Admin",
  },
  {
    id: 5,
    type: "order",
    action: "completed",
    subject: "Order #ORD-005",
    timestamp: "3 hours ago",
    user: "System",
  },
  {
    id: 6,
    type: "inventory",
    action: "low_stock",
    subject: "Product F",
    timestamp: "4 hours ago",
    user: "System",
  },
  {
    id: 7,
    type: "order",
    action: "cancelled",
    subject: "Order #ORD-006",
    timestamp: "5 hours ago",
    user: "Diana Miller",
  },
  {
    id: 8,
    type: "inventory",
    action: "out_of_stock",
    subject: "Product D",
    timestamp: "6 hours ago",
    user: "System",
  },
  {
    id: 9,
    type: "order",
    action: "created",
    subject: "Order #ORD-008",
    timestamp: "7 hours ago",
    user: "Fiona Garcia",
  },
  {
    id: 10,
    type: "inventory",
    action: "updated",
    subject: "Product B",
    timestamp: "8 hours ago",
    user: "Admin",
  },
]

export function RecentActivity({ extended = false }) {
  const displayActivities = extended ? activities : activities.slice(0, 5)

  return (
    <ScrollArea className={extended ? "h-[400px]" : "h-[300px]"}>
      <div className="space-y-4 pr-3">
        {displayActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 rounded-md border p-3">
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                activity.type === "order" ? "bg-blue-100" : "bg-green-100"
              }`}
            >
              {activity.type === "order" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-5 w-5 ${
                    activity.action === "created"
                      ? "text-blue-600"
                      : activity.action === "shipped"
                        ? "text-purple-600"
                        : activity.action === "completed"
                          ? "text-green-600"
                          : "text-red-600"
                  }`}
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-5 w-5 ${
                    activity.action === "added"
                      ? "text-green-600"
                      : activity.action === "updated"
                        ? "text-blue-600"
                        : activity.action === "low_stock"
                          ? "text-yellow-600"
                          : "text-red-600"
                  }`}
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium">{activity.subject}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    activity.action === "created"
                      ? "bg-blue-100 text-blue-800"
                      : activity.action === "updated"
                        ? "bg-blue-100 text-blue-800"
                        : activity.action === "shipped"
                          ? "bg-purple-100 text-purple-800"
                          : activity.action === "completed"
                            ? "bg-green-100 text-green-800"
                            : activity.action === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : activity.action === "added"
                                ? "bg-green-100 text-green-800"
                                : activity.action === "low_stock"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                  }`}
                >
                  {activity.action.replace("_", " ")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {activity.user} - {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
