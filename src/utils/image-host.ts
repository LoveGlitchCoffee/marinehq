import { imageHostRequestUrl, imageAPIKey } from '../config.json';

// image is either base64 or url
async function uploadToImgHost(image: string): Promise<string> {
  const params = new URLSearchParams();
  params.append('key', imageAPIKey);
  params.append('source', image);
  params.append('format', 'json');

  const response = await fetch(imageHostRequestUrl, {
    method: 'post',
    body: params
  });

  let uploadedURL = '';
  const jsonData = await response.json();
  if (response.ok) {
    uploadedURL = jsonData.image.url;
    console.log(uploadedURL);
  } else {
    console.log('Unable to upload image');
    console.log(jsonData);
  }
  return uploadedURL;
}

export { uploadToImgHost };
