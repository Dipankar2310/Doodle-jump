document.addEventListener('DOMContentLoaded', () => {
    let grid = document.querySelector('.grid')
    let doodler = document.createElement('div')//create a div doodler
    let button = document.querySelector('.start')
    grid.appendChild(button)
    let doodlerLeftSpace = 50
    let startPoint = 140
    let doodlerBottomSpace = startPoint
    let isGameOver = false
    let isGameon = false
    let platFormcount = 5
    let platforms = []
    let upTimerId
    let downTimerId
    let leftTimerId
    let rightTimerId
    let platformTimerId
    let isJumping = false
    let isGoingLeft = false
    let isGoingRight = false
    let platCount
    let badPlatCount = 0
    let score = 0
    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')
            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }

    }
    class Badplat {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')
            const visual = this.visual
            visual.classList.add('badplat')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }

    }
    function createDoodler() {
        grid.appendChild(doodler)//append variable doodler in class grid
        doodler.classList.add('doodler')// add a class of .doodler to the div named doodler
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }
    function createPlatforms() {

        for (let i = 0; i < platFormcount; i++) {
            let platGap = 600 / platFormcount
            let newPlatBottom = 100 + i * platGap
            let rand = Math.random() * 10
            let newPlatform
            if (rand < 7.5 || badPlatCount >= 1) {
                newPlatform = new Platform(newPlatBottom)
                platCount++
            }
            else {
                newPlatform = new Badplat(newPlatBottom)
                badPlatCount++;
            }
            platforms.push(newPlatform)
        }
        i = 0
        doodlerBottomSpace = platforms[0].bottom
    }
    function movePlatforms() {
        if (doodlerBottomSpace > 200) {

            platforms.forEach(platform => {
                platform.bottom -= 5

                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'
                if (platform.bottom < 10 && !isGameOver) {
                    let firstPlatform = platforms[0].visual
                    if (firstPlatform.classList.contains('platform')) {
                        firstPlatform.classList.remove('platform')
                        platforms.shift();
                        platCount--
                    }
                    else {
                        firstPlatform.classList.remove('badplat')
                        platforms.shift();
                        badPlatCount--
                    }
                    let rand = Math.random() * 10
                    let newPlatform
                    if ((rand < 5 || badPlatCount >= 1)) {
                        newPlatform = new Platform(600)
                        platCount++
                        score++


                    }
                    else {
                        newPlatform = new Badplat(600)
                        badPlatCount++;
                        score += 2


                    }

                    platforms.push(newPlatform)

                }

            })
        }
    }
    function gameOver() {
        console.log('game over');
        isGameOver = true;
        isGameon = false;
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score

        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
        clearInterval(platformTimerId)
        grid.appendChild(button)


    }

    function fall() {
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(function () {
            doodlerBottomSpace -= 2
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0) {
                gameOver()
            }
            console.log(startPoint)
            platforms.forEach(plat => {
                let platform = plat.visual
                if (
                    (doodlerBottomSpace >= plat.bottom) &&
                    (doodlerBottomSpace <= plat.bottom + 10) &&
                    ((doodlerLeftSpace + 65) >= plat.left) &&
                    (doodlerLeftSpace + 35 <= plat.left + 85) &&
                    (doodlerBottomSpace < 400) &&
                    !isJumping
                ) {
                    if (platform.classList.contains('badplat')) {
                        gameOver();
                    }
                    else {
                        startPoint = doodlerBottomSpace
                        jump()
                    }
                }
            })
        }, 1)
    }

    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function () {
            doodlerBottomSpace += 2
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace > startPoint + 200) {
                fall()
            }
        }, 1)
    }
    function control(e) {
        if (e.key === "ArrowLeft" && !isGoingLeft) {
            moveLeft();
        }
        else if (e.key === "ArrowRight" && !isGoingRight) {
            moveRight();
        }
        else if (e.key === "ArrowUp") {
            moveStraight();

        }
    }
    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true;
        leftTimerId = setInterval(function () {
            if (doodlerLeftSpace >= 0) {
                doodlerLeftSpace -= 1
                doodler.style.left = doodlerLeftSpace + 'px'
            }
            else moveRight()
        }, 1)
    }
    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true;

        rightTimerId = setInterval(function () {
            if (doodlerLeftSpace <= 300) {
                doodlerLeftSpace += 1
                doodler.style.left = doodlerLeftSpace + 'px'
            }

            else moveLeft()
        }, 1)
    }
    function moveStraight() {
        if (isGoingLeft) {
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        if (isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false
        }

    }


    function start() {
        isGameon = true
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        if (isGameOver === true) {
            isGameOver = false;
            platforms = []
            isJumping = false
            isGoingLeft = false
            isGoingRight = false
            doodlerLeftSpace = 50
            startPoint = 140
            doodlerBottomSpace = startPoint
            platCount = 0
            badPlatCount = 0
            score = 0

            clearInterval(upTimerId);
            clearInterval(downTimerId);
            clearInterval(rightTimerId);
            clearInterval(leftTimerId);
            clearInterval(platformTimerId)

        }

        if (!isGameOver) {

            createPlatforms()
            createDoodler()

            platformTimerId = setInterval(movePlatforms, 20)
            jump()
            document.addEventListener('keydown', control)
        }
    }
    button.addEventListener('click', () => { if (!isGameon) { start() } })

})