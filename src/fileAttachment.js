async function remote_fetch(file) {
  const response = await fetch(await file.url());
  if (!response.ok) throw new Error(`Unable to load file: ${file.name}`);
  return response;
}

class FileAttachment {
  constructor(resolve, name) {
    Object.defineProperties(this, {
      _resolve: {value: resolve},
      name: {value: name, enumerable: true}
    });
  }
  async url() {
    const url = await this._resolve(this.name);
    if (url == null) throw new Error(`Unknown file: ${this.name}`);
    return url;
  }
  async blob() {
    return (await remote_fetch(this)).blob();
  }
  async arrayBuffer() {
    return (await remote_fetch(this)).arrayBuffer();
  }
  async text() {
    return (await remote_fetch(this)).text();
  }
  async json() {
    return (await remote_fetch(this)).json();
  }
  async image() {
    const url = await this.url();
    return new Promise(async (resolve, reject) => {
      const img = new Image;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Unable to load file: ${this.name}`));
      img.src = url;
    });
  }
}

export default function FileAttachments(resolve) {
  return (name) => new FileAttachment(resolve, name);
}