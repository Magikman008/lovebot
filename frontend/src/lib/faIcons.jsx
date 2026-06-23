import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faBowlFood,
  faBurger,
  faCalendarDays,
  faCat,
  faChampagneGlasses,
  faCheck,
  faClock,
  faFaceSmile,
  faFishFins,
  faGift,
  faHeart,
  faMask,
  faPaperPlane,
  faPizzaSlice,
  faShoePrints,
  faUtensils,
  faWandMagicSparkles,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";


const iconMap = {
  back: faArrowLeft,
  arrow: faArrowRight,
  bowl: faBowlFood,
  burger: faBurger,
  calendar: faCalendarDays,
  cat: faCat,
  cheers: faChampagneGlasses,
  check: faCheck,
  clock: faClock,
  face: faFaceSmile,
  fish: faFishFins,
  gift: faGift,
  heart: faHeart,
  mask: faMask,
  plane: faPaperPlane,
  pizza: faPizzaSlice,
  shoe: faShoePrints,
  sparkle: faWandMagicSparkles,
  utensils: faUtensils,
  xmark: faXmark,
};


export function FaIcon({ name, ...props }) {
  return <FontAwesomeIcon icon={iconMap[name] || faHeart} {...props} />;
}
