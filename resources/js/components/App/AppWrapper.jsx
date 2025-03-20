import React from 'react';
import AppComponent from './App';

// Ce wrapper est utilisé pour contourner le problème de préambule
// en ayant un fichier JSX pur qui importe le composant TSX
const AppWrapper = (props) => {
  console.log('AppWrapper chargé avec succès');
  return <AppComponent {...props} />;
};

export default AppWrapper; 