const cream = '#FBF6EE';
const ink = '#182130';
const amber = '#E7A11B';
const amberDark = '#B77E0A';
const blue = '#1D3A6E';
const telegram = '#229ED9';

export const Brand = {
  cream,
  ink,
  amber,
  amberDark,
  blue,
  telegram,
  muted: '#5A6578',
  border: '#E8DFD0',
  card: '#FFFFFF',
  success: '#1B7A4E',
  danger: '#B42318',
  softAmber: '#FFF3D6',
  softBlue: '#E8EEF7',
};

export default {
  light: {
    text: ink,
    background: cream,
    tint: amber,
    tabIconDefault: '#8A93A3',
    tabIconSelected: amberDark,
  },
  dark: {
    text: cream,
    background: ink,
    tint: amber,
    tabIconDefault: '#8A93A3',
    tabIconSelected: amber,
  },
};
