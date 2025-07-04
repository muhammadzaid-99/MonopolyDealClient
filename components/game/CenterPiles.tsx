// components/game/CenterPiles.tsx
import { Action, CardInfo, GameInfo } from "@/app/game/page"
import { GameCard } from "@/components/game/GameCard"
import { GameCardSelectable } from "./GameCardSelectable"
import { useSocket } from "@/lib/SocketProvider"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"

function ActionSentence(a: Action | null): string {
  if (a === null) return ""

  switch (a) {
    case Action.DrawCards:
      return "Draw 2 Cards"
    case Action.SelectOpponent:
      return "Select an Opponent."
    case Action.PayMoney:
      return "Select Cards to Pay or Continue"
    case Action.SelectOpponentSet:
      return "Select a Complete Property Set from Opponent"
    case Action.SelectOpponentProperty:
      return "Select a Property from Opponent"
    case Action.Continue:
      return "Continue?"
    case Action.SelectYourProperty:
      return "Select a Property from Your Side"
    case Action.SelectYourPropertySetAndOpponent:
      return "Select an Opponent & a Property Set from Yours"
    case Action.SelectYourPropertySet:
      return "Select a Property Set from Your Side"
    case Action.Arrange:
      return "Arrange your Transferred Property"
    case Action.Wait:
      return "Waiting for Action Response..."
    default:
      return ""
  }
}

export function CenterPiles(gameInfo: GameInfo) {
  const { action, playerID, socket } = useSocket()

  function HandleDrawCards() {
    socket?.send(JSON.stringify({ type: "draw-cards", player_id: playerID }))
  }

  function HandleContinue() {
    socket?.send(JSON.stringify({ type: Action.Continue, player_id: playerID }))
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full bg-white ">
      <div className="flex flex-col w-full rounded-md border shadow-inner h-full">
        {/* Discard Pile */}
        <ScrollArea className="h-md:h-32 h-14 bg-gray-50 flex flex-col gap-1 border text-center">
          {action && (
            <div className="text-[10px] h-md:hidden font-semibold text-center p-2 border-b [text-wrap:balance] animate-pulse">
              {ActionSentence(action)}
            </div>
          )}
          {gameInfo?.messages?.map((msg, i) => (
            <div key={i} className="h-md:text-xs text-[8px] p-2 border-b select-none tracking-wide h-md:font-serif font-sans">
              {msg}
            </div>
          ))}
        </ScrollArea>
        <div className=" flex flex-1 items-center justify-center text-xs max-h-md:scale-75 max-h-md:-m-4">
          {gameInfo?.top_card ? (
            <GameCardSelectable {...gameInfo?.top_card} NonSelectable />
          ) : (
            <span></span>
          )}
        </div>
        <div className="flex gap-1 items-center bg-gray-100 w-full justify-between">
          {/* Draw Pile */}
          <Button className={`bg-slate-700 h-8 h-md:m-4 m-1 max-h-md:scale-75 rounded-md border self-end text-xs text-center shadow-inner ${playerID === gameInfo.current_turn_player_id && (!gameInfo.turn_cards_drawn || action == Action.DrawCards) && "animate-pulse"}`} onClick={HandleDrawCards}>
            Draw Cards
          </Button>
          <div className="text-xs max-h-md:hidden font-semibold text-center [text-wrap:balance]">
            {ActionSentence(action)}
          </div>
          <Button variant="secondary" className={` h-8 h-md:m-4 m-1 max-h-md:scale-75 rounded-md border self-end text-xs text-center shadow-inner ${"animate-pulse duration-1000"}`}
            onClick={HandleContinue}
            disabled={(action != Action.Continue && action != Action.PayMoney && action != Action.Arrange)}
          >
            Continue
          </Button>

        </div>

      </div>
    </div>
  )
}
