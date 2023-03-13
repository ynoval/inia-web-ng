import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'deepFilter',
  pure: false,
})
@Injectable()
export class Ng2DeepSearchPipe implements PipeTransform {
  /**
   * @param items object from array
   * @param term term's search
   */
  transform(items: any, term: string, props: any[] = []): any {
    // rome-ignore lint/complexity/useSimplifiedLogicExpression: <explanation>
    if (!term || !items) return items;

    return Ng2DeepSearchPipe.filter(items, term, props);
  }

  /**
   *
   * @param items List of items to filter
   * @param term  a string term to compare with every property of the list
   *
   */
  static filter(items: Array<{ [key: string]: any }>, term: string, keysToExclude): Array<{ [key: string]: any }> {
    const toCompare = term.toLowerCase();

    function checkInside(item: any) {
      for (let property in item) {
        if (item[property] === null || item[property] == undefined || keysToExclude.includes(property)) {
          continue;
        }
        if (typeof item[property] === 'object') {
          if (checkInside(item[property])) {
            return true;
          }
        }
        if (item[property].toString().toLowerCase().includes(toCompare)) {
          return true;
        }
      }
      return false;
    }

    return items.filter(function (item) {
      return checkInside(item);
    });
  }
}
