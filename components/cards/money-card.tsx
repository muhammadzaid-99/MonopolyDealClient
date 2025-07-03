import { Card, CardContent } from "@/components/ui/card"

interface MoneyCardProps {
  moneyValue: number
  className?: string
}

const getMoneyCardStyle = (value: number) => {
  if (value >= 10) return "from-green-600 to-green-800 border-green-900"
  if (value >= 5) return "from-blue-500 to-blue-700 border-blue-800"
  if (value >= 3) return "from-purple-500 to-purple-700 border-purple-800"
  return "from-orange-400 to-orange-600 border-orange-700"
}

export function MoneyCard({ moneyValue, className = "" }: MoneyCardProps) {
  const styleClasses = getMoneyCardStyle(moneyValue)

  return (
    <Card className={`w-24 h-36 sm:w-32 sm:h-48 bg-gradient-to-br ${styleClasses} text-white border-2 ${className}`}>
      <CardContent className="p-2 h-full flex flex-col justify-center items-center">
        <div className="text-2xl sm:text-4xl font-bold">${moneyValue}M</div>
        <div className="text-xs text-center mt-2">MONEY</div>
      </CardContent>
    </Card>
  )
}
