## 🛠️ How we built it

- **Theta EdgeCloud**:
  - **LLM/GenAI**: We utilize a Large Language Model (LLM) to build a Retrieval-Augmented Generation (RAG) system. This system effectively leverages product and brand information to pitch products and answer viewer queries.
  - **Cloud Rendering**: To provide high-quality, aesthetically pleasing video ads, we perform real-time 3D rendering of the ads on Theta EdgeCloud’s GPU-based instances, ensuring cost-effectiveness and scalability.
  - **STT/TTS**: Speech-to-Text (STT) and Text-to-Speech (TTS) models are employed to generate and deliver responses in real-time.
  - **Live Stream**: By utilizing Theta Edge nodes distributed globally, we achieve low latency and cost-effective live streaming of the 3D rendered video to the audience.

- **Theta Blockchain**:
  - We have deployed a smart contract on the Theta testnet to manage advertising campaigns and billing. This ensures transparency, convenience, and reliability in billing processes.

- **Unity3D**:
  - The 3D environment for the ads is developed using Unity3D. The environment includes various interactive elements and logic, exported as an executable. This executable runs on EdgeCloud for real-time rendering based on inputs from the core server.

- **API/Core**:
  - Serving as the brain of the system, our API/Core coordinates the various components. It determines which ads to show, manages interactions with the RAG system, handles cloud rendering, and ensures seamless integration of STT/TTS services. This ensures optimal performance and minimal latency.

![Architecture](https://img.humaads.live/Architecture_devpost.png)
