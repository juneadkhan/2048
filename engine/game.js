export default class Game {
    constructor(size) {
        this.size = size
        this.moveArray = []
        this.winArray = []
        this.loseArray = []

        // Game State Object
        this.gameState = {
            board: [],
            score: 0,
            won: false,
            over: false
        }

        this.setupNewGame()
    }

    setupNewGame() {
        this.board = new Array(this.size * this.size).fill(0)
        this.board3D = Array(this.size).fill().map(() => Array(this.size).fill(0))

        let tile1 = this.addTile()
        let tile2 = this.addTile()

        while (tile1.x == tile2.x && tile1.y == tile2.y) {
            tile2 = this.addTile()
        }

        // Update board to correspond with board3D
        this.gameState.board = [].concat.apply([], this.board3D)
    }

    addTile() {
        let openSpots = []
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board3D[i][j] == 0 || this.gameState.board == 0) {
                    openSpots.push({ x: i, y: j })
                }
            }
        }
        // P(2) = 0.9, P(4) = 0.1
        if (openSpots.length > 0) {
            let randomTilePosition = openSpots[Math.floor(Math.random() * openSpots.length)]
            let num = Math.random(1)
            let value = 4
            if (num > 0.1) {
                value = 2
            }
            this.board3D[randomTilePosition.x][randomTilePosition.y] = value
            return randomTilePosition

        }
    }

    loadGame(gameState) {
        // Intialize gameState object
        this.gameState = gameState
        // Intialize board3D to board value.
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.board3D[i][j] = this.gameState.board[(i * this.size) + j]
            }
        }
    }

    // Grid Manipulation Methods:

    flip(inputGrid) {
        for (let i = 0; i < this.size; i++) {
            inputGrid[i].reverse()
        }
        return inputGrid
    }

    slide(row) { return (Array(this.size - (row.filter(val => val)).length).fill(0)).concat((row.filter(val => val))) }

    rotate(inputGrid) { return inputGrid.map((val, index) => inputGrid.map(row => row[index]).reverse()) }

    operate(row) { return this.slide(this.combineTiles(this.slide(row))) }

    combineTiles(row) {
        for (let i = this.size - 1; i >= 0; i--) {
            let a = row[i]
            let b = row[i - 1]
            if (a == b) {
                row[i] = a + b
                row[i - 1] = 0
                this.gameState.score += row[i]
            }
        }
        return row
    }

    compareGrids(grid1, grid2) {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (grid1[i][j] != grid2[i][j]) {
                    return true
                }
            }
        }
        return false
    }

    isMovePossible(tiles) {
        let canCombine = false

        for (let i = 0; i < tiles.length - 1; i++) {
            if (tiles[i] == tiles[i + 1]) {
                canCombine = true
            }
        }

        return canCombine || (tiles.length < this.size)
    }

    isGameOver() {

        for (let i = 0; i < this.size; i++) {
            let tiles = this.board3D[i].filter(x => x)

            // Horizontal Check
            if (this.isMovePossible(tiles)) {
                return false
            }

            // Vertical Check
            tiles = (this.board3D[0].map((col, i) => this.board3D.map(row => row[i]))[i]).filter(x => x)
            if (this.isMovePossible(tiles)) {
                return false
            }

        }

        return true

    }

    isGameWon() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board3D[i][j] == 2048) {
                    return true
                }
            }
        }
        return false
    }

    move(direction) {
        this.gameState.board = this.board3D.reduce((acc, val) => acc.concat(val), []);
        let flipFlag = false
        let rotationFlag = false
        let playFlag = true

        switch (direction) {
            case "right":
                break
            case 'left':
                this.board3D = this.flip(this.board3D)
                flipFlag = true
                break
            case 'up':
                this.board3D = this.rotate(this.board3D)
                rotationFlag = true
                break
            case "down":
                this.board3D = this.rotate(this.board3D)
                this.board3D = this.flip(this.board3D)
                rotationFlag = true
                flipFlag = true
                break
            default:
                playFlag = false
                break
        }

        this.configAndLogicCheck(playFlag, flipFlag, rotationFlag)
    }

    toString() {
        let output = ""
        for (let i = 0; i < this.size; i++) {
            if (i % this.size === 0) {
                output += "\n"
            }
            output += this.gameState.board[i] + " "
        }

        output += "\n" + "MoveArray : " + this.moveArray
        output += "\n" + "Size : " + this.size
        output += "\n" + "winArray : " + this.winArray
        output += "\n" + "LoseArray : " + this.loseArray
        output += "\n" + "Board : " + this.gameState.board
        output += "\n" + "Board3D : " + this.board3D

        return output

    }

    onMove(callback) {
        return this.moveArray.push(callback)
    }

    onWin(callback) {
        return this.winArray.push(callback)
    }

    onLose(callback) {
        return this.loseArray.push(callback)
    }

    getGameState() {
        return this.gameState
    }


    configAndLogicCheck(playFlag, flipFlag, rotationFlag) {
        if (playFlag) {
            let originalBoard = this.board3D.slice()
            for (let i = 0; i < this.size; i++) {
                this.board3D[i] = this.operate(this.board3D[i])
            }
            if (flipFlag) {
                this.board3D = this.flip(this.board3D)
            }
            if (rotationFlag) {
                this.board3D = this.rotate(this.board3D)
                this.board3D = this.rotate(this.board3D)
                this.board3D = this.rotate(this.board3D)
            }
            // If the Grid has changed, Add a Tile
            if (this.compareGrids(originalBoard, this.board3D)) {
                this.addTile()
            }

            this.gameState.board = this.board3D.reduce((acc, val) => acc.concat(val), [])
            // Callbacks
            for (let func in this.moveArray) {
                this.moveArray[func](this.gameState)
            }

            this.gameState.over = this.isGameOver()
            if (this.gameState.over) {
                for (let func in this.loseArray)
                    this.loseArray[func](this.gameState)
            }

            this.gameState.won = this.isGameWon()
            if (this.gameState.won) {
                for (let func in this.winArray)
                    this.winArray[func](this.gameState)
            }
        }
    }s

}