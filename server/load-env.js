import fs from 'node:fs';
import path from 'node:path';

// Bulletproof .env loader for ESM (must be imported as the first thing)
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const equalsIdx = line.indexOf('=');
      if (equalsIdx > 0) {
        const key = line.slice(0, equalsIdx).trim();
        let value = line.slice(equalsIdx + 1).trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        process.env[key] = value;
      }
    });
    console.log('✨ Environment variables synced successfully.');
  }
} catch (e) {
  console.error('Manual .env load failed:', e);
}
