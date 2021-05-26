import Game from "./game.js"

let game = new Game(4)
const $root = $('#root')

export const setup = document.getElementById("body").onload = function () {
    $($root).append(
        `
        <section class="hero is-small is-beige padded">
        <div class="hero-body">
            <div class="container px-6">
                <div class="columns is-vcentered">

                    <div class="column px-6">
<nav class="level">

  <div class="level-item has-text-centered">
    <div>
        <h1>2048</h1>
        <h2>Join the tiles to get to <strong>2048!</strong></h2>
    </div>
  </div>
 

  <div class="level-item has-text-centered">
    <div>
    <div id="score"> <p>SCORE</p> <div id="scoreText">${game.gameState.score}</div></div>
    <button class="button" id="reset"><p>New Game</p></button>
    </div>

  </div>
  
</nav>

<div class="container"
<div id="grid">
<div id="lost"> <br><h3>Game Over!</h3> <h2>Score: ${game.gameState.score} </h2> </div>
<div id="won"> <br><h3>Congrats,<br>You Won!</h3> <h2>Score: ${game.gameState.score} </h2> </div>

</div>
</div>
<br><br>
</div>
</div>

                    </div>


                </div>
            </div>
        </div>
    </section>

  <div class="content has-text-centered py-4 padded">
    <p>
        <strong>How to Play</strong> <br> Use your arrow keys to move the tiles. Tiles with the same number merge into one when they touch. Add them up to reach 2048!
    </p>
  </div>
        `

    );
    $("#lost").hide()
    $("#won").hide()
    let count = 0
    game.gameState.board.forEach(tileValue => {
        if (tileValue == 0) {
            $($('#grid')).append(`<div id ="box${count}"></div>`)
            document.getElementById(`box${count}`).style.backgroundColor = "#CDC1B4"
        } else {
            $($('#grid')).append(`<div id ="box${count}">${tileValue}</div>`)
        }
        count++
    })

    $('#reset').click(function () {
        game.setupNewGame()
        game.gameState.score = 0
        game.gameState.won = false
        game.gameState.over = false
        updateBoard()
    })

}

function updateBoard() {
    for (let i = 0; i < 16; i++) {
        document.getElementById(`box${i}`).innerHTML = game.gameState.board[i]
        if (document.getElementById(`box${i}`).innerHTML == 0) {
            $(`#box${i}`).replaceWith(`<div id ="box${i}"></div>`)
            document.getElementById(`box${i}`).style.backgroundColor = "#CDC1B4"
        } else {
            switch (game.gameState.board[i]) {
                case 2:
                    document.getElementById(`box${i}`).style.backgroundColor = "#EEE4DA"
                    document.getElementById(`box${i}`).style.color = "#776E65"
                    break
                case 4:
                    document.getElementById(`box${i}`).style.backgroundColor = "#EEE1C9"
                    document.getElementById(`box${i}`).style.color = "#776E65"
                    break
                case 8:
                    document.getElementById(`box${i}`).style.backgroundColor = "#f3b27a"
                    document.getElementById(`box${i}`).style.color = "white"
                    break
                case 16:
                    document.getElementById(`box${i}`).style.backgroundColor = "#f69664"
                    document.getElementById(`box${i}`).style.color = "white"
                    break
                case 32:
                    document.getElementById(`box${i}`).style.backgroundColor = "#f77c5f"
                    document.getElementById(`box${i}`).style.color = "white"
                    break
                case 64:
                    document.getElementById(`box${i}`).style.backgroundColor = "#f75f3b"
                    document.getElementById(`box${i}`).style.color = "white"
                    break
                case 128:
                    document.getElementById(`box${i}`).style.backgroundColor = "#edd073"
                    document.getElementById(`box${i}`).style.color = "white"
                    document.getElementById(`box${i}`).style.fontSize = "38px"
                    break
                case 256:
                    document.getElementById(`box${i}`).style.backgroundColor = "#edcc62"
                    document.getElementById(`box${i}`).style.color = "white"
                    document.getElementById(`box${i}`).style.fontSize = "38px"
                    break
            }

        }
    }
    document.getElementById(`score`).innerHTML = `<p>SCORE</p> <div id="scoreText"> ${game.gameState.score} </div>`
    $("#won").hide()
}
$(document).keydown(function (e) {
    switch (e.keyCode) {
        case 37:
            if (game.gameState.won == false && game.gameState.over == false) {
                game.move('left')
                break
            }
        case 38:
            if (game.gameState.won == false && game.gameState.over == false) {
                game.move('up')
                break
            }
        case 39:
            if (game.gameState.won == false && game.gameState.over == false) {
                game.move('right')
                break
            }
        case 40:
            if (game.gameState.won == false && game.gameState.over == false) {
                game.move('down')
                break
            }
    }
});

game.onMove(gameState => {
    updateBoard()
})

game.onLose(gameState => {
    document.getElementById(`lost`).innerHTML = `<br><h3>Game Over!</h3> <h2>Score: ${game.gameState.score} </h2>`
    $("#lost").show()
    $(function () {
        $('#reset').click(function () {
            game.setupNewGame()
            game.gameState.score = 0
            updateBoard()
            $("#grid").show()
            $("#lost").hide()
        })
    })
})

game.onWin(gameState => {
    document.getElementById(`won`).innerHTML = `You won!`
    $("#won").show()
})