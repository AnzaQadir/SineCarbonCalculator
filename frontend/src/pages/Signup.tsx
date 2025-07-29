import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { signupUser, joinCommunity, SignupData } from '@/services/api';
import ChatSignup from '@/components/ChatSignup';

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
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState(0);

  // Success confirmation screen
  if (isSuccess) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-gradient-to-br from-white to-emerald-50 py-12 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center space-y-6">
            {/* Joyful Panda GIF */}
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg mb-2">
              <img src="/gif/joyful_panda.gif" alt="Joyful Panda" className="w-full h-full object-cover" />
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
            {/* Follow Buttons */}
            <div className="space-y-3">
              <p className="text-gray-600 font-medium">Stay connected!</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.open('https://www.instagram.com/zerrahworld/', '_blank')}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.35 3.608 1.325.975.975 1.263 2.242 1.325 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.35 2.633-1.325 3.608-.975.975-2.242 1.263-3.608 1.325-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.35-3.608-1.325-.975-.975-1.263-2.242-1.325-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.35-2.633 1.325-3.608C4.533 2.513 5.8 2.225 7.166 2.163 8.432 2.105 8.812 2.093 12 2.093m0-2.163C8.756 0 8.345.012 7.052.07 5.614.133 4.344.42 3.222 1.543 2.1 2.665 1.812 3.935 1.75 5.373.692 6.666.68 7.077.68 12s.012 5.334.07 6.627c.062 1.438.35 2.708 1.472 3.83 1.122 1.122 2.392 1.41 3.83 1.472 1.293.058 1.704.07 6.627.07s5.334-.012 6.627-.07c1.438-.062 2.708-.35 3.83-1.472 1.122-1.122 1.41-2.392 1.472-3.83.058-1.293.07-1.704.07-6.627s-.012-5.334-.07-6.627c-.062-1.438-.35-2.708-1.472-3.83C20.292.42 19.022.133 17.584.07 16.292.012 15.881 0 12 0z"/><path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998z"/><circle cx="18.406" cy="5.594" r="1.44"/></svg>
                  Follow on Instagram
                </button>
                <button
                  onClick={() => window.open('https://www.linkedin.com/company/zerrah/', '_blank')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.451 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.354V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>
                  Follow on LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Conversational signup flow
  return (
    <Layout>
      <ChatSignup
        onComplete={async (data) => {
          setIsLoading(true);
          try {
            const response = await signupUser({
              email: data.email,
              firstName: data.name,
              age: data.age,
              gender: data.gender,
              profession: data.profession,
              country: data.location?.split(',').pop()?.trim() || '',
              city: data.location?.split(',')[0]?.trim() || '',
              household: data.household,
              ctaVariant: 'A', // or randomize if needed
            });
            setWaitlistPosition(response.waitlistPosition);
            localStorage.setItem('zerrah_user_id', response.user.id);
            setIsSuccess(true);
          } catch (error) {
            console.error('Signup error:', error);
            // Optionally show error toast
          } finally {
            setIsLoading(false);
          }
        }}
      />
    </Layout>
  );
};

export default Signup; 