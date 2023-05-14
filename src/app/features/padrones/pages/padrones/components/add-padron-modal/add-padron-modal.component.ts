import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@app/common/services/api.service';

@Component({
  selector: 'app-add-padron-modal',
  templateUrl: './add-padron-modal.component.html',
  styleUrls: ['./add-padron-modal.component.scss'],
})
export class AddPadronModalComponent implements OnInit {
  addPadronForm: FormGroup;

  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<AddPadronModalComponent>,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.addPadronForm = this.fb.group({
      // padronNumber: ['', [Validators.required, Validators.pattern(/^\d{*}$/)]],
      padronNumber: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    });
  }

  getErrorMessage(): string {
    if (this.addPadronForm.controls.padronNumber.hasError('required')) {
      return 'El número de padrón es requerido';
    }
    if (this.addPadronForm.controls.padronNumber.hasError('pattern')) {
      return 'Número de padrón inválido';
    }
    return 'Padrón no registrado';
  }

  onSubmit(): void {
    if (this.addPadronForm.valid) {
      this.isLoading = true;
      const padron = parseInt(this.addPadronForm.controls.padronNumber.value);
      this.apiService.validatePadronNumber(padron).then(
        (isValid: boolean) => {
          //TODO: Remove timeout when implement server validation
          setTimeout(() => {
            this.isLoading = false;
            if (isValid) {
              this.dialogRef.close(this.addPadronForm.controls.padronNumber.value);
            } else {
              this.addPadronForm.controls.padronNumber.setErrors({ invalidValue: true });
            }
          }, 3000);
        },
        (error: any) => {
          this.isLoading = false;
          console.log(error);
        }
      );
    }
  }
}
