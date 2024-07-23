import React from "react";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const videos = [
    {
      title: "Flying Seagulls",
      url: "https://media.thetavideoapi.com/org_tr8r9f7yjyv6m7g2ftmwrkk3r3xd/srvacc_atkkrghauxi3hi61xhdza6g8g/video_weezd68dab9f9m9syig50w7d3e/master.m3u8",
      desc: "This content is listed free to use on orignal website. Here its just for demo purpose. checkout at orignal site: https://www.pexels.com/video/video-footage-of-flying-seagulls-4713259/",
      thumbnail:
        "https://images.pexels.com/videos/4713259/animal-art-background-beak-4713259.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      artist: "Yogendra Singh",
    },
    {
      title: "Lake Water",
      url: "https://media.thetavideoapi.com/org_tr8r9f7yjyv6m7g2ftmwrkk3r3xd/srvacc_atkkrghauxi3hi61xhdza6g8g/video_w43ntrq2rpiy54f21tut0b2jwj/master.m3u8",
      desc: "This content is listed free to use on orignal website. Here its just for demo purpose. checkout at orignal site: https://www.pexels.com/video/flock-of-goose-eating-on-the-lake-water-4872339/",
      thumbnail:
        "https://images.pexels.com/videos/4872339/beatiful-landscape-free-goose-lake-4872339.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      artist: "Morteza K",
    },
    {
      title: "Bird In The Nature",
      url: "https://media.thetavideoapi.com/org_tr8r9f7yjyv6m7g2ftmwrkk3r3xd/srvacc_atkkrghauxi3hi61xhdza6g8g/video_u8pbi9qazzsaiz7gyhrn28e85i/master.m3u8",
      desc: "This content is listed free to use on orignal website. Here its just for demo purpose. checkout at orignal site: https://www.pexels.com/video/brown-bird-in-the-nature-6247699/",
      thumbnail:
        "https://images.pexels.com/videos/6247699/pexels-photo-6247699.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      artist: "Rodolfo Angulo A.",
    },
  ];
  const navigate = useNavigate();
  return (
    <div className="select-none">
      <Header />
      <div className="w-full flex p-4 px-10 flex-wrap">
        {videos.map((val, indx) => {
          return (
            <div className="flex flex-col mx-2 my-2" key={`video_${indx}`}>
              <div
                onClick={() => {
                  navigate("/demo/play", {
                    state: {
                      description: val.desc,
                      url: val.url,
                      title: val.title,
                      artist: val.artist
                    },
                  });
                }}
                className="group relative rounded-xl overflow-hidden hover:cursor-pointer  active:scale-95 "
              >
                <img
                  className="h-60 w-96 group-hover:opacity-70"
                  src={val.thumbnail}
                />
                <img
                  className="opacity-0  absolute right-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100"
                  src="/play.png"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">{val.artist}</span>
                <div>
                  <span className="leading-3 text-xl bg-purple-300 text-black rounded p-0.5">
                    {val.title}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
