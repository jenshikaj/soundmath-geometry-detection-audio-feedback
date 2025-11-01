from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import numpy as np
import cv2

# Flask app setup
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Load YOLOv8 model
model = YOLO("yolov8_shapes_detection_model_v1.pt")

@app.route('/predict', methods=['POST'])
def predict():
    if not request.data:
        return jsonify({"error": "No image data received"}), 400

    try:
        # Decode the image from byte data
        npimg = np.frombuffer(request.data, np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"error": "Invalid image format"}), 400

        # Inference with YOLO model
        results = model.predict(source=img, conf=0.25)[0]

        # Prepare response
        detections = [{
            "class_id": int(cls),
            "confidence": float(conf),
            "bbox": [int(x1), int(y1), int(x2), int(y2)],
            "class_name": model.names[int(cls)]
        } for x1, y1, x2, y2, conf, cls in results.boxes.data.tolist()]

        return jsonify({"detections": detections})

    except Exception as e:
        print("Error during prediction:", e)
        return jsonify({"error": "Server error"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
