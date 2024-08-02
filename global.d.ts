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
    dth_envio: number;
}

declare interface RecentMessage extends Message {
    nome_destinatario: string;
    nome_remetente: string;
}