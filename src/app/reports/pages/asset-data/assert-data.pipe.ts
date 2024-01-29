import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'assertData'
})
export class AssertDataPipe implements PipeTransform {

  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push(key);
    }
    return keys;
  }

}
