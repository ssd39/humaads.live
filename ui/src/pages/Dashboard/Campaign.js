import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bars } from "react-loader-spinner";
import config from "../../config";

export default function Campaign() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [campaignName, setCampaingName] = useState("");
  const [greetings, setGreetings] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [infoList, setInfoList] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch(`${config.API}/campaing-info`)
      .then((res) => res.json())
      .then((res) => {
        setBannerUrl(res.info.data.banner_url);
        setBrandName(res.info.data.name);
        setVideoUrl(res.info.data.video);
        setCampaingName(res.info.data.title);
        setGreetings(res.info.data.greetings);
        console.log(res.info.data.product_details);
        setInfoList(res.info.data.product_details);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="flex items-center w-full">
        <div className="mr-4">
          <div
            onClick={() => {
              navigate("/dashboard/overview");
            }}
            className=" select-none active:scale-90 cursor-pointer bg-purple-200 rounded-full text-3xl text-black px-2"
          >
            {"<"}
          </div>
        </div>
        <span className="text-5xl font-bold text-purple-300">
          Edit Campaign
        </span>
      </div>
      <div className="mt-4 w-full">
        <hr />
      </div>
      <div>
        {isLoading ? (
          <div className="mt-8 flex items-center justify-center bg-black">
            <Bars
              height="80"
              width="80"
              color="#d8b4fe"
              ariaLabel="bars-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        ) : (
          <>
            <div className="mt-8 relative">
              <div className="flex">
                <div className="flex flex-col">
                  <span className="text-white font-bold text-xl mb-1">
                    Brand Name:
                  </span>
                  <input
                    className="p-2 rounded-lg text-black"
                    type="value"
                    value={brandName}
                  />
                </div>
                <div className="flex flex-col ml-8">
                  <span className="text-white font-bold text-xl mb-1">
                    Campaign Name:
                  </span>
                  <input
                    type="value"
                    className="p-2 rounded-lg text-black"
                    value={campaignName}
                  />
                </div>
              </div>
              <div className="flex flex-col w-[700px] mt-3">
                <span className="text-white font-bold text-xl mb-1">
                  Video URL:
                </span>
                <input
                  type="value"
                  className="p-2 rounded-lg text-black"
                  value={videoUrl}
                />
              </div>
              <div className="flex flex-col w-[700px] mt-3">
                <span className="text-white font-bold text-xl mb-1">
                  Greetings:
                </span>
                <textarea
                  type="value"
                  rows={2}
                  className="p-2 rounded-lg text-black"
                  value={greetings}
                />
              </div>
              <div className="flex flex-col w-[700px] mt-3">
                <span className="text-white font-bold text-xl mb-1">
                  Banner URL:
                </span>
                <input
                  type="value"
                  className="p-2 rounded-lg text-black"
                  value={bannerUrl}
                />
                <img
                  src={bannerUrl}
                  height={200}
                  width={200}
                  className="mt-2 rounded-xl"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col">
              <div className="flex">
                <span className="text-white font-bold text-xl mb-1">
                  Brand Details
                </span>
                <div className="flex ml-2">
                  <div className="shadow-purple-400 shadow-md bg-gradient-to-r to-[#ff6a00] from-[#ee0979] rounded-xl font-bold p-1 px-2 cursor-pointer active:scale-90">
                    <span>Add</span>
                  </div>
                  <span className="text-xl ml-2 font-bold">:</span>
                </div>
              </div>
              <div className="mt-4">
                {infoList.map((v, i) => {
                  return (
                    <div
                      className="mb-8 flex flex-col w-[700px] mt-3 justify-center"
                      key={`pi_${i}`}
                    >
                      <div className="flex">
                        <span className="text-white font-bold text-xl mb-1">
                          {i + 1})
                        </span>
                        <div className="flex ml-2">
                          <div className="shadow-purple-400 shadow-md bg-gradient-to-r to-[#ff6a00] from-[#ee0979] rounded-xl font-bold p-1 px-2 cursor-pointer active:scale-90">
                            <span>Delete</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex  ">
                        <div className="w-[500px]">
                          <div className="flex flex-col  mt-2">
                            <span className="text-white font-bold text-xl mb-1">
                              Tag:
                            </span>
                            <input
                              type="value"
                              className="p-2 rounded-lg text-black"
                              value={v.tag}
                            />
                          </div>
                          <div className="flex flex-col  mt-1 ">
                            <span className="text-white font-bold text-xl mb-1">
                              Related Poster:
                            </span>
                            <input
                              type="value"
                              className="p-2 rounded-lg text-black"
                              value={v.poster}
                            />
                          </div>
                        </div>
                        <img
                          src={v.poster}
                          height={200}
                          width={200}
                          className="rounded-xl ml-3"
                        />
                      </div>
                      <div className="flex flex-col w-[700px] mt-3">
                        <span className="text-white font-bold text-xl mb-1">
                          Information:
                        </span>
                        <textarea
                          type="value"
                          rows={2}
                          className="p-2 rounded-lg text-black"
                          value={v.info}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
