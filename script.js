// --- MOBILE MENU TOGGLE ---
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuBtnIcon = document.querySelector('.menu-btn i');
    navLinks.classList.toggle('active');
    
    // Toggle Icon
    if(navLinks.classList.contains('active')) {
        menuBtnIcon.classList.remove('fa-bars');
        menuBtnIcon.classList.add('fa-times');
    } else {
        menuBtnIcon.classList.remove('fa-times');
        menuBtnIcon.classList.add('fa-bars');
    }
}

// --- DARK/LIGHT THEME TOGGLE ---
const themeBtn = document.querySelector('.theme-toggle i');

// Check Local Storage
if(localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    themeBtn.classList.remove('fa-moon');
    themeBtn.classList.add('fa-sun');
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    
    if(document.body.classList.contains('light-mode')) {
        themeBtn.classList.remove('fa-moon');
        themeBtn.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        themeBtn.classList.remove('fa-sun');
        themeBtn.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
    init(); // Redraw particles with new colors
}

// --- NEURAL NETWORK ANIMATION ---
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;
let mouse = { x: null, y: null, radius: (canvas.height/80) * (canvas.width/80) }

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x; mouse.y = event.y;
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        let dx = mouse.x - this.x; let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance < mouse.radius + this.size){
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 10;
            if (mouse.x > this.x && this.x > this.size * 10) this.x -= 10;
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 10;
            if (mouse.y > this.y && this.y > this.size * 10) this.y -= 10;
        }
        this.x += this.directionX; this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 10000;
    
    // Check Theme for Colors
    let isLight = document.body.classList.contains('light-mode');
    let colors = isLight 
        ? ['#0ea5e9', '#6366f1', '#334155'] 
        : ['#38bdf8', '#6366f1', '#2dd4bf', '#ffffff'];

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 0.5;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.5) - 0.25; 
        let directionY = (Math.random() * 0.5) - 0.25;
        
        let color = colors[Math.floor(Math.random() * colors.length)];
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                let opacityValue = 1 - (distance/20000);
                
                let isLight = document.body.classList.contains('light-mode');
                // Darker lines for light mode, light lines for dark mode
                if(isLight) {
                    ctx.strokeStyle = 'rgba(14, 165, 233,' + opacityValue + ')';
                } else {
                    ctx.strokeStyle = 'rgba(56, 189, 248,' + opacityValue + ')';
                }
                
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) { particlesArray[i].update(); }
    connect();
}

window.addEventListener('resize', function() {
    canvas.width = innerWidth; canvas.height = innerHeight;
    init();
});
window.addEventListener('mouseout', function() { mouse.x = undefined; mouse.y = undefined; });
init(); animate();

// --- 2. CURSOR LOGIC ---
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');

document.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
    setTimeout(() => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }, 50);
});

// --- 3. 3D CARD TILT ---
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        const centerX = rect.width / 2; const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / 25) * -1; const rotateY = (x - centerX) / 25;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`; });
});