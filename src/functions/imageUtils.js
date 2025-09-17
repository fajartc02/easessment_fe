async function removeWhiteBackground(base64Image) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Make white pixels transparent
      for (let i = 0; i < data.length; i += 4)
      {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (r > 240 && g > 240 && b > 240)
        {
          data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const result = canvas.toDataURL('image/png');
      resolve(result);
    };

    img.src = base64Image;
  });
}

async function autoCropSignature(base64Image) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = 0;
      let maxY = 0;

      // Scan pixel untuk mencari area non-putih (tanda tangan)
      for (let y = 0; y < canvas.height; y++)
      {
        for (let x = 0; x < canvas.width; x++)
        {
          const index = (y * canvas.width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];

          // Jika pixel tidak putih (threshold untuk mendeteksi tanda tangan)
          if (r < 240 || g < 240 || b < 240)
          {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      // Tambahkan padding
      const padding = 5;
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(canvas.width, maxX + padding);
      maxY = Math.min(canvas.height, maxY + padding);

      const croppedCanvas = document.createElement('canvas');
      const croppedCtx = croppedCanvas.getContext('2d');

      const width = maxX - minX;
      const height = maxY - minY;

      // Pastikan ada content yang di-crop
      if (width > 0 && height > 0)
      {
        croppedCanvas.width = width;
        croppedCanvas.height = height;

        croppedCtx.drawImage(
          canvas,
          minX, minY, width, height,
          0, 0, width, height
        );

        const croppedBase64 = croppedCanvas.toDataURL('image/png');
        resolve(croppedBase64);
      } else
      {
        // Jika tidak ada content, return original
        resolve(base64Image);
      }
    };

    img.src = base64Image;
  });
};

async function clearSignature(base64Image) {
  const cropped = await autoCropSignature(base64Image);
  const result = await removeWhiteBackground(cropped);
  return result;
}

export {
  clearSignature,
  removeWhiteBackground,
  autoCropSignature
}
