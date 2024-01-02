document.addEventListener('DOMContentLoaded', () => {
    const TOTAL_TRASHCANS = 15;
    const TOTAL_BUTTONS = 2;
    let trashcans = [];
    let containers = [];
    let foundButtons = 0;
    let clicks = 0;
    const gameArea = document.getElementById('gameArea');
    const resetButton = document.getElementById('resetButton');
    const clicksDisplay = document.createElement('div');
    const foundButtonsDisplay = document.createElement('div');
    let positions = new Array(TOTAL_TRASHCANS).fill(false);
    let buttons = [];
    let lastClickedButton = null;

    function adjustHeight() {
        const gameArea = document.getElementById('gameArea');
        gameArea.style.height = window.innerHeight + 'px';
    }

    adjustHeight();

    /*function positionTrashcans() {
    const areaWidth = gameArea.clientWidth;
    const areaHeight = gameArea.clientHeight;
    const trashcanSize = window.innerWidth * 0.05; // 5% of the viewport width
    
    trashcans.forEach(trashcan => {
        let x, y, overlap;
        do {
            overlap = false;
            x = Math.random() * (areaWidth - trashcanSize);
            y = Math.random() * (areaHeight - trashcanSize);

            // Check for overlap with other trashcans
            trashcans.forEach(other => {
                if (other !== trashcan) {
                    const otherX = parseInt(other.style.left, 10);
                    const otherY = parseInt(other.style.top, 10);
                    if (Math.abs(x - otherX) < trashcanSize && Math.abs(y - otherY) < trashcanSize) {
                        overlap = true;
                    }
                }
            });
        } while (overlap);

        trashcan.style.left = `${x}px`;
        trashcan.style.top = `${y}px`;
    });
}*/

    function updateDisplays() {
        clicksDisplay.textContent = `Clicks: ${clicks}`;
        foundButtonsDisplay.textContent = `Found Buttons: ${foundButtons}`;
    }

    function initializeGame() {
        gameArea.innerHTML = '';
        trashcans = [];

        const trashcanSizeVH = window.innerWidth <= 600 ? 6 : 5;
        let trashcanSizePx = (trashcanSizeVH / 100) * window.innerHeight;
        // Assign buttons to random trashcans
        for (let i = 0; i < TOTAL_BUTTONS; i++) {
            let pos;
            do {
                pos = Math.floor(Math.random() * TOTAL_TRASHCANS);
            } while (positions[pos]);
            positions[pos] = true;
        }


        const maxAttempts = 200;
        for (let i = 0; i < TOTAL_TRASHCANS; i++) {
            const trashcan = document.createElement('div');
            trashcan.classList.add('trashcan');

            const container= document.createElement('div');
            container.classList.add('container');

            let xPercent, yPercent, overlap;
            let attempts = 0;

            do {
                overlap = false;
                //const gameAreaRect = gameArea.getBoundingClientRect();
                //const maxXPercent = (gameAreaRect.width - (trashcanSizeVH * window.innerWidth / 100)) / window.innerWidth * 100;
                //const maxYPercent = (gameAreaRect.height - (trashcanSizeVH * window.innerWidth / 100)) / window.innerHeight * 100;
                const xPositionPx = Math.random() * (window.innerWidth - trashcanSizePx);
                const yPositionPx = Math.random() * (window.innerHeight - trashcanSizePx);
                xPercent = (xPositionPx / window.innerWidth) *100;
                //yPercent = (Math.random() * (100 - (2 * trashcanSizeVH))) + trashcanSizeVH;
                 yPercent = (yPositionPx / window.innerHeight) * 100;
                
                containers.forEach(other => {
                    const otherX = parseFloat(other.style.left);
                    const otherY = parseFloat(other.style.top);
                    if (Math.abs(xPercent - otherX) < trashcanSizeVH *1.5 && 
                        Math.abs(yPercent - otherY) < trashcanSizeVH *1.5) {
                        overlap = true;
                    }
                });
                if (attempts++ > maxAttempts) {
                    console.log('Max attempts break');
                    break;
                }
            } while (overlap);

                container.style.left = `${xPercent}%`;
                container.style.top = `${yPercent}%`;
                trashcan.dataset.hasButton = positions[i];
                container.addEventListener('click', e => handleTrashcanClick(e, trashcan));
                gameArea.appendChild(container);
                container.appendChild(trashcan);
                containers.push(container);

                if (positions[i]) {
                // Create a button and position it directly behind the trashcan
                const button = document.createElement('div');
                button.classList.add('button');
                button.style.display = 'none'; // Initially hidden
                container.appendChild(button); // Append the button to the game area
                buttons.push(button); // Store the button for later use
            }
        }
        
        clicks = 0;
        foundButtons = 0;
        updateDisplays();
    }

   

    function handleTrashcanClick(e, trashcan) {
        //const currentColor = window.getComputedStyle(trashcan).backgroundColor;
        //console.log(`Clicks: ${clicks}, Color: ${currentColor}`)

        const clickedElement = e.target;


        if (clicks >= 2) {
            return;
        }
        if (clickedElement.classList.contains('trashcan')) {

        trashcan.style.visibility = 'hidden';
        //const trashcanIndex = trashcans.indexOf(trashcan);
        //if (positions[trashcanIndex]) {
          //  const button = buttons[trashcanIndex];
            //button.style.display = 'block'; // Reveal the button
            //}

            if (trashcan.dataset.hasButton === 'true') {
                const button = trashcan.nextElementSibling;
                button.style.display = 'block';
            }
        }


        // Reveal the trashcan's state
        //trashcan.style.backgroundColor = trashcan.dataset.hasButton === 'true' ? 'red' : 'transparent';
        if (lastClickedButton !== trashcan) {
            foundButtons += trashcan.dataset.hasButton === 'true' ? 1 : 0;
        }
        clicks++;
        updateDisplays();
        lastClickedButton = trashcan;
        // Check and reset the round after two clicks
        if (clicks === 2) {
            setTimeout(() => {
                if (foundButtons === 2) {
                    alert("You won! #026 is the answer! (which is Raichu's pokedex #!)");
                } else {
                    lastClickedButton = null;
                    alert("Try again!");
                }
                resetRound();
            }, 100); // Delay to allow the player to see the second choice
        }
    }
    
    function resetRound() {
        // Reset the state for a new round
        clicks = 0;
        foundButtons = 0;
    
        containers.forEach(container => {
            // Assuming the first child of the container is always the trashcan
            const trashcan = container.firstChild;
            trashcan.style.visibility = 'visible';
    
            // Check if there is a button in this container and hide it
            if (trashcan.dataset.hasButton === 'true') {
                const button = trashcan.nextElementSibling;
                button.style.display = 'none';
            }
        });
    
        updateDisplays();
    }
    window.addEventListener('resize', adjustHeight);
    resetButton.addEventListener('click', initializeGame);
    gameArea.before(clicksDisplay, foundButtonsDisplay);
    initializeGame();
});
