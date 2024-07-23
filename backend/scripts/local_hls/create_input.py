from dotenv import load_dotenv
load_dotenv()

import os

from google.cloud.video import live_stream_v1
from google.cloud.video.live_stream_v1.services.livestream_service import (
    LivestreamServiceClient,
)


def create_input(
    project_id: str, location: str, input_id: str
) -> live_stream_v1.types.Input:
    client = LivestreamServiceClient()

    parent = f"projects/{project_id}/locations/{location}"
    input = live_stream_v1.types.Input(
        type_="RTMP_PUSH",
    )
    operation = client.create_input(parent=parent, input=input, input_id=input_id)
    response = operation.result(900)
    print(f"Input: {response.name}")
    print(f"Uri: {response.uri}")
    return response

#rtmp://34.140.101.134/live/88e8836d-03bb-433c-9089-071b1c9491f5
create_input(os.environ["PROJECT_ID"], "europe-west1", "humaads-stream3")