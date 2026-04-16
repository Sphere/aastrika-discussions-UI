import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'createInitials',
    standalone: false
})
export class CreateInitialsPipe implements PipeTransform {

  transform(value: string): any {
    if (value) {
        let initials = ''
        const array = `${value} `.toString().split(' ')
        if (array[0] !== 'undefined' && typeof array[1] !== 'undefined') {
          initials += array[0].charAt(0)
          initials += array[1].charAt(0)
        } else {
          for (let i = 0; i < value.length; i += 1) {
            if (value.charAt(i) === ' ') {
              continue
            }
    
            if (value.charAt(i) === value.charAt(i)) {
              initials += value.charAt(i)
    
              if (initials.length === 2) {
                break
              }
            }
          }
        }
        console.log(initials)
        return initials.toUpperCase()
    }
  }
}
