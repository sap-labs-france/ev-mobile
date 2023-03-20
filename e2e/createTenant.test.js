// describe('Create tenant', () => {
//   beforeAll(async () => {
//     // Enable permissions to avoid native popups when launching app
//     await device.launchApp({permissions: {notifications: 'YES', location: 'inuse'}});
//   });
//
//   beforeEach(async () => {
//     await device.reloadReactNative();
//   });
//
//   it('should be able to add a tenant manually', async () => {
//     await element(by.id('LoginNoTenantFoundDialog.cancelButton')).tap();
//     await expect(element(by.id('LoginTenantSelection'))).toBeVisible();
//     await element(by.id('LoginTenantSelection')).tap();
//     await expect(element(by.id('TenantsAddButton'))).toExist();
//     await element(by.id('TenantsAddButton')).tap();
//     await expect(element(by.id('TenantsAddTenantDialog'))).toBeVisible();
//   });
// });
