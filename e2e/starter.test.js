describe('Given an app with no tenant registered', () => {
  beforeAll(async () => {
    // Enable permissions to avoid native popups when launching app
    await device.launchApp({permissions: {notifications: 'YES', location: 'inuse'}});
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show no tenant found dialog', async () => {
    await expect(element(by.id('LoginNoTenantFoundDialog'))).toBeVisible();
  });

  it('should be able to close the dialog', async () => {
    await element(by.id('LoginNoTenantFoundDialog.cancelButton')).tap();
    await expect(element(by.id('LoginNoTenantFoundDialog'))).not.toBeVisible();
  });
});

