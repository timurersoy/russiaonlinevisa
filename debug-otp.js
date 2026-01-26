const { TOTP } = require('otplib');

try {
    const authenticator = new TOTP({
        window: 1
    });
    console.log('TOTP instantiated successfully');
    console.log('Check method exists:', typeof authenticator.check);
    console.log('Verify method exists:', typeof authenticator.verify);
} catch (e) {
    console.error('TOTP instantiation failed:', e.message);
}
