export interface Document {
    cotiza: string;
    Monto: string;
    TipoDeCambio: string;
    Moneda: string;
    fechaCotiza: Date;
    pedido: string;
    fechaPedido: null;
    remision: string;
    fechaRemision: null;
    factura: string;
    fechaFactura: Date;
    saldo: string;
    urlCotiza: string;
    urlPedido: string;
    urlRemision: string;
    urlFactura: string;
}
