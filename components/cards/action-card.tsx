import { Card, CardContent } from "@/components/ui/card"

interface ActionCardProps {
  name: string
  description: string
  moneyValue: number
  className?: string
}

export function ActionCard({ name, description, moneyValue, className = "" }: ActionCardProps) {
  return (
    <Card
      className={`w-24 h-36 sm:w-32 sm:h-48 bg-gradient-to-br from-red-400 to-red-600 text-white border-2 border-red-700 ${className}`}
    >
      <CardContent className="p-2 h-full flex flex-col relative">
        <div className="absolute top-1 right-1 bg-yellow-400 text-black text-xs font-bold px-1 rounded">
          ${moneyValue}M
        </div>
        <div className="text-xs font-bold mb-1 text-center">ACTION CARD</div>
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-sm font-bold text-center mb-2">{name}</h3>
          <p className="text-xs text-center leading-tight">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
