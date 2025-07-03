import { Card, CardContent } from "@/components/ui/card"

interface RentCardProps {
  description: string
  moneyValue: number
  colors: string[]
  className?: string
}

const colorMap: Record<string, string> = {
  brown: "from-amber-800 to-amber-900",
  lightblue: "from-sky-300 to-sky-500",
  pink: "from-pink-400 to-pink-600",
  orange: "from-orange-400 to-orange-600",
  red: "from-red-500 to-red-700",
  yellow: "from-yellow-400 to-yellow-600",
  green: "from-green-500 to-green-700",
  blue: "from-blue-500 to-blue-700",
  purple: "from-purple-500 to-purple-700",
  black: "from-gray-800 to-gray-900",
}

export function RentCard({ description, moneyValue, colors, className = "" }: RentCardProps) {
  const gradientColors = colors.map((color) => colorMap[color] || "from-gray-400 to-gray-600")
  const backgroundClass =
    colors.length === 2
      ? `bg-gradient-to-br ${gradientColors[0].split(" ")[0]} via-purple-500 ${gradientColors[1].split(" ")[1]}`
      : `bg-gradient-to-br ${gradientColors[0] || "from-gray-400 to-gray-600"}`

  return (
    <Card className={`w-24 h-36 sm:w-32 sm:h-48 ${backgroundClass} text-white border-2 border-purple-700 ${className}`}>
      <CardContent className="p-2 h-full flex flex-col relative">
        <div className="absolute top-1 right-1 bg-yellow-400 text-black text-xs font-bold px-1 rounded">
          ${moneyValue}M
        </div>
        <div className="text-xs font-bold mb-1 text-center">ACTION CARD</div>
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-sm font-bold text-center mb-2">RENT</h3>
          <p className="text-xs text-center leading-tight mb-2">{description}</p>
          <div className="flex justify-center gap-1">
            {colors.map((color, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full border border-white"
                style={{ backgroundColor: color === "lightblue" ? "#38bdf8" : color }}
              ></div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
