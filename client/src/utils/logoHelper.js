import cisiLogo from '../assets/CISI.png';
import codeaiLogo from '../assets/CodeAi.png';
import ieeeLogo from '../assets/IEEE.png';
import rasLogo from '../assets/RAS.png';
import saeLogo from '../assets/SAE.png';
import smeLogo from '../assets/SME.png';
import aiWorkshopImg from '../assets/ai_workshop.jpg';
import codesprintImg from '../assets/codesprint.jpg';
import nrityaImg from '../assets/nritya.jpg';
import careerTalkImg from '../assets/career_talk.jpg';
import roboticsImg from '../assets/robotics.jpg';

const logoMap = {
  '/src/assets/CISI.png': cisiLogo,
  '/src/assets/CodeAi.png': codeaiLogo,
  '/src/assets/IEEE.png': ieeeLogo,
  '/src/assets/RAS.png': rasLogo,
  '/src/assets/SAE.png': saeLogo,
  '/src/assets/SME.png': smeLogo,
  '/src/assets/ai_workshop.jpg': aiWorkshopImg,
  '/src/assets/codesprint.jpg': codesprintImg,
  '/src/assets/nritya.jpg': nrityaImg,
  '/src/assets/career_talk.jpg': careerTalkImg,
  '/src/assets/robotics.jpg': roboticsImg
};

export const getClubLogo = (path) => logoMap[path] || codeaiLogo;
