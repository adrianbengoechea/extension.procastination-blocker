import { render } from 'preact';
import App from './components/App';
import '../assets/styles/global.css';

render(<App />, document.getElementById('app')!);