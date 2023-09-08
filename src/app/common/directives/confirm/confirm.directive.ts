import { Directive, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmInfoModel } from './confirm.model';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Directive({
  selector: '[appConfirm]',
})
export class ConfirmDirective {
  @Input() confirmInfo: ConfirmInfoModel;

  @Input() dontAsk: boolean = false;

  @Output() doConfirm = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  @HostListener('click', ['$event'])
  onClick(clickEvent: MouseEvent) {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    // if (this.dontAsk) {
    //   this.doConfirm.next(null);
    //   return;
    // }

    const dialogRef = this.openDialog();
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.doConfirm.next(null);
        // const event = new MouseEvent('click', { bubbles: true });
        // (clickEvent.target as HTMLElement).dispatchEvent(event);
      }
    });
  }

  openDialog(): any {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = this.confirmInfo.width;
    dialogConfig.data = this.confirmInfo;
    return this.dialog.open(ConfirmDialogComponent, dialogConfig);
  }
}
