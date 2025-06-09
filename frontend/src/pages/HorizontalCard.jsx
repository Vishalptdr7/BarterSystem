import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import ImageCarousel from "./ImageCarousel";

export function HorizontalCard() {
  return (
    <Card className="w-full flex flex-col lg:flex-row max-w-6xl mx-auto shadow-lg border border-gray-200 rounded-xl overflow-hidden my-4">
      {/* Left: Carousel */}
      <CardHeader
        shadow={false}
        floated={false}
        className="w-full lg:w-1/2 h-60 sm:h-72 md:h-96 lg:h-auto p-0 rounded-none"
      >
        <div className="h-full w-full object-cover">
          <ImageCarousel />
        </div>
      </CardHeader>

      {/* Right: Content */}
      <CardBody className="w-full lg:w-1/2 flex flex-col justify-center px-4 py-6 sm:px-6 sm:py-8 bg-white">
        <Typography
          variant="small"
          color="gray"
          className="mb-2 uppercase tracking-wide font-medium text-teal-600 text-sm"
        >
          Skill Exchange
        </Typography>

        <Typography
          variant="h4"
          color="blue-gray"
          className="mb-3 text-xl sm:text-2xl font-bold text-gray-900 leading-tight"
        >
          Seamless Bartering of Skills and Services
        </Typography>

        <Typography
          color="gray"
          className="mb-4 text-gray-700 text-sm sm:text-base leading-relaxed"
        >
          Our platform empowers users to exchange skills and services directly—
          no money involved. Whether you're a developer seeking design help or a
          teacher looking to learn photography, match with others who need your
          skill. Build trust with ratings, chat in real-time, and grow through
          community-driven learning.
        </Typography>

        <a href="#" className="inline-block">
          <Button
            variant="filled"
            className="flex items-center gap-2 text-sm bg-teal-500 hover:bg-teal-600 transition-all duration-300 text-white px-4 py-2 rounded-full shadow"
          >
            Explore Now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </Button>
        </a>
      </CardBody>
    </Card>
  );
}
