/*
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { within, userEvent } from '@storybook/testing-library';
import { CommonModule } from '@angular/common';



import Page from '../page/page.component';
import {HomeComponent} from "../home/home.component";
import {LoginComponent} from "./login.component";
import {AppModule} from "../app.module";

export default {
  title: 'Example/Login',
  component: LoginComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/angular/configure/story-layout
    layout: 'fullscreen',
  },
  decorators: [],
} as Meta;



const Template: Story<Page> = (args: Page) => ({
  props: args,
});

const LoginTemplate: Story<LoginComponent> = (args: LoginComponent) => ({
  props: args,
});

export const LoggedOut = Template.bind({});

// More on interaction testing: https://storybook.js.org/docs/angular/writing-tests/interaction-testing
export const LoggedIn = LoginTemplate.bind({});
LoggedIn.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const loginButton = await canvas.getByRole('button', { name: /Log in/i });
  await userEvent.click(loginButton);
};

*/
