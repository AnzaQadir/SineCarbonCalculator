const { Sequelize } = require('sequelize');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

console.log('🔍 Testing different database connection formats...');
console.log('Original URL length:', DATABASE_URL?.length);

// Test 1: Original URL
async function testOriginal() {
  console.log('\n1. Testing original URL...');
  try {
    const sequelize = new Sequelize(DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false }
      }
    });
    await sequelize.authenticate();
    console.log('✅ Original URL works');
    await sequelize.close();
  } catch (error) {
    console.log('❌ Original URL failed:', error.message);
  }
}

// Test 2: Decoded URL
async function testDecoded() {
  console.log('\n2. Testing decoded URL...');
  try {
    const decodedUrl = decodeURIComponent(DATABASE_URL);
    const sequelize = new Sequelize(decodedUrl, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false }
      }
    });
    await sequelize.authenticate();
    console.log('✅ Decoded URL works');
    await sequelize.close();
  } catch (error) {
    console.log('❌ Decoded URL failed:', error.message);
  }
}

// Test 3: Parse and reconstruct URL
async function testParsed() {
  console.log('\n3. Testing parsed URL...');
  try {
    const url = new URL(DATABASE_URL);
    const reconstructed = `postgresql://${url.username}:${url.password}@${url.hostname}:${url.port}${url.pathname}`;
    
    const sequelize = new Sequelize(reconstructed, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false }
      }
    });
    await sequelize.authenticate();
    console.log('✅ Parsed URL works');
    await sequelize.close();
  } catch (error) {
    console.log('❌ Parsed URL failed:', error.message);
  }
}

async function runTests() {
  await testOriginal();
  await testDecoded();
  await testParsed();
}

runTests(); 