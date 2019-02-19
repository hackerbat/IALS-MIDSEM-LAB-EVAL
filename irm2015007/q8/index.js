var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')


var rows = 13,
    cols = 13,
    points = [],
    springs = [],
    sep = 25,
    gravity = 0.5,
    friction = 0.9,
    clamps = [],
    t = 0,
    curr = 0

function distance(pa , pb) {
    let dx = pa.x - pb.x
    let dy = pa.y - pb.y
    return Math.sqrt(dx* dx + dy * dy)
}    

function createCloth() {
    for(let i = 0 ; i < rows ; i++) {
        for(let j = 0 ; j < cols ; j++) {
            let x = 200 + j * sep
            let y = 100 + i * sep
            points.push({x:x , y:y , prev_x : x - 5 , prev_y : y - 5 , isfixed : 0})
        }
    }

    for(let  i = 0 ; i < rows - 1 ; i++) {
        for(let j = 0 ; j < cols - 1 ; j++) {
            let p1 = points[i * cols + j]
            let p2 = points[i * cols + j + 1]
            let p3 = points[(i + 1) * cols + j]
            springs.push({p1 : p1 , p2 : p2 , len : distance(p1 , p2)})
            springs.push({p1 : p1 , p2 : p3 , len : distance(p1 , p3)})
        }
    }

    for(let i = 0 ; i < rows - 1 ; i++) {
        let p1 = points[i * rows + cols -1],
            p2 = points[(i + 1) * rows + cols - 1]
        springs.push({p1 : p1 , p2 : p2 , len : distance(p1 , p2)})
    }

    for(let j = 0 ; j < cols - 1 ; j++) {
        let p1 = points[(rows - 1) * cols + j],
            p2 = points[(rows - 1) * cols + j + 1]
        springs.push({p1 : p1 , p2 : p2 , len : distance(p1 , p2)})
    }
    points[0].isfixed = 1
    // points[3].isfixed = 1
    points[6].isfixed = 1
    // points[9].isfixed = 1
    points[cols - 1].isfixed = 1
    clamps.push(0)
    // clamps.push(3)
    clamps.push(6)
    // clamps.push(9)
    clamps.push(12)
}

function displayPoints() {
    for (let i = 0 ; i < points.length ; i++) {
        let p = points[i]
        ctx.beginPath()
        ctx.arc(p.x , p.y , 5 , 0 , Math.PI * 2)
        ctx.fillStyle = 'black'
        ctx.fill()
    }
}

function displaySprings() {
    ctx.beginPath()
    for(let i = 0 ; i < springs.length ; i++) {
        let s = springs[i]
        ctx.moveTo(s.p1.x, s.p1.y);
        ctx.lineTo(s.p2.x, s.p2.y);
    }
    ctx.stroke()
}

function updatePoints() {
    for(let i = 0 ; i < points.length ; i++) {
        let p = points[i],
            vx = (p.x - p.prev_x) * friction
            vy = (p.y - p.prev_y) * friction
        
        if(p.isfixed == 1) {
            continue
        }
        p.prev_x = p.x
        p.prev_y = p.y
        p.x += vx
        p.y += vy
        p.y += gravity
        t++
        if((t % 20000) == 0 && curr < 3 ) {
            points[clamps[curr]].isfixed = 0
            curr++
        }
    }
}

function constrainPoints() {
    for(let i = 0 ; i < points.length ; i++) {
        let p = points[i],
            vx = (p.x - p.prev_x) * friction
            vy = (p.y - p.prev_y) * friction
        if(p.x > 500) {
            p.x = 500
            p.prev_x = p.x + vx
        } else if(p.x < 0) {
            p.x = 0
            p.prev_x = p.x + vx
        }
        if(p.y > 500) {
            p.y = 500
            p.prev_y = p.y + vy
        } else if(p.y < 0) {
            p.y = 0
            p.prev_y = p.y + vy
        }
    }
}

function updateSprings() {
    for(let i = 0 ; i < springs.length ; i++) {
        let s = springs[i],
            dx = s.p2.x - s.p1.x,
            dy = s.p2.y - s.p1.y,
            dist = Math.sqrt(dx * dx + dy * dy),
            diff = s.len - dist,
            per = diff / dist / 2,
            offsetx = dx * per
            offsety = dy * per
        
        if(s.p1.isfixed != 1) {
            s.p1.x -= offsetx
            s.p1.y -= offsety
        }
        if(s.p2.isfixed != 1) {
            s.p2.x += offsetx
            s.p2.y += offsety
        }
    }
}


function loop () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    updatePoints()
    constrainPoints()
    updateSprings()
    displayPoints()
    displaySprings()
    f = window.requestAnimationFrame(loop)
}

createCloth()
loop()