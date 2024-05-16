import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@app/common/services/api.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import type { DepartmentModel } from '@app/features/padrones/models/department.model';
@Component({
  selector: 'app-add-padron-modal',
  templateUrl: './add-padron-modal.component.html',
  styleUrls: ['./add-padron-modal.component.scss'],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    NgFor,
    AsyncPipe,
  ],
})
export class AddPadronModalComponent implements OnInit {
  addPadronForm: FormGroup;

  departments: DepartmentModel[] = [
    {
      id: 'G',
      name: 'Artigas',
    },
    {
      id: 'A',
      name: 'Canelones',
    },
    {
      id: 'E',
      name: 'Cerro Largo',
    },
    {
      id: 'L',
      name: 'Colonia',
    },
    {
      id: 'Q',
      name: 'Durazno',
    },
    {
      id: 'N',
      name: 'Flores',
    },
    {
      id: 'O',
      name: 'Florida',
    },
    {
      id: 'P',
      name: 'Lavalleja',
    },
    {
      id: 'B',
      name: 'Maldonado',
    },
    {
      id: 'V',
      name: 'Montevideo',
    },
    {
      id: 'I',
      name: 'Paysandú',
    },
    {
      id: 'J',
      name: 'Río Negro',
    },
    {
      id: 'F',
      name: 'Rivera',
    },
    {
      id: 'C',
      name: 'Rocha',
    },
    {
      id: 'H',
      name: 'Salto',
    },
    {
      id: 'M',
      name: 'San José',
    },
    {
      id: 'K',
      name: 'Soriano',
    },
    {
      id: 'R',
      name: 'Tacuarembó',
    },
    {
      id: 'D',
      name: 'Treinta y Tres',
    }
  ];

  selectedDepartment = ''

  departmentControl = FormControl;


  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<AddPadronModalComponent>,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.addPadronForm = this.fb.group({
      selectedDepartment: ['', [Validators.required]],
      padronNumber: ['', [Validators.required]],
    });
  }

  getPadronErrorMessage(): string {
    if (this.addPadronForm.controls.selectedDepartment.hasError('required')) {
      return 'El departamento es requerido';
    }
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
      const padron = Number.parseInt(this.addPadronForm.controls.padronNumber.value);
      const department = this.addPadronForm.controls.selectedDepartment.value;
      this.apiService.validatePadronNumber(padron, department).then(
        (isValid: boolean) => {
          //TODO: Remove timeout when implement server validation
          setTimeout(() => {
            this.isLoading = false;
            if (isValid) {
              this.dialogRef.close({
                padron: this.addPadronForm.controls.padronNumber.value,
                department: this.addPadronForm.controls.selectedDepartment.value
              });
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
