import { Directive, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmInfo } from './confirm.model';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Directive({
  selector: '[appConfirm]',
})
export class ConfirmDirective {
  @Input() confirmInfo: ConfirmInfo;

  @Input() dontAsk: boolean = false;

  @Output() doConfirm = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.dontAsk) {
      this.doConfirm.next();
    } else {
      this.openDialog();
    }
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = this.confirmInfo.width;
    dialogConfig.data = this.confirmInfo;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.doConfirm.next();
      }
    });
  }
}
