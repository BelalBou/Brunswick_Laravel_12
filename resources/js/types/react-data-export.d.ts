// Déclarations de type pour react-data-export
declare module 'react-data-export' {
  import { FC, ReactNode } from 'react';
  
  interface ExcelFileProps {
    filename?: string;
    fileExtension?: string;
    element?: ReactNode;
    children?: ReactNode;
  }
  
  interface ExcelSheetProps {
    name: string;
    data: any[];
    children?: ReactNode;
  }
  
  interface ExcelColumnProps {
    label: string;
    value: string | ((row: any) => any);
    width?: number;
  }
  
  export const ExcelFile: FC<ExcelFileProps> & {
    ExcelSheet: FC<ExcelSheetProps>;
    ExcelColumn: FC<ExcelColumnProps>;
  };
  
  export const ExcelSheet: FC<ExcelSheetProps>;
  export const ExcelColumn: FC<ExcelColumnProps>;
} 