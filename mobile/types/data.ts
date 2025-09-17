
export interface Refeicao {
  id: string;
  nome: string;
  categoria: string;
  kcal: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  ingredientes: { 
    texto: string 
  }[];
  tempoPreparo: string;
  modoPreparo: string[];
}


export interface Data {
  refeicoes: Refeicao[];

  suplementos?: string[];
}