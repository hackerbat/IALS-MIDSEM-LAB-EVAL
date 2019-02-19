var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

var ksa = 1,
    ksr = 1500,
    kor = 10000,
    koa = 0.1,
    gh=0.5,
    gu = 0.9,
    gd = 0.5


function draw_gate(argument) 
{

    ctx.moveTo(250,0);
    ctx.lineTo(250,100);
    ctx.stroke();

    ctx.moveTo(250,500);
    ctx.lineTo(250,400);

    ctx.stroke();
}


function dist(a,b) {
    return Math.sqrt((a[0] - b[0])*(a[0] - b[0]) + (a[1] - b[1])*(a[1] - b[1]) )
}

function clearWindow() {
    ctx.fillStyle = 'white'
    ctx.fillRect(0 , 0 , canvas.width , canvas.height)
}

function circle(r , t) {
    ctx.beginPath()
    ctx.arc(r[0] , r[1] , 10 , 0 , 2*Math.PI , true)
    ctx.closePath()
    if(t == 1) {
    ctx.fillStyle = 'red'
    } else if(t == -1) {
        ctx.fillStyle = 'green'
    }   
    ctx.fill()
}   

function draw () {
    clearWindow()
    draw_gate()
    for(let k = 0 ; k < (2 * n) ; k++) {
        circle(a[k].r , a[k].type)
        a[k].agenta(k)
    }
    f = window.requestAnimationFrame(draw)
}

class Agent {
    
    constructor(r , t) {
        this.r = r
        this.type = t
    }

    agenta(z) {
        let fX = 0,
            fY = 0

        for(let i = 0 ; i < 2 * n ; i++) {
            if(z == i) {
                
                fX +=0;
                a[z].r[0]+=gh*a[z].type;

                if(a[z].type==1)
                {
                    if((a[z].r[1] < 110 || a[z].r[1] > 240) && a[z].r[0] < 250 )
                    {
                        let dy = a[z].r[1] - 175,
                            dx=0,
                            d = Math.sqrt(dx * dx + dy * dy)
                            a[z].r[1] -= gh * dy/100
                    }
                }
                else
                {
                    if((a[z].r[1] > 390 || a[z].r[1] < 260 ) && a[z].r[0] > 250)
                    {
                        let dy = a[z].r[1] - 325,
                            dx=0,
                            d = Math.sqrt(dx * dx + dy * dy)
                            a[z].r[1] -= gh * dy/100
                    }
                }
                continue
            }
            let dx = a[z].r[0] - a[i].r[0],
                dy = a[z].r[1] - a[i].r[1],
                d = Math.sqrt(dx * dx + dy * dy)
            if(d < 1) {
                d = 5
            }
            if(a[z].type == a[i].type) {
                fX -= ksa * d * (dx / d)
                fY -= ksa * d * (dy / d)
                fX += ksr * (1 / d) * (dx / d)
                fY += ksr * (1 / d) * (dy / d)
            } else {
                fX += kor * (1 / d) * (dx / d)
                fY += kor * (1 / d) * (dy / d)
                fX -= koa * d * (dx / d)
                fY -= koa * d * (dy / d)
            }
        }
        a[z].r[0] += fX / 1000
        a[z].r[1] += fY / 1000

        if(a[z].r[1]>390 || a[z].r[1]<110)
        {
            let dx = a[z].r[0] - 250,
                dy=0,
                d = Math.sqrt(dx * dx + dy * dy)

            if(d<20)
            {
                a[z].r[0]+=dx;
            }
        }
    }
}

var a = []


var n = Math.floor(Math.random() * 6)
//var n =1;
for (i = 0 ; i < n ; i++) {
    x = Math.floor(Math.random() * 250) +10
    y = Math.floor(Math.random() * 450) +10
    a.push(new Agent([x,y] , 1))
}


for (i = 0 ; i < n ; i++) {
    x = Math.floor(Math.random() * 250) + 260
    y = Math.floor(Math.random() * 450) + 10
    a.push(new Agent([x,y] , -1))
}




draw()
