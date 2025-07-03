"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useSocket } from "@/lib/SocketProvider"
import Link from "next/link"

export default function HomePage() {
  const [playerName, setPlayerName] = useState("")
  const [roomID, setRoomID] = useState("")
  const router = useRouter()
  const { socket, playerID } = useSocket()

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data);
      console.log(msg)

      switch (msg.type) {
        case 'create-room':
          console.log(msg)
          if (msg.join_status === true || msg.room_id) {
            setTimeout(() => {
              router.push(`/lobby?room_id=${msg.room_id}`);
            }, 0);
          }
          break;
        case 'join-room':
          console.log(msg)
          if (msg.join_status === true || msg.room_id) {
            setTimeout(() => {
              router.push(`/lobby?room_id=${msg.room_id}`);
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

  const handleCreateRoom = () => {
    if (playerName.trim().length < 3) {
      alert("Please enter your name, at least 3 characters.")
      return
    }
    // Navigate to lobby - you'll implement the actual navigation logic
    console.log("Creating room for player:", playerName)
    socket?.send(JSON.stringify({ type: "create-room", player_id: playerID, player_name: playerName }))
  }

  const handleJoinRoom = () => {
    if (playerName.trim().length < 3 || !roomID.trim()) {
      alert("Please enter your name (at least 3 characters) and room ID.")
      return
    }
    // Navigate to lobby - you'll implement the actual navigation logic
    console.log("Joining room:", roomID, "as player:", playerName)
    socket?.send(JSON.stringify({ type: "join-room", player_id: playerID, player_name: playerName, room_id: roomID }))
  }

  return (
    <div className="h-dvh bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-800">Monopoly Deal</CardTitle>
          <p className="text-gray-600">Online Card Game</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="playerName">Player Name</Label>
            <Input
              id="playerName"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full"
            />
          </div>

          <Button onClick={handleCreateRoom} className="w-full bg-green-600 hover:bg-green-700" size="lg">
            Create Room
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomId">Room ID</Label>
              <Input
                id="roomId"
                placeholder="Enter room ID"
                value={roomID}
                onChange={(e) => setRoomID(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={handleJoinRoom} variant="outline" className="w-full" size="lg">
              Join Room
            </Button>
          </div>
          <div className="flex w-full mt-1 items-center justify-center gap-2">
            <Link href="http://monopolydealrules.com" rel="noopener noreferrer" target="_blank" className="text-xs underline">How to play?</Link>
            <Link href="http://github.com/muhammadzaid-99" rel="noopener noreferrer" target="_blank" className="text-xs underline">Developer</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
