document.addEventListener('DOMContentLoaded', () => {
    // 1. Animación de la cortina (Overlay)
    const tl = gsap.timeline();

    tl.to("#intro-overlay", {
        yPercent: -100,
        duration: 1.2,
        ease: "expo.inOut",
        delay: 0.5
    });

    // 2. Animación del título principal
    tl.from("#main-title", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
    }, "-=0.5");

    // 3. Animación de las tarjetas de estado
    tl.from(".stat-card", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    }, "-=0.7");

    async function loadAstro() {
        try {
            const res = await fetch('/api/astronomy');
            const data = await res.json();
            
            document.getElementById('moon-hero').innerText = data.moon.phase;
            document.getElementById('planet-hero').innerText = data.planet.name;

            const list = document.getElementById('events-list');
            list.innerHTML = data.events.map(e => {
                const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}&dates=${e.date}T${e.time_start}Z/${e.date}T${e.time_end}Z&details=${encodeURIComponent(e.desc)}`;
                
                return `
                <div class="event-item opacity-0 border-b border-gray-900 pb-12 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <span class="text-blue-500 text-xs font-black tracking-widest">${e.date}</span>
                        <h2 class="text-5xl font-black uppercase mt-2 tracking-tighter">${e.title}</h2>
                        <p class="text-gray-500 mt-2 max-w-md">${e.desc}</p>
                    </div>
                    <a href="${googleUrl}" target="_blank" class="calendar-btn mt-6 md:mt-0 border border-gray-700 px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all">
                        + AGREGAR
                    </a>
                </div>
                `;
            }).join('');

            // Animación para que los eventos aparezcan al cargar
            gsap.to(".event-item", {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                delay: 1.5
            });

        } catch (error) {
            console.error("Error en la conexión estelar:", error);
        }
    }

    loadAstro();

    // Manejo del formulario
    document.getElementById('subscribe-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            nombre: document.getElementById('name').value,
            email: document.getElementById('email').value
        };
        const res = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        if (res.ok) alert("¡Suscripción confirmada!");
    });
});