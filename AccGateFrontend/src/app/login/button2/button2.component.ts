import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'storybook-button2',
  template: ` <button
    type="button"
    (click)="onClick.emit($event)"
    [ngClass]="classes"
    [ngStyle]="{ 'background-color': backgroundColor }">
    {{ label }}
  </button>`,
  styleUrls: ['./button2.css'],
})
export class Button2Component {
  /**
   * Is this the principal call to action on the page?
   */
  @Input()
  primary = false;

  /**
   * What background color to use
   */
  @Input()
  backgroundColor?: string;

  /**
   * How large should the button be?
   */
  @Input()
  size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Button contents
   *
   * @required
   */
  @Input()
  label = 'accGateButton2';

  /**
   * Optional click handler
   */
  @Output()
  onClick = new EventEmitter<Event>();

  public get classes(): string[] {
    const mode = this.primary ? 'storybook-button2--primary' : 'storybook-button2--secondary';

    return ['storybook-button2', `storybook-button2--${this.size}`, mode];
  }
}
