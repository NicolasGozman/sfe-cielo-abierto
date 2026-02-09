import os
from flask import Flask, render_template, jsonify, request
import sqlite3
import smtplib
from email.mime.text import MIMEText
from datetime import datetime

app = Flask(__name__)


def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS suscriptores 
                      (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, email TEXT, fecha TIMESTAMP)''')
    conn.commit()
    conn.close()


def enviar_mail_bienvenida(destinatario, nombre):
    remitente = os.environ.get('MAIL_USER')
    password = os.environ.get('MAIL_PASS')
    contenido = f"Hola {nombre},\n\nGracias por conectarte a SFE Cielo Abierto. Ya estás suscrito a las alertas de Santa Fe."
    msg = MIMEText(contenido)
    msg['Subject'] = 'SFE Cielo Abierto - Suscripción Exitosa'
    msg['From'] = remitente
    msg['To'] = destinatario
    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(remitente, password)
        server.sendmail(remitente, destinatario, msg.as_string())
        server.quit()
    except:
        pass


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/astronomy')
def get_astro_data():
    return jsonify({
        "moon": {"phase": "Gibosa Creciente", "illumination": "84%"},
        "planet": {"name": "Marte", "pos": "Visible al NE"},
        "events": [
            {
                "title": "Conjunción Luna-Venus",
                "date": "20260215",
                "time_start": "200000",
                "time_end": "220000",
                "desc": "Evento visible desde la costanera de Santa Fe."
            }
        ]
    })


@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    data = request.json
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO suscriptores (nombre, email, fecha) VALUES (?, ?, ?)",
                   (data.get('nombre'), data.get('email'), datetime.now()))
    conn.commit()
    conn.close()
    enviar_mail_bienvenida(data.get('email'), data.get('nombre'))
    return jsonify({"status": "success"})


if __name__ == '__main__':
    init_db()
    app.run(debug=True)
