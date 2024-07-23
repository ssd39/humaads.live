from dotenv import load_dotenv
load_dotenv()
import os

from google.cloud.video.live_stream_v1.services.livestream_service import (
    LivestreamServiceClient,
)
from google.protobuf import empty_pb2 as empty


def delete_channel(project_id: str, location: str, channel_id: str) -> empty.Empty:
    """Deletes a channel.
    Args:
        project_id: The GCP project ID.
        location: The location of the channel.
        channel_id: The user-defined channel ID."""

    client = LivestreamServiceClient()

    name = f"projects/{project_id}/locations/{location}/channels/{channel_id}"
    operation = client.delete_channel(name=name)
    response = operation.result(600)
    print("Deleted channel")

    return response

delete_channel(os.environ["PROJECT_ID"], "europe-west1", "humaads-stream3")