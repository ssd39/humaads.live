from gradio_client import Client, handle_file
import subprocess
import os

def tts_edgecloud(file_path: str) -> str:
    try:
        wav_file = file_path.replace(".webm", ".wav")
        subprocess.Popen(f"ffmpeg -i {file_path} -ac 1 {wav_file}", shell=True)
        client = Client(os.environ["EDGECLOUD_WHISPER_API"])
        result = client.predict(
            audio=handle_file(wav_file)
        )
        print(result)
        return result
    except Exception as e:
        print("tts_edgecloud:", e)
    return ""