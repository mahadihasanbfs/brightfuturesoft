import React from "react";

const ViewIssue = ({ viewissue, issueDetails, setViewissue }) => {
  return (
    <div>
      <div className={viewissue ? "flex" : "hidden"}>
        <div className=" mx-auto py-20">
          <div
            className={`fixed  z-50 top-0 left-0 flex h-full min-h-screen w-full items-center justify-center backdrop-blur-xs bg-opacity-90 px-4 py-5  ${
              viewissue ? "block" : "hidden"
            }`}
          >
            <div className="w-full max-w-[800px] max-h-[90%]  rounded-[20px]  bg-gray-900 border border-gray-700 relative pb-10 px-8 text-center md:px-[30px] ">
              <div className="flex justify-between z-50 pt-4 items-start w-full sticky top-0  border-b">
                <div className="pb-2 text-xl font-bold text-white text-center sm:text-2xl">
                  <span>{issueDetails.author_name}</span>
                  <span className="text-red-400">'s Issue</span>
                </div>
                <div
                  onClick={() => setViewissue(!viewissue)}
                  className="cursor-pointer rounded-full px-2.5 mb-2 p-1 text-2xl hover:text-red-500"
                >
                  <button>
                    <svg
                      className="text-2xl"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-circle-x"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m15 9-6 6" />
                      <path d="m9 9 6 6" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="overflow-y-auto h-[90%]">
                <h3 className="pb-2 text-xl my-4 font-bold text-green-400 sm:text-xl text-start">
                  Subject: {issueDetails.subject}
                </h3>

                <div className="border border-gray-700 text-start bg-gray-900 rounded pt-1 px-4 pb-2 mb-4">
                  <p className="text-lg text-white font-semibold"> Message:</p>

                 <div
 className="w-full whitespace-pre-wrap text-white"
  dangerouslySetInnerHTML={{
    __html: issueDetails.body,
  }}
/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewIssue;
