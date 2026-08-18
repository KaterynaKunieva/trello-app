function convertToBase64(file: Blob): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (): void => resolve(reader.result);
    reader.onerror = (error): void => reject(error);
  });
}

function isBase64(str: string): boolean {
  return str.startsWith('data:image/');
}

function getCssBackground(str: string): string {
  if (isBase64(str)) {
    return `url("${str}") center/cover no-repeat`;
  }
  return str;
}

export { convertToBase64, isBase64, getCssBackground };
