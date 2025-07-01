import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

// A/B Test variants
const CTA_VARIANTS = {
  A: "Join the Movement",
  B: "Claim Your Spot"
};

const professions = [
  'Student (School / College / University)',
  'Education (Teacher, Lecturer, Academic)',
  'Business & Management',
  'Engineering & Technology',
  'Health & Medicine',
  'Science & Research',
  'Law & Policy',
  'Environment & Sustainability',
  'Arts, Design & Creative Fields',
  'Media & Communications',
  'Social Sciences & Humanities',
  'IT & Software Development',
  'Government & Public Sector',
  'Hospitality, Travel & Tourism',
  'Skilled Trades (e.g., Electrician, Plumber, Mechanic)',
  'Retail, Sales & Customer Service',
  'Logistics, Transport & Delivery',
  'Home & Caregiving (e.g., Stay-at-home parent, Care worker)',
  'Currently Unemployed or Exploring Options',
  'Prefer Not to Say',
];

const genders = [
  'Male',
  'Female',
  'Non-binary',
  'Prefer not to say',
];

const ageRanges = [
  '10-20',
  '20-25',
  '25-30',
  '30-40',
  '40-50',
  '50+',
];

const countries = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'South Korea',
  'Singapore',
  'India',
  'Pakistan',
  'Bangladesh',
  'Sri Lanka',
  'Nepal',
  'China',
  'Thailand',
  'Vietnam',
  'Malaysia',
  'Indonesia',
  'Philippines',
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'Oman',
  'Turkey',
  'Egypt',
  'South Africa',
  'Nigeria',
  'Kenya',
  'Ghana',
  'Ethiopia',
  'Morocco',
  'Tunisia',
  'Brazil',
  'Argentina',
  'Mexico',
  'Colombia',
  'Chile',
  'Peru',
  'Venezuela',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Austria',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Poland',
  'Czech Republic',
  'Hungary',
  'Romania',
  'Bulgaria',
  'Greece',
  'Portugal',
  'Spain',
  'Italy',
  'Ireland',
  'New Zealand',
  'Other',
];

// Cities organized by country
const citiesByCountry: { [key: string]: string[] } = {
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
  'United Kingdom': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield', 'Edinburgh', 'Bristol', 'Cardiff'],
  'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong'],
  'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'],
  'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
  'Japan': ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki', 'Saitama'],
  'South Korea': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan', 'Changwon'],
  'Singapore': ['Singapore'],
  'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'],
  'Pakistan': ['Karachi', 'Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Hyderabad', 'Gujranwala', 'Peshawar', 'Quetta', 'Islamabad'],
  'Bangladesh': ['Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh', 'Comilla', 'Narayanganj'],
  'Sri Lanka': ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Trincomalee', 'Anuradhapura', 'Polonnaruwa', 'Kurunegala', 'Ratnapura', 'Badulla'],
  'Nepal': ['Kathmandu', 'Pokhara', 'Lalitpur', 'Bharatpur', 'Biratnagar', 'Birgunj', 'Dharan', 'Butwal', 'Hetauda', 'Nepalgunj'],
  'China': ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Tianjin', 'Chongqing', 'Nanjing', 'Wuhan', 'Xi\'an'],
  'Thailand': ['Bangkok', 'Chiang Mai', 'Pattaya', 'Phuket', 'Hat Yai', 'Nakhon Ratchasima', 'Udon Thani', 'Khon Kaen', 'Nakhon Si Thammarat', 'Chiang Rai'],
  'Vietnam': ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hai Phong', 'Can Tho', 'Bien Hoa', 'Hue', 'Nha Trang', 'Buon Ma Thuot', 'Vung Tau'],
  'Malaysia': ['Kuala Lumpur', 'George Town', 'Ipoh', 'Shah Alam', 'Petaling Jaya', 'Johor Bahru', 'Malacca City', 'Alor Setar', 'Miri', 'Kuching'],
  'Indonesia': ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Palembang', 'Makassar', 'Tangerang', 'Depok', 'Bekasi'],
  'Philippines': ['Manila', 'Quezon City', 'Davao City', 'Caloocan', 'Cebu City', 'Zamboanga City', 'Antipolo', 'Pasig', 'Taguig', 'Valenzuela'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Taif', 'Tabuk', 'Buraidah', 'Khamis Mushait', 'Al Hofuf'],
  'Qatar': ['Doha', 'Al Wakrah', 'Al Khor', 'Lusail', 'Al Rayyan', 'Umm Salal', 'Al Daayen'],
  'Kuwait': ['Kuwait City', 'Salmiya', 'Hawalli', 'Jahra', 'Farwaniya', 'Mubarak Al-Kabeer'],
  'Bahrain': ['Manama', 'Riffa', 'Muharraq', 'Hamad Town', 'A\'ali', 'Isa Town'],
  'Oman': ['Muscat', 'Salalah', 'Sohar', 'Nizwa', 'Sur', 'Ibri'],
  'Turkey': ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Gaziantep', 'Konya', 'Mersin', 'Diyarbakir'],
  'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez', 'Luxor', 'Mansoura', 'El-Mahalla El-Kubra', 'Aswan'],
  'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London', 'Nelspruit', 'Kimberley', 'Polokwane'],
  'Nigeria': ['Lagos', 'Kano', 'Ibadan', 'Kaduna', 'Port Harcourt', 'Benin City', 'Maiduguri', 'Zaria', 'Aba', 'Jos'],
  'Kenya': ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Nyeri', 'Machakos', 'Kakamega', 'Thika', 'Kitale'],
  'Ghana': ['Accra', 'Kumasi', 'Tamale', 'Sekondi-Takoradi', 'Ashaiman', 'Sunyani', 'Cape Coast', 'Koforidua', 'Obuasi', 'Tema'],
  'Ethiopia': ['Addis Ababa', 'Dire Dawa', 'Mekelle', 'Gondar', 'Adama', 'Jimma', 'Bahir Dar', 'Jijiga', 'Shashamane', 'Bishoftu'],
  'Morocco': ['Casablanca', 'Rabat', 'Fez', 'Marrakech', 'Agadir', 'Tangier', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan'],
  'Tunisia': ['Tunis', 'Sfax', 'Sousse', 'Ettadhamen', 'Kairouan', 'Gabès', 'Ariana', 'Gafsa', 'Monastir', 'La Marsa'],
  'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'],
  'Argentina': ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Tucumán', 'Salta', 'Santa Fe', 'San Juan', 'Resistencia'],
  'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'Ciudad Juárez', 'León', 'Zapopan', 'Nezahualcóyotl', 'Chihuahua'],
  'Colombia': ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué'],
  'Chile': ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta', 'Viña del Mar', 'Temuco', 'Rancagua', 'Talca', 'Arica'],
  'Peru': ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Iquitos', 'Cusco', 'Chimbote', 'Huancayo', 'Tacna'],
  'Venezuela': ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay', 'Ciudad Guayana', 'Petare', 'Maturín', 'Barcelona', 'Turmero'],
  'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen'],
  'Belgium': ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Namur', 'Leuven', 'Mons', 'Aalst'],
  'Switzerland': ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Winterthur', 'St. Gallen', 'Lucerne', 'Lugano', 'Biel'],
  'Austria': ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt', 'Villach', 'Wels', 'Sankt Pölten', 'Dornbirn'],
  'Sweden': ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping'],
  'Norway': ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Drammen', 'Fredrikstad', 'Kristiansand', 'Sandnes', 'Tromsø', 'Sarpsborg'],
  'Denmark': ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde'],
  'Finland': ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Jyväskylä', 'Lahti', 'Kuopio', 'Pori'],
  'Poland': ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice'],
  'Czech Republic': ['Prague', 'Brno', 'Ostrava', 'Plzen', 'Liberec', 'Olomouc', 'Ústí nad Labem', 'České Budějovice', 'Hradec Králové', 'Pardubice'],
  'Hungary': ['Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs', 'Győr', 'Nyíregyháza', 'Kecskemét', 'Székesfehérvár', 'Szombathely'],
  'Romania': ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Constanța', 'Craiova', 'Galați', 'Ploiești', 'Brașov', 'Brăila'],
  'Bulgaria': ['Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Stara Zagora', 'Pleven', 'Sliven', 'Dobrich', 'Shumen'],
  'Greece': ['Athens', 'Thessaloniki', 'Patras', 'Piraeus', 'Larissa', 'Heraklion', 'Peristeri', 'Kallithea', 'Acharnes', 'Kalamaria'],
  'Portugal': ['Lisbon', 'Porto', 'Vila Nova de Gaia', 'Amadora', 'Braga', 'Funchal', 'Coimbra', 'Setúbal', 'Almada', 'Agualva-Cacém'],
  'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao'],
  'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania'],
  'Ireland': ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford', 'Drogheda', 'Dundalk', 'Swords', 'Bray', 'Navan'],
  'New Zealand': ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga', 'Napier-Hastings', 'Dunedin', 'Palmerston North', 'Nelson', 'Rotorua'],
};

const householdSizes = [
  '1 person',
  '2 people',
  '3 people',
  '4 people',
  '5+ people',
];

const Signup = () => {
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    age: '',
    gender: '',
    profession: '',
    country: '',
    city: '',
    household: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [ctaVariant, setCtaVariant] = useState<'A' | 'B'>('A');
  const [waitlistPosition, setWaitlistPosition] = useState(0);

  // A/B Test: Randomly assign variant on component mount
  useEffect(() => {
    setCtaVariant(Math.random() > 0.5 ? 'A' : 'B');
    // Simulate waitlist position
    setWaitlistPosition(Math.floor(Math.random() * 1000) + 1);
  }, []);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setForm({ ...form, email });
    
    if (email.length > 0) {
      setEmailValid(validateEmail(email));
    } else {
      setEmailValid(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If country is changed, reset city and update form
    if (name === 'country') {
      setForm({ ...form, country: value, city: '' });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Get filtered cities based on selected country
  const getFilteredCities = () => {
    if (!form.country) return [];
    return citiesByCountry[form.country] || [];
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateEmail(form.email)) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSuccess(true);
  };

  // Success confirmation screen
  if (isSuccess) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-gradient-to-br from-white to-emerald-50 py-12 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center space-y-6">
            {/* Success Animation */}
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-amber-800">Congratulations!</h1>
            <p className="text-gray-600 text-lg">
              You're on the Zerrah waiting list. We'll send you an invite as soon as we launch.
            </p>
            
            {/* Waitlist Position */}
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-amber-800 font-semibold">
                You're #{waitlistPosition.toLocaleString()} in line
              </p>
              <p className="text-amber-600 text-sm">We're launching soon!</p>
            </div>

            {/* Share Buttons */}
            <div className="space-y-3">
              <p className="text-gray-600 font-medium">Share the good news!</p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => {
                    const text = `Just joined the Zerrah waiting list! 🚀 Small actions, big impact. #ClimateAction #Sustainability`;
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Share on Twitter
                </button>
                <button 
                  onClick={() => {
                    const text = `Just joined the Zerrah waiting list! Small actions, big impact.`;
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&title=${encodeURIComponent('Zerrah - Small actions, big impact')}&summary=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Share on LinkedIn
                </button>
              </div>
            </div>

            {/* Progressive Engagement */}
            <div className="border-t pt-6 space-y-4">
              <p className="text-gray-600">Stay connected while you wait:</p>
              <div className="flex gap-3 justify-center">
                <button className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                  Follow on Instagram
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.194 94.639L19.53 81.105 6.184 67.593l3.007-3.005L24.664 78.1l-15.463 15.544z"/>
                  </svg>
                  Join Slack Community
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-gradient-to-br from-white to-emerald-50 py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 space-y-6">
          {/* Hero Header */}
          <div className="text-center space-y-3">
            <div className="relative flex items-center justify-center mx-auto" style={{ width: 96, height: 96 }}>
              {/* Glowing animated ring */}
              <span className="absolute inline-block w-full h-full rounded-full bg-amber-100 animate-pulse opacity-70"></span>
              {/* Icon with shadow */}
              <div className="relative z-10 w-20 h-20 bg-amber-200 rounded-full flex items-center justify-center shadow-lg border-4 border-amber-300">
                <img
                  src="/images/particles.png"
                  alt="Zerrah particles"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-amber-800 mt-2">Join Zerrah</h1>
            <p className="text-lg text-gray-600">Small actions, big impact</p>
            <div className="text-amber-700 font-semibold text-base mt-1">Your Climate Impact Starts Here</div>
          </div>

          {/* Enhanced Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                name="firstName"
                type="text"
                placeholder="First name (optional)"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="relative">
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleEmailChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent ${
                  emailValid === null 
                    ? 'border-gray-200' 
                    : emailValid 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-red-300 bg-red-50'
                }`}
                required
              />
              
              {/* Inline Validation */}
              {emailValid !== null && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {emailValid ? (
                    <span className="text-green-500 text-xl">✔️</span>
                  ) : (
                    <span className="text-red-500 text-xl">❌</span>
                  )}
                </div>
              )}
              
              {emailValid === false && (
                <p className="text-red-500 text-sm mt-1">That doesn't look right</p>
              )}
            </div>

            {/* Age Selection */}
            <div>
              <label className="block text-gray-700 mb-1">Your Age</label>
              <div className="flex flex-wrap gap-2">
                {ageRanges.map((range) => (
                  <label key={range} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="age"
                      value={range}
                      checked={form.age === range}
                      onChange={handleChange}
                      className="form-radio text-amber-600"
                      required
                    />
                    <span className="text-sm">{range}</span>
                  </label>
                ))}
              </div>
              <span className="text-xs text-gray-400">How many years young are you?</span>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-gray-700 mb-1">Your Identity</label>
              <select 
                name="gender" 
                value={form.gender} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Select...</option>
                {genders.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              <span className="text-xs text-gray-400">Your answer helps us understand our community better.</span>
            </div>

            {/* Profession Selection */}
            <div>
              <label className="block text-gray-700 mb-1">Your Work & Lifestyle</label>
              <select 
                name="profession" 
                value={form.profession} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Select...</option>
                {professions.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Location Fields - Country First, Then City */}
            <div>
              <label className="block text-gray-700 mb-1">Your Location</label>
              <select 
                name="country" 
                value={form.country} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 mb-2"
                required
              >
                <option value="">Select Country...</option>
                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select 
                name="city" 
                value={form.city} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200"
                required
                disabled={!form.country}
              >
                <option value="">
                  {form.country ? 'Select City...' : 'Select a country first'}
                </option>
                {getFilteredCities().map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className="text-xs text-gray-400">This helps us see local trends in our eco-community.</span>
            </div>

            {/* Household Size Options */}
            <div>
              <label className="block text-gray-700 mb-1">Your Tribe at Home</label>
              <select 
                name="household" 
                value={form.household} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Select household size...</option>
                {householdSizes.map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
              <span className="text-xs text-gray-400">Every household is a team effort towards a better planet.</span>
            </div>

            {/* Microcopy Reassurance */}
            <p className="text-xs text-gray-500 text-center">
              No spam—just gentle updates on your climate story
            </p>

            {/* CTA Button with Loading State */}
            <button
              type="submit"
              disabled={!emailValid || isLoading}
              className={`w-full py-3 px-6 rounded-full font-bold text-lg transition-all duration-300 transform ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-amber-600 hover:bg-amber-700 hover:scale-105 active:scale-95'
              } text-white shadow-lg`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Joining...
                </div>
              ) : (
                CTA_VARIANTS[ctaVariant]
              )}
            </button>
          </form>

          {/* A/B Test Tracking */}
          <div className="text-xs text-gray-400 text-center">
            Testing variant: {ctaVariant}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup; 