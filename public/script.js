var socket = io();
let socketInfo;
socket.emit('name');

socket.on('socket-info', (data) => {
    socketInfo = data;
    console.log(data);
});

const canvas = document.getElementById('game');
const game = canvas.getContext("2d");
canvas.width = 1280;
canvas.height = 720;

const gravity = 0.4;

let playerCount = 0;

let playerImage = new Image(60, 45);
playerImage.src = './char.png';

class Player{
    constructor(index, color, x, y, image){
        this.index = index;
        this.color = color;
        this.image = image;
        this.pos = {
            x: x,
            y: y
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 50,
        this.height = 60
    }
    draw(){
        game.fillStyle = this.color;
        // game.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        game.drawImage(this.image, this.pos.x, this.pos.y);
    }
    update(){
        this.draw();
        this.pos.y += this.velocity.y;
        this.pos.x += this.velocity.x;
        this.velocity.y += gravity;
        if(this.pos.y + this.height + this.velocity.y <= 400){
            this.velocity.y += gravity;
        }else{
            this.velocity.y = 0;
        }
    }
}

class Platform{
    constructor(x, y){
        this.pos = {
            x: x,
            y: y
        }
        this.width = 700,
        this.height = 50
    }
    draw(){
        game.fillStyle = 'rgb(10,10,100)';
        game.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
}

const player = new Player(0,'rgb(20,20,20)', 500, 10, playerImage);
let players = [];
const platform = new Platform(300, 400);
let keyPress = {
    w: false,
    a: false,
    s: false,
    d: false
}
function animate(){
    requestAnimationFrame(animate);
    game.fillStyle = 'rgb(84, 84, 209)';
    game.fillRect(0, 0, canvas.width, canvas.height);
    platform.draw();
    socket.emit('player', (player));
    for(let i = 0; i < players.length; i++){
        players[i].draw();
    }
    player.update();
    logic();
}
socket.on('data', (data) => {
    if(data.players.length-1 > playerCount){
        players.push(new Player(1,'rgb(20,200,20)', 600, 10, playerImage));
        playerCount++;
    }
    if(data.players.length-1 < playerCount){
        players.pop();
        playerCount--;
    }
    
    console.log(data);
    let a = 0;
    for(let i = 0; i < data.players.length; i++){
        if(socketInfo != data.players[i].socket){
            players[a].pos.x = data.players[i].x;
            players[a].pos.y = data.players[i].y;
            a++;
        }
    }
});
animate();

function logic(){
    if(keyPress.d){
        player.velocity.x = 3;
    } else if(keyPress.a){
        player.velocity.x = -3;
    } else{
        player.velocity.x = 0;
    }
}

addEventListener('keydown', (event) => {
    let key = event.key;
    switch(key){
        case 'w':
            player.velocity.y = -20;
            break;
        case 'a':
            keyPress.a = true;
            break;
        case 's':
            keyPress.s = true;
            break;
        case 'd':
            keyPress.d = true;
            break;
    }
});

addEventListener('keyup', (event) => {
    let key = event.key;
    switch(key){
        // case 'w':
        //     break;
        case 'a':
            keyPress.a = false;
            break;
        case 's':
            keyPress.s = false;
            break;
        case 'd':
            keyPress.d = false;
            break;
    }
});
