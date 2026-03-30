import subprocess
import os
import sys
import platform

def check_dependencies():
    print("🚀 Checking TripCompass dependencies...")
    
    # Check for Node.js
    try:
        node_version = subprocess.check_output(["node", "--version"]).decode().strip()
        print(f"✅ Node.js found: {node_version}")
    except Exception:
        print("❌ Node.js not found. Please install Node.js (v18+) to run this project.")
        sys.exit(1)

    # Check for .env.local
    if not os.path.exists(".env.local"):
        print("⚠️ .env.local missing. Creating a template...")
        with open(".env.local", "w") as f:
            f.write("GROQ_API_KEY=your_groq_api_key_here\n")
            f.write("OPENWEATHER_API_KEY=your_openweathermap_api_key_here\n")
        print("✅ Template created. Please update it with your API keys.")

def start_server():
    print("\n🌴 Starting TripCompass Dev Server...")
    command = "npm run dev"
    if platform.system() == "Windows":
        command = "npm.cmd run dev"
    
    try:
        subprocess.run(command, shell=True, check=True)
    except KeyboardInterrupt:
        print("\n👋 App stopped. Have a great journey!")
    except Exception as e:
        print(f"❌ Failed to start server: {e}")

if __name__ == "__main__":
    check_dependencies()
    start_server()
