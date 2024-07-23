from dotenv import load_dotenv
load_dotenv()
import os

from google.cloud.video import live_stream_v1
from google.cloud.video.live_stream_v1.services.livestream_service import (
    LivestreamServiceClient,
)


def get_channel(
    project_id: str, location: str, channel_id: str
) -> live_stream_v1.types.Channel:
    """Gets a channel.
    Args:
        project_id: The GCP project ID.
        location: The location of the channel.
        channel_id: The user-defined channel ID."""

    client = LivestreamServiceClient()

    name = f"projects/{project_id}/locations/{location}/channels/{channel_id}"
    response = client.get_channel(name=name)
    print(f"Channel: {response.name}")
    print(f"State: {live_stream_v1.types.Channel.StreamingState(response.streaming_state)}")
    print(f"Input: {response.active_input}")
    return response

get_channel(os.environ["PROJECT_ID"], "europe-west1", "humaads-stream3")