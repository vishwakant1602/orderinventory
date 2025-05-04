"use client"

import type React from "react"

import { useState } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

export type ToasterToast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToasterToast[]>([])

  const toast = ({ title, description, action, variant }: Omit<ToasterToast, "id">) => {
    const id = genId()
    const newToast = {
      id,
      title,
      description,
      action,
      variant,
    }

    setToasts((prevToasts) => {
      const updatedToasts = [...prevToasts, newToast].slice(-TOAST_LIMIT)
      return updatedToasts
    })

    return {
      id,
      dismiss: () => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
      },
      update: (props: Omit<ToasterToast, "id">) => {
        setToasts((prevToasts) => prevToasts.map((toast) => (toast.id === id ? { ...toast, ...props } : toast)))
      },
    }
  }

  const dismiss = (toastId?: string) => {
    setToasts((prevToasts) => (toastId ? prevToasts.filter((toast) => toast.id !== toastId) : []))
  }

  return {
    toast,
    dismiss,
    toasts,
  }
}
