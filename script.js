// Brilhinho no mouse
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = '9999';
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const sparks = [];

class Spark {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 4;
        this.speedY = Math.random() * 3 + 1;
        this.gravity = 0.2;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;

        // Cores vibrantes de fogo (laranja, vermelho, amarelo)
        const colors = [
            { r: 255, g: 100, b: 0 },   // Laranja forte
            { r: 255, g: 50, b: 0 },    // Vermelho-laranja
            { r: 255, g: 200, b: 0 },   // Amarelo-dourado
            { r: 255, g: 150, b: 0 }    // Laranja claro
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.97;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;

        // Brilho externo
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`);
        gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.5)`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Núcleo brilhante
        ctx.fillStyle = `rgba(255, 255, 200, ${this.life})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Cria múltiplas faíscas em cada movimento
    for (let i = 0; i < 3; i++) {
        sparks.push(new Spark(
            mouseX + (Math.random() - 0.5) * 10,
            mouseY + (Math.random() - 0.5) * 10
        ));
    }
});

function animate() {
    // Limpa o canvas com transparência
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Atualiza e desenha as faíscas
    for (let i = sparks.length - 1; i >= 0; i--) {
        sparks[i].update();
        sparks[i].draw();

        // Remove faíscas que já "morreram"
        if (sparks[i].life <= 0 || sparks[i].size < 0.5) {
            sparks.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

animate();


document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica para o Menu de Navegação em Telas Pequenas (Hamburguer) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('#navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o evento de clique se propague para o window
            navMenu.classList.toggle('active');
        });
    }

    // --- Lógica para os Menus Suspensos (Dropdowns) ---
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const button = item.querySelector('.nav-button');
        const dropdownMenu = item.querySelector('.dropdown-menu');

        // Garante que estamos lidando apenas com itens que têm um dropdown
        if (button && dropdownMenu) {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Impede o fechamento imediato pelo listener do window

                // O dropdown que foi clicado está visível?
                const isVisible = dropdownMenu.style.display === 'block';

                // Primeiro, fecha todos os outros dropdowns
                closeAllDropdowns();
                
                // Se o dropdown clicado não estava visível, ele é exibido
                if (!isVisible) {
                    dropdownMenu.style.display = 'block';
                }
            });
        }
    });

    // --- Função para fechar todos os dropdowns abertos ---
    const closeAllDropdowns = () => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    };

    // --- Fechar elementos ao clicar em qualquer lugar da página ---
    window.addEventListener('click', () => {
        closeAllDropdowns();
        
        // Esconde o menu de navegação móvel se estiver ativo
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
});
