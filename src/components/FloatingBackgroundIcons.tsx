"use client"
import React, { useState, useEffect, memo } from "react"
import { Shirt, Sparkles, Zap } from "lucide-react"

const icons = [Shirt, Sparkles, Zap]

interface FloatingItem {
  id: number
  Icon: React.ElementType
  size: number
  style: React.CSSProperties
}

const FloatingBackgroundIcons = memo(() => {
  const [items, setItems] = useState<FloatingItem[]>([])

  useEffect(() => {
    // Generate icons only on client side
    const newItems = Array.from({ length: 12 }, (_, i) => {
      const Icon = icons[i % 3]
      const size = Math.random() * (36 - 12) + 12
      return {
        id: i,
        Icon,
        size,
        style: {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `float ${
            Math.random() * (14 - 6) + 6
          }s ease-in-out infinite ${Math.random() * 6}s`,
          willChange: "transform",
        },
      }
    })
    setItems(newItems)
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute text-(--color-brand-primary) opacity-10"
          style={item.style}
        >
          <item.Icon style={{ width: item.size, height: item.size }} />
        </div>
      ))}
    </div>
  )
})

FloatingBackgroundIcons.displayName = "FloatingBackgroundIcons"

export default FloatingBackgroundIcons
