from dotenv import load_dotenv
load_dotenv()
import os

from google.cloud.video.live_stream_v1.services.livestream_service import (
    LivestreamServiceClient,
)
from google.protobuf import empty_pb2 as empty


def delete_input(project_id: str, location: str, input_id: str) -> empty.Empty:
    client = LivestreamServiceClient()

    name = f"projects/{project_id}/locations/{location}/inputs/{input_id}"
    operation = client.delete_input(name=name)
    response = operation.result(600)
    print("Deleted input")

    return response

delete_input(os.environ["PROJECT_ID"], "europe-west1", "humaads-stream2")