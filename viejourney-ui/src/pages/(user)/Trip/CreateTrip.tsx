import { Chip, Stack } from "@mui/material";
import React from "react";
import { MainLayout } from "../../../layouts";
import { CreateTripForm } from "../../../components/Pages/(user)/Trips";
import { AutoAwesome, AutoAwesomeOutlined } from "@mui/icons-material";
const CreateTrip: React.FC = () => {
  return (
    <MainLayout>
      <Stack className="py-20 max-w-[125rem] min-w-[37.5rem] flex items-center justify-center space-y-10">
        <div className="text-center space-y-2">
          <Chip
            label="AI Powered Trip Planning"
            icon={<AutoAwesome className="text-blue-700" />}
            className="px-2 bg-blue-200 text-blue-800 font-semibold text-sm"
          />
          <h1 className="text-5xl font-semibold">
            Plan your next{" "}
            <span className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text">
              adventure
            </span>
          </h1>
          <p className="text-base text-neutral-600 max-w-[40rem] mx-auto">
            Create personalized itineraries, discover hidden gems, and make
            unforgettable memories with our intelligent trip planning assistant.
          </p>
        </div>
        <div className="grid grid-cols-6 gap-4 w-full max-w-[75rem] mx-auto">
          <CreateTripForm />
          <div className="lg:col-span-2  space-y-4">
            <div className="h-fit shadow-sm border border-neutral-400 rounded-2xl bg-white p-4">
              <h1 className="mb-4 font-bold text-xl">Why plan with us?</h1>
              <dl>
                <Stack direction="row" alignItems="start" spacing={2}>
                  <div className="bg-violet-200 p-1 rounded-md">
                    <AutoAwesomeOutlined className="text-violet-600" />
                  </div>
                  <div>
                    <dt className="font-semibold text-base">
                      AI-Powered Suggestions
                    </dt>
                    <dd className="text-sm text-neutral-600">
                      Get personalized recommendations based on your preferences
                    </dd>
                  </div>
                </Stack>
                <Stack direction="row" alignItems="start" spacing={2}>
                  <div className="bg-green-200 p-1 rounded-md">
                    <AutoAwesomeOutlined className="text-green-600" />
                  </div>
                  <div>
                    <dt className="font-semibold text-base">
                      Collaborative Planning
                    </dt>
                    <dd className="text-sm text-neutral-600">
                      Plan together with friends and family in real-time
                    </dd>
                  </div>
                </Stack>
                <Stack direction="row" alignItems="start" spacing={2}>
                  <div className="bg-blue-200 p-1 rounded-md">
                    <AutoAwesomeOutlined className="text-blue-600" />
                  </div>
                  <div>
                    <dt className="font-semibold text-base">Local Insights</dt>
                    <dd className="text-sm text-neutral-600">
                      Discover hidden gems from local experts and travelers
                    </dd>
                  </div>
                </Stack>
              </dl>
            </div>
            <div className="h-fit shadow-sm border border-neutral-400 rounded-2xl bg-white p-4">
              <h1 className="font-bold text-xl mb-4">Trending Destinations</h1>
              <ul className="grid grid-cols-2 gap-4 ">
                <li className="relative hover:scale-105 transition-transform duration-300">
                  <img
                    src="/images/lake-storm-morning-8k-mr.jpg"
                    alt="Destination 1"
                    className="lg:w-full lg:h-32 object-cover rounded-md "
                  />
                  <div className="absolute bottom-2 left-2  ">
                    <h3 className="text-white font-semibold">Ta Xua</h3>
                    <p className="text-neutral-200 text-sm">Viet Nam</p>
                  </div>
                </li>
                <li className="relative hover:scale-105 transition-transform duration-300">
                  <img
                    src="/images/lake-storm-morning-8k-mr.jpg"
                    alt="Destination 1"
                    className="lg:w-full lg:h-32 object-cover rounded-md "
                  />
                  <div className="absolute bottom-2 left-2  ">
                    <h3 className="text-white font-semibold">Ta Xua</h3>
                    <p className="text-neutral-200 text-sm">Viet Nam</p>
                  </div>
                </li>
                <li className="relative hover:scale-105 transition-transform duration-300">
                  <img
                    src="/images/lake-storm-morning-8k-mr.jpg"
                    alt="Destination 1"
                    className="lg:w-full lg:h-32 object-cover rounded-md "
                  />
                  <div className="absolute bottom-2 left-2  ">
                    <h3 className="text-white font-semibold">Ta Xua</h3>
                    <p className="text-neutral-200 text-sm">Viet Nam</p>
                  </div>
                </li>
                <li className="relative hover:scale-105 transition-transform duration-300">
                  <img
                    src="/images/lake-storm-morning-8k-mr.jpg"
                    alt="Destination 1"
                    className="lg:w-full lg:h-32 object-cover rounded-md "
                  />
                  <div className="absolute bottom-2 left-2  ">
                    <h3 className="text-white font-semibold">Ta Xua</h3>
                    <p className="text-neutral-200 text-sm">Viet Nam</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Stack>
    </MainLayout>
  );
};

export default CreateTrip;
