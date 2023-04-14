var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 100

var dino = {
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    draw: function () {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


class Catus {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


var timer = 0;
var catuss = [];

function 프레임마다실행되는함수() {
    // 지금은 아무것도 안함
    requestAnimationFrame(프레임마다실행되는함수);
    timer += 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (timer % 60 == 0) {
        var catus = new Catus(canvas.width, 100, 100, 100);
        catuss.push(catus);
    }

    catuss.forEach(function (catus, i, origin) {
        if (catus.x < 100) {
            origin.splice(i, 1);
        }
        catus.x -= 10;
        catus.draw();
    })

    if (isJumping) {
        dino.y -= 10;
        jumpTimer++;
    }

    if (jumpTimer > 10 && dino.y < 100) {
        console.log()
        dino.y += 10;
        isJumping = false;
    }

    dino.draw();
}

프레임마다실행되는함수();

var isJumping = false;
var jumpTimer = 0;
document.addEventListener('keydown', function (e) {
    console.log("test", e.code)
    if (e.code == 'Space') {
        isJumping = true;
        jumpTimer = 0;
    }
})