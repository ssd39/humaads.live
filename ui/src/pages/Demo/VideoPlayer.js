import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./components/Header";
import { toast } from "react-toastify";
import { start_stt } from "../../lib/whisper_edgecloud";
import { start_stt_local } from "../../lib/stt_localtest";
import { Rings } from "react-loader-spinner";
import config from "../../config";

export default function VideoPlayer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdRunning, setAdRunning] = useState(true);
  const [adStage, setAdStage] = useState(0);
  const [isMicOn, setMic] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const [questions, setQuestions] = useState([]);
  const [isSkip, setSkip] = useState(false);
  const [questionInp, setQUestionInp] = useState("");
  const isNextSignal = useRef(false);

  const stop_stt = useRef(null);
  const ws = useRef(null);
  const player = useRef(null);

  useEffect(() => {
    if (!location?.state) {
      navigate("/demo");
    }
  }, [location.state]);

  const loadPlayer = (url) => {
    const optionalHlsOpts = null;
    const optionalThetaOpts = {
      allowRangeRequests: true, // false if cdn does not support range headers
    };
    const container = window.document.getElementById("div-player");
    container.innerHTML =
      '<video autoplay  preload="auto" class="video-js vjs-default-skin vjs-fluid"  id=\'v-player\'></video>';
    player.current = window.videojs("v-player", {
      techOrder: ["theta_hlsjs", "html5"],
      sources: [
        {
          //location?.state?.url
          src: url,
          type: "application/x-mpegURL",
          label: "auto",
        },
      ],

      controls: true,
      theta_hlsjs: {
        videoId: "1",
        onThetaReady: null, // optional listener
        onStreamReady: null, // optional listener
        hlsOpts: optionalHlsOpts,
        thetaOpts: optionalThetaOpts,
      },
    });
    player.current.ready(() => {
      player.current.on("timeupdate", (event) => {
        //chrome fix
        //console.log("Time update!");
        //console.log(event);
        if (window.isAdRunning) {
          if (
            !isNextSignal.current &&
            player.current.currentTime() + 5 >= player.current.duration()
          ) {
            isNextSignal.current = true;
            ws.current.send(JSON.stringify({ action: "start" }));
          }

          if (
            window.lokAdStage == 0 &&
            player.current.currentTime() == player.current.duration()
          ) {
            console.log("video ended");
            console.log("AD stream", window.surl);
            window.lokAdStage = 1;
            const container = window.document.getElementById("div-player");
            const iframe = document.createElement("iframe");
            iframe.id = "theta_stream"
            iframe.src = window.surl;
            iframe.allow = "autoplay; controls=false;";
            iframe.sandbox = "allow-same-origin allow-scripts";
            iframe.className = "h-full w-full z-[1000] absolute top-0 left-0";
            iframe.frameborder = "0";
            iframe.style = "pointer-events: none;";
            container.appendChild(iframe);
            setAdStage(1);
          }
        }
      });
    });
  };

  useEffect(() => {
    window.msx = [];
    window.lokAdStage = 0;
    window.isAdRunning = true;
    if (location.state) {
      if (ws.current) {
        return;
      }
      let ws_ = new WebSocket(`${config.WS}/ads-manager`);
      ws.current = ws_;
      ws_.onopen = function (e) {
      
      };

      ws_.onmessage = (event) => {
        setLoading(false);
        try {
          const json_data = JSON.parse(event.data);
          console.log(json_data);
          if (json_data.action == "stream") {
            const video_url = json_data.video;
            console.log(json_data.stream_url);
            window.surl = json_data.stream_url;
            loadPlayer(video_url);
            player.current.controls(false);
          } else if (json_data.action == "close") {
            if (json_data.message) {
              toast.error(json_data.message);
            }

            if (window.isAdRunning) {
              setAdRunning(false);
              window.isAdRunning = false;
              console.log("adStage", adStage);
              if (window.lokAdStage > 0) {
                player.current.dispose();
                player.current = null;
              }
              loadPlayer(location?.state?.url);
              ws_.close()
            }
          }
        } catch (e) {
          console.error(e);
        }
      };

      ws_.onclose = function (event) {
        if (event.wasClean) {
          /*alert(
            `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
          );*/
        } else {
          // e.g. server process killed or network down
          // event.code is usually 1006 in this case
          //alert("[close] Connection died");
        }

        if (window.isAdRunning) {
          setAdRunning(false);
          window.isAdRunning = false;
          console.log("adStage", adStage);
          if (window.lokAdStage > 0) {
            player.current.dispose();
            player.current = null;
          }
          loadPlayer(location?.state?.url);
        }
      };

      ws_.onerror = function (error) {
        //alert(`[error]`);
        console.error("WS_ERROR:", error);
      };

      return () => {
        if (player.current) {
          player.current.dispose();
          player.current = null;
        }
      };
    }
  }, []);

  useEffect(() => {
    console.log(questions);
  }, [questions]);

  return (
    <div className="flex flex-col select-none">
      <Header />
      <div className="flex flex-col px-10 my-4">
        <div className="flex">
          <div className="flex-1 flex flex-col">
            <div className="relative">
              <div
                id="div-player"
                className={`${
                  !isAdRunning ? "z-[1000]" : ""
                } relative rounded-xl overflow-hidden`}
              ></div>

              <div className="absolute  top-0 bottom-0 flex items-center justify-center  left-0 right-0">
                <Rings
                  visible={isLoading}
                  height="80"
                  width="80"
                  color="#d8b4fe"
                  ariaLabel="rings-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </div>
              {isAdRunning && !isLoading && (
                <div className="z-[1001] top-0 h-12 w-12 rounded-tl-xl rounded-br-lg bg-purple-300 text-black absolute flex items-center justify-center">
                  <span className="text-2xl font-bold">AD</span>
                </div>
              )}
              {isAdRunning && !isLoading && (
                <div className="z-[1001] right-0 bottom-0 mb-8 h-14 p-2  rounded-l-full bg-purple-300 text-black absolute flex items-center justify-center">
                  {adStage == 1 && (
                    <div
                      onClick={async () => {
                        if (isMicOn) {
                          if (stop_stt.current) {
                            stop_stt.current();
                          }
                          setMic(false);
                          return;
                        }

                        const stop_stt_local = await start_stt_local((msg) => {
                          window.msx = [...window.msx, msg];
                          if (window.lokAdStage > 1) {
                            ws.current.send(
                              JSON.stringify({
                                action: "feedback",
                                message: msg,
                              })
                            );
                          } else {
                            if (msg.trim() != "") {
                              setQuestions(window.msx);
                              ws.current.send(
                                JSON.stringify({
                                  action: "question",
                                  question: msg,
                                })
                              );
                            }
                          }
                        });
                        stop_stt.current = stop_stt_local;
                        setMic(true);
                      }}
                      className={`mr-2 rounded-full font-bold p-2 text-white shadow-purple-400 shadow-md  bg-gradient-to-r to-[#ff6a00] from-[#ee0979]  cursor-pointer active:scale-90`}
                    >
                      {isMicOn ? (
                        <img height={24} width={24} src="/mic.png" />
                      ) : (
                        <img height={24} width={24} src="/mute.png" />
                      )}
                    </div>
                  )}
                  <div
                    onClick={() => {
                      if (adStage == 0) {
                        return;
                      }
                      if (isSkip) {
                        ws.current.send(
                          JSON.stringify({
                            action: "feedback",
                            message: "No",
                          })
                        );
                      } else {
                        ws.current.send(
                          JSON.stringify({
                            action: "skip",
                          })
                        );
                        window.lokAdStage = 2;
                        setTimeout(() => {
                          setSkip(true);
                        }, 1500);
                      }
                    }}
                    className={
                      adStage == 1
                        ? `rounded-2xl font-bold p-2 px-4 text-white shadow-purple-400 shadow-md  bg-gradient-to-r to-[#ff6a00] from-[#ee0979]  cursor-pointer active:scale-90`
                        : `rounded-2xl font-bold p-2 px-4 bg-gradient-to-r to-[#bdc3c7] from-[#bdc3c7] cursor-not-allowed`
                    }
                  >
                    <span>{isSkip ? "No" : "Skip"}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col mt-3">
              <span className="font-semibold">
                {location?.state?.artist || ""}
              </span>
              <div>
                <span className="leading-3 text-xl bg-purple-300 text-black rounded p-0.5">
                  {location?.state?.title || ""}
                </span>
              </div>
              <div className="mt-4">
                <span>Description</span>
                <hr />
                <span className="mt-2 select-text">
                  {location?.state?.description || ""}
                </span>
              </div>
            </div>
          </div>

          <div className="w-[35%] ">
            {adStage != 1  || !isAdRunning ? (
              <div className="flex flex-col p-4 absolute h-[80%] w-[30%] mr-8 right-0 rounded-xl bg-gradient-to-b from-[#0000] to-[#414345]">
                <div className="mb-4">
                  <span className="mb-3 text-2xl font-bold">Comments</span>
                  <hr />
                </div>
                <div className="flex-1"></div>
                <div className="flex items-center justify-center">
                  <input
                    className="flex-1 p-2 px-4 rounded-xl bg-black outline-none"
                    placeholder="type comment..."
                  />
                  <div
                    onClick={() => {
                      // TODO
                      toast("Comments functionality not currently available!");
                    }}
                    className="shadow-purple-400 shadow-md ml-6 -translate-y-1 bg-gradient-to-r to-[#ff6a00] from-[#ee0979] rounded-2xl font-bold p-2 px-4 cursor-pointer active:scale-90"
                  >
                    <span>{">"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col p-4 absolute h-[80%] w-[30%] mr-8 right-0 rounded-xl bg-gradient-to-b from-[#0000] to-[#414345]">
                <div className="mb-4">
                  <div className="flex items-center  justify-between mb-3 ">
                    <span className="text-2xl font-bold ml-3">
                      Ask the representative
                    </span>
                  </div>
                  <hr />
                </div>
                <div className="flex-1 flex flex-col overflow-scroll mb-2">
                  {questions.map((val, i) => {
                    return (
                      <div className="my-2" key={`q_${i}`}>
                        <span className="bg-purple-300 font-semibold text-black rounded-lg p-2">
                          {val}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-center">
                  <input
                    onChange={(e) => {
                      setQUestionInp(e.target.value);
                    }}
                    value={questionInp}
                    className="flex-1 p-2 px-4 rounded-xl bg-black outline-none"
                    placeholder="type question..."
                  />
                  <div
                    onClick={() => {
                      if (questionInp != "") {
                        setQuestions([...questions, questionInp]);
                        ws.current.send(
                          JSON.stringify({
                            action: "question",
                            question: questionInp,
                          })
                        );
                        setQUestionInp("")
                      }
                    }}
                    className="shadow-purple-400 shadow-md ml-6 -translate-y-1 bg-gradient-to-r to-[#ff6a00] from-[#ee0979] rounded-2xl font-bold p-2 px-4 cursor-pointer active:scale-90"
                  >
                    <span>{">"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
