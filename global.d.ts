declare interface User {
    id_usuario: number;
    nome: string;
    dth_acesso: Date;
}

declare interface Message {
    id_mensagem: number;
    conteudo: string;
    ind_tipo: "T",
    id_remetente: number;
    id_destinatario: number;
    nome_remetente: string;
    nome_destinatario: string;
    dth_envio: number;
}