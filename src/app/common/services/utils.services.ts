import { Injectable } from '@angular/core';
// import * as dayjs from 'dayjs';
import dayjs from 'dayjs';

@Injectable({ providedIn: 'root' })
export class UtilsService {
  //Retorna los dias del "año" en el formato: MMM DD, comenzando en initialDate y devolviendo cada "period" cantidad de dias
  // Ejemplo: getYearDays(new Date(1977, 6, 12), 16)  returns
  // ['JUL 12', 'JUL 28', 'AUG 12', ...]
  getYearDays(initialDate: Date, period: number = 16): string[] {
    const results = [];
    //1977 es solo un año que no es biciesto ni 1978 tampoco
    const start = dayjs(new Date(1977, initialDate.getMonth(), initialDate.getDate()));
    const amount = Math.ceil(365 / period);
    [...Array(amount)].forEach((i: number) => {
      const newDay = start.add(period * i);
      results.push(newDay.format('MMM DD'));
    });
    return results;
  }
}
