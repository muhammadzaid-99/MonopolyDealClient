"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"

interface Notification {
  id: string
  message: string
  type: "info" | "success" | "warning" | "error"
  duration?: number
}

interface NotificationSystemProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
}

export function NotificationSystem({ notifications, onDismiss }: NotificationSystemProps) {
  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration) {
        const timer = setTimeout(() => {
          onDismiss(notification.id)
        }, notification.duration)

        return () => clearTimeout(timer)
      }
    })
  }, [notifications, onDismiss])

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-500 text-green-800"
      case "warning":
        return "bg-yellow-100 border-yellow-500 text-yellow-800"
      case "error":
        return "bg-red-100 border-red-500 text-red-800"
      default:
        return "bg-blue-100 border-blue-500 text-blue-800"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <Card key={notification.id} className={`border-l-4 ${getNotificationStyle(notification.type)}`}>
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium pr-2">{notification.message}</p>
              <button onClick={() => onDismiss(notification.id)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (
    message: string,
    type: "info" | "success" | "warning" | "error" = "info",
    duration = 5000,
  ) => {
    const id = Math.random().toString(36).substr(2, 9)
    const notification: Notification = { id, message, type, duration }

    setNotifications((prev) => [...prev, notification])
  }

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return {
    notifications,
    addNotification,
    dismissNotification,
  }
}
