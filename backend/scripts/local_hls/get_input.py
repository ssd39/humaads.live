from dotenv import load_dotenv
load_dotenv()

import os

from google.cloud.video import live_stream_v1
from google.cloud.video.live_stream_v1.services.livestream_service import (
    LivestreamServiceClient,
)


def get_input(
    project_id: str, location: str, input_id: str
) -> live_stream_v1.types.Input:
    client = LivestreamServiceClient()
    name = f"projects/{project_id}/locations/{location}/inputs/{input_id}"
    response = client.get_input(name=name)
    print(f"Input: {response.name}")
    print(f"Uri: {response.uri}")
    return response

#rtmp://34.140.101.134/live/88e8836d-03bb-433c-9089-071b1c9491f5
get_input(os.environ["PROJECT_ID"], "europe-west1", "humaads-stream3")