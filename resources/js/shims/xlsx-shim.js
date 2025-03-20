/**
 * Shim pour la bibliothèque xlsx utilisée par react-data-export
 * Résout les problèmes de variables non déclarées
 */

// Correction pour les erreurs de variables non déclarées dans xlsx.js
if (typeof window !== 'undefined') {
  // Fix pour l'erreur "assignment to undeclared variable cptable"
  window.cptable = window.cptable || {};
  
  // Fix pour l'erreur "assignment to undeclared variable QUOTE"
  window.QUOTE = window.QUOTE || '"';
  
  // Autres variables potentiellement nécessaires pour xlsx
  window.SSF = window.SSF || {};
  window.CFB = window.CFB || {};
  window.XmlNode = window.XmlNode || function() {};
  window.XMLNS = window.XMLNS || {};
  window.ParseXML = window.ParseXML || function() { return { documentElement: {} }; };
}

// Vérifie si nous sommes dans un environnement de navigateur ou non
const isBrowser = typeof window !== 'undefined';

/**
 * Fonction pour pré-initialiser xlsx avant son chargement
 */
export const initXLSX = () => {
  if (isBrowser) {
    console.log('xlsx shim initialisé');
  }
};

// Auto-initialisation
initXLSX();

export default { initXLSX }; 