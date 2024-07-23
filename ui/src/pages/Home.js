import React from "react";
import {
  MemoizedStars,
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "../components/text-reveal-card";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="overflow-x-hidden select-none p-6 flex flex-col min-h-screen w-full bg-gradient-to-r to-[#1d1226] from-black">
      <MemoizedStars />
      <div className="flex mb-5">
        <div className="flex-1">
          <div className="flex">
            <img className="w-[35%]" src="/humads-logo.png" />
          </div>
          <span className="text-2xl ml-1.5">
            AI Humanoid + Ads + Live Stream
          </span>
        </div>
        <div className="flex ">
          <div>
            <div onClick={() => navigate('/demo')} className="shadow-purple-400 shadow-md bg-gradient-to-r to-[#ff6a00] from-[#ee0979] rounded-2xl font-bold p-2 px-4 cursor-pointer active:scale-90">
              <span>Demo App</span>
            </div>
          </div>
          <div>
            <div onClick={() => navigate('/dashboard/overview')} className="shadow-purple-400 shadow-md ml-6 bg-gradient-to-r to-[#ff6a00] from-[#ee0979] rounded-2xl font-bold p-2 px-4 cursor-pointer active:scale-90">
              <span>Advetiser Dashboard</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1">
        <div className="flex-1 flex justify-center items-center  w-full">
          <div className="relative">
            <div class="absolute gradient1 radial-gradient-position3 -left-20 -top-36"></div>
            <div class="absolute gradient1 radial-gradient-position3 -left-72 -top-44"></div>
            <img className="absolute scale-[180%] " src="/video-back.png" />
            <img className="absolute  -left-52 top-0 img4 " src="/1.png" />
            <img className="absolute  -right-52 top-8 img3" src="/2.png" />
            <img className="absolute  -left-52 -bottom-12 img3" src="/3.png" />
            <img className="absolute  -right-36 -bottom-20 img4" src="/4.png" />
            <div className="h-80 w-80  rounded-full pl-6 flex items-center justify-center overflow-hidden">
              <video
                className="scale-[300%] "
                src="character1.mp4"
                autoPlay
                loop
                muted
              />
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="relative flex flex-col items-center justify-center w-[82%] text-3xl font-medium">
            <span className="leading-[50px]">
              Introducing a revolutionary{" "}
              <span className="bg-purple-300 text-black m-1 p-1">
                AI-powered
              </span>
              platform where
              <span className="bg-purple-300 text-black m-1 p-1">
                live-streamed humanoid sales agents
              </span>
              provide interactive product information, enhancing viewer
              engagement and transforming traditional{" "}
              <span className="bg-purple-300 text-black m-1 p-1">
                video ads
              </span>{" "}
              into dynamic, interactive experiences.
            </span>
            <div className="w-full mt-8 text-lg">
              <div>Powered By</div>
              <div className="flex mt-2">
                <a  target="_blank" className="z-[1001]" href="https://www.thetatoken.org/">
                  <img
                    className="rounded-full"
                    height={64}
                    width={64}
                    src="/theta-logo.png"
                  />
                </a>
                <a  target="_blank" className="z-[1001]" href="https://www.thetaedgecloud.com/">
                  <img
                    className="ml-4"
                    height={64}
                    width={64}
                    src="/edgecloud.png"
                  />
                </a>
                <a  target="_blank" className="z-[1001]" href="https://www.langchain.com/">
                  <img
                    className="ml-4 rounded-full"
                    height={64}
                    width={64}
                    src="/LangChain-Logo-min.png"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute gradient radial-gradient-position right-0 bottom-0"></div>
      <div class="absolute gradient radial-gradient-position1 left-0 bottom-0"></div>
    </div>
  );
}
