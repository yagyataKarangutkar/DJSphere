import fs from 'fs';
import path from 'path';

const srcDir = 'C:/Users/UMESH/.gemini/antigravity-ide/brain/f3bb1e18-c5bb-444a-bcc6-edaf5790d334/.user_uploaded';
const destDir = 'c:/Users/UMESH/OneDrive/Desktop/projects/DJSphere/client/src/assets';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const fileMappings = [
  { src: 'media_1786873358738.jpg', dest: 'ai_workshop.jpg' },
  { src: 'media_1786873358820.jpg', dest: 'career_talk.jpg' },
  { src: 'media_1786873358899.jpg', dest: 'codesprint.jpg' },
  { src: 'media_1786873359108.jpg', dest: 'nritya.jpg' },
  { src: 'media_1786873359199.jpg', dest: 'robotics.jpg' },
];

fileMappings.forEach(mapping => {
  const srcPath = path.join(srcDir, mapping.src);
  const destPath = path.join(destDir, mapping.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Successfully copied ${mapping.src} to ${mapping.dest}`);
  } else {
    console.log(`Warning: Source file ${srcPath} does not exist.`);
  }
});
