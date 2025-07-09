const base64ToBlob = (base64, contentType = 'image/jpeg') => {
  const parts = base64.split(';base64,');
  const byteCharacters = atob(parts[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
};

export const uploadToImgBB = async (base64Image, filename="screenshot") => {
  const apiKey = process.env.REACT_APP_IMGBB_API_KEY;

  const imageBlob = base64ToBlob(base64Image, 'image/jpeg');

  const formData = new FormData();
  formData.append('image', imageBlob, `${filename}_${Date.now()}.jpg`);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!result.success || response.status !== 200) {
      throw new Error(`ImgBB API Error: ${result.message || 'Unknown error'}`);
    }

    return result.data.display_url;
  } catch (error) {
    console.error("Failed to upload to ImgBB:", error);
    throw error;
  }
};