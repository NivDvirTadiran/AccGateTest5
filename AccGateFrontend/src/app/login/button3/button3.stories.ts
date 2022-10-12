// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { Button3Component } from './button3.component';

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
export default {
  title: 'Example/Button3',
  component: Button3Component,
  // More on argTypes: https://storybook.js.org/docs/angular/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: Story<Button3Component> = (args: Button3Component) => ({
  props: args,
});

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/angular/writing-stories/args
Primary.args = {
  primary: true,
  label: 'button1',
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'button2',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'button3',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'button4',
};
