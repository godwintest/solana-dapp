
import { Buffer } from 'buffer';

// Polyfill Buffer for web3 libraries
window.Buffer = Buffer;
