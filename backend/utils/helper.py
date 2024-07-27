import string
import random
import base64
from io import BytesIO

def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

def create_form_data_from_base64(base64_string, file_name):
    byte_string = base64.b64decode(base64_string.split(',')[1])
    mime_type = base64_string.split(';')[0].split(':')[1]
    file_data = BytesIO(byte_string)
    file_data.name = file_name
    return file_data