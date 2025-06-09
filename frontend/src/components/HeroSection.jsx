import React from "react";
import { Button } from "@material-tailwind/react";

const HeroSection = () => {
  return (
    <section className="mt-12 sm:mt-6 lg:mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="my-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28 flex flex-col lg:flex-row gap-6 items-center lg:items-start">
        {/* Text Content */}
        <div className="w-full lg:w-1/2 sm:text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-800">
            <span className="block xl:inline">Exchange Skills, Grow Your</span>
            <span className="block text-indigo-600 xl:inline">
              {" "}
              Opportunities
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-500 sm:max-w-xl sm:mx-auto lg:mx-0">
            Join our platform to barter your skills with others, learn new
            abilities, and build a network of mutual growth. Whether you're a
            designer, coder, writer, or marketer — there's someone out there who
            needs your skill and offers something valuable in return.
          </p>

          {/* Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-3">
            <Button
              color="gray"
              className="text-white bg-gray-800 hover:bg-gray-700 px-8 py-3 md:px-10 md:py-4 text-base md:text-lg"
            >
              Start Exchanging
            </Button>
            <Button
              variant="outlined"
              color="indigo"
              className="bg-indigo-100 hover:bg-indigo-200 text-gray-800 px-8 py-3 md:px-10 md:py-4 text-base md:text-lg"
            >
              See How It Works
            </Button>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full lg:w-1/2">
          <img
            className="h-56 sm:h-72 md:h-96 w-full object-cover rounded-md shadow-lg"
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
            alt="Hero"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
