<ResizablePanelGroup direction="vertical" className={`hidden h-md:hidden ${players?.length < 3 && "max-h-md:hidden"}`}>
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