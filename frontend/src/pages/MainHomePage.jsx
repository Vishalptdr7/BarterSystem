import React from "react";

const MainHomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      {/* Header */}
      <header className="navbar bg-primary text-primary-content px-6">
        <div className="flex-1 text-2xl font-bold">
          <a className="hover:text-accent transition-all duration-300">
            MyWebsite
          </a>
        </div>
        <nav className="flex gap-4">
          <a className="hover:underline">Home</a>
          <a className="hover:underline">About</a>
          <a className="hover:underline">Contact</a>
        </nav>
      </header>

      {/* Hero Carousel */}
      <div className="carousel w-full h-[500px] mt-4 rounded-lg overflow-hidden">
        <div id="slide1" className="carousel-item relative w-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
            className="w-full object-cover"
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 justify-between">
            <a href="#slide4" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide2" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide2" className="carousel-item relative w-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp"
            className="w-full object-cover"
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 justify-between">
            <a href="#slide1" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide3" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide3" className="carousel-item relative w-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp"
            className="w-full object-cover"
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 justify-between">
            <a href="#slide2" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide4" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide4" className="carousel-item relative w-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp"
            className="w-full object-cover"
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 justify-between">
            <a href="#slide3" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide1" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <section className="flex flex-col items-center justify-center text-center py-12 px-4 md:px-16">
        <h2 className="text-4xl font-bold mb-4">Welcome to MyWebsite</h2>
        <p className="max-w-2xl text-lg text-gray-600">
          Discover amazing content, connect with like-minded people, and enjoy a
          seamless experience.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-neutral text-neutral-content mt-auto">
        <p>© {new Date().getFullYear()} MyWebsite. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainHomePage;
