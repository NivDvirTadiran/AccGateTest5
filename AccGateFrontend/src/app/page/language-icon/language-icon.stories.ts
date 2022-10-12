// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { LanguageIconComponent } from './language-icon.component';

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
export default {
  title: 'Example/LanguageIcon',
  component: LanguageIconComponent,
  // More on argTypes: https://storybook.js.org/docs/angular/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: Story<LanguageIconComponent> = (args: LanguageIconComponent) => ({
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