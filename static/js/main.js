document.addEventListener('DOMContentLoaded', () => {
    // 1. Quitar la cortina blanca
    setTimeout(() => {
        document.getElementById('intro-overlay').style.transform = 'translateY(-100%)';
    }, 1500);

    // 2. Cargar datos de la API interna
    async function loadAstro() {
    try {
        const res = await fetch('/api/astronomy');
        const data = await res.json();
        
        document.getElementById('moon-hero').innerText = `${data.moon.phase} (${data.moon.illumination})`;
        document.getElementById('planet-hero').innerText = `${data.planet.name} → ${data.planet.pos}`;
        
        const list = document.getElementById('events-list');
list.innerHTML = data.events.map(e => {
    // Volvemos al link original que NO necesita a Python para funcionar
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}&dates=${e.date}T${e.time_start}Z/${e.date}T${e.time_end}Z&details=${encodeURIComponent(e.desc)}`;
    
    return `
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-900 pb-8">
            <div>
                <span class="text-blue-500 text-xs font-bold">${e.date}</span>
                <h2 class="text-4xl font-black uppercase">${e.title}</h2>
                <p class="text-gray-400">${e.desc}</p>
            </div>
            <a href="${googleUrl}" target="_blank" class="calendar-btn mt-4 md:mt-0">+ Google Calendar</a>
        </div>
    `;
}).join('');
    } catch (e) {
        console.error("Error cargando datos cósmicos");
    }
}

    loadAstro();

    // 3. Formulario de Suscripción
    const form = document.getElementById('subscribe-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        btn.innerText = "CONECTANDO...";
        
        const payload = {
            nombre: document.getElementById('name').value,
            email: document.getElementById('email').value
        };

        const res = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("¡Señal captada! Estás suscrito a las alertas de Santa Fe.");
            form.reset();
        }
        btn.innerText = "Activar Señal";
    });
});
// Dentro de tu función loadAstro() al mapear los eventos:
const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}&details=${encodeURIComponent(e.desc)}&dates=${e.date}T${e.time_start}Z/${e.date}T${e.time_end}Z`;

// Y agregá el botón en el HTML generado:
// <a href="${googleUrl}" target="_blank" class="calendar-btn">+ Google Calendar</a>