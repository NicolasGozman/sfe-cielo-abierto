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
            // Construcción del link para Google Calendar
            const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}&details=${encodeURIComponent(e.desc)}&dates=${e.date}T${e.time_start}Z/${e.date}T${e.time_end}Z`;
            
            return `
                <div class="event-row flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <span style="color: #3b82f6; font-size: 0.7rem; font-weight: bold; letter-spacing: 0.2rem;">${e.date.substring(6,8)} FEB 2026</span>
                        <h2 style="font-size: clamp(1.5rem, 4vw, 3rem); font-weight: 900; text-transform: uppercase;">${e.title}</h2>
                        <p style="color: #666; font-size: 1rem;">${e.desc}</p>
                    </div>
                    <a href="${googleUrl}" target="_blank" class="calendar-btn mt-4 md:mt-0">
                        + Google Calendar
                    </a>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error("Error cargando datos cósmicos");
    }
}
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