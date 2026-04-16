import { Pipe, PipeTransform } from '@angular/core';
/* tslint:disable */
import { orderBy } from 'lodash-es';
/* tslint:enable */

@Pipe({
    name: 'sortBy',
    standalone: false
})
export class SortByPipe implements PipeTransform {

  transform(data: any[], sortField: string, sortOrder: string): any[] {
    if (!data || !data.length || sortOrder === '' || !sortOrder) { return data; }
    if (!sortField || sortField === '') {
      data = data.map(e => e.trim());
      if (sortOrder === 'asc') {
        return data.sort();
      } else {
        return data.sort().reverse();
      }
    }
    data.forEach((obj) => {
      obj[sortField] = obj[sortField].trim();
    });
    return orderBy(data, [sortField], [sortOrder]);
  }

}
