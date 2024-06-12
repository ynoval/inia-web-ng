import { Component } from '@angular/core';
// import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-grid-delete-button',
  // eslint-disable-next-line prettier/prettier
  template: `<mat-icon (click)="onClick($event)" color="warn" style="trasform: scale(0.5); cursor: pointer"> delete</mat-icon>
`,
})
// export class GridDeleteButtonRendererComponent implements ICellRendererAngularComp {
export class GridDeleteButtonRendererComponent {
  params: any;

  agInit(params): void {
    this.params = params;
  }

  // eslint-disable-next-line class-methods-use-this
  refresh(params?: any): boolean {
    return true;
  }

  onClick($event) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data,
      };
      this.params.onClick(this.params);
    }
  }
}
