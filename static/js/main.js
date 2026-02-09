document.addEventListener('DOMContentLoaded', () => {
    // Quitar overlay
    setTimeout(() => {
        document.getElementById('intro-overlay').style.transform = 'translateY(-100%)';
    }, 800);

    // Cargar Astronomía
    async function loadAstro() {
        const res = await fetch('/api/astronomy');
        const data = await res.json();
        
        document.getElementById('moon-hero').innerText = data.moon.phase;
        document.getElementById('planet-hero').innerText = data.planet.name;

        const list = document.getElementById('events-list');
        list.innerHTML = data.events.map(e => {
            const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}&dates=${e.date}T${e.time_start}Z/${e.date}T${e.time_end}Z&details=${encodeURIComponent(e.desc)}`;
            return `
                <div class="flex justify-between items-center border-b border-gray-900 pb-8">
                    <div>
                        <span class="text-blue-500 text-xs font-bold">${e.date}</span>
                        <h2 class="text-4xl font-black uppercase">${e.title}</h2>
                        <p class="text-gray-500">${e.desc}</p>
                    </div>
                    <a href="${googleUrl}" target="_blank" class="calendar-btn">+ Google</a>
                </div>
            `;
        }).join('');
    }
    loadAstro();

    // Formulario
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
        if (res.ok) alert("¡Suscrito!");
    });
});