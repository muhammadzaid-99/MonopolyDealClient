'use client'
import { Dispatch, SetStateAction, useState } from "react";
import clsx from "clsx";
import { CardType } from "@/lib/utils";
import { CardInfo } from "@/app/game/page";
import { PanelsRightBottom } from "lucide-react";
import { useSocket } from "@/lib/SocketProvider";

export function propertyColorToColor(propertyColor: string) {
    switch (propertyColor) {
        case "Dark Blue":
            return "#1e3a8a"; // dark blue
        case "Brown":
            return "#7c4700"; // brown
        case "Green":
            return "#059669"; // green
        case "Red":
            return "#dc2626"; // red
        case "Yellow":
            return "#eab308"; // yellow
        case "Orange":
            return "#f97316"; // orange
        case "Pink":
            return "#ec4899"; // pink
        case "Light Blue":
            return "#38bdf8"; // light blue
        case "Railroad":
            return "Black"; // gray/black for railroad
        case "Utility":
            return "#7f8c58"; // light green for utility
        case "Wild":
            return "#a21caf"; // purple for wild
        default:
            return "#d1d5db"; // fallback gray
    }
}

export function GameCardSelectable({
    card_type,
    id,
    name,
    description,
    value,
    property_card_info,
    colors,
    properties,
    NonSelectable,
    ClickEvent,
}: CardInfo & {
    NonSelectable?: boolean,
    ClickEvent?: () => void
}) {

    function HandleClick() {
        if (!NonSelectable) {
            setTimeout(() => setSelectedCardID(id === selectedCardID ? null : id), 0)
        }
        if (ClickEvent) {
            console.log("click event")
            console.log(selectedCardID)
            setTimeout(() => {
                console.log("click event inside timeout")
                console.log(selectedCardID)
                ClickEvent()
            }, 10)
        }
    }

    const { selectedCardID, setSelectedCardID } = useSocket()

    const renderContent = () => {
        switch (card_type) {
            case "Money":
                return (
                    <div
                        className={clsx(
                            "h-full w-full flex items-center justify-center p-1 rounded-md",
                            {
                                "bg-yellow-100": value === 1,
                                "bg-green-200": value === 2,
                                "bg-blue-200": value === 3,
                                "bg-purple-200": value === 4,
                                "bg-orange-200": value === 5,
                                "bg-red-300": value === 10,
                            }
                        )}
                    >


                        <div className="flex flex-col text-center text-sm h-full">
                            <div className="flex-1 flex flex-col items-center justify-center gap-1 px-1 mt-1">
                                <div className="text-2xl font-bold">${value}</div>
                            </div>
                            <div className="text-[8px] mt-auto tracking-widest">MONEY</div>
                        </div>
                    </div>
                )

            case "Property":
                return (
                    <div className={clsx("h-full w-full flex items-center justify-center p-1 rounded-md border-t-[16px]", {
                    })} style={{ borderColor: propertyColorToColor(property_card_info?.color) }}>
                        <div className="flex flex-col text-center text-sm h-full">
                            {/* <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: property_card_info.color }} /> */}
                            <div className="flex-1 flex flex-col items-center gap-1 px-1 mt-3">
                                <div className="font-semibold text-sm text-center">{name}</div>
                                <div className="text-[10px] text-gray-600 text-center">
                                    <span className="text-sm flex gap-1">
                                        {property_card_info?.rent_values?.map((rv, i) => (
                                            <span key={i} className="rounded-sm px-1 text-white font-medium" style={{ backgroundColor: propertyColorToColor(property_card_info?.color) }}>
                                                {rv}
                                            </span>
                                        ))}
                                    </span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">${value}</div>
                            <div className="text-[8px] mt-auto tracking-widest">PROPERTY</div>
                        </div>
                    </div>
                );

            case "Wildcard":
                switch (properties.length) {
                    case 2:
                        return (
                            <div className={clsx("h-full w-full flex items-center justify-center p-1 rounded-md border-y-4", {
                            })} style={{ borderTopColor: propertyColorToColor(properties[0].color), borderBottomColor: propertyColorToColor(properties[1]?.color) }}>
                                <div className="flex flex-col gap-1 h-full items-center">
                                    <div className="text-[10px] text-gray-600 text-center">
                                        <span className="text-sm flex gap-1">
                                            {properties[0]?.rent_values?.map((rv, i) => (
                                                <span key={i} className="rounded-sm px-1 text-white " style={{ backgroundColor: propertyColorToColor(properties[0]?.color) }}>
                                                    {rv}
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                    <div className="flex flex-1 flex-col items-center justify-center">
                                        <div className="text-sm text-gray-600">${value}</div>
                                        <div className="text-[8px] tracking-widest">PROPERTY WILD</div>
                                    </div>
                                    <div className="text-[10px] text-gray-600 text-center">
                                        <span className="text-sm flex gap-1">
                                            {properties[1]?.rent_values?.map((rv, i) => (
                                                <span key={i} className="rounded-sm px-1 text-white " style={{ backgroundColor: propertyColorToColor(properties[1]?.color) }}>
                                                    {rv}
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    default:
                        return (
                            <div className={clsx("h-full w-full flex items-center justify-center p-1 rounded-md border-y-[16px] border-t-purple-300 bg-gradient-to-b from-purple-300 via-pink-200 to-purple-300 border-b-purple-300", {
                            })}>
                                <div className="flex flex-col items-center gap-1">
                                    <div>
                                        {properties[0]?.rent_values?.join(", ")}
                                    </div>
                                    <div className="text-[8px] mt-auto tracking-widest whitespace-normal mx-2 text-center">PROPERTY WILD</div>
                                    <div>
                                        {properties[1]?.rent_values?.join(", ")}
                                    </div>
                                </div>
                            </div>
                        )
                }

            case "Action":
                return (
                    <div
                        className={clsx(
                            "h-full w-full flex items-center justify-center p-1 rounded-md",
                            "border-[3px]",
                            {
                                "border-yellow-400": name === "Pass Go" || name === "It's My Birthday",
                                "border-purple-500": name === "Deal Breaker",
                                "border-blue-500": name === "Forced Deal" || name === "Sly Deal",
                                "border-green-500": name === "Debt Collector" || name === "Double The Rent",
                                "border-orange-500": name === "House" || name === "Hotel",
                                "border-red-600": name === "Just Say No",
                            }

                        )}
                    >
                        <div className="flex flex-col text-center text-sm h-full">
                            <div className="flex-1 flex flex-col items-center gap-1 px-1 mt-1">
                                <div className="font-semibold break-words whitespace-normal">{name}</div>
                                {/* <div className="text-xs text-gray-500">{description}</div> */}
                            </div>
                            <div className="text-sm text-gray-600">${value}</div>
                            <div className="text-[8px] mt-auto tracking-widest">ACTION</div>
                        </div>

                    </div>
                );

            case "Rent":
                return (
                    <div className={clsx("h-full w-full flex items-center justify-center p-1 rounded-md border-[3px] border-gray-400")}>
                        <div className="flex flex-col text-center text-sm h-full">
                            <div className="flex-1 flex flex-col items-center gap-1 px-1 mt-1">
                                <div className="flex font-semibold break-words whitespace-normal">RENT</div>
                                <div className="flex gap-1 mt-1">
                                    {colors.length === 1 && colors[0] === "Wild" ? (
                                        colors.map((color, idx) => (
                                            <div key={idx} className="w-12 h-4 rounded-full shadow-sm bg-gradient-to-r from-blue-500 via-pink-500 to-orange-500" />
                                        ))
                                    ) : (
                                        colors.map((color, idx) => (
                                            <div key={idx} className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: propertyColorToColor(color) }} />
                                        ))
                                    )}
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">${value}</div>
                            <div className="text-[8px] mt-auto tracking-widest">ACTION</div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div
            className={clsx("cursor-pointer transition-all ease-in-out bg-white relative z-50", (id === selectedCardID) && "animate-pulse translate-y-2 scale-110")}
            onClick={HandleClick}
        >
            <div className="select-none w-[90px] h-[130px] min-w-[90px] rounded-md border border-gray-200 shadow-md ">
                {renderContent()}
            </div>
        </div>
    );
}
