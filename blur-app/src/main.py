from flask import Flask, request, Response, jsonify, send_file
from flask_cors import CORS
import base64
import cv2
import numpy as np
import os
import io

from camera import VideoCamera

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

face_detector = cv2.FaceDetectorYN_create(
  "data/face_detection_yunet_2022mar.onnx",
  "",
  (0, 0),  # input size
  0.4,     # confidence threshold
  0.1      # NMS threshold
)


@app.route("/upload", methods=["POST"])
def upload():
    image_data = request.json["image"]
    image_data = base64.b64decode(image_data.split(",")[1])

    img = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_COLOR)

    channels = 1 if len(img.shape) == 2 else img.shape[2]
    if channels == 1:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    if channels == 4:
        img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)

    height, width, _ = img.shape
    face_detector.setInputSize((width, height))

    _, faces = face_detector.detect(img)
    faces = faces if faces is not None else []
    # Draw rectangle around the faces
    for face in faces:
      box = list(map(int, face[:4]))
      x, y, w, h = box
      x = max(0, x)
      y = max(0, y)
      img[y:y+h, x:x+w] = cv2.blur(img[y:y+h, x:x+w], (50, 50))

    buf = cv2.imencode('.jpg', img)[1]
    b64 = base64.b64encode(buf).decode()

    return jsonify({"img": b64})
    # return send_file(bytesa, mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, threaded=True, use_reloader=False)