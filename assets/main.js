const gameBoard = document.querySelector(".gameBoard"),
    canvas = document.querySelector("canvas");
canvas.width = gameBoard.offsetWidth;
canvas.height = gameBoard.offsetHeight;
const ctx = canvas.getContext("2d");

const road = new Image;
road.src = 'assets/way.png';

const barrier = new Image;
barrier.src = 'assets/barrier.png';

let roady = 0,
    barriery = -80,
    barrierx = 85,
    barrierheight = 71;
let roadypast = -canvas.height;
let traveled = 0;
let score = traveled,
    heart = 5,
    interval,
    carModel,
    newimg,
    mostScore = 0;

class Car {
    constructor(x = 0, move = 0) {
        this.x = x;
        this.y = canvas.height - 151 - 20;
        this.move = move;
        this.img = new Image;
        this.img.src = 'assets/car.png';
    }
    draw() {
        ctx.drawImage(this.img, this.x, this.y, 80, 151);
    }

    update() {
        this.x += this.move;
        this.draw();
    }
    crashDetection() {
        return (
            this.y <= barriery + barrierheight && this.y >= barriery && this.x >= barrierx && this.x <= barrierx + 80
        )
    }
}


const roadAnimate = () => {
    if (roady >= canvas.height) {
        roady = 0;
        roadypast = -canvas.height
    }
    if (barriery >= canvas.height) {
        barrierx = barrierx == 85 ? 200 : 85;
        barriery = -80
    };
    ctx.drawImage(road, 0, roady, canvas.width, canvas.height);
    ctx.drawImage(road, 0, roadypast, canvas.width, canvas.height);
    ctx.drawImage(barrier, barrierx, barriery, 80, barrierheight)
    let speed = 1;
    if (score >= 120 && score < 240) {
        speed = 4;
    } else if (score >= 240) {
        speed = 6;
    }
    roady += speed;
    barriery += speed;
    roadypast += speed;
    traveled++;
    if (traveled == 100) {
        score += 1;
        traveled = 0
    };
}

const animate = () => {
    requestAnimationFrame(animate);
    document.getElementById("heart").innerText = heart;
    document.getElementById("score").innerText = score;
    if (score > mostScore) document.getElementById("mostScore").innerText = score;
    else document.getElementById("mostScore").innerText = mostScore;
    if (carModel.move > 0) if (carModel.x >= 199) carModel.move = 0;
    if (carModel.move < 0) if (carModel.x <= 85) carModel.move = 0;
    if (carModel.crashDetection()) {
        barriery = 2000;
        heart--
    };
    if (heart < 5) {
        carModel.img = newimg;
    }
    if (heart <= 0) {
        document.getElementById("end").classList.add("active");
        clearInterval(interval);
        cancelAnimationFrame(animate);
    }
    carModel.update();
}

onkeydown = (evn) => {
    let key = evn.code;
    switch (key) {
        case "ArrowLeft":
            if (carModel.x == 200) carModel.move = -5;
            break;
        case "ArrowRight":
            if (carModel.x == 85) carModel.move = 5;
            break;
    }
}

let controllers = document.querySelectorAll(".mobileController > span");
for(let controller of controllers) {
    controller.onclick = () => {
        if(controller.classList.contains("left")) {
            if (carModel.x == 200) carModel.move = -5;
        } else {
            if (carModel.x == 85) carModel.move = 5;
        }
    }
}

// start game
let stared = false;
let startModals = Array.from(document.querySelectorAll(".modal"));
startModals.forEach(startModal => {
    let startbtn = startModal.children[0].children[startModal.children[0].children.length - 1];
    startbtn.onclick = () => {
        carModel = new Car(85);
        newimg = new Image;
        newimg.src = 'assets/car-crashed.png';
        heart = 5;
        score = 0;
        traveled = 0;
        stared = true;
        interval = setInterval(roadAnimate, 10);
        animate();
        startModal.classList.remove('active');
    }
})