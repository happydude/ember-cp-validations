YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Alias",
        "Base",
        "Belongs To",
        "Collection",
        "Confirmation",
        "Custom",
        "DS Error",
        "Date",
        "Dependent",
        "Error",
        "Exclusion",
        "Factory",
        "Format",
        "Has Many",
        "Inclusion",
        "Inline",
        "Length",
        "Messages",
        "Number",
        "Presence",
        "Result",
        "ResultCollection"
    ],
    "modules": [
        "Accessing Validations",
        "Advanced",
        "Basic",
        "Common Options",
        "I18n Solutions",
        "Templating",
        "Usage",
        "V-Get Helper",
        "Validations",
        "Validators"
    ],
    "allModules": [
        {
            "displayName": "Accessing Validations",
            "name": "Accessing Validations",
            "description": "All validations can be accessed via the `validations` object created on your model/object.\nEach attribute also has its own validation which has the same properties.\nAn attribute validation can be accessed via `validations.attrs.<ATTRIBUTE>` which will return a {{#crossLink \"ResultCollection\"}}{{/crossLink}}.\n\n### Global Validations\n\nGlobal validations exist on the `validations` object that resides on the object that is being validated.\nTo see all possible properties, please checkout the docs for {{#crossLink \"ResultCollection\"}}{{/crossLink}}.\n\n```js\nmodel.get('validations.isValid');\nmodel.get('validations.errors');\nmodel.get('validations.messages');\n// etc...\n```\n\n### Attribute Validations\n\nThe `validations` object also contains an `attrs` object which holds a {{#crossLink \"ResultCollection\"}}{{/crossLink}}\nfor each attribute specified in your validation rules.\n\n```js\nmodel.get('validations.attrs.username.isValid');\nmodel.get('validations.attrs.password.errors');\nmodel.get('validations.attrs.email.messages');\n// etc...\n```"
        },
        {
            "displayName": "Advanced",
            "name": "Advanced",
            "description": "### Default Options\n\nDefault options can be specified over a set of validations for a given attribute. Local properties will always take precedence.\n\nInstead of doing the following:\n\n```javascript\nconst Validations = buildValidations({\n  username: [\n    validator('presence', {\n      presence: true,\n      description: 'Username'\n    }),\n    validator('length', {\n      min: 1,\n      description: 'Username'\n    }),\n    validator('my-custom-validator', {\n      description: 'A username'\n    })\n  ]\n});\n```\n\nWe can declare default options:\n\n```javascript\nconst Validations = buildValidations({\n  username: {\n    description: 'Username'\n    validators: [\n      validator('presence', true),\n      validator('length', {\n        min: 1\n      }),\n      validator('my-custom-validator', {\n        description: 'A username'\n      })\n    ]\n  },\n});\n```\n\nIn the above example, all the validators for username will have a description of `Username` except that of the `my-custom-validator` validator which will be `A username`.\n\n### Global Options\n\nIf you have  specific options you want to propagate throught all your validation rules, you can do so by passing in a global options object.\nThis is ideal for when you have a dependent key that each validator requires such as the current locale from your i18n implementation, or\nyou want easily toggle your validations on/off.\n\n```javascript\nconst Validations = buildValidations(validationRules, globalOptions);\n```\n\n```javascript\nimport Ember from 'ember';\nimport { validator, buildValidations } from 'ember-cp-validations';\n\nconst Validations = buildValidations({\n  firstName: {\n    description: 'First Name'\n    validators: [\n      validator('presence', {\n        presence: true,\n        dependentKeys: ['foo', 'bar']\n      })\n     ]\n   },\n  lastName: validator('presence', true)\n}, {\n  description: 'This field'\n  dependentKeys: ['i18n.locale'],\n  disabled: computed.readOnly('model.disableValidations')\n});\n```\n\nJust like in the default options, locale validator options will always take precedence over default options and default options will always take precedence\nover global options. This allows you to declare global rules while having the ability to override them in lower levels.\n\nThis rule does not apply to `dependentKeys`, instead they all are merged. In the example above, __firstName__'s dependentKeys will be\n`['i18n.locale', 'disableValidations', 'foo', 'bar']`\n\n### Computed Options\n\nAll options can also be Computed Properties. These CPs have access to the `model` and `attribute` that is associated with the validator.\n\nPlease note that the `message` option of a validator can also be a function with [the following signature](http://offirgolan.github.io/ember-cp-validations/docs/modules/Validators.html#message).\n\n```javascript\nconst Validations = buildValidations({\n  username: validator('length', {\n    disabled: Ember.computed.not('model.meta.username.isEnabled'),\n    min: Ember.computed.readOnly('model.meta.username.minLength'),\n    max: Ember.computed.readOnly('model.meta.username.maxLength'),\n    description: Ember.computed(function() {\n      // CPs have access to the `model` and `attribute`\n      return this.get('model').generateDescription(this.get('attribute'));\n    }).volatile() // Disable caching and force recompute on every get call\n  })\n});\n```\n\n### Nested Keys\n\nWhen declaring object validations (not including Ember Data models), it is possible to validate child objects from the parent object.\n\n```javascript\nimport Ember from 'ember';\nimport { validator, buildValidations } from 'ember-cp-validations';\n\nconst Validations = buildValidations({\n  'acceptTerms': validator('inclusion', { in: [ true ] }),\n  'user.firstName': validator('presence', true),\n  'user.lasName': validator('presence', true),\n  'user.account.number': validator('number')\n});\n\nexport default Ember.Component.extend(Validations, {\n  acceptTerms: false,\n  user:  {\n    firstName: 'John',\n    lastName: 'Doe' ,\n    account: {\n      number: 123456,\n    }\n  },\n  isFormValid: Ember.computed.alias('validations.isValid'),\n});\n```"
        },
        {
            "displayName": "Basic",
            "name": "Basic",
            "description": "## Models\n\nThe first thing we need to do it build our validation rules. This will then generate a Mixin that you will be able to incorporate into your model or object.\n\n```javascript\n// models/user.js\n\nimport Ember from 'ember';\nimport DS from 'ember-data';\nimport { validator, buildValidations } from 'ember-cp-validations';\n\nconst Validations = buildValidations({\n  username: validator('presence', true),\n  password: [\n    validator('presence', true),\n    validator('length', {\n      min: 4,\n      max: 8\n    })\n  ],\n  email: [\n    validator('presence', true),\n    validator('format', { type: 'email' })\n  ],\n  emailConfirmation: [\n    validator('presence', true),\n    validator('confirmation', {\n      on: 'email',\n      message: '{description} do not match',\n      description: 'Email addresses'\n    })\n  ]\n});\n```\n\nOnce our rules are created and our Mixin is generated, all we have to do is add it to our model.\n\n```javascript\n// models/user.js\n\nexport default DS.Model.extend(Validations, {\n  'username': attr('string'),\n  'password': attr('string'),\n  'email': attr('string')\n});\n```\n\n## Objects\n\nYou can also use the generated `Validations` mixin on any `Ember.Object` or child\nof `Ember.Object`, like `Ember.Component`. For example:\n\n```javascript\n// components/x-foo.js\n\nimport Ember from 'ember';\nimport { validator, buildValidations } from 'ember-cp-validations';\n\nconst Validations = buildValidations({\n  bar: validator('presence', true)\n});\n\nexport default Ember.Component.extend(Validations, {\n  bar: null\n});\n```\n\nTo lookup validators, container access is required which can cause an issue with `Ember.Object` creation if the object is statically imported. The current fix for this is as follows.\n\n```javascript\n// models/user.js\n\nexport default Ember.Object.extend(Validations, {\n  username: null\n});\n```\n\n**Ember < 2.3.0-beta.1**\n\n```javascript\n// routes/index.js\n\nimport User from '../models/user';\n\nexport default Ember.Route.extend({\n  model() {\n    var container = this.get('container');\n    return User.create({ username: 'John', container })\n  }\n});\n```\n\n**Ember >= 2.3.0-beta.2**\n\n```javascript\n// routes/index.js\n\nimport User from '../models/user';\n\nexport default Ember.Route.extend({\n  model() {\n    return User.create(\n     Ember.getOwner(this).ownerInjection(),\n     { username: 'John' }\n    );\n  }\n});\n```"
        },
        {
            "displayName": "Common Options",
            "name": "Common Options",
            "description": "### description\n\nDefault: __'This field'__\n\nA descriptor for your attribute used in the error message strings.\nYou can overwrite this value in your `validators/messages.js` file by changing the `defaultDescription` property.\n\n```javascript\n// Examples\nvalidator('date', {\n  description: 'Date of birth'\n})\n// If validation is run and the attribute is empty, the error returned will be:\n// 'Date of birth can't be blank'\n```\n\n### lazy\n\nDefault: __true__\n\nOnly validate the given validator if the attribute is not already in an invalid\nstate. When you have multiple validators on an attribute, it will only validate subsequent\nvalidators if the preceding validators have passed. When set to __false__, the validator\nwill always be executed, even if its preceding validators are invalid.\n\n```javascript\n// Examples\nbuildValidations({\n username: [\n   validator('presence', true),\n   validator('length', { min: 5 }),\n   validator('custom-promise-based-validator') // Will only be executed if the above two have passed\n ]\n});\n\nvalidator('custom-validator-that-must-executed', {\n  lazy: false\n})\n```\n\n### dependentKeys\n\nA list of other model specific dependents for you validator.\n\n```javascript\n// Examples\nvalidator('has-friends', {\n  dependentKeys: ['model.friends.[]']\n})\nvalidator('has-valid-friends', {\n  dependentKeys: ['model.friends.@each.username']\n})\nvalidator('x-validator', {\n  dependentKeys: ['model.username', 'model.email', 'model.meta.foo.bar']\n})\n```\n\n### disabled\n\nDefault: __false__\n\nIf set to __true__, disables the given validator. \n\n```js\n// Examples\nvalidator('presence', {\n  presence: true,\n  disabled: true\n})\nvalidator('presence', {\n  presence: true,\n  disabled: computed.not('model.shouldValidate')\n})\n```\n\n### debounce\n\nDefault: __0__\n\nDebounces the validation with the given time in `milliseconds`. All debounced validations will\nbe handled asynchronously (wrapped in a promise).\n\n```javascript\n// Examples\nvalidator('length', {\n  debounce: 500\n})\nvalidator('x-validator', {\n  debounce: 250\n})\n```\n\n### isWarning\n\nDefault: __false__\n\nAny validator can be declared as a warning validator by setting `isWarning` to true. These validators will act as\nassertions that when return a message, will be placed under `warnings` and `warningMessages` collections. What this means,\nis that these validators will not have any affect on the valid state of the attribute allowing you to display warning messages\neven when the attribute is valid.\n\n```javascript\n// Examples\nvalidator('length', {\n  isWarning: true,\n  min: 6,\n  message: 'Password is weak'\n})\n```\n\n### value\n\nUsed to retrieve the value to validate. This will overwrite the validator's default `value` method.\nBy default this returns `model[attribute]`. If you are dependent on other model attributes, you will\nneed to add them as `dependentKeys`.\n\n```javascript\n// Examples\nvalidator('date', {\n  value(model, attribute) {\n  \t// Format the orignal value before passing it into the validator\n  \treturn moment().utc(model.get(attribute)).format('DD/MM/YYY');\n  }\n})\nvalidator('number', {\n  dependentKeys: ['someOtherAttr'],\n  value(model, attribute) {\n   // Validate a value that is not the current attribute\n   return this.get('model').get('someOtherAttr');\n  }\n})\n```\n\n### message\n\nThis option can take two forms. It can either be a `string` (a CP that returns a string is also valid), or a `function`.\nIf a string is used, then it will overwrite all error message types for the specified validator.\n\n```javascript\n// Example: String\nvalidator('confirmation', {\n  message: 'Email does not match {attribute}. What are you even thinking?!'\n})\n```\n\nWe can pass a `function` into our message option for even more customization capabilities.\n\n```javascript\n// Example: Function\nvalidator('date', {\n  message(type, options, value, context) {\n    if (type === 'before') {\n      return '{description} should really be before {date}';\n    }\n    if (type === 'after') {\n      return '{description} should really be after {date}';\n    }\n  }\n})\n```\nThe message function is given the following arguments:\n\n- `type` (**String**): The error message type\n- `options` (**Object**): The validator options that were defined in the model\n- `value`: The current value being evaluated\n- `context` (**Object**): Context for string replacement\n\nThe return value must be a `string`. If nothing is returned (`undefined`),\ndefaults to the default error message of the specified type.\n\nWithin this function, the context is set to that of the current validator.\nThis gives you access to the model, defaultMessages, options and more."
        },
        {
            "displayName": "I18n Solutions",
            "name": "I18n Solutions",
            "description": "### [__Ember-Intl__](https://github.com/jasonmit/ember-intl-cp-validations)\n\n ```bash\n ember install ember-intl-cp-validations\n ```\n\n### [__Ember-I18n__](https://github.com/jasonmit/ember-i18n-cp-validations)\n\n```bash\n ember install ember-i18n-cp-validations\n```"
        },
        {
            "displayName": "Templating",
            "name": "Templating"
        },
        {
            "displayName": "Usage",
            "name": "Usage",
            "description": "## Installation\n```shell\nember install ember-cp-validations\n```\n\n## Changelog\nChangelog can be found [here](https://github.com/offirgolan/ember-cp-validations/blob/master/CHANGELOG.md)\n\n## Live Demo\nA live demo can be found [here](http://offirgolan.github.io/ember-cp-validations/)\n\n## Looking for help?\nIf it is a bug [please open an issue on GitHub](http://github.com/offirgolan/ember-cp-validations/issues)."
        },
        {
            "displayName": "V-Get Helper",
            "name": "V-Get Helper",
            "description": "Accessing validation information in your templates is really simple but the pathing can be quite long. For example, if we want to display the error `message` for the `username` attribute, it would look something like this:\n\n```handlebars\n{{model.validations.attrs.username.message}}\n```\n\n## The V-Get Helper\nTo bypass such long pathing, you can use the `v-get` helper.\n\n_**Notice**: Ember v1.13.0 is not supported due to a bug. Please use Ember v1.13.1 and higher or Ember v1.12.* and lower_\n\n**Access global model properties**\n\n```handlebars\n{{v-get model 'isValid'}}\n```\n\n**Access attribute specific properties**\n\n```handlebars\n{{v-get model 'username' 'message'}}\n```\n\n**Access model relationship validations**\n\nSay we have a `user` model with a `details` attribute that is a belongsTo relationship, to access validations on the `details` attribute/model we can access it as such.\n\n```handlebars\n{{v-get model.details 'isValid'}}\n{{v-get model.details 'firstName' 'message'}}\n```\n\nWhat's awesome about this is that you can pass in bound properties!\n\n```handlebars\n{{v-get model attr prop}}\n{{v-get model prop}}\n```\n\nHere is a more extensive example:\n```handlebars\n<form>\n  {{input value=model.username placeholder=\"Username\"}}\n  {{#if (v-get model 'username' 'isInvalid')}}\n    <div class=\"error\">\n      {{v-get model 'username' 'message'}}\n    </div>\n  {{/if}}\n\n  <button type=\"submit\" disabled={{v-get model 'isInvalid'}}>Submit</button>\n</form>\n```"
        },
        {
            "displayName": "Validations",
            "name": "Validations",
            "description": "## Running Manual Validations\n\nAlthough validations are lazily computed, there are times where we might want to force all or\nspecific validations to happen. For this reason we have exposed three methods:\n\n- {{#crossLink \"Factory/validateSync:method\"}}{{/crossLink}}: Should only be used if all validations are synchronous. It will throw an error if any of the validations are asynchronous\n- {{#crossLink \"Factory/validate:method\"}}{{/crossLink}}: Will always return a promise and should be used if asynchronous validations are present\n- {{#crossLink \"Factory/validateAttribute:method\"}}{{/crossLink}}: A functional approach to valididating an attribute without changing its state"
        },
        {
            "displayName": "Validators",
            "name": "Validators"
        }
    ],
    "elements": []
} };
});