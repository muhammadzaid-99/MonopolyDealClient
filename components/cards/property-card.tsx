import { Card, CardContent } from "@/components/ui/card"

interface PropertyCardProps {
  color: string
  name: string
  moneyValue: number
  rentValues: number[]
  className?: string
}

const colorMap: Record<string, string> = {
  brown: "from-amber-800 to-amber-900 border-amber-900",
  lightblue: "from-sky-300 to-sky-500 border-sky-600",
  pink: "from-pink-400 to-pink-600 border-pink-700",
  orange: "from-orange-400 to-orange-600 border-orange-700",
  red: "from-red-500 to-red-700 border-red-800",
  yellow: "from-yellow-400 to-yellow-600 border-yellow-700",
  green: "from-green-500 to-green-700 border-green-800",
  blue: "from-blue-500 to-blue-700 border-blue-800",
  purple: "from-purple-500 to-purple-700 border-purple-800",
  black: "from-gray-800 to-gray-900 border-gray-900",
}

export function PropertyCard({ color, name, moneyValue, rentValues, className = "" }: PropertyCardProps) {
  const colorClasses = colorMap[color] || "from-gray-400 to-gray-600 border-gray-700"

  return (
    <Card className={`w-24 h-36 sm:w-32 sm:h-48 bg-gradient-to-br ${colorClasses} text-white border-2 ${className}`}>
      <CardContent className="p-2 h-full flex flex-col relative">
        <div className="absolute top-1 right-1 bg-yellow-400 text-black text-xs font-bold px-1 rounded">
          ${moneyValue}M
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-sm font-bold text-center mb-2">{name}</h3>
          <div className="space-y-1">
            <div className="text-xs text-center font-semibold">RENT</div>
            <div className="flex justify-center gap-1 flex-wrap">
              {rentValues.map((rent, index) => (
                <span key={index} className="text-xs bg-white text-black px-1 rounded">
                  ${rent}M
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
