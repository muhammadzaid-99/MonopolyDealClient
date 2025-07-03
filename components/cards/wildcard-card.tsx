import { Card, CardContent } from "@/components/ui/card"

interface WildcardCardProps {
  color1?: string
  color2?: string
  moneyValue?: number
  rentValues1?: number[]
  rentValues2?: number[]
  isAllColors?: boolean
  description?: string
  className?: string
}

const colorMap: Record<string, string> = {
  brown: "bg-amber-800",
  lightblue: "bg-sky-400",
  pink: "bg-pink-500",
  orange: "bg-orange-500",
  red: "bg-red-600",
  yellow: "bg-yellow-500",
  green: "bg-green-600",
  blue: "bg-blue-600",
  purple: "bg-purple-600",
  black: "bg-gray-800",
}

export function WildcardCard({
  color1,
  color2,
  moneyValue,
  rentValues1,
  rentValues2,
  isAllColors = false,
  description,
  className = "",
}: WildcardCardProps) {
  if (isAllColors) {
    return (
      <Card
        className={`w-24 h-36 sm:w-32 sm:h-48 bg-gradient-to-br from-rainbow-400 to-rainbow-600 text-white border-2 border-rainbow-700 ${className}`}
      >
        <CardContent className="p-2 h-full flex flex-col relative">
          <div className="text-xs font-bold mb-1 text-center">WILDCARD</div>
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-sm font-bold text-center mb-2">ALL COLORS</h3>
            {description && <p className="text-xs text-center leading-tight">{description}</p>}
          </div>
        </CardContent>
      </Card>
    )
  }

  const color1Class = color1 ? colorMap[color1] : "bg-gray-400"
  const color2Class = color2 ? colorMap[color2] : "bg-gray-400"

  return (
    <Card className={`w-24 h-36 sm:w-32 sm:h-48 bg-white border-2 border-gray-700 ${className}`}>
      <CardContent className="p-2 h-full flex flex-col relative">
        {moneyValue && (
          <div className="absolute top-1 right-1 bg-yellow-400 text-black text-xs font-bold px-1 rounded">
            ${moneyValue}M
          </div>
        )}
        <div className="text-xs font-bold mb-1 text-center text-black">WILDCARD</div>
        <div className="flex-1 flex flex-col">
          <div className={`flex-1 ${color1Class} rounded-t flex items-center justify-center`}>
            <div className="text-white text-center">
              <div className="text-xs font-bold">{color1?.toUpperCase()}</div>
              {rentValues1 && (
                <div className="flex gap-1 justify-center mt-1">
                  {rentValues1.map((rent, index) => (
                    <span key={index} className="text-xs bg-white text-black px-1 rounded">
                      ${rent}M
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={`flex-1 ${color2Class} rounded-b flex items-center justify-center`}>
            <div className="text-white text-center">
              <div className="text-xs font-bold">{color2?.toUpperCase()}</div>
              {rentValues2 && (
                <div className="flex gap-1 justify-center mt-1">
                  {rentValues2.map((rent, index) => (
                    <span key={index} className="text-xs bg-white text-black px-1 rounded">
                      ${rent}M
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
