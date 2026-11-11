import os
import tempfile

from flask import Flask, jsonify, render_template, request

from transcribe import load_model, transcribe

app = Flask(__name__)


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/transcribe")
def transcribe_route():
    f = request.files.get("audio")
    if not f or not f.filename:
        return jsonify(error="no audio file"), 400
    suffix = os.path.splitext(f.filename)[1] or ".wav"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        f.save(tmp.name)
    try:
        return jsonify(text=transcribe(tmp.name))
    except Exception as e:
        return jsonify(error=str(e)), 500
    finally:
        os.unlink(tmp.name)


if __name__ == "__main__":
    print("Loading speech model (first run downloads ~480 MB)...", flush=True)
    load_model()
    print("Model ready.", flush=True)
    app.run(port=5000)
