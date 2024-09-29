import { useEffect, useState } from 'react';
import '../Styles/Home.css';
import { pokerRanges } from './JLRanges';

function Home() {
    const [rangeSet, setRangeSet] = useState([]); // 2D array for card selection
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [selectedRange, setSelectedRange] = useState("UTG");
    const [selectedRangeCategory, setSelectedRangeCategory] = useState('RFI'); // Default category
    const [rangeActual, setRangeActual] = useState([]);
    const [isSelecting, setIsSelecting] = useState(true); // Track whether you're selecting or deselecting
    const [currentAction, setCurrentAction] = useState(1); // Default action: Raise
    const categories = Object.keys(pokerRanges); // Get categories like "RFI", "FacingRFI_EP_MP"
    const [rangeOptions, setRangeOptions] = useState(Object.keys(pokerRanges.RFI)); // Default range options for "RFI"
    const [matches, setMatches] = useState("");
    const cards = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
    var JLRange = pokerRanges;
    // Initialize the 2D card grid on component mount
    useEffect(() => {
        const cardGrid = [];
        for (let i = 0; i < cards.length; i++) {
            const row = [];
            for (let j = 0; j < cards.length; j++) {
                let cardKey;
                if (i === j) {
                    cardKey = `${cards[i]}${cards[j]}`; // Pair
                } else if (i < j) {
                    cardKey = `${cards[i]}${cards[j]}s`; // Suited
                } else {
                    cardKey = `${cards[j]}${cards[i]}o`; // Offsuit
                }
                row.push([cardKey, 0]); // Initialize as unselected
            }
            cardGrid.push(row);
        }
        setRangeSet(cardGrid); // Set the initialized card grid


        const secondGrid = [];
        const something = JLRange.RFI[selectedRange]; // Fetch the selected range (e.g., UTG)
        console.log(something)
        for (let i = 0; i < cards.length; i++) {
            const row = [];
            for (let j = 0; j < cards.length; j++) {
                let cardKey;
                if (i === j) {
                    cardKey = `${cards[i]}${cards[j]}`; // Pair
                } else if (i < j) {
                    cardKey = `${cards[i]}${cards[j]}s`; // Suited
                } else {
                    cardKey = `${cards[j]}${cards[i]}o`; // Offsuit
                }

                // Find if the cardKey exists in the selected range
                const rangeHand = something.find(hand => hand[0] === cardKey);
                const selectedAction = rangeHand ? rangeHand[1] : null; // If exists, get the action

                // Push the card and its selection state (based on whether it's in the range)
                row.push([cardKey, selectedAction || 0]); // false if not selected
            }
            secondGrid.push(row);
        }

        console.log(secondGrid);
        setRangeActual(secondGrid);
    }, []);

    // Handle mouse down event for card selection
    const handleMouseDown = (rowIndex, colIndex) => {
        const alreadySelected = rangeSet[rowIndex][colIndex][1]; // Check if the card is selected
        setIsMouseDown(true);
        setIsSelecting(alreadySelected === 0); // If the card is not selected, we're selecting; otherwise, we're deselecting
        toggleCardSelection(rowIndex, colIndex, alreadySelected === 0 ? currentAction : 0);
    };

    // Handle mouse up event to stop selection
    const handleMouseUp = () => {
        setIsMouseDown(false);
    };

    // Handle mouse enter event to enable dragging selection
    const handleMouseEnter = (rowIndex, colIndex) => {
        if (isMouseDown) {
            // Only toggle based on the `isSelecting` state
            toggleCardSelection(rowIndex, colIndex, isSelecting ? currentAction : 0);
        }
    };

    // Toggle card selection based on the current action (Raise, Call, Bluff)
    const toggleCardSelection = (rowIndex, colIndex, action) => {
        setRangeSet(prevRangeSet => {
            const newRangeSet = prevRangeSet.map((row, i) =>
                row.map((card, j) => {
                    if (i === rowIndex && j === colIndex) {
                        return [card[0], action]; // Set the action or deselect (set to 0)
                    }
                    return card; // No change for other cards
                })
            );
            return newRangeSet;
        });
    };

    // Set the action for Raise, Call, or Bluff
    const setAction = (action) => {
        setCurrentAction(action);
    };

    // Handle dropdown change
    const handleRangeChange = (event) => {
        setSelectedRange(event.target.value); // Change the selected range
        const cardGrid = [];
        const selectedRange = JLRange[selectedRangeCategory][event.target.value]; // Fetch the selected range (e.g., UTG)

        for (let i = 0; i < cards.length; i++) {
            const row = [];
            for (let j = 0; j < cards.length; j++) {
                let cardKey;

                if (i === j) {
                    cardKey = `${cards[i]}${cards[j]}`; // Pair
                } else if (i < j) {
                    cardKey = `${cards[i]}${cards[j]}s`; // Suited
                } else {
                    cardKey = `${cards[j]}${cards[i]}o`; // Offsuit
                }

                // Find if the cardKey exists in the selected range
                const rangeHand = selectedRange.find(hand => hand[0] === cardKey);
                const selectedAction = rangeHand ? rangeHand[1] : 0; // If exists, get the action, otherwise set to 0

                // Push the card and its selection state (based on whether it's in the range)
                row.push([cardKey, selectedAction]);
            }
            cardGrid.push(row);
        }

        setRangeActual(cardGrid); // Update the grid
    };

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setSelectedRangeCategory(category);
        setRangeOptions(Object.keys(pokerRanges[category])); // Update the ranges
        setSelectedRange(Object.keys(pokerRanges[category])[0]); // Reset to the first range in the category
    };

    const formatSelectedCards = () => {
        var items = "";
        rangeSet.map((row, ri) =>
            row.map(([cardKey, selectedAction], ci) => {
                if (selectedAction !== 0) {
                    items += `["${cardKey}", ${selectedAction}],`
                }
            }) // Filter out unselected cards (action 0)
        );
        console.log(items);
    };

    // Example usage
    formatSelectedCards(rangeSet);

    return (
        <div onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            <div>
                {/* Buttons to select the action */}
                {/* Category Dropdown */}
                <label>Select Category: </label>
                <select value={selectedRangeCategory} onChange={handleCategoryChange}>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </select>
                {/* Range Dropdown */}
                <label>Select Range: </label>
                <select value={selectedRange} onChange={handleRangeChange}>
                    {rangeOptions.map((range, index) => (
                        <option key={index} value={range}>{range}</option>
                    ))}
                </select>
            </div>
            <div>
                <button onClick={() => setAction(1)}>Raise</button>
                <button onClick={() => setAction(2)}>Call</button>
                <button onClick={() => setAction(3)}>Bluff</button>
            </div>


            {/* Grid for card selection */}
            <div className="range">
                {rangeSet.map((row, rowIndex) =>
                    row.map(([cardKey, selected], colIndex) => (
                        <button
                            key={`${rowIndex}-${colIndex}`}
                            className={`card value-${selected}`}
                            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                            onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                        >
                            {cardKey}
                        </button>
                    ))
                )}
            </div>
            <button>GET RANGE FOR JSON</button>
            {/* Grid for card selection */}
            <div className="range">
                {rangeActual.map((row, rowIndex) =>
                    row.map(([cardKey, selected], colIndex) => (
                        <button
                            key={`${rowIndex}-${colIndex}`}
                            className={`card value-${selected}`}
                        >
                            {cardKey}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;
