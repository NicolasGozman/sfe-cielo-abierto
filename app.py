import os
from flask import Flask, render_template, jsonify, request, Response
import sqlite3
import smtplib
from email.mime.text import MIMEText
from datetime import datetime
from icalendar import Calendar, Event  # La herramienta para crear el archivo

app = Flask(__name__)


# --- CONFIGURACIÓN DE BASE DE DATOS ---


def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS suscriptores 
                (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, email TEXT, fecha TIMESTAMP)''')
    conn.commit()
    conn.close()

# --- LÓGICA DE ENVÍO DE CORREO (SMTP) ---


def enviar_mail_bienvenida(destinatario, nombre):
    # Configura tus credenciales aquí
    remitente = "nicolas.gozman02@gmail.com"
    password = "npso kwuu glcp gshn"

    contenido = f"Hola {nombre},\n\nGracias por conectarte a SFE Cielo Abierto. Ya estás suscrito a las alertas astronómicas de Santa Fe.\n\n¡Cielos despejados!"
    msg = MIMEText(contenido)
    msg['Subject'] = 'SFE Cielo Abierto - Suscripción Exitosa'
    msg['From'] = remitente
    msg['To'] = destinatario

    try:
        # Servidor SMTP de Gmail
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(remitente, password)
        server.sendmail(remitente, destinatario, msg.as_string())
        server.quit()
        print(f"Correo enviado con éxito a {destinatario}")
    except Exception as e:
        print(f"Error al enviar correo: {e}")

# --- RUTAS ---


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/astronomy')
def get_astro_data():
    # Datos dinámicos para Santa Fe
    return jsonify({
        "moon": {"phase": "Gibosa Creciente", "illumination": "84%"},
        "planet": {"name": "Marte", "pos": "Visible al NE"},
        "events": [
            {
                "title": "Conjunción Luna-Venus",
                "date": "20260215",  # Formato AAAAMMDD para el calendario
                "time_start": "200000",
                "time_end": "220000",
                "desc": "Evento visible desde la costanera de Santa Fe."
            },
            {
                "title": "Lluvia de Meteoros",
                "date": "20260312",
                "time_start": "020000",
                "time_end": "050000",
                "desc": "Punto máximo de visibilidad en zonas rurales."
            }
        ]
    })


@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    data = request.json
    nombre = data.get('nombre')
    email = data.get('email')

    try:
        # 1. Guardar en Base de Datos SQL
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute("INSERT INTO suscriptores (nombre, email, fecha) VALUES (?, ?, ?)",
                       (nombre, email, datetime.now()))
        conn.commit()
        conn.close()

        # 2. Enviar Correo Electrónico Real
        enviar_mail_bienvenida(email, nombre)

        return jsonify({"status": "success"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/api/generate_ics')
def generate_ics():
    try:
        title = request.args.get('title', 'Evento Astronómico')
        desc = request.args.get('desc', '')
        start_str = request.args.get('start')  # Recibe AAAAMMDDTHHMMSS

        if not start_str:
            return "Falta la fecha", 400

        cal = Calendar()
        event = Event()
        event.add('summary', title)
        event.add('description', desc)

        # Ajuste clave: Limpiamos la cadena de texto por si vienen caracteres extra
        clean_start = start_str.split('.')[0].replace('-', '').replace(':', '')

        # Formato ics
        fecha_dt = datetime.strptime(clean_start, '%Y%m%dT%H%M%S')
        event.add('dtstart', fecha_dt)
        event.add('dtend', fecha_dt)  # El evento dura 0 minutos por defecto
        event.add('location', 'Santa Fe, Argentina')

        cal.add_component(event)

        return Response(
            cal.to_ical(),
            mimetype="text/calendar",
            headers={"Content-disposition": f"attachment; filename={title}.ics"}
        )
    except Exception as e:
        # Esto te dirá el error exacto en los logs de Render
        print(f"Error generando ICS: {e}")
        return f"Error interno: {str(e)}", 500


if __name__ == '__main__':
    init_db()
    app.run(debug=True)
