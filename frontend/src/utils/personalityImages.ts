import { PersonalityType } from '@/types/personality';

type Gender = 'boy' | 'girl';

// Define the personality image mapping with gender variants
const personalityImageMap: Record<PersonalityType, Record<Gender, string>> = {
  'Sustainability Slayer': {
    boy: '/images/Sustainability-Slayer-Boy.png',
    girl: '/images/Sustainability-Slayer-Girl.png'
  },
  'Planet\'s Main Character': {
    boy: '/images/Planets-Main-Character-Boy.png',
    girl: '/images/Planets-Main-Character-Girl.png'
  },
  'Sustainability Soft Launch': {
    boy: '/images/Sustainability-Soft-Launch-Boy.png',
    girl: '/images/Sustainability-Soft-Launch-Girl.png'
  },
  'Eco in Progress': {
    boy: '/images/Eco-in-Progress-Boy.png',
    girl: '/images/Eco-in-Progress-Girl.png'
  },
  'Kind of Conscious, Kind of Confused': {
    boy: '/images/Kind-of-Conscious-Boy.png',
    girl: '/images/Kind-of-Conscious-Girl.png'
  },
  'Doing Nothing for the Planet': {
    boy: '/images/Doing-Nothing-Boy.png',
    girl: '/images/Doing-Nothing-Girl.png'
  },
  'Certified Climate Snoozer': {
    boy: '/images/Climate-Snoozer-Boy.png',
    girl: '/images/Climate-Snoozer-Girl.png'
  }
};

// Fallback images for each gender
const FALLBACK_IMAGES = {
  boy: '/images/Default-Personality-Boy.png',
  girl: '/images/Default-Personality-Girl.png'
};

// Cache for preloaded images
const imageCache = new Map<string, HTMLImageElement>();

/**
 * Get the image path for a given personality type and gender
 * @param personalityType - The type of personality
 * @param gender - The gender of the user ('boy' or 'girl')
 * @returns The image path for the personality
 */
export const getPersonalityImage = (
  personalityType: PersonalityType,
  gender?: Gender // gender is optional
): string => {
  let safeGender: Gender;
  if (gender === 'boy' || gender === 'girl') {
    safeGender = gender;
  } else {
    // Pick random gender if not provided or invalid
    safeGender = Math.random() < 0.5 ? 'boy' : 'girl';
  }
  const imagePath = personalityImageMap[personalityType]?.[safeGender] || FALLBACK_IMAGES[safeGender];
  console.log('Getting image path:', { personalityType, gender: safeGender, imagePath });
  return imagePath;
};

/**
 * Preload personality images for better performance
 * @param personalityTypes - Array of personality types to preload
 * @param gender - The gender of the user ('boy' or 'girl')
 */
export const preloadPersonalityImages = (personalityTypes: PersonalityType[], gender: Gender): void => {
  personalityTypes.forEach((type) => {
    const imagePath = getPersonalityImage(type, gender);
    
    // Skip if already cached
    if (imageCache.has(imagePath)) return;

    const img = new Image();
    img.onload = () => {
      console.log('Image loaded successfully:', imagePath);
      imageCache.set(imagePath, img);
    };
    img.onerror = (error) => {
      console.error('Error loading image:', { imagePath, error });
    };
    img.src = imagePath;
  });
};

/**
 * Get image dimensions for a personality image
 * @param personalityType - The type of personality
 * @param gender - The gender of the user ('boy' or 'girl')
 * @returns Promise resolving to image dimensions
 */
export const getImageDimensions = async (personalityType: PersonalityType, gender: Gender): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      console.log('Image dimensions loaded:', { personalityType, gender, width: img.width, height: img.height });
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = (error) => {
      console.error('Error getting image dimensions:', { personalityType, gender, error });
      reject(error);
    };
    img.src = getPersonalityImage(personalityType, gender);
  });
};

/**
 * Check if an image is already loaded
 * @param personalityType - The type of personality
 * @param gender - The gender of the user ('boy' or 'girl')
 * @returns boolean indicating if the image is loaded
 */
export const isImageLoaded = (personalityType: PersonalityType, gender: Gender): boolean => {
  const imagePath = getPersonalityImage(personalityType, gender);
  const isLoaded = imageCache.has(imagePath);
  console.log('Checking if image is loaded:', { personalityType, gender: imagePath, isLoaded });
  return isLoaded;
}; 