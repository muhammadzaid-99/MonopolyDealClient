"use client"

import { useState } from "react"
import { GameLobby } from "@/components/game/game-lobby"
import { GameRoom } from "@/components/game/game-room"
import { NotificationSystem, useNotifications } from "@/components/game/notification-system"
import { Button } from "@/components/ui/button"

// Demo data
const mockPlayers = [
  { id: "1", name: "Alice", isReady: true, isHost: true },
  { id: "2", name: "Bob", isReady: false, isHost: false },
  { id: "3", name: "Charlie", isReady: true, isHost: false },
]

const mockCurrentPlayer = {
  id: "1",
  name: "Alice",
  handCount: 5,
  bankCards: [
    { id: "b1", type: "money", moneyValue: 5 },
    { id: "b2", type: "money", moneyValue: 3 },
  ],
  propertyCards: {
    red: [{ id: "p1", type: "property", color: "red", name: "Kentucky Avenue", moneyValue: 3, rentValues: [2, 4, 7] }],
    blue: [],
  },
  isCurrentTurn: true,
}

const mockOtherPlayers = [
  {
    id: "2",
    name: "Bob",
    handCount: 7,
    bankCards: [{ id: "b3", type: "money", moneyValue: 1 }],
    propertyCards: {
      green: [
        { id: "p2", type: "property", color: "green", name: "Pacific Avenue", moneyValue: 4, rentValues: [2, 4, 7] },
      ],
    },
    isCurrentTurn: false,
  },
]

export default function DemoPage() {
  const [gameState, setGameState] = useState<"lobby" | "game">("lobby")
  const [playerReady, setPlayerReady] = useState(true)
  const { notifications, addNotification, dismissNotification } = useNotifications()

  const handleToggleReady = () => {
    setPlayerReady(!playerReady)
    addNotification(`You are now ${!playerReady ? "ready" : "not ready"}`, "info")
  }

  const handleStartGame = () => {
    setGameState("game")
    addNotification("Game started! Good luck!", "success")
  }

  const handleCardMove = (cardId: string, from: string, to: string) => {
    addNotification(`Moved card from ${from} to ${to}`, "info")
  }

  const handleEndTurn = () => {
    addNotification("Turn ended", "info")
  }

  return (
    <div>
      <NotificationSystem notifications={notifications} onDismiss={dismissNotification} />

      <div className="fixed top-4 left-4 z-40 space-x-2">
        <Button onClick={() => setGameState("lobby")} variant={gameState === "lobby" ? "default" : "outline"} size="sm">
          Lobby
        </Button>
        <Button onClick={() => setGameState("game")} variant={gameState === "game" ? "default" : "outline"} size="sm">
          Game
        </Button>
        <Button onClick={() => addNotification("Test notification", "info")} variant="outline" size="sm">
          Test Notification
        </Button>
      </div>

      {gameState === "lobby" ? (
        <GameLobby
          roomId="ROOM123"
          players={mockPlayers.map((p) => ({ ...p, isReady: p.id === "1" ? playerReady : p.isReady }))}
          currentPlayerId="1"
          onToggleReady={handleToggleReady}
          onStartGame={handleStartGame}
        />
      ) : (
        <GameRoom
          currentPlayer={mockCurrentPlayer}
          otherPlayers={mockOtherPlayers}
          discardPile={[{ id: "d1", type: "action", name: "Sly Deal", description: "Steal a property", moneyValue: 3 }]}
          onCardMove={handleCardMove}
          onEndTurn={handleEndTurn}
        />
      )}
    </div>
  )
}
