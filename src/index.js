import autofitText, { autoFit } from './autofitText.js';
import {
  createAutofitTextInstaller,
  registerAutofitTextDirective,
} from './register.js';

const AutofitTextPlugin = {
  install: createAutofitTextInstaller(autofitText),
};

export { autoFit, autofitText, createAutofitTextInstaller, registerAutofitTextDirective };
export default AutofitTextPlugin;
