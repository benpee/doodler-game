console.log('Hello there!')


document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');
    let doodlerLeftSpace = 50;
    let doodlerBottomSpace = startPoint;
    let platformCount = 5;
    let platforms = [];
    let upTimerId, downTimerId, leftTimerId, rightTimerId;
    let isJumping = true;
    let startPoint = 150
    let isGoingLeft = false;
    let isGoingRight = false;
    let score = 0;

    function createDoodler() {
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerLeftSpace = platform[0].left;
        doodler.style.left = `${doodlerLeftSpace}px`;
        doodler.style.bottom = `${doodlerBottomSpace}px`;
    }

    class Platform {
        constructor(newPlatform) {
            this.bottom = newPlatBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = `${this.left}px`;
            visual.style.bottom = `${this.bottom}px`;
            grid.appendChild('visual');
        }
    }

    function createPlatforms() {
        for (let i = 0; i < platformCount; i++) {
            let platformGap = 500 / platformCount;
            let newPlatBottom = 100 + i * platformGap;
            let newPlatform = new platform()
            platforms.push(newPlatform)
        }
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4;
                let visual = platform.visual;
                visual.style.bottom = `${platform.bottom}px`;

                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform');
                    platforms.shift();
                    score++;
                    let newPlatform = new Platform(600);
                    platforms.push(newPlatform);
                }
            })
        }
    }

    function jump() {
        clearInterval(downTimerId);
        upTimerId = setInterval(() => {
            doodlerBottomSpace += 20;
            doodler.style.bottom = `${doodlerBottomSpace}px`;

            if (doodlerBottomSpace > startPoint + 200) fall();
        }, 30);
    }

    function fall() {
        clearInterval(upTimerId)
        isJumping = false;
        downTimerId = setInterval(() => {
            doodlerBottomSpace -= 5;
            doodler.style.bottom = `${doodlerBottomSpace}px`;

            if (doodlerBottomSpace <= 0) gameOver();

            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) && !isJumping
                )
                    //Landed and jump again
                    startPoint = doodlerBottomSpace;
                jump();
            })
        }, 30)
    }

    function gameOver() {
        isGameOver = true;
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild);
        }
        grid.innerHTML = score;
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
    }

    function control(e) {
        if (e.key === "ArrowLeft")
            // Move left
            moveLeft();

        if (e.key === "ArrowRight")
            // Move right
            moveRight();

        if (e.key === "ArrowUp")
            // Move straight
            moveUp();
    }

    function moveLeft() {
        isGoingLeft = true;
        if (isGoingRight) {
            clearInterval(rightTimerId);
            isGoingRight = false;
        }

        leftTimerId = setInterval(() => {
            if (doodlerLeftSpace >= 0) {
                doodlerLeftSpace -= 5;
                doodler.style.left = `${doodlerLeftSpace}px`
            } else { moveRight() }
        })
    }

    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimerId);
            isGoingLeft = false;
        }

        isGoingRight = true;
        rightTimerId = setInterval(() => {
            if (doodlerLeftSpace <= 340) {
                doodlerLeftSpace += 5;
                doodler.style.left = `${doodlerLeftSpace}px`
            } else { moveRight() }
        })
    }

    function moveUp() {
        isGoingRight = false;
        isGoingLeft = false;
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
    }

    function start() {
        if (!isGameOver) {
            // Attach button to it personally
            createPlatforms();
            createDoodler();
            setInterval(movePlatforms, 30);
            jump();
            document.addEventListener('keyup', control);
        }
    }
    start();
})

