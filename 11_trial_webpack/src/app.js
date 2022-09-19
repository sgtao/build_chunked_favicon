// import sub from './sub' // sub.js をインポートする(.jsは省略可能)
import './sub'; // sub.js をインポート(更に省略するケース)
import './app.scss';

const init = () => {
  console.log('this is a main js');
};
init();
