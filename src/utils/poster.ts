import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as imagehost from './image-host';
const imgBase64 = require('image-to-base64');

async function generatePoster(
  name: string,
  imageURL: string,
  bounty: number
): Promise<string> {
  const pythonGenerator = child_process.spawn('python3', [
    'bin/utils/generate_poster.py', // depend on where execution is from
    '-n',
    name,
    '-i',
    imageURL,
    '-b',
    bounty.toString()
  ]);
  pythonGenerator.on('error', (err) => {
    console.log(`ERROR ${err}`);
    return undefined;
  });
  let localPosterPath = '';
  for await (const chunk of pythonGenerator.stderr) {
    localPosterPath += chunk;
  }
  localPosterPath = localPosterPath.substring(0, localPosterPath.length - 1); // cut off \n at the end
  console.log(path.resolve(localPosterPath));
  const imgAsBase64 = await imgBase64(path.resolve(`./${localPosterPath}`));
  const uploadedUrl = await imagehost.uploadToImgHost(imgAsBase64);
  fs.unlink(localPosterPath, (err) => {
    if (err) {
      console.log(`Cannot remove file ${localPosterPath}`);
    }
  });
  return uploadedUrl;
}

export { generatePoster };
