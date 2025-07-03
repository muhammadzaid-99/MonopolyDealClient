// components/game/PileButton.tsx
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { GameCard } from "@/components/game/GameCard"
import { Action, CardInfo } from "@/app/game/page"
import { GameCardSelectable } from "./GameCardSelectable"
import { Dispatch, SetStateAction } from "react"
import { useSocket } from "@/lib/SocketProvider"

interface BankPileButtonProps {
  count: number
  value: number
  cards?: CardInfo[] // replace with real type later
}

export function BankPileButton({ count, value, cards = [] }: BankPileButtonProps) {
  const {socket, playerID, action, selectedCardID} = useSocket()

  function ClickEvent() {
    if (action == Action.PayMoney) {
      console.log("Trying to pay card id", selectedCardID)
      socket?.send(JSON.stringify({ type: Action.PayMoney, player_id: playerID, card_id: selectedCardID }))
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="h-md:text-xs text-[10px] px-2 py-1 rounded-md bg-white border shadow-sm">
          <div className="flex h-md:flex-col items-center max-h-md:justify-between leading-tight h-md:min-w-12 min-w-8 max-h-md:h-4">
            <span>{count}</span>
            <span className="">${value}</span>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent className="h-md:w-[430px] w-[300px]">
        <ScrollArea className="w-full whitespace-nowrap max-h-md:-m-3.5">
          <div className="flex gap-2 px-2 pb-4 max-h-md:scale-[0.675] max-h-md:-my-5 max-h-md:-mx-10">
            {cards.map((c, i) => (
              <GameCardSelectable key={i} {...c} ClickEvent={ClickEvent} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
