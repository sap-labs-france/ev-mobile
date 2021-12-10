import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

import { View } from 'react-native';

test('renders correctly', () => {
  const tree = renderer.create(<View />).toJSON();
  expect(tree).toMatchSnapshot();
  expect(3).toBeTruthy();
});
