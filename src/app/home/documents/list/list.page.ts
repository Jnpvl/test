import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/services/document.service';
import { Document } from 'src/app/interfaces/document.interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  documents: Document[] = [];
  filteredDocuments: Document[] = [];
  selectedFilter: string = '';

  constructor(
    private router: Router,
    private DocumentService: DocumentService,
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
          Monto: this.formatNumber(doc.Monto),
          saldo: this.formatNumber(doc.saldo)
        }));
        this.filteredDocuments = [...this.documents];
      },
      (error) => {
        console.error('Error during API call: ', error);
      }
    );
  }

  formatNumber(value: string): string {
    const number = parseFloat(value);
    return isNaN(number) ? value : number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  handleSearch(event: any) {
    const query = event.target.value.toLowerCase();

    this.documents = [...this.filteredDocuments];
    if (query) {
      this.documents = this.documents.filter((document) => {
        if (document) {
          return (
            document.cotiza.toString().includes(query) ||
            document.Monto.toString().includes(query) ||
            document.fechaCotiza.toString().includes(query)
          );
        } else {
          return this.documents = [...this.filteredDocuments];
        }
      })
    } else {
      this.documents = [...this.filteredDocuments];
    }
  }

  handleFilter(event: any) {
    const query = event.target.dataset.value.toLowerCase();

    if (this.selectedFilter === query) {
      this.selectedFilter = '';
      this.documents = [...this.filteredDocuments];
    } else {
      this.selectedFilter = query;

      this.documents = [...this.filteredDocuments];
      if (query) {
        if (query === 'cotiza') {
          this.documents = this.documents.filter((doc) => doc.remision === "" && doc.factura === "");
        } else if (query === 'recibo') {
          this.documents = this.documents.filter((doc) => doc.remision && doc.remision !== "");
        } else if (query === 'factura') {
          this.documents = this.documents.filter((doc) => doc.factura && doc.factura !== "");
        } else {
          this.documents = [...this.filteredDocuments];
        }
      } else {
        this.documents = [...this.filteredDocuments];
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
}
