export interface Card {
    userId: number;
    id: string;
    type: string;
    brand: string;
    cardNumber: string;
    holderName: string;
    expirationYear: string;
    expirationMonth: string;
    allowsCharges: boolean;
    allowsPayouts: boolean;
    creationDate: string;
    bankName: string;
    pointsType: string;
    pointsCard: boolean;
    customerId: string;
    bankCode: string;
}
