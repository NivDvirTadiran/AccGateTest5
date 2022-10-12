import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'storybook-language-icon',
  templateUrl: './language-icon.component.html',
  styleUrls: ['./language-icon.component.css']
})
export class LanguageIconComponent {
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
    const mode = this.primary ? 'storybook-language-icon--primary' : 'storybook-language-icon--secondary';

    return ['storybook-language-icon', `storybook-language-icon--${this.size}`, mode];
  }


  constructor() { }

  ngOnInit(): void {
  }

}
