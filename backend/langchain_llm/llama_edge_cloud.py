from langchain_core.language_models.llms import LLM
import requests
from typing import (
    Any,
    List,
    Optional,
)
from langchain_core.callbacks import (
    CallbackManagerForLLMRun,
)
import os

class LLamaEdgeCloud(LLM):

    def _call(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> str:
        messages = []
        tmp = ""
        msgtyp = ""
        for line in prompt.split("\n"):
            if "System:" in line:
                if tmp != "":
                    messages.append({"content": tmp, "role": msgtyp})
                tmp = ""
                msgtyp = "system"
                line = line.replace("System:", "")
            elif "Human:" in line:
                if tmp != "":
                    messages.append({"content": tmp, "role": msgtyp})
                tmp = ""
                msgtyp = "user"
                line = line.replace("Human:", "")
            tmp += "\n" + line
        if tmp != "":
            messages.append({"content": tmp, "role": msgtyp})
        try:
            r = requests.post(os.environ["EDGECLOUD_LLAMA_ENDPOINT"] + "/v1/chat/completions", json={
                "model": "meta-llama/Meta-Llama-3-8B-Instruct",
                "messages": messages,
                "max_tokens": 2048,
                "temperature": 0.5,
                "top_p": 0.7
            })
            result = r.json()
            if len(result["choices"]) > 0:
                return result["choices"][0]["message"]["content"]
        except Exception as e:
            print("Edgecloud llama error:", e)
        return ""

    def _llm_type(self):
        return "EdgeCloud-LLAMA-3-8B"