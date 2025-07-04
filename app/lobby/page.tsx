"use client"

import { Suspense, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Copy, Check } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSocket } from "@/lib/SocketProvider"

interface Player {
  ID: string,
  Name: string,
  IsReady: boolean,
  PropertyCards: any,
  BankCards: any,
}


export default function GameLobby() {
  const [copied, setCopied] = useState(false)
  const [players, setPlayers] = useState<Player[]>([])
  const { socket, playerID } = useSocket()
  const currentPlayer = players.find((p) => p.ID === playerID)
  const router = useRouter()

  const searchParams = useSearchParams()
  const roomId = searchParams.get("room_id") || ""
  const playerName = searchParams.get("player_name") || ""

  useEffect(() => {
    if (!socket) return;
    socket?.send(JSON.stringify({ type: "join-room", player_id: playerID, player_name: playerName, room_id: roomId }))
  }, [])

  useEffect(() => {
    if (!socket) return;

    socket?.send(JSON.stringify({ type: "game-state", player_id: playerID }))

    socket.onmessage = (event: MessageEvent) => {
      console.log(event.data)
      const msg = JSON.parse(event.data);
      console.log(msg)

      switch (msg.type) {
        case 'player-list':
          console.log(msg)
          setPlayers(msg.players)
          break;
        case 'start-game':
          if (msg.game_start) {
            setTimeout(() => {
              router.push('/game');
            }, 0);
          }
          break;
      }
    };

    // Optional: cleanup
    return () => {
      socket.onmessage = null;
    };
  }, [socket, router]);


  const copyRoomId = async () => {
    await navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function onToggleReady() {
    socket?.send(JSON.stringify({ type: "change-ready-state", player_id: playerID, ready_state: !currentPlayer?.IsReady }))
  }

  function onStartGame() {
    socket?.send(JSON.stringify({ type: "start-game", player_id: playerID }))
  }

  return (

    <div className="h-dvh bg-gradient-to-br from-green-100 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center relative">
            <CardTitle className="text-2xl font-bold text-green-800">Game Lobby</CardTitle>
            <CardContent>
              <div className="flex items-center justify-center gap-2">
                <span className="text-gray-600">Room ID:</span>
                <code className="bg-gray-100 px-2 py-1 rounded font-mono">{roomId}</code>
                <Button variant="ghost" size="sm" onClick={copyRoomId} className="h-8 w-8 p-0">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Players ({players.length}/5)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {players.map((player) => (
                <div key={player.ID} className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${player.ID === currentPlayer?.ID && "ring-1"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {player.Name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{player.Name}</div>
                      {/* {player.isHost && (
                        <Badge variant="secondary" className="text-xs">
                          Host
                        </Badge>
                      )} */}
                    </div>
                  </div>
                  <Badge
                    variant={player.IsReady ? "default" : "secondary"}
                    className={player.IsReady ? "bg-green-600" : ""}
                  >
                    {player.IsReady ? "Ready" : "Not Ready"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            onClick={onToggleReady}
            variant={currentPlayer?.IsReady ? "outline" : "default"}
            className="flex-1"
            size="lg"
          >
            {currentPlayer?.IsReady ? "Not Ready" : "I am Ready"}
          </Button>

          <Button
            onClick={onStartGame}
            className="flex-1 bg-green-600 hover:bg-green-700"
            size="lg"
            disabled={players?.some(player => !player.IsReady) || players?.length < 2}
          >
            Start Game
          </Button>
        </div>

        {/* {!allReady && (
          <div className="text-center text-gray-600 text-sm">
            {players.length < 2 ? "Waiting for more players to join..." : "Waiting for all players to be ready..."}
          </div>
        )} */}
      </div>
    </div>
  )
}
