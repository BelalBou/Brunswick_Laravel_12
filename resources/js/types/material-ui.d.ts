import '@material-ui/core';

declare module '@material-ui/core/Hidden' {
  interface HiddenProps {
    children?: React.ReactNode;
    mdUp?: boolean;
    smDown?: boolean;
    implementation?: 'js' | 'css';
  }
} 