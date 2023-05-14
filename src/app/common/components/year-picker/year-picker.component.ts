import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};

/**
 * @title Slider with custom thumb label formatting.
 */
@Component({
  selector: 'app-year-picker',
  templateUrl: './year-picker.component.html',
  styleUrls: ['./year-picker.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_FORMATS,
    },
  ],
})
export class YearPickerComponent implements OnInit {
  @ViewChild('picker', { static: false })
  private picker!: MatDatepicker<Date>;

  @Input() initialYear: number;

  @Input() minYear: number;

  @Input() maxYear: number;

  @Output() pick: EventEmitter<number> = new EventEmitter<number>();

  minDate: Date;

  maxDate: Date;

  selectedYear: Date;

  ngOnInit() {
    console.log('init Year Picker component');
    this.selectedYear = this.initialYear ? new Date(`${this.initialYear}/1/1`) : new Date();
    this.minDate = this.minYear ? new Date(`${this.minYear}/1/1`) : new Date('1985/1/1'); //TODO: Get from Config
    this.maxDate = this.maxYear ? new Date(`${this.maxYear}/12/31`) : new Date();
  }

  chosenYearHandler(event: any) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    let { _d } = event;
    this.selectedYear = _d;
    this.picker.close();
    console.log({ event });
    this.pick.emit(this.selectedYear.getFullYear());
  }
}
