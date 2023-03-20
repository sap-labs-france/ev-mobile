describe('Login', () => {
  beforeAll(async () => {
    // Enable permissions to avoid native popups when launching app
    await device.launchApp({permissions: {notifications: 'YES', location: 'inuse'}});
  });

  it('should be able to login', async () => {
    await element(by.id('LoginNoTenantFoundDialog.cancelButton')).tap();
    await element(by.id('LoginEmailInput')).tap();
    await expect(element(by.id('LoginEmailInput'))).toBeFocused();
    await element(by.id('LoginEmailInput')).typeText('email@domain.com');
    await element(by.id('LoginEmailInput')).tapReturnKey();
    await expect(element(by.id('LoginPasswordInput'))).toBeFocused();
    await element(by.id('LoginPasswordInput')).typeText('password');
    await element(by.id('LoginPasswordInputRightIcon')).tap();
    await element(by.id('LoginPasswordInput')).tapReturnKey();
    await expect(element(by.id('LoginPasswordInput'))).not.toBeFocused();
    await element(by.id('LoginEULACheckbox')).tap({x:0, y:0});
    await element(by.id('LoginButton')).tap();
  });
});
