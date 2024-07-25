import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Document } from 'src/app/interfaces/document.interface';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  documents: Document[] = [];
  originalDocuments: Document[] = [];
  selectedDocuments: Document[] = [];
  selectedDocumentsIds: Set<number> = new Set<number>();
  totalSaldo: number = 0;
  selectedFilter: string = '';
  customAmount: number = 100;
  customDescription: string | null = null;
  selectedCurrencyType: string | null = null;

  constructor(
    private router: Router,
    private DocumentService: DocumentService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.getDocuments();
  }
  
  backPage() {
    this.router.navigate(['../'], { replaceUrl: true });
  }

  getDocuments() {
    this.DocumentService.getDocuments().subscribe(
      (res: any) => {
        this.documents = res.map((doc: any) => ({
          ...doc,
          saldo: this.formatNumber(doc.saldo),
          Monto: this.formatNumber(doc.Monto)
        }))
        .filter((doc: any) => parseFloat(doc.saldo) > 0.00);
        this.originalDocuments = [...this.documents];
      },
      (error) => {
        console.error('Error during API call: ', error);
      }
    );
  }

  formatNumber(value: string): string {
    const number = parseFloat(value);
    return isNaN(number) ? value : number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  handleSearch(event: any) {
    const query = event.target.value.toLowerCase();

    this.documents = [...this.originalDocuments];
    if (query) {
      this.documents = this.documents.filter((document) => {
        if (document) {
          return (
            document.cotiza.toString().includes(query) ||
            document.saldo.toString().includes(query)
          );
        } else {
          return this.documents = [...this.originalDocuments];
        }
      })
    } else {
      this.documents = [...this.originalDocuments];
    }
  }

  handleFilter(filter: string) {
    if (this.selectedFilter === filter) {
      this.selectedFilter = '';
      this.documents = [...this.originalDocuments];
    } else {
      this.selectedFilter = filter;
      this.documents = [...this.originalDocuments];
      if (filter) {
        if (filter === 'cotiza') {
          this.documents = this.documents.filter((doc) => doc.remision === "" && doc.factura === "");
        } else if (filter === 'factura') {
          this.documents = this.documents.filter((doc) => doc.factura && doc.factura !== "");
        } else if (filter === 'pagoLibre') {
          this.documents = [...this.originalDocuments];
        }
      } else {
        this.documents = [...this.originalDocuments];
      }
    }
  }

  getDocumentImage(document: Document): string {
    if (document.remision === "" && document.factura === "") {
      return 'assets/icons/cotiza.png';
    } else if (document.remision !== "") {
      return 'assets/icons/recibo.png';
    } else if (document.factura !== "") {
      return 'assets/icons/factura.png';
    } else {
      return 'assets/images/default.png';
    }
  }

  getDocumentClass(document: Document): string {
    if (document.remision === "" && document.factura === "") {
      return 'cotiza';
    } else if (document.remision !== "") {
      return 'recibo';
    } else if (document.factura !== "") {
      return 'factura';
    } else {
      return 'default';
    }
  }

  handleSelectedDoc(document: Document) {
    if (this.isDocumentSelected(document)) {
      this.selectedDocumentsIds.delete(parseFloat(document.cotiza));
    } else {
      if (!this.selectedCurrencyType) {
        this.selectedCurrencyType = document.Moneda;
        this.selectedDocumentsIds.add(parseFloat(document.cotiza));
      } else {
        if (document.Moneda !== this.selectedCurrencyType) {
          this.alertSelectedDocs();
          return;
        }
      }
      this.selectedDocumentsIds.add(parseFloat(document.cotiza));
    }
    this.calculateTotalSaldo();
  }

  isDocumentSelected(document: Document): boolean {
    return this.selectedDocumentsIds.has(parseFloat(document.cotiza));
  }

  getSelectedDocuments(): Document[] {
    return this.documents.filter(doc => this.selectedDocumentsIds.has(parseFloat(doc.cotiza)));
  }

  calculateTotalSaldo() {
    this.totalSaldo = this.getSelectedDocuments().reduce((total, doc) => total + parseFloat(doc.saldo.replace(/,/g, '')), 0);
  }

  processPayment() {
    const selectedDocuments = this.getSelectedDocuments();

    if (this.selectedFilter === 'pagoLibre') {
      if (selectedDocuments.length === 0) {
        if (this.customAmount < 100) {
          this.alertCustomAmount();
          return;
        }
        this.navigateToPaymentPage(selectedDocuments, this.customAmount, this.customDescription);
        return;
      }

      if (this.customAmount < 100 || this.customAmount > this.totalSaldo) {
        this.alertCustomAmount();
        return;
      }

      this.navigateToPaymentPage(selectedDocuments, this.customAmount, this.customDescription);
      return;
    }
    if (selectedDocuments.length === 0) {
      this.alertDocuments();
      return;
    }

    this.navigateToPaymentPage(selectedDocuments, this.totalSaldo, null);
  }

  navigateToPaymentPage(selectedDocuments: Document[], totalSaldo: number, description: string | null) {
    this.router.navigate(['/home/payments/select-card'], {
      queryParams: {
        selectedDocuments: JSON.stringify(selectedDocuments),
        totalSaldo: totalSaldo,
        description: description,
        currency: this.selectedCurrencyType
      }
    });
  }

  async alertDocuments() {
    const alert = await this.alertController.create({
      header: 'Seleccione un documento',
      message: 'No ha seleccionado un documento para proceder al pago. Seleccione uno o más documentos para proseguir con el pago.',
      buttons: [
        {
          text: 'ENTENDIDO',
          role: 'confirmar',
        }
      ]
    });
    await alert.present();
  }

  async alertCustomAmount() {
    if (this.customAmount < 100) {
      const alert = await this.alertController.create({
        header: 'Monto rechazado',
        message: 'El monto minimo a depositar es de $100.00 MXN. Gracias por su compresión.',
        buttons: [
          {
            text: 'ENTENDIDO',
            role: 'confirmar'
          }
        ]
      });
      await alert.present();
    } else if (this.customAmount > this.totalSaldo) {
      const alert = await this.alertController.create({
        header: 'Monto rechazado',
        message: `El monto es superior al saldo total de $${this.totalSaldo.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Gracias por su compresión.`,
        buttons: [
          {
            text: 'ENTENDIDO',
            role: 'confirmar'
          }
        ]
      });
      await alert.present();
    }
  }

  async alertSelectedDocs() {
    const alert = await this.alertController.create({
      header: 'Error con factura seleccionada',
      message: 'Solo puede escoger documentos con un solo tipo de moneda.',
      buttons: [
        {
          text: 'ENTENDIDO',
          role: 'confirmar'
        }
      ]
    });
    await alert.present();
  }
}
