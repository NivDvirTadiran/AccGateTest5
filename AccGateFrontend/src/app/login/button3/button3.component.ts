import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'storybook-button3',
  templateUrl: './button3.component.html',
  styleUrls: ['./button3.component.css']
})
export class Button3Component {
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
    const mode = this.primary ? 'storybook-button3--primary' : 'storybook-button3--secondary';

    return ['storybook-button3', `storybook-button3--${this.size}`, mode];
  }


}
