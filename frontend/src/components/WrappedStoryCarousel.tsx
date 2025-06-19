import React from 'react';
import Slider from 'react-slick';
import { WrappedStoryCard } from './WrappedStoryCard';

// Map personality to image and color
const personalityAssets: Record<string, { image: string; color: string }> = {
  "Sustainability Slayer": {
    image: "/profile.jpg",
    color: "#1ED760"
  },
  "Planet's Main Character": {
    image: "/profile.jpg",
    color: "#E2215B"
  },
  "Sustainability Soft Launch": {
    image: "/profile.jpg",
    color: "#4F8A8B"
  },
  "Kind of Conscious, Kind of Confused": {
    image: "/profile.jpg",
    color: "#F9A826"
  },
  "Eco in Progress": {
    image: "/profile.jpg",
    color: "#6C63FF"
  },
  "Doing Nothing for the Planet": {
    image: "/profile.jpg",
    color: "#BDBDBD"
  },
  "Certified Climate Snoozer": {
    image: "/profile.jpg",
    color: "#22223B"
  },
};

interface WrappedStoryCarouselProps {
  storySlides: any[];
}

export const WrappedStoryCarousel: React.FC<WrappedStoryCarouselProps> = ({ storySlides }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <Slider {...settings}>
      {storySlides.map((slide, idx) => (
        <div key={idx}>
          <WrappedStoryCard
            {...slide}
            mainImage={personalityAssets[slide.personality]?.image || "/images/personalities/default.png"}
            color={personalityAssets[slide.personality]?.color || "#222"}
          />
        </div>
      ))}
    </Slider>
  );
};

export default WrappedStoryCarousel; 