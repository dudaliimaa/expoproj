// types/produto.ts
export interface Produto {
    id: string;
    nome: string;
    categoria: string;
    preco: number;
    qtd: number;
    validade: string;
    descricao: string;
    imagem?: string;
}