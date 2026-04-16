import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'splitInitials',
    standalone: false
})
export class SplitInitialsPipe implements PipeTransform {

  transform(value: string): any {
    if (value) {
      let userInitial = '';
      const name = value.split(' ');
      name.forEach(element => {
        userInitial = userInitial + element.charAt(0);
      });
      return userInitial;
    }
  }
}
