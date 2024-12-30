from flask import Flask, request, jsonify
import subprocess
import os
import time
import serial.tools.list_ports

app = Flask(__name__)

# Function to detect the connected ESP32 port
def detect_esp32_port():
    ports = serial.tools.list_ports.comports()
    for port in ports:
        if "ESP32" in port.description:  # Detect the ESP32 device
            return port.device
    return None  # No ESP32 detected

# Function to flash the model to the ESP32 (with port handled by backend)
def flash_model_to_esp32(model_name):
    try:
        # Detect the connected ESP32 port
        port = detect_esp32_port()
        if not port:
            return {"error": "No ESP32 device detected."}
        
        # Define the paths for the model and audio files (example paths, change accordingly)
        model_file_path = f"/models/{model_name}.bin"
        audio_file_path = f"/audios/{model_name}_audio.bin"
        
        # Flash the model to the specific memory location (0x1000)
        model_flash_command = [
            'esptool', '--chip', 'esp32', '--port', port, '--baud', '115200', 
            '--before', 'default_reset', '--after', 'hard_reset', 
            'write_flash', '-z', '0x1000', model_file_path
        ]
        
        # Execute the command to flash the model
        subprocess.run(model_flash_command, check=True)
        print(f"Flashed model {model_name} to memory location 0x1000")

        # Flash the audio file to the memory location 0x210000
        audio_flash_command = [
            'esptool', '--chip', 'esp32', '--port', port, '--baud', '115200', 
            '--before', 'default_reset', '--after', 'hard_reset', 
            'write_flash', '-z', '0x210000', audio_file_path
        ]
        
        # Execute the command to flash the audio file
        subprocess.run(audio_flash_command, check=True)
        print(f"Flashed audio file for {model_name} to memory location 0x210000")

        return {"message": f"Model and audio files for {model_name} successfully flashed!"}
    
    except subprocess.CalledProcessError as e:
        return {"error": f"Error during flashing: {e}"}
    except Exception as e:
        return {"error": str(e)}

@app.route('/flash', methods=['POST'])
def flash_model():
    data = request.get_json()

    # Get model name from the request body
    model_name = data.get('model')

    if not model_name:
        return jsonify({"error": "Model name is required"}), 400

    # Flash the model and audio to ESP32
    result = flash_model_to_esp32(model_name)

    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
