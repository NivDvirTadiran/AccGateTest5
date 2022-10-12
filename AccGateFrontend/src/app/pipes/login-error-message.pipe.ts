import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'loginErrorMessage'
})
export class LoginErrorMessagePipe implements PipeTransform {

  transform(message: string, ...args: unknown[]): unknown {
    const dataToArray = message.split(',').map(item => item.trim());
    // convert array to string replacing comma with new line
    return dataToArray.join('\n');
  }

}
