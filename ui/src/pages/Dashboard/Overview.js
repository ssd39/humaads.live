import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import config from "../../config";
import { useNavigate } from "react-router-dom";

export default function Overview() {
  const [tab, setTab] = useState(0);
  const [views, setViews] = useState(0);
  const [qna, setQna] = useState(0);
  const [feedback, setFeedback] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [avgTime, setAvgTime] = useState(0);
  const [balance, setBalance] = useState(0);
  const [amountSpent, setAmountSpent] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [feedBackList, setFeedBackList] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const navigate = useNavigate()

  const loadData = () => {
    setLoading(true);
    fetch(`${config.API}/insights`)
      .then((res) => res.json())
      .then((res) => {
        setFeedback(res.feedback_count);
        setViews(res.views);
        setQna(res.qna);
        setAvgTime(res.avg_timespent);
        setSkipped(res.skipped);
        setBalance(res.balance);
        setAmountSpent(res.amount_spent);
        setTransactionList(res.transactions);
        setFeedBackList(res.feedbacks);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if(tab==0){
      loadData()
    }
  }, [tab])

  return (
    <div className="min-h-screen w-full">
      <Header />
      <div className="px-6 mt-2 flex flex-col">
        <div className="flex">
          <div className="bg-white rounded-full flex p-1.5 select-none pb-2 px-4">
            <div
              onClick={() => {
                setTab(0);
              }}
              className={`cursor-pointer font-semibold text-black rounded-full p-2 ${
                tab == 0
                  ? "shadow-black bg-purple-300 hover:opacity-70 shadow-md"
                  : "hover:bg-slate-100 hover:shadow-inner active:scale-90"
              }`}
            >
              <span>Insights</span>
            </div>
            <div
              onClick={() => {
                setTab(1);
              }}
              className={`font-semibold text-black rounded-full p-2 ml-4 cursor-pointer ${
                tab == 1
                  ? "shadow-black bg-purple-300 hover:opacity-70 shadow-md"
                  : "hover:bg-slate-100 hover:shadow-inner active:scale-90"
              }`}
            >
              <span>Campaigns</span>
            </div>
          </div>
        </div>
        {tab == 0 && (
          <div className="relative">
            {isLoading && (
              <div className="absolute top-0 bottom-0 flex items-center justify-center  left-0 right-0 bg-black">
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
            )}
            <div className="flex mt-6 relative">
              <div className="flex flex-col">
                <label for="campaigns" className="font-bold mb-2 text-lg">
                  Campaign:
                </label>
                <select
                  value={""}
                  name="campaigns"
                  id="campaigns"
                  className="bg-black border border-white p-3 rounded-xl w-44"
                >
                  <option value="">Best Pizza Campaign</option>
                </select>
              </div>
              <div className="ml-4 flex flex-col">
                <label for="campaigns" className="font-bold mb-2 text-lg">
                  Time range:
                </label>
                <select
                  value={""}
                  name="campaigns"
                  id="campaigns"
                  className="bg-black border border-white p-3 rounded-xl w-44"
                >
                  <option value="">1 Month</option>
                </select>
              </div>
            </div>
            <div className="mt-9 flex">
              <div className="bg-white rounded-lg p-2 w-44 flex flex-col">
                <span className="bg-purple-300 font-semibold text-black rounded-lg p-1">
                  Views
                </span>
                <span className="mt-1 text-black font-bold ml-1 text-2xl">
                  {views}
                </span>
              </div>
              <div className="ml-4 bg-white rounded-lg p-2 w-44 flex flex-col">
                <span className="bg-purple-300 font-semibold text-black rounded-lg p-1">
                  QnA
                </span>
                <span className="mt-1 text-black font-bold ml-1 text-2xl">
                  {qna}
                </span>
              </div>
              <div className="ml-4 bg-white rounded-lg p-2 w-44 flex flex-col">
                <span className="bg-purple-300 font-semibold text-black rounded-lg p-1">
                  Feedbacks
                </span>
                <span className="mt-1 text-black font-bold ml-1 text-2xl">
                  {feedback}
                </span>
              </div>
              <div className="ml-4 bg-white rounded-lg p-2 w-44 flex flex-col">
                <span className="bg-purple-300 font-semibold text-black rounded-lg p-1">
                  Skipped
                </span>
                <span className="mt-1 text-black font-bold ml-1 text-2xl">
                  {skipped}
                </span>
              </div>
              <div className="ml-4 bg-white rounded-lg p-2 w-44 flex flex-col">
                <span className="bg-purple-300 font-semibold text-black rounded-lg p-1">
                  Avg. Timespent
                </span>
                <span className="mt-1 text-black font-bold ml-1 text-2xl">
                  {avgTime}
                  <span className="text-sm ml-1">seconds</span>
                </span>
              </div>
              <div className="ml-4 bg-white rounded-lg p-2 w-44 flex flex-col">
                <span className="bg-purple-300 font-semibold text-black rounded-lg p-1">
                  Amount Spent
                </span>
                <div className="flex justify-between items-baseline">
                  <span className="mt-1 text-black font-bold ml-1 text-2xl">
                    {amountSpent.toFixed(2)}
                    <span className="text-sm ml-1">HuMa</span>
                  </span>
                </div>
              </div>
              <div className="ml-4 bg-white rounded-lg p-2 w-56 flex flex-col">
                <span className="bg-purple-300 font-semibold text-black rounded-lg p-1">
                  Balance
                </span>
                <div className="flex justify-between items-baseline">
                  <span className="mt-1 text-black font-bold ml-1 text-2xl">
                    {balance}
                    <span className="text-sm ml-1">HuMa</span>
                  </span>
                  <div>
                    <div
                      onClick={() => {
                        toast.info("Topup not supported in demo dashboard!");
                      }}
                      className="mb-1 shadow-purple-400 shadow-md bg-gradient-to-r to-[#ff6a00] from-[#ee0979] rounded-lg font-bold p-0.5  px-1 cursor-pointer active:scale-90 text-sm"
                    >
                      <span>Top-Up</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex">
              <div className="p-4 bg-white text-black rounded-xl max-h-[500px] overflow-scroll">
                <table className="border-spacing-5">
                  <thead>
                  <tr>
                    <th className="w-96 text-left bg-purple-300 px-2 rounded-l-lg">
                      Feedback
                    </th>
                    <th className="bg-purple-300 px-2 rounded-r-lg">
                      Received On
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  {feedBackList.map((v, i) => {
                      return (
                        <tr className="border-b">
                        <td className="pl-2" key={`txdata11_${i}`}>
                          <div className="py-2">{v.message}</div>
                        </td>
                        <td className="pl-2" key={`txdata12_${i}`}>
                          <div className="py-2">{new Date(v.created_at).toDateString()}</div>
                        </td>
                      </tr>
                      )})}
             
                  </tbody>
                </table>
              </div>
              <div className="ml-4 p-4 bg-white text-black rounded-xl max-h-[500px] overflow-scroll">
                <table className="border-spacing-5">
                  <thead>
                    <tr>
                      <th className="w-80 text-left bg-purple-300 px-2 rounded-l-lg">
                        Tx Hash
                      </th>
                      <th className="bg-purple-300 px-2">
                        Amount <span className="text-sm">(HuMa)</span>
                      </th>
                      <th className="bg-purple-300 px-2 rounded-r-lg">
                        Debited On
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionList.map((v, i) => {
                      return (
                        <tr className="border-b">
                          <td className="pl-2 pr-6" key={`txdata1_${i}`}>
                            <div className="py-2 text-blue-500"><a href={`https://testnet-explorer.thetatoken.org/txs/${v.tx_hash}`}>{v.tx_hash.slice(0, 20)}...{v.tx_hash.slice(40, 66)}</a></div>
                          </td>
                          <td className="pl-2" key={`txdata2_${i}`}>
                            <div className="py-2">
                              {v.amount.toFixed(2)} HuMa
                            </div>
                          </td>
                          <td className="pl-2" key={`txdata3_${i}`}>
                            <div className="py-2">
                              {new Date(v.created_at).toDateString()}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {tab == 1 && (
          <>
            <div className="flex flex-col">
              <div className="flex">
                <div
                  onClick={() => {
                    toast.info(
                      "Adding new campaign not supported in demo dashboard!"
                    );
                  }}
                  className="mt-6 shadow-purple-400 shadow-md bg-gradient-to-r to-[#ff6a00] from-[#ee0979] rounded-lg font-bold p-1.5  px-4 cursor-pointer active:scale-90 text-lg"
                >
                  <span>New Campaign</span>
                </div>
              </div>
              <div className="flex">
                <div className="mt-4 p-4 bg-white text-black rounded-xl max-h-[500px] overflow-scroll">
                  <table className="border-spacing-5">
                    <tr>
                      <th className="w-96 text-left bg-purple-300 px-2 rounded-l-lg">
                        Campaign
                      </th>
                      <th className="bg-purple-300 px-2">Created On</th>
                      <th className="bg-purple-300 px-2 rounded-r-lg"></th>
                    </tr>
                    <tr className="border-b">
                      <td className="pl-2">
                        <div className="py-2">Best Pizza Campaign</div>
                      </td>
                      <td className="pl-2 ">
                        <div className="py-2  ">20 July 2024</div>
                      </td>
                      <td className="pl-2">
                        <div className="py-2 pl-12">
                          <div
                            onClick={() => {
                              navigate("/dashboard/campaign")
                            }}
                            className="text-white shadow-purple-400 shadow-md bg-gradient-to-r to-[#ff6a00] from-[#ee0979] rounded-lg font-bold p-1.5  px-4 cursor-pointer active:scale-90 text-lg"
                          >
                            <span>Edit</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
