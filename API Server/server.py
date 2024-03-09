from flask import Flask, request, jsonify
from flask_cors import CORS
import random

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

        ## RANDOM NUMBER GENERATOR
        # Generate a random number between 0 and 9
        random_number = random.randint(0, 9)

        # Check if the random number is less than or equal to 0 (10% probability)
        if random_number <= 0:
            # Set the damage value to '1'
            damage = '1'
        else:
            # Set the damage value to '0'
            damage = '0'

        # Return the response with the generated damage value
        return jsonify({'message': 'Image processed successfully',
                        'damage': damage
                        })

    else:
        return jsonify({'error': 'Invalid file format'})

if __name__ == '__main__':
    app.run(port=6789)