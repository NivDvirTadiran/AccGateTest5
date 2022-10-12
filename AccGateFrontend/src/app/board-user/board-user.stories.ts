import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import type { Story, Meta } from '@storybook/angular';
import {storiesOf } from '@storybook/angular';
import Button from '../../stories/button.component';
import { BoardUserComponent } from './board-user.component';
import {AppModule} from "../app.module";
import {UserService} from "../_services/user.service";
import {HttpClient} from "@angular/common/http";
/*
storiesOf('BoardUserComponent', module).add('variant 1', () => ({
  component: BoardUserComponent,
  props: {},
}));
*/
export default {
  title: 'Example/BoardUser',
  component: BoardUserComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule],
    }),
  ],
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/angular/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta;

const Template: Story<BoardUserComponent> = (args: BoardUserComponent) => ({
  props: args,
});

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {
    name: 'Jane Doe',
  },
};

export const LoggedOut = Template.bind({});
LoggedOut.parameters = {
  angularRouter: {active: 'user'}
}
LoggedOut.args = {};

