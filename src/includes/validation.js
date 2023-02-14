// prettier-ignore
import { Form as VeeForm, Field as VeeField, ErrorMessage, defineRule, configure } from "vee-validate";
// prettier-ignore
import { required, email, min, max, alpha_spaces as alphaSpaces, min_value as minVal, max_value as maxVal, confirmed, not_one_of as excluded } from "@vee-validate/rules";

export default {
  install(app) {
    console.log("RUNNING THE VEE VALIDATE PLUGIN");
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    defineRule("required", required);
    defineRule("tos", required);
    defineRule("email", email);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("alphaSpaces", alphaSpaces);
    defineRule("minVal", minVal);
    defineRule("maxVal", maxVal);
    defineRule("confirmed", confirmed);
    defineRule("excluded", excluded);
    defineRule("country_not_allowed", excluded);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `The field ${ctx.field} is required.`,
          min: `The field ${ctx.field} is too short.`,
          max: `The field ${ctx.field} is too max.`,
          alphaSpaces: `The field ${ctx.field} may only contain alphabetical characters and alpha spaces.`,
          email: `The field ${ctx.field} must be a valid email.`,
          maxVal: `The field ${ctx.field} is too hight.`,
          minVal: `The field ${ctx.field} is too low.`,
          excluded: `You are not allowed to use this value for the field ${ctx.field}`,
          confirmed: `The passwords don't match.`,
          tos: "You must accept the Terms of Service.",
          country_not_allowed:
            "Due to restrictions, we do not accept users from this location.",
        };

        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : "The field " + ctx.field + " is invalid.";

        return message;
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true,
    });
  },
};
