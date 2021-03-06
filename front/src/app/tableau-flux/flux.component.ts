import { AgentService } from './../agent.service';
import { FluxService } from './../flux.service';
import { Flux } from './../modeles/flux';
import { ConfirmationService, SelectItem, Message, SortEvent } from 'primeng/api';
import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';



@Component({
  selector: 'app-tableau-flux',
  templateUrl: './flux.component.html',
  styleUrls: ['./flux.component.css']

})
export class TableauFluxComponent implements OnInit {

  displayDialog: boolean;
  Allflux: Flux[];
  flux: Flux = {};
  selectedFlux: Flux;
  newFlux: boolean;
  cols: any[];
  userform: FormGroup;
  submitted: boolean;
  msgs: Message[] = [];

  constructor(private fluxService: FluxService, private fb: FormBuilder, private messageService: MessageService) { }

  ngOnInit() {

    this.getAllFlux();

    this.cols = [

      { field: 'nom', header: 'Nom' }

    ];
  }
  getAllFlux() {
    this.fluxService.getAllFlux().subscribe(flux => {
      this.Allflux = flux;
    });
  }
  showDialogToAdd() {
    this.newFlux = true;
    this.flux = {};
    this.displayDialog = true;
  }
  save() {
    const flux = [...this.Allflux];
    if (this.newFlux) {
      flux.push(this.flux),
        this.fluxService.createFlux(this.flux).subscribe(
          fl => this.flux = fl,

        );
      this.getAllFlux();
    } else {
      this.fluxService.updateFlux(this.flux).subscribe(() => {
      });
      this.getAllFlux();
    }

    this.getAllFlux();
    this.flux = null;
    this.displayDialog = false;
  }

  delete() {
    const index = this.Allflux.indexOf(this.selectedFlux);
    this.Allflux = this.Allflux.filter((val, i) => i !== index);
    this.fluxService.deleteFlux(this.flux.id).subscribe();
    this.flux = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.newFlux = false;
    this.flux = this.cloneFlux(event.data);
    this.displayDialog = true;
  }

  cloneFlux(f: Flux): Flux {
    const flux = {};
    // tslint:disable-next-line:forin
    for (const prop in f) {
      flux[prop] = f[prop];
    }
    return flux;
  }

  // Filtre
  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const value1 = data1[event.field];
      const value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null) {
        result = -1;
      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else if (typeof value1 === 'string' && typeof value2 === 'string') {
        result = value1.localeCompare(value2);
      } else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      }
      return (event.order * result);
    });
  }

  show() {
    this.msgs.push({ severity: 'success', summary: 'Info Message', detail: 'Flux Supprimé' });
  }

  clear() {
    this.messageService.clear();
}
}
