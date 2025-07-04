"use client";

import { Action } from "@/app/game/page";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";

type SocketContextType = {
    socket: WebSocket | null;
    playerID: string | null;
    selectedCardID: number | null;
    setSelectedCardID: Dispatch<SetStateAction<number | null>>
    action: Action | null
    setAction: Dispatch<SetStateAction<Action | null>>
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    playerID: null,
    selectedCardID: null,
    setSelectedCardID: () => {},
    action: null,
    setAction: () => {},
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const socketRef = useRef<WebSocket | null>(null);
    const [playerID, setPlayerID] = useState<string | null>(null);
    const [selectedCardID, setSelectedCardID] = useState<number | null>(null)
    const [action, setAction] = useState<Action | null>(null)
    

    useEffect(() => {
        // const hostname = window.location.hostname;
        // socketRef.current = new WebSocket(`ws://${hostname}:4040`);
        const host = process.env.NEXT_PUBLIC_SERVER_HOST_NAME
        socketRef.current = new WebSocket(`wss://${host}/`);

        socketRef.current.onopen = () => {
            console.log("WebSocket connected");
            const storedPlayerID = sessionStorage.getItem("player_id")
            setPlayerID(storedPlayerID);
            console.log("Retrieved playerID", storedPlayerID)
            socketRef.current?.send(JSON.stringify({"player_id": storedPlayerID}));
        };

        socketRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "player_id_assigned" && data.player_id) {
                    sessionStorage.setItem("player_id", data.player_id)
                    setPlayerID(data.player_id);
                }
            } catch (e) {
                console.error("Failed to parse message", e);
            }
        };

        socketRef.current.onclose = (event) => {
            console.log("WebSocket disconnected");
            // setPlayerID(null);
        };


        return () => {
            socketRef.current?.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, playerID, selectedCardID, setSelectedCardID, action, setAction }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
