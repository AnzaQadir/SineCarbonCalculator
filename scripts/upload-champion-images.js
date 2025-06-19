const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Your imgbb.com API key
const IMGBB_API_KEY = 'YOUR_IMGBB_API_KEY';

const champions = [
  {
    name: 'icypriya-kangujam',
    url: 'https://tse3.mm.bing.net/th?id=OIP.oZOVjVoHc2M5RQ24m0mxRAHaJ3&pid=Api'
  },
  {
    name: 'arunabha-ghosh',
    url: 'https://www.ceew.in/sites/default/files/Arunabha-Ghosh.jpg'
  },
  {
    name: 'sonam-wangchuk',
    url: 'https://tse1.mm.bing.net/th?id=OIP.UDiIPiKh_LqPPlFGX5UXIwHaEJ&pid=Api'
  },
  {
    name: 'sunita-narain',
    url: 'https://tse3.mm.bing.net/th?id=OIP.RSkn0-L7h8L7dDaR3oHnAQHaHk&pid=Api'
  },
  {
    name: 'roxy-mathew-koll',
    url: 'https://www.climate.rocksea.org/wp-content/uploads/2019/10/roxy-mathew-koll.jpg'
  },
  {
    name: 'ajay-mathur',
    url: 'https://tse3.mm.bing.net/th?id=OIP.x3jjM08xvdjof7yM5eTxbwHaE7&pid=Api'
  },
  {
    name: 'runa-khan',
    url: 'https://tse3.mm.bing.net/th?id=OIP.x3jjM08xvdjof7yM5eTxbwHaE7&pid=Api'
  },
  {
    name: 'saleemul-huq',
    url: 'https://thedailystar.net/sites/default/files/styles/very_big_201/public/images/2022/10/30/dr_saleemul_huq.jpg'
  },
  {
    name: 'malik-amin-aslam',
    url: 'https://pakobserver.net/wp-content/uploads/2021/08/Malik-Amin-Aslam.jpg'
  },
  {
    name: 'adil-najam',
    url: 'https://i0.wp.com/www.adilnajam.com/wp-content/uploads/2019/07/AN-BU-Pardee-Headshot.jpg'
  },
  {
    name: 'tanzeela-mazhar',
    url: 'https://thenamal.com/wp-content/uploads/2021/01/tanzeela-mazhar.jpg'
  },
  {
    name: 'shoaib-sultan-khan',
    url: 'https://devcon.org.pk/wp-content/uploads/2022/03/Shoaib-Sultan-Khan.jpg'
  }
];

async function downloadImage(url, name) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });

    const filePath = path.join(__dirname, 'temp', `${name}.jpg`);
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(filePath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading image for ${name}:`, error);
    return null;
  }
}

async function uploadToImgbb(filePath) {
  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath));
    formData.append('key', IMGBB_API_KEY);

    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: formData.getHeaders()
    });

    return response.data.data.url;
  } catch (error) {
    console.error('Error uploading to imgbb:', error);
    return null;
  }
}

async function processImages() {
  // Create temp directory if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, 'temp'))) {
    fs.mkdirSync(path.join(__dirname, 'temp'));
  }

  const results = {};

  for (const champion of champions) {
    console.log(`Processing ${champion.name}...`);
    
    // Download image
    const filePath = await downloadImage(champion.url, champion.name);
    if (!filePath) continue;

    // Upload to imgbb
    const imgbbUrl = await uploadToImgbb(filePath);
    if (!imgbbUrl) continue;

    results[champion.name] = imgbbUrl;

    // Clean up temp file
    fs.unlinkSync(filePath);
  }

  // Update champion-images.json
  const championImagesPath = path.join(__dirname, '..', 'src', 'data', 'champion-images.json');
  const championImages = JSON.parse(fs.readFileSync(championImagesPath, 'utf8'));

  for (const [name, url] of Object.entries(results)) {
    if (championImages[name]) {
      championImages[name].image = url;
      championImages[name].fallback = url;
    }
  }

  fs.writeFileSync(championImagesPath, JSON.stringify(championImages, null, 2));
  console.log('Updated champion-images.json with new URLs');
}

processImages().catch(console.error); 