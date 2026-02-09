document.addEventListener('DOMContentLoaded', () => {
    // 1. Animaciones GSAP iniciales
    const tl = gsap.timeline();
    tl.to("#intro-overlay", { yPercent: -100, duration: 1.2, delay: 0.5 });
    tl.from("#main-title", { y: 100, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.5");
    tl.from(".stat-card", { y: 30, opacity: 0, duration: 0.8, stagger: 0.2 }, "-=0.7");

    // 2. Carga de datos y Google Calendar
    async function loadAstro() {
        const res = await fetch('/api/astronomy');
        const data = await res.json();
        
        document.getElementById('moon-hero').innerText = data.moon.phase;
        document.getElementById('planet-hero').innerText = data.planet.name;

        const list = document.getElementById('events-list');
        list.innerHTML = data.events.map(e => {
            const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}&dates=${e.date}T${e.time_start}Z/${e.date}T${e.time_end}Z&details=${encodeURIComponent(e.desc)}&location=Santa+Fe,+Argentina`;
            
            return `
            <div class="event-item opacity-0 border-b border-gray-900 pb-12 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <span class="text-blue-500 text-xs font-black tracking-widest">${e.date}</span>
                    <h2 class="text-5xl font-black uppercase mt-2 tracking-tighter">${e.title}</h2>
                    <p class="text-gray-500 mt-2 max-w-md">${e.desc}</p>
                </div>
                <a href="${googleUrl}" target="_blank" class="calendar-btn mt-6 md:mt-0 font-bold">
                    + GOOGLE CALENDAR
                </a>
            </div>`;
        }).join('');

        gsap.to(".event-item", { opacity: 1, y: 0, duration: 1, stagger: 0.2, delay: 1 });
    }
    loadAstro();

    // 3. Formulario
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
        if (res.ok) alert("¡Conectado!");
    });
});