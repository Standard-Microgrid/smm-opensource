const https = require('https');
const fs = require('fs');
const path = require('path');

// Try to load environment variables from .env.local files
function loadEnvFile(filePath) {
  if (fs.existsSync(filePath)) {
    const envContent = fs.readFileSync(filePath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

// Try to load from various .env.local locations
const possibleEnvPaths = [
  path.join(__dirname, '../../../apps/open/.env.local'),
  path.join(__dirname, '../../../apps/prod/.env.local'),
  path.join(__dirname, '../../../.env.local'),
  path.join(__dirname, '../.env.local')
];

possibleEnvPaths.forEach(loadEnvFile);

const PROJECT_ID = 'pbnutmoiwykadzkqviay';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Checking environment variables...');
console.log('🔍 SUPABASE_SERVICE_ROLE_KEY exists:', !!SERVICE_ROLE_KEY);
console.log('🔍 Key length:', SERVICE_ROLE_KEY ? SERVICE_ROLE_KEY.length : 0);
console.log('🔍 Key starts with:', SERVICE_ROLE_KEY ? SERVICE_ROLE_KEY.substring(0, 10) + '...' : 'undefined');

if (!SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable required');
  console.error('   Please add it to one of these files:');
  possibleEnvPaths.forEach(p => console.error(`   - ${p}`));
  process.exit(1);
}

const SCHEMAS = 'public,core,payment_data,meter_platforms,meter_data,ps_data,platforms';
// Use the correct Supabase API endpoint for types generation
const url = `https://api.supabase.com/v1/projects/${PROJECT_ID}/types/typescript?included_schemas=${SCHEMAS}`;

console.log('🔍 Trying URL:', url);

const options = {
  headers: {
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json'
  }
};

console.log('🔄 Generating TypeScript types...');

https.get(url, options, (res) => {
  console.log('📡 Response status:', res.statusCode);
  console.log('📡 Response headers:', res.headers);
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('📡 Response data length:', data.length);
    console.log('📡 First 200 chars:', data.substring(0, 200));
    
    if (res.statusCode !== 200) {
      console.error('❌ API returned non-200 status:', res.statusCode);
      console.error('❌ Response:', data);
      process.exit(1);
    }
    
    // Check if response is valid TypeScript
    if (data.includes('"message":"invalid signature"')) {
      console.error('❌ Invalid signature error from Supabase API');
      console.error('❌ This usually means the service role key is incorrect or expired');
      console.error('❌ Response:', data);
      process.exit(1);
    }
    
    const outputPath = path.join(__dirname, '../src/types/database.ts');
    fs.writeFileSync(outputPath, data);
    console.log('✅ Types generated successfully at', outputPath);
  });
}).on('error', (err) => {
  console.error('❌ Error generating types:', err);
  process.exit(1);
});