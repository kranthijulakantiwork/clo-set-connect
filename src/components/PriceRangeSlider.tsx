"use client"

import { useState, useEffect, useRef } from "react"

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  disabled?: boolean
}

export default function PriceRangeSlider({ min, max, value, onChange, disabled = false }: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState(value)
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!sliderRef.current) return

      const rect = sliderRef.current.getBoundingClientRect()
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      const newValue = Math.round(min + percent * (max - min))

      setLocalValue((prev) => {
        if (isDragging === "min") {
          return [Math.min(newValue, prev[1]), prev[1]]
        } else {
          return [prev[0], Math.max(newValue, prev[0])]
        }
      })
    }

    const handleMouseUp = () => {
      setIsDragging(null)
      onChange(localValue)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, min, max, localValue, onChange])

  const minPercent = ((localValue[0] - min) / (max - min)) * 100
  const maxPercent = ((localValue[1] - min) / (max - min)) * 100

  return (
    <div className={`${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <h3 className="text-sm font-medium text-gray-400 mb-3">4. Pricing slider</h3>

      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-400 mb-3">
          <span>${localValue[0]}</span>
          <span>${localValue[1]}</span>
        </div>

        <div ref={sliderRef} className="relative h-1 bg-gray-700 rounded-full">
          {/* Active range */}
          <div
            className="absolute h-full bg-gray-500 rounded-full"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          />

          {/* Min handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-400 rounded-full cursor-pointer hover:scale-125 transition-transform"
            style={{ left: `${minPercent}%`, marginLeft: "-6px" }}
            onMouseDown={() => !disabled && setIsDragging("min")}
          />

          {/* Max handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-400 rounded-full cursor-pointer hover:scale-125 transition-transform"
            style={{ left: `${maxPercent}%`, marginLeft: "-6px" }}
            onMouseDown={() => !disabled && setIsDragging("max")}
          />
        </div>
      </div>

      {disabled && <p className="text-xs text-gray-500 italic mt-2">Select "Paid" option to enable</p>}
    </div>
  )
}
