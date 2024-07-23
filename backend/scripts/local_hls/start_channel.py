from dotenv import load_dotenv
load_dotenv()
import os

from google.cloud.video import live_stream_v1
from google.cloud.video.live_stream_v1.services.livestream_service import (
    LivestreamServiceClient,
)


def start_channel(
    project_id: str, location: str, channel_id: str
) -> live_stream_v1.types.ChannelOperationResponse:
    """Starts a channel.
    Args:
        project_id: The GCP project ID.
        location: The location of the channel.
        channel_id: The user-defined channel ID."""

    client = LivestreamServiceClient()

    name = f"projects/{project_id}/locations/{location}/channels/{channel_id}"
    operation = client.start_channel(name=name)
    response = operation.result(900)
    print("Started channel")

    return response

start_channel(os.environ["PROJECT_ID"], "europe-west1", "humaads-stream3")