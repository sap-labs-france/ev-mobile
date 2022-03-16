
import MigrationManager from '../src/migration/MigrationManager';
import Configuration from '../src/config/Configuration';

test('refactorTenants', async () => {
  const tenants = [
    {
      name: 'Tenant1',
      subdomain: 'slf',
      endpoint: Configuration.AWS_REST_ENDPOINT_PROD
    },
    {
      name: 'Tenant2',
      subdomain: 'testcharger',
      endpoint: Configuration.AWS_REST_ENDPOINT_QA
    },
    {
      name: 'Tenant1',
      subdomain: 'slf',
      endpoint: 'newendpoint'
    }
  ]
  const migrationManager = MigrationManager.getInstance()
  const refactoredTenants = await migrationManager.refactorTenants(tenants);
  expect(refactoredTenants.length).toEqual(3);
  for (let i = 0; i < 3; i++) {
    expect(refactoredTenants[i].name === tenants[i].name);
    expect(refactoredTenants[i].subdomain === tenants[i].subdomain);
  }
  console.log(Configuration.getEndpoints()[0].name);
  const tenant1 = refactoredTenants[0];
  expect(tenant1.endpoint.name).toEqual('Amazon Web Service');
  expect(tenant1.endpoint.endpoint).toEqual(Configuration.AWS_REST_ENDPOINT_PROD);
  const tenant2 = refactoredTenants[1];
  expect(tenant2.endpoint.name).toEqual('QA');
  expect(tenant2.endpoint.endpoint).toEqual(Configuration.AWS_REST_ENDPOINT_QA);
  const tenant3 = refactoredTenants[2];
  expect(tenant3.endpoint.name).toEqual(undefined);
  expect(tenant3.endpoint.endpoint).toEqual(undefined);
});

