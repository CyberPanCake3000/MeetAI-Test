import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class FileManager {
  constructor(mainDir, textDir, imagesDir) {
    if (!mainDir || !textDir || !imagesDir) {
      throw new Error('Main directory, text and images directories must be specified');
    }

    const projectRoot = path.join(__dirname, '../../');

    this.mainDir = path.join(projectRoot, mainDir);
    this.textDir = path.join(this.mainDir, textDir);
    this.imagesDir = path.join(this.mainDir, imagesDir);
  }


  async initializeDirs() {
    await fs.ensureDir(this.textDir);
    await fs.ensureDir(this.imagesDir);
  }

  async saveText(content, filename = 'content.txt') {
    await fs.writeFile(path.join(this.textDir, filename), content);
  }

  async saveImage(buffer, filename) {
    await fs.writeFile(path.join(this.imagesDir, filename), buffer);
  }

  getStats() {
    return {
      textFiles: fs.readdirSync(this.textDir).length,
      imageFiles: fs.readdirSync(this.imagesDir).length
    };
  }
}