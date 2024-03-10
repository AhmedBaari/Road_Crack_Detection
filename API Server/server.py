# IMPORTS

from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import random

# inference imports 
from typing import NamedTuple

import cv2
import numpy as np

# Deep learning framework
from ultralytics import YOLO
from PIL import Image

# MODEL
model = YOLO("last.pt")

# CLASSES
CLASSES = [
    "Transverse Crack",
    "Alligator Crack",
    "Potholes",
    "Longitudinal Construction joint part",
    "Lateral Construction joint part",
    "Cross walk blur",
    "White line blur",
    "Utility Hole"
]

# DETECTION CLASS
class Detection(NamedTuple):
    class_id: int
    label: str
    score: float
    box: np.ndarray

# FLASK SERVER WITH CORS
app = Flask(__name__)
CORS(app)

@app.route('/process_image', methods=['POST'])
def process_image():
    # Get the image file from the request
    image_file = request.files['image']

    # Check if the file is a webp image
    if image_file.filename.endswith('.webp'):
        # Process the image here
        # Save the image
        image_file.save('received_image.webp')

        # Convert to PNG 
        im = Image.open('received_image.webp')
        im.save('received_image.jpg')

        image_file = Image.open('received_image.jpg')


        # Perform inference
        _image = np.array(image_file)
        h_ori = _image.shape[0]
        w_ori = _image.shape[1]

        import cv2

        resized_image = 0
        # Load the input image
        input_image = cv2.imread('received_image.jpg')

        # Check if the input image is loaded successfully
        if input_image is None:
            print("Error: Unable to load image")
        else:
            # Specify the desired width and height for resizing
            width = 640
            height = 640

            # Resize the input image
            resized_image = cv2.resize(input_image, (width, height))

        resized_image

        # Continue with further processing or analysis
        results = model.predict(resized_image, conf=0.1)

        # Access the first element of the results list
        boxes = results[0].boxes
        boxes

        for result in results:
            boxes = result.boxes.cpu().numpy()
            detections = [
                Detection(
                    class_id=int(_box.cls),
                    label=CLASSES[int(_box.cls)],
                    score=float(_box.conf),
                    box=_box.xyxy[0].astype(int),
                )
                for _box in boxes
            ]

        annotated_frame = results[0].plot()
        _image_pred = cv2.resize(annotated_frame, (w_ori, h_ori), interpolation = cv2.INTER_AREA)


        import io


        cv2.imwrite("image.jpg", _image_pred)

        # Get the image.jpg object 
        image = open('image.jpg', 'rb')

        # Read the image file
        with open('image.jpg', 'rb') as f:
            image_data = f.read()
    
        # Convert image data to a blob
        blob = io.BytesIO(image_data)
    
        # Return the blob as a response
        return Response(blob, mimetype='image/jpeg')

    else:
        return jsonify({'error': 'Invalid file format'})

if __name__ == '__main__':
    app.run(port=6789)