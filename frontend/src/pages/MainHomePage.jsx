import React from "react";
import { useEffect, useState } from "react";
import { Feature } from "../components/Feature";
import { Content } from "../components/Content";
import HeroSection from "../components/HeroSection";
import HeroSectionSkeleton from "../Skeleton/HeroSectionSkeleton";
import { ContentSkeleton } from "../Skeleton/ContentSkeleton";
import { FeatureSkeleton } from "../Skeleton/FeatureSkeleton";
import { HorizontalCard } from "./HorizontalCard";
import { HorizontalCardSkeleton } from "../Skeleton/HorizontalCardSkeleton";
const MainHomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      {/* Header */}
      {isLoading?<HeroSectionSkeleton/>:<HeroSection/>}
      {isLoading?<ContentSkeleton/>:<Content/>}
      {isLoading?<FeatureSkeleton/>:<Feature/>}
      {
        isLoading?<HorizontalCardSkeleton/>:<HorizontalCard/>
      }
      
    </div>
  );
};

export default MainHomePage;
