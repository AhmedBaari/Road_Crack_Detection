import asyncio
import websockets

# Python WebSocket server

async def echo(websocket, path):
    async for message in websocket:
        with open('received_image.webp', 'wb') as f:
            f.write(message.encode())  # Encode the string as bytes
        print("Received image and saved as received_image.svg")
        await websocket.send("HELLO WORLD")

start_server = websockets.serve(echo, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
