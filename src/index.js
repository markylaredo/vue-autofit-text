import autofitText from './autofitText.js';
import {
  createAutofitTextInstaller,
  registerAutofitTextDirective,
} from './register.js';

const AutofitTextPlugin = {
  install: createAutofitTextInstaller(autofitText),
};

export { autofitText, createAutofitTextInstaller, registerAutofitTextDirective };
export default AutofitTextPlugin;
