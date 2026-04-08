const fs = require('fs');
const http = require('http');
const https = require('https');
const { URL } = require('url');

const urls = process.argv.slice(2);

if (urls.length === 0) {
  console.error("Error: No URLs provided.");
  process.exit(1);
}

urls.forEach((url) => {

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    const protocol = url.startsWith('https') ? https : http;

    const options = {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    };

    protocol.get(url, options, (res) => {

      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {

        fs.writeFile(`${hostname}.txt`, data, (err) => {

          if (err) {
            console.error(`Error writing file for ${url}`);
          } else {
            console.log(`Saved: ${hostname}.txt`);
          }

        });

      });

    }).on('error', (err) => {
      console.error(`Error downloading ${url}: ${err.message}`);
    });

  } catch (err) {
    console.error(`Invalid URL: ${url}`);
  }

});
