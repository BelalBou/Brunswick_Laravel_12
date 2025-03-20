/**
 * Utilitaire pour l'export Excel qui initialise correctement la bibliothèque
 */

// Import des shims nécessaires
import '../shims/xlsx-shim';

// Import sécurisé de react-data-export
let ExcelModule = null;

// Fonction d'initialisation qui retourne une promesse
export const initExcelExport = async () => {
  if (!ExcelModule) {
    try {
      // Import dynamique pour éviter les erreurs au chargement
      const module = await import('react-data-export');
      ExcelModule = module;
      
      console.log('react-data-export initialisé avec succès');
      return module;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de react-data-export:', error);
      throw error;
    }
  }
  return ExcelModule;
};

// Exportation des composants principaux avec lazy loading
export const getExcelComponents = async () => {
  const module = await initExcelExport();
  return {
    ExcelFile: module.ExcelFile,
    ExcelSheet: module.ExcelSheet,
    ExcelColumn: module.ExcelColumn
  };
};

export default {
  initExcelExport,
  getExcelComponents
}; 