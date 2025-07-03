// components/game/PileButton.tsx
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { GameCard } from "@/components/game/GameCard"
import { Action, CardInfo, PropertyPile } from "@/app/game/page"
import { GameCardSelectable, propertyColorToColor } from "./GameCardSelectable"
import { Dispatch, SetStateAction, useState } from "react"
import { useSocket } from "@/lib/SocketProvider"
import clsx from "clsx"
import { Badge } from "../ui/badge"

const propertyColors = [
  "Dark Blue",
  "Brown",
  "Green",
  "Red",
  "Yellow",
  "Orange",
  "Pink",
  "Light Blue",
  "Railroad",
  "Utility",
]

interface PropertyPileButtonProps {
  owner_id: string
  pile?: PropertyPile
  looseCards?: CardInfo[]
  isForLoose?: boolean,
}

export function PropertyPileButton({ owner_id, pile, looseCards, isForLoose }: PropertyPileButtonProps) {
  const { action, playerID, selectedCardID, socket } = useSocket()

  function HandleSelectColor(color: string) {
    console.log(color)
    socket?.send(JSON.stringify({ type: "change-pile-color", player_id: playerID, property_pile_id: pile?.id, property_color: color }))
  }

  function HandleMoveProperty(dest_id = "") {

    console.log("moving to", dest_id)
    socket?.send(JSON.stringify({ type: "arrange-property", player_id: playerID, card_id: selectedCardID, property_arrange_dest_pile_id: dest_id }))
  }

  function HandleSelectPropertySet() {

    console.log("player id is", playerID)
    console.log("owner id is", owner_id)

    if (action == Action.SelectOpponentSet && playerID != owner_id) {
      socket?.send(JSON.stringify({ type: action, player_id: playerID, property_pile_id: pile?.id, target_player_id: owner_id }))
    }
    if ((action == Action.SelectYourPropertySet || action == Action.SelectYourPropertySetAndOpponent) && playerID == owner_id) {
      console.log("sending with", pile?.id)
      socket?.send(JSON.stringify({ type: action, player_id: playerID, property_pile_id: pile?.id }))
    }
  }

  function HandleSelectProperty() {
    if (action == Action.SelectYourProperty || action == Action.SelectOpponentProperty) {
      console.log("select property", owner_id, selectedCardID)
      socket?.send(JSON.stringify({ type: action, player_id: playerID, card_id: selectedCardID, target_player_id: owner_id }))
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {isForLoose ? (
          <button className="text-xs px-2 py-1 rounded-md shadow-sm w-16 h-16 bg-gray-200" onClick={(e) => { selectedCardID && e.preventDefault(); HandleMoveProperty() }}>
            <div className="flex flex-col items-center leading-tight text-black">
              <span>{looseCards?.length}</span>
              <span className="text-[8px] tracking-widest">LOOSE</span>
            </div>
          </button>
        ) : (
          <button className="text-xs px-2 py-1 rounded-md border shadow-sm w-9 h-16"
            style={{ backgroundColor: propertyColorToColor(pile?.color || "") }}
            onClick={(e) => {
              if (action == Action.SelectOpponentSet || action == Action.SelectYourPropertySet || action == Action.SelectYourPropertySetAndOpponent) {
                e.preventDefault()
                HandleSelectPropertySet()
                return
              }
              if (selectedCardID) {
                e.preventDefault()
                HandleMoveProperty(pile?.id)
              }
            }}>
            <div className="flex flex-col items-center leading-tight text-white relative">
              <span>{pile?.cards?.length}</span>
              <span>${pile?.rent}</span>
              <div className={clsx("rounded-full h-2 min-w-5 px-1 mt-1 shadow", {
                "bg-pink-300": pile?.hotel,
                "bg-emerald-300": !pile?.hotel && pile?.house,
                "bg-yellow-200": !pile?.hotel && !pile?.house && pile?.complete,
                "invisible": !pile?.hotel && !pile?.house && !pile?.complete,
              })}  />

              {/* <span
                className={clsx(
                  "absolute z-10 -top-4 -right-3 h-2.5 w-2.5 rounded-full border border-white",

                )}
              /> */}
            </div>

          </button>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-[430px]">
        {isForLoose ? (
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 px-2 pb-4">
              {looseCards?.map((c, i) => (
                <GameCardSelectable key={i} {...c} ClickEvent={HandleSelectProperty} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          pile?.color ? (
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-2 px-2 pb-4">
                {pile?.cards?.map((c, i) => (
                  <GameCardSelectable key={i} {...c} ClickEvent={HandleSelectProperty} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-2 px-2 pb-4">
                {propertyColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => HandleSelectColor(color)}
                    className="h-7 w-7 rounded-full border-2 border-white shrink-0"
                    style={{ backgroundColor: propertyColorToColor(color) }}
                    title={color}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )
        )}
      </PopoverContent>
    </Popover>
  )
}
