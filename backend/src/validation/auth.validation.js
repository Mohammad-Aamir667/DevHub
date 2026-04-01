const validator = require("validator");
const validateSignUpData = (data) => {
    const { firstName, emailId, password } = data;

    if (!firstName || !firstName.trim()) {
        return { isValid: false, message: "Enter a valid name" };
    }

    if (!validator.isEmail(emailId)) {
        return { isValid: false, message: "Enter a valid email" };
    }

    if (!validator.isStrongPassword(password)) {
        return { isValid: false, message: "Enter a strong password" };
    }

    return { isValid: true };
};
module.exports = { validateSignUpData }