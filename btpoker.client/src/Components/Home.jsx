import { useEffect, useState } from 'react';
import '../Styles/Home.css';

function Home() {
    const [selectedCards, setSelectedCards] = useState(new Set());
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isSelecting, setIsSelecting] = useState(true); // New state to track whether we're selecting or deselecting

    const cards = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

    // Handle mouse down event
    const handleMouseDown = (cardKey) => {
        const alreadySelected = selectedCards.has(cardKey);
        setIsMouseDown(true);
        setIsSelecting(!alreadySelected); // Set the mode based on whether the card is already selected
        toggleCardSelection(cardKey, !alreadySelected); // Initial selection/deselection
    };

    // Handle mouse up event
    const handleMouseUp = () => {
        setIsMouseDown(false);
    };

    // Handle mouse enter event for dragging selection
    const handleMouseEnter = (cardKey) => {
        if (isMouseDown) {
            toggleCardSelection(cardKey, isSelecting); // Only continue the initial action (select or deselect)
        }
    };

    // Toggle card selection based on the current mode
    const toggleCardSelection = (cardKey, shouldSelect) => {
        setSelectedCards(prevSelectedCards => {
            const newSelectedCards = new Set(prevSelectedCards);
            if (shouldSelect) {
                newSelectedCards.add(cardKey);
            } else {
                newSelectedCards.delete(cardKey);
            }
            return newSelectedCards;
        });
    };

    // Generate card key (can be anything unique like index1-index2)
    const generateCardKey = (card1, card2, index1, index2) => {
        if (index1 === index2) {
            return `${card2}${card1}`; // Paired cards (e.g., AA, KK)
        } else if (index2 < index1) {
            return `${card2}${card1}o`; // Offsuit (e.g., AKo, KQo)
        } else {
            return `${card1}${card2}s`; // Suited (e.g., AKs, KQs)
        }
    };
    
    return (
        <div onMouseUp={handleMouseUp}>
            <div className="range">
                {
                    cards.map((card1, index1) =>
                        cards.map((card2, index2) => {
                            const cardKey = generateCardKey(card1, card2, index1, index2);
                            const isSelected = selectedCards.has(cardKey);

                            return (
                                <button
                                    key={cardKey}
                                    className={`${index1 === index2 ? "pair" : ""} card ${isSelected ? "selected" : ""}`}
                                    onMouseDown={() => handleMouseDown(cardKey)}
                                    onMouseEnter={() => handleMouseEnter(cardKey)}
                                >
                                    {
                                        index1 === index2
                                            ? `${card2}${card1}`
                                            : index2 < index1
                                                ? `${card2}${card1}o`
                                                : `${card1}${card2}s`
                                    }
                                </button>
                            );
                        })
                    )
                }
            </div>

            <div>{ selectedCards }</div>
        </div>
    );
}

export default Home;