//max number of particles that can exist one on screen 
MAX_NUMER_OF_ENTITIES_PER_ARRAY = 150;

//size of circles
MIN_SIZE = 0.6;
MAX_SIZE = 2;

//distance of lines
MIN_DISTANCE = 30;
MAX_DISTANCE = 110;

//color
BALL_COLOR = "white";
LINE_COLOR = "white";

//initial speed of spreading of shapes n >= MIN_SPEED_POSIBLE
CONST_SPEED = 0.3;

SPEED_LEFT = 0.5;
SPEED_RIGHT = 0.5; 
SPEED_UP = 0.5;
SPEED_DOWN = 0.5; 

MIN_SPEED_POSSIBLE = 0.01;

//make CONST_SPEED to null for individualt speed to take effect
if(CONST_SPEED != null){
    SPEED_LEFT = CONST_SPEED;
    SPEED_RIGHT = CONST_SPEED;
    SPEED_UP = CONST_SPEED;
    SPEED_DOWN = CONST_SPEED;
}

//speed of shape Decay
MIN_SPEED_OF_DECAY = 0.00001;
MAX_SPEED_OF_DECAY = 0.0001;

//min size of shapes until regenerating
MIN_SIZE_DECAY = 0.5;

// radius around mouse that will make shapes move aside
RADIUS_AROUND_MOUSE = 150;

//how faster will shapes decay around mouse
SPEED_OF_DECAY_INCREASE_AROUD_MOUSE = 50;

//atraction force around mouse (high number = low attraction) n >= 1
ATTRACTION_FORCE = 45;

//maximum opacity of the regions created between shapes 0 < n < 1
MAX_SHAPE_OPACITY = 0.8;

//color of shapes of the geions as rgb values
COLOR_OF_SHAPES = "255,255,255"; 

//the glabal opacicity of the whole canvas 0 < n < 1
GLOBAL_OPACITY_OF_SPAHES = 0.5;

//Number of layer(specific arrays of dots that will interact with each other)
NUMBER_OF_ARRAYS = 2;

//other global objects
const mainArray = [];
for(let i = 0; i < NUMBER_OF_ARRAYS; i++){
    let arr = [];
    mainArray.push(arr);
}
ctx = createCanvas("canvas1");
ctx.globalAlpha = GLOBAL_OPACITY_OF_SPAHES;
let mouse = {
	x: null,
	y: null
}

window.addEventListener('resize',
    function(){
        ctx.globalAlpha = GLOBAL_OPACITY_OF_SPAHES;
    }
)

window.addEventListener('mousemove', 
	function(event){
		mouse.x = event.x + canvas.clientLeft/2;
		mouse.y = event.y + canvas.clientTop/2;
});

window.addEventListener('click', 
	function(event){
		
        console.log("cick: " + mouse.x + " : " + mouse.y);
            for(let j = 0; j < NUMBER_OF_ARRAYS; j ++){
                for(let i = 0; i < mainArray[j].length; i++){
                if(mainArray[j][i].distance < RADIUS_AROUND_MOUSE * 20){
                    
                    if(Math.sign(mainArray[j][i].speedX) != Math.sign(mainArray[j][i].dx)) 
                    mainArray[j][i].speedX = -mainArray[j][i].speedX;
                    
                    if(Math.sign(mainArray[j][i].speedY) != Math.sign(mainArray[j][i].dy)) 
                    mainArray[j][i].speedY = -mainArray[j][i].speedY;
                    
                    if(mainArray[j][i].x.between(mouse.x+20, mouse.x-20)) 
                    mainArray[j][i].speedX = 0;
                    
                    if(mainArray[j][i].y.between(mouse.y+20, mouse.y-20)) 
                    mainArray[j][i].speedY = 0;
                
                }
            }
        }
        
});


class Shape{
    constructor(){
        this.x = getRandom(1, w);
        this.y = getRandom(1, h);

        this.size=getRandom(MIN_SIZE, MAX_SIZE);

            // this.speedX=getRandom(-SPEED_LEFT, SPEED_RIGHT);
        this.speedX = getRandomArgument(getRandom(-SPEED_LEFT, -MIN_SPEED_POSSIBLE), getRandom(MIN_SPEED_POSSIBLE, SPEED_RIGHT));
            // this.speedY=getRandom(-SPEED_UP, SPEED_DOWN);
        this.speedY = getRandomArgument(getRandom(-SPEED_UP, -MIN_SPEED_POSSIBLE), getRandom(MIN_SPEED_POSSIBLE, SPEED_DOWN));

        this.color = BALL_COLOR;
        
        //todo: maybe adding density
        this.lineLengh = getRandom(MIN_DISTANCE, MAX_DISTANCE);

        this.speedOfDecay = getRandom(MIN_SPEED_OF_DECAY, MAX_SPEED_OF_DECAY);
    }

    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.hypot(dx, dy);

        this.distance = distance;
        this.dx = dx;
        this.dy = dy;

        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;

        //the closer the stronger the pull
        let force = (RADIUS_AROUND_MOUSE - distance) / RADIUS_AROUND_MOUSE;
        if(force < 0) force = 0;

        this.dirX = (forceDirectionX * force * this.lineLengh) / ATTRACTION_FORCE;
        this.dirY = (forceDirectionY * force * this.lineLengh) / ATTRACTION_FORCE;

        if(distance < RADIUS_AROUND_MOUSE + this.size){
            this.size -= this.speedOfDecay * SPEED_OF_DECAY_INCREASE_AROUD_MOUSE;

            this.x += this.dirX + this.speedX;
            this.y += this.dirY + this.speedY;

            //event horizon radius
            if(distance < RADIUS_AROUND_MOUSE / 10 + this.size){
                this.size = MIN_SIZE_DECAY;
            }
        //depricated
        //{
        }if(distance == RADIUS_AROUND_MOUSE + this.size){
            this.size -= this.speedOfDecay * SPEED_OF_DECAY_INCREASE_AROUD_MOUSE;

            this.speedX = -this.speedX;
            this.speedY = -this.speedY;
        }
        //}  
        else{
            this.x += this.speedX;
            this.y += this.speedY;
        }
        
        this.size -= this.speedOfDecay;
    }

    draw(){
        ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
            ctx.fillStyle = this.color;
            ctx.fill();
        ctx.closePath();
    }
}


function drawConections(i, arr){
    for (let j = i+1; j < arr.length; j++) {
        shape1 = arr[i];
        shape2 = arr[j];
        distance_1_2 = dist(shape1.x, shape1.y, shape2.x, shape2.y);

        //draw conections
        if (distance_1_2 <= shape2.lineLengh) {
            ctx.beginPath();
                ctx.strokeStyle = LINE_COLOR;
                ctx.lineWidth = (1 - distance_1_2/shape2.lineLengh);
                ctx.moveTo(shape1.x, shape1.y);
                ctx.lineTo(shape2.x, shape2.y);
                ctx.stroke();
            ctx.closePath();

            //draw shapes in between 3 points
            for(let t = j+1; t < arr.length; t++){
                shape3 = arr[t];
                distance_2_3 = dist(shape2.x, shape2.y, shape3.x, shape3.y);
                distance_1_3 = dist(shape1.x, shape1.y, shape3.x, shape3.y);
                if(distance_2_3 <= shape3.lineLengh && distance_1_3 <= shape3.lineLengh){
                    ctx.beginPath();
                        normalisedShapeOpacity = 1 - Math.max(distance_1_2/shape2.lineLengh, distance_2_3/shape3.lineLengh, distance_1_3/shape3.lineLengh);
                        normalisedMaxShapeOpacity = 1 - MAX_SHAPE_OPACITY;
                        ctx.fillStyle = "rgba("+ COLOR_OF_SHAPES +","+ (normalisedShapeOpacity - normalisedMaxShapeOpacity) +")";
                        ctx.moveTo(shape1.x, shape1.y);
                        ctx.lineTo(shape2.x, shape2.y);
                        ctx.lineTo(shape3.x, shape3.y);
                        ctx.fill();
                    ctx.closePath();
                }
            }
        }
        
    }
}

function drawShapes(arr){
    let shapesToRemove = [];

    for (let i = 0; i < arr.length; i++) {
        arr[i].update();
        arr[i].draw();
        drawConections(i, arr);

        if (arr[i].x >= w || arr[i].x <= 0) {
            arr[i].speedX = -arr[i].speedX;
        }

        if (arr[i].y >= h || arr[i].y <= 0) {
            arr[i].speedY = -arr[i].speedY;
        }

        if (arr[i].x >= w + 2 || arr[i].x <= -2 ||
            arr[i].y >= h + 2 || arr[i].y <= -2 ||
            arr[i].size <= MIN_SIZE_DECAY) {
            shapesToRemove.push(i);
        }
    }

    for (let i = shapesToRemove.length - 1; i >= 0; i--) {
        arr.splice(shapesToRemove[i], 1);
        arr.push(new Shape());
    }
}



function init(){
    for(let i = 0; i < NUMBER_OF_ARRAYS; i++){
        for(let j = 0; j < MAX_NUMER_OF_ENTITIES_PER_ARRAY; j++){
            mainArray[i].push(new Shape);
        }
    }
    console.log(mainArray);
} 
init();

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i = 0; i < NUMBER_OF_ARRAYS; i++){
        drawShapes(mainArray[i]);
    }
    requestAnimationFrame(animate);
}
animate();
