'use client'
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { GameCard } from '@/components/game/GameCard'
import { PropertyPileButton } from "@/components/game/PropertyPileButton"
import { CenterPiles } from "@/components/game/CenterPiles"
import { GameCardSelectable } from "@/components/game/GameCardSelectable"
import { useSocket } from "@/lib/SocketProvider"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CardType } from "@/lib/utils"
import { BankPileButton } from "@/components/game/BankPileButton"
import { Hand, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"


export interface PropertyPile {
    id: string,
    color: string,
    cards: CardInfo[],
    complete: boolean,
    house: boolean,
    hotel: boolean,
    rent: number
}

interface Player {
    ID: string,
    Name: string,
    IsReady: boolean,
    BankCards: CardInfo[],
    LooseCards: CardInfo[],
    // PropertyCards: Map<string, CardInfo[]>,
    // PropertyRents: Record<string, number>,
    // PropertyCompletion: Record<string, number>,
    PropertyPiles: Map<string, PropertyPile>,
    HandCount: number,
}

export interface CardInfo {
    card_type: CardType;
    id: number,
    name: string;
    description: string;
    value: number;
    property_card_info: {
        color: string;
        rent_values: number[];
    };
    properties: {
        color: string;
        rent_values: number[];
    }[];
    colors: string[];
}

export interface GameInfo {
    current_turn_player_id?: string;
    top_card?: CardInfo;
    plays_remaining?: number;
    turn_cards_drawn?: boolean;
    messages?: string[];
}

export enum Action {
    DrawCards = "draw-cards",
    SelectOpponent = "select-opponent",
    PayMoney = "pay",
    SelectOpponentSet = "select-opponent-property-complete-set",
    SelectOpponentProperty = 'select-opponent-property',
    Continue = "continue",
    SelectYourProperty = "select-your-property",
    SelectYourPropertySet = "select-your-property-complete-set",
    SelectYourPropertySetAndOpponent = "select-your-property-set-and-opponent",
    Arrange = "arrange",
    Wait = "wait"
}

export default function GameRoom() {

    const { action, setAction, socket, playerID, selectedCardID, setSelectedCardID } = useSocket()
    const router = useRouter()
    const [players, setPlayers] = useState<Player[]>([])
    const [currentPlayer, setCurrentPlayer] = useState<Player>()
    const [handCards, setHandCards] = useState<CardInfo[]>()
    const [gameInfo, setGameInfo] = useState<GameInfo>()




    function HandlePlayCard(location: string) {
        // if (action == null) {
        // just a workaround for some time
        if (location == "DiscardPile" && currentPlayer && gameInfo && gameInfo.plays_remaining == 0 && currentPlayer.HandCount > 7) {
            socket?.send(JSON.stringify({ type: "discard-card", player_id: playerID, card_id: selectedCardID }))
        } else {
            socket?.send(JSON.stringify({ type: "play-card", player_id: playerID, card_id: selectedCardID, play_location: location }))
        }
        // } else {
        //     socket?.send(JSON.stringify({ type: "play-card", player_id: playerID, card_id: selectedCardID }))
        // }
        setSelectedCardID(null)
    }

    function HandleEndTurn() {
        socket?.send(JSON.stringify({ type: "end-turn", player_id: playerID }))
    }

    function HandleSelectOpponent(target_player_id: string) {
        socket?.send(JSON.stringify({ type: 'select-opponent', player_id: playerID, target_player_id: target_player_id }))
    }

    function HandleCreateNewPile() {
        socket?.send(JSON.stringify({ type: 'create-pile', player_id: playerID }))
    }



    useEffect(() => {
        if (!socket) return;

        socket?.send(JSON.stringify({ type: "game-state", player_id: playerID }))

        socket.onmessage = (event: MessageEvent) => {
            const msg = JSON.parse(event.data);
            console.log(msg)

            switch (msg.type) {
                case 'player-list':
                    console.log(msg)
                    setCurrentPlayer(msg.players.find((p: Player) => p.ID === playerID));
                    setPlayers(
                        msg.players
                            .filter((p: Player) => p.ID !== playerID)
                            .sort((a: Player, b: Player) => a.ID.localeCompare(b.ID))
                    );
                    break;
                case 'hand-cards':
                    const handCardsArray = Object.values(msg.handCards) as CardInfo[]
                    setHandCards(handCardsArray)
                    break;
                case 'game-info':
                    setGameInfo(msg)
                    console.log(msg)
                    break;
                case 'action':
                    // alert(msg.action)
                    switch (msg.action) {
                        case 'clear':
                            setAction(null)
                            break;
                        case 'draw-cards':
                            setAction(Action.DrawCards)
                            break;
                        case 'select-an-opponent':
                            setAction(Action.SelectOpponent)
                            break;
                        case 'pay':
                            setAction(Action.PayMoney)
                            break;
                        case 'select-opponent-property-complete-set':
                            setAction(Action.SelectOpponentSet)
                            break;
                        case 'continue':
                            setAction(Action.Continue)
                            break;
                        case 'select-opponent-property':
                            setAction(Action.SelectOpponentProperty)
                            break;
                        case 'select-your-property':
                            setAction(Action.SelectYourProperty)
                            break;
                        case 'select-your-property-complete-set':
                            setAction(Action.SelectYourPropertySet)
                            break;
                        case 'select-your-property-set-and-opponent':
                            setAction(Action.SelectYourPropertySetAndOpponent)
                            break;
                        case 'arrange':
                            setAction(Action.Arrange)
                            break;
                        case 'wait':
                            setAction(Action.Wait)
                            break;
                    }
                    break;
            }
        };

        // Optional: cleanup
        return () => {
            socket.onmessage = null;
        };
    }, [socket, router]);

    return (
        <div className="w-full h-dvh p-2 bg-muted game-container ">
            <div className="w-full h-full max-h-dvh rounded-lg border  overflow-scroll">
                <div className="flex flex-col h-full">
                    <div className="flex-[2] grid grid-cols-3 grid-rows-2 gap-2 p-2">
                        {Array.from({ length: 6 }).map((_, i) => {
                            if (i === 1) {
                                return (
                                    <div key={i} className={`bg-muted rounded-md border row-span-2 max-h-md:scale-90 max-h-md:-m-3.5 ${selectedCardID !== null && "ring-2 hover:bg-sky-100 cursor-pointer"}`} onClick={(e) => { e.stopPropagation(); HandlePlayCard("DiscardPile") }}>
                                        <CenterPiles {...gameInfo} />
                                    </div>
                                )
                            }
                            if (i === 4) return;
                            let player_index = i;
                            if (i > 1) player_index--;
                            if (i > 4) player_index--;

                            const player = players[player_index] // skip index 2,4 (center)

                            if (!player) {
                                return
                            }

                            return (
                                <div key={i} className={`bg-card rounded-md border shadow-sm p-1 flex flex-col gap-2 max-h-md:scale-90 max-h-md:-m-3.5 ${players?.length < 3 && "row-span-2"} ${(action == Action.SelectOpponent || action == Action.SelectYourPropertySetAndOpponent) && "ring-2 hover:bg-sky-100 cursor-pointer"}`} onClick={() => HandleSelectOpponent(player.ID)}>
                                    <div className="flex justify-between items-center w-full">
                                        <div className="font-bold h-md:text-lg text-sm px-2">
                                            <span>{player.Name} </span>{player?.HandCount ? (<>
                                                <span className="font-semibold text-xs px-2 max-h-md:hidden">{player.HandCount} cards in hand</span>
                                                {/* <span className="h-md:hidden"><Hand size={14} strokeWidth={1} /></span> */}
                                                <span className="font-normal text-[10px] px-2 h-md:hidden tracking-wider">Hand: {player.HandCount}</span>
                                            </>
                                            ) : (<></>)}
                                        </div>
                                        {player.ID === gameInfo?.current_turn_player_id && (
                                            <div className="font-bold text-lg flex gap-1">
                                                <div className="flex gap-1 items-center">
                                                    {gameInfo?.plays_remaining ? (Array.from({ length: gameInfo?.plays_remaining }).map((_, i) => (
                                                        <Badge key={i} className="bg-blue-700 rounded-full h-md:h-5 h-md:min-w-5 h-3 min-w-3 px-1" />
                                                    ))) : (<></>)}
                                                </div>
                                                <Badge variant="default" className="max-h-md:hidden select-none hover:bg-blue-700 bg-blue-700">
                                                    CURRENT TURN
                                                </Badge>
                                                <div className="h-md:hidden text-xs text-gray-700 select-none">
                                                    <Target size={16} strokeWidth={1} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <Separator />



                                    {/* Bank Section */}
                                    <div className={`flex flex-col gap-0.5 transition-all ${players?.length > 2 && "max-h-md:hidden"} `}>
                                        <span className="text-[10px] font-semibold px-2">Bank</span>
                                        <ScrollArea className="w-full whitespace-nowrap">
                                            <div className="flex gap-1 px-2">
                                                {player?.BankCards &&
                                                    Object.entries(
                                                        player.BankCards.reduce<Record<number, CardInfo[]>>((acc, card) => {
                                                            acc[card.value] = acc[card.value] || [];
                                                            acc[card.value].push(card);
                                                            return acc;
                                                        }, {})
                                                    ).map(([value, cards]) => (
                                                        <BankPileButton
                                                            key={`bank-group-${value}`}
                                                            count={cards?.length}
                                                            value={Number(value)}
                                                            cards={cards}
                                                        />
                                                    ))
                                                }
                                            </div>
                                            <ScrollBar orientation="horizontal" />
                                        </ScrollArea>
                                    </div>

                                    <Separator className={` ${players?.length > 2 && "max-h-md:hidden"} `} />

                                    {/* Property Section */}
                                    <div className={`flex flex-col gap-0.5 transition-all ${players?.length > 2 && "max-h-md:hidden"} `}>
                                        <span className="text-[10px] font-semibold px-2">Properties</span>
                                        <ScrollArea className="w-full whitespace-nowrap">
                                            <div className="flex gap-1 px-2">
                                                <PropertyPileButton
                                                    key={`prop-${player.ID}-${"loose-pile"}`}
                                                    owner_id={player.ID}
                                                    looseCards={player.LooseCards}
                                                    isForLoose
                                                />
                                                {player?.PropertyPiles &&
                                                    Object.entries(player.PropertyPiles).map(([id, pile]: [any, PropertyPile]) => {
                                                        return (
                                                            <PropertyPileButton
                                                                key={`prop-${player.ID}-${id}`}
                                                                owner_id={player.ID}
                                                                pile={pile}
                                                            />
                                                        );
                                                    })
                                                }
                                            </div>
                                            <ScrollBar orientation="horizontal" />
                                        </ScrollArea>
                                    </div>


                                    <ResizablePanelGroup direction="vertical" className={`h-md:hidden ${players?.length < 3 && "max-h-md:hidden"}`}>
                                        <ResizablePanel defaultSize={100} minSize={0} className={`h-md:hidden ${players?.length < 3 && "max-h-md:hidden"}`}>
                                            {/* Property Section */}
                                            <div className="flex flex-col gap-0.5 transition-all">
                                                <span className="text-[10px] font-semibold px-2">Properties</span>
                                                <ScrollArea className="w-full whitespace-nowrap">
                                                    <div className="flex gap-1 px-2">
                                                        <PropertyPileButton
                                                            key={`prop-${player.ID}-${"loose-pile"}`}
                                                            owner_id={player.ID}
                                                            looseCards={player.LooseCards}
                                                            isForLoose
                                                        />
                                                        {player?.PropertyPiles &&
                                                            Object.entries(player.PropertyPiles).map(([id, pile]: [any, PropertyPile]) => {
                                                                return (
                                                                    <PropertyPileButton
                                                                        key={`prop-${player.ID}-${id}`}
                                                                        owner_id={player.ID}
                                                                        pile={pile}
                                                                    />
                                                                );
                                                            })
                                                        }
                                                    </div>
                                                    <ScrollBar orientation="horizontal" />
                                                </ScrollArea>
                                            </div>
                                        </ResizablePanel>
                                        <ResizableHandle withHandle className={`h-md:hidden ${players?.length < 3 && "max-h-md:hidden"}`} />
                                        <ResizablePanel defaultSize={0} minSize={0} className={`h-md:hidden ${players?.length < 3 && "max-h-md:hidden"}`}>
                                            {/* Bank Section */}
                                            <div className="flex flex-col  gap-0.5 transition-all">
                                                <span className="text-[10px] font-semibold px-2">Bank</span>
                                                <ScrollArea className="w-full whitespace-nowrap">
                                                    <div className="flex gap-1 px-2">
                                                        {player?.BankCards &&
                                                            Object.entries(
                                                                player.BankCards.reduce<Record<number, CardInfo[]>>((acc, card) => {
                                                                    acc[card.value] = acc[card.value] || [];
                                                                    acc[card.value].push(card);
                                                                    return acc;
                                                                }, {})
                                                            ).map(([value, cards]) => (
                                                                <BankPileButton
                                                                    key={`bank-group-${value}`}
                                                                    count={cards?.length}
                                                                    value={Number(value)}
                                                                    cards={cards}
                                                                />
                                                            ))
                                                        }
                                                    </div>
                                                    <ScrollBar orientation="horizontal" />
                                                </ScrollArea>
                                            </div>

                                        </ResizablePanel>


                                    </ResizablePanelGroup>
                                </div>
                            )
                        })}
                    </div>



                    <Separator />

                    {/* Bottom 1/3 Area: Resizable Left and Right Panels */}
                    <div className="flex-[1] h-md:p-2">
                        <ResizablePanelGroup direction="horizontal" className="">
                            <ResizablePanel defaultSize={50} minSize={40} className="max-h-md:-m-2">
                                <div className="h-full w-full bg-card rounded-md border shadow-sm p-2  flex flex-col max-h-md:scale-90">
                                    <div className="flex justify-between items-center">
                                        <div className="font-bold h-md:text-lg text-sm">
                                            <span>
                                                {currentPlayer?.Name}
                                            </span>  {currentPlayer?.HandCount ? (<>
                                                <span className="font-semibold text-xs px-2 max-h-md:hidden">{currentPlayer.HandCount} cards in hand</span>
                                                <span className="font-normal text-[10px] px-2 h-md:hidden tracking-wider">Hand: {currentPlayer.HandCount}</span>
                                            </>
                                            ) : (<></>)}
                                        </div>
                                        {currentPlayer?.ID === gameInfo?.current_turn_player_id && (
                                            <div className="flex gap-1">
                                                <div className="flex gap-2">
                                                    <div className="flex gap-1 items-center">
                                                        {gameInfo?.plays_remaining ? (Array.from({ length: gameInfo?.plays_remaining }).map((_, i) => (
                                                            <Badge key={i} className="bg-blue-700 rounded-full h-md:h-5 h-md:min-w-5 h-3 min-w-3 px-1" />
                                                        ))) : (<></>)}
                                                    </div>
                                                    {/* <Badge variant="default" className="select-none hover:bg-blue-700 bg-blue-700">
                                                        YOUR TURN
                                                    </Badge> */}
                                                </div>
                                                <Button variant="default" disabled={!gameInfo?.turn_cards_drawn} onClick={HandleEndTurn} className={`max-h-md:scale-75 select-none text-xs h-6 bg-pink-700 rounded-xl font-bold transition-all ${gameInfo?.plays_remaining === 0 && "animate-pulse px-8"}`}>
                                                    END TURN
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <span className="h-md:text-sm text-xs font-medium h-md:mb-1 max-h-md:hidden">Your Hand</span>

                                    <ScrollArea className="w-full whitespace-nowrap ">
                                        <div className="flex w-full gap-2 h-md:pb-4 h-md:px-2 max-h-md:scale-75 max-h-md:-my-3 max-h-md:-mx-10">
                                            {handCards?.map((card, i) => (
                                                <GameCardSelectable key={i} {...card} />
                                            ))}
                                        </div>
                                        <ScrollBar orientation="horizontal" />
                                    </ScrollArea>
                                </div>
                            </ResizablePanel>

                            <ResizableHandle withHandle />



                            <ResizablePanel defaultSize={50} minSize={40} className="max-h-md:-m-2">
                                <div className="h-full w-full bg-card rounded-md p-2 border shadow-sm flex flex-col h-md:gap-4 gap-1 max-h-md:scale-90">
                                    {/* Bank Piles */}
                                    <div className={`flex flex-col gap-1 rounded-md transition-all ${selectedCardID !== null && "ring-2 hover:bg-sky-100 cursor-pointer"}`} onClick={() => HandlePlayCard("BankPile")}>
                                        <span className="h-md:text-sm font-medium text-xs">Bank</span>
                                        <ScrollArea className="w-full whitespace-nowrap">

                                            <div className="flex gap-2 px-2">
                                                {currentPlayer?.BankCards &&
                                                    Object.entries(
                                                        currentPlayer.BankCards.reduce<Record<number, CardInfo[]>>((acc, card) => {
                                                            acc[card.value] = acc[card.value] || [];
                                                            acc[card.value].push(card);
                                                            return acc;
                                                        }, {})
                                                    ).map(([value, cards]) => (
                                                        <BankPileButton
                                                            key={`bank-group-${value}`}
                                                            count={cards.length}
                                                            value={Number(value)}
                                                            cards={cards}
                                                        />
                                                    ))
                                                }

                                            </div>
                                            <ScrollBar orientation="horizontal" />
                                        </ScrollArea>
                                    </div>

                                    <Separator />

                                    {/* Property Piles */}
                                    <div className={`flex flex-col gap-1 rounded-md transition-all ${selectedCardID !== null && "ring-2 hover:bg-sky-100 cursor-pointer"}`} onClick={() => HandlePlayCard("PropertyPile")}>
                                        <span className="h-md:text-sm font-medium text-xs">Properties</span>
                                        <ScrollArea className="w-full whitespace-nowrap">
                                            <div className="flex gap-2 px-2">
                                                {currentPlayer && (
                                                    <PropertyPileButton
                                                        key={`prop-${currentPlayer.ID}-${"loose-pile"}`}
                                                        owner_id={currentPlayer.ID}
                                                        looseCards={currentPlayer.LooseCards}
                                                        isForLoose
                                                    />
                                                )}
                                                {currentPlayer?.PropertyPiles &&
                                                    Object.entries(currentPlayer.PropertyPiles).map(([id, pile]: [any, PropertyPile]) => (
                                                        <PropertyPileButton
                                                            key={`prop-${currentPlayer.ID}-${id}`}
                                                            owner_id={currentPlayer.ID}
                                                            pile={pile}
                                                        />
                                                    ))}
                                                <Button variant="outline" className="w-9 h-14 h-md:h-16" onClick={HandleCreateNewPile}>
                                                    +
                                                </Button>
                                            </div>
                                            <ScrollBar orientation="horizontal" />
                                        </ScrollArea>
                                    </div>

                                </div>
                            </ResizablePanel>

                        </ResizablePanelGroup>
                    </div>

                </div>
            </div>
        </div>
    )
}
