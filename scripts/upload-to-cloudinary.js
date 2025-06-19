const axios = require('axios');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dvtbof2rc',
  api_key: '538484539148836',
  api_secret: 'RWuA7ZWpra7CGuoBfNYenED4uBA'
});

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
    url: 'https://www.iitbombay.org/wp-content/uploads/2021/03/Roxy-Mathew-Koll.jpg'
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
    url: 'https://www.icccad.net/wp-content/uploads/2019/04/Saleemul-Huq.jpg'
  },
  {
    name: 'malik-amin-aslam',
    url: 'https://www.globalwitness.org/media/images/Malik_Amin_Aslam.width-800.jpg'
  },
  {
    name: 'adil-najam',
    url: 'https://www.bu.edu/pardee/files/2019/07/AN-BU-Pardee-Headshot.jpg'
  },
  {
    name: 'tanzeela-mazhar',
    url: 'https://media.licdn.com/dms/image/C4D03AQGjY1lZ3K_Qyw/profile-displayphoto-shrink_800_800/0/1516784308454?e=2147483647&v=beta&t=8Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z'
  },
  {
    name: 'shoaib-sultan-khan',
    url: 'https://www.akdn.org/sites/akdn/files/media/institutions/aga_khan_rural_support_programme/akrsp_shoaib_sultan_khan.jpg'
  }
];

async function downloadImage(url, name, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Attempt ${attempt} to download image for ${name}...`);
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
        timeout: 10000, // 10 second timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const filePath = path.join(__dirname, 'temp', `${name}.jpg`);
      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          console.log(`Successfully downloaded image for ${name}`);
          resolve(filePath);
        });
        writer.on('error', (error) => {
          console.error(`Error writing file for ${name}:`, error);
          reject(error);
        });
      });
    } catch (error) {
      console.error(`Error downloading image for ${name} (attempt ${attempt}):`, error.message);
      if (attempt === retries) {
        console.error(`Failed to download image for ${name} after ${retries} attempts`);
        return null;
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}

async function uploadToCloudinary(filePath, name) {
  try {
    console.log(`Uploading ${name} to Cloudinary...`);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'climate-champions',
      public_id: name,
      resource_type: 'image',
      overwrite: true,
      transformation: [
        { width: 500, height: 500, crop: 'fill' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    console.log(`Successfully uploaded ${name} to Cloudinary`);
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading ${name} to Cloudinary:`, error);
    return null;
  }
}

async function processImages() {
  // Create temp directory if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, 'temp'))) {
    fs.mkdirSync(path.join(__dirname, 'temp'));
  }

  const results = {};
  const failedDownloads = [];
  const failedUploads = [];

  for (const champion of champions) {
    console.log(`\nProcessing ${champion.name}...`);
    
    // Download image
    const filePath = await downloadImage(champion.url, champion.name);
    if (!filePath) {
      failedDownloads.push(champion.name);
      continue;
    }

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(filePath, champion.name);
    if (!cloudinaryUrl) {
      failedUploads.push(champion.name);
      continue;
    }

    results[champion.name] = cloudinaryUrl;

    // Clean up temp file
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error(`Error cleaning up temp file for ${champion.name}:`, error);
    }
  }

  // Print summary
  console.log('\nProcessing Summary:');
  console.log(`Successfully processed: ${Object.keys(results).length} images`);
  if (failedDownloads.length > 0) {
    console.log(`Failed downloads: ${failedDownloads.join(', ')}`);
  }
  if (failedUploads.length > 0) {
    console.log(`Failed uploads: ${failedUploads.join(', ')}`);
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
  console.log('\nUpdated champion-images.json with new Cloudinary URLs');
}

processImages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 