/* eslint-disable no-param-reassign */
// @flow

import _ from 'lodash';

import variable from './../variables/platform';
import badgeTheme from './Badge';
import bodyTheme from './Body';
import buttonTheme from './Button';
import cardTheme from './Card';
import cardItemTheme from './CardItem';
import checkBoxTheme from './CheckBox';
import containerTheme from './Container';
import contentTheme from './Content';
import fabTheme from './Fab';
import footerTheme from './Footer';
import footerTabTheme from './FooterTab';
import formTheme from './Form';
import h1Theme from './H1';
import h2Theme from './H2';
import h3Theme from './H3';
import headerTheme from './Header';
import iconTheme from './Icon';
import inputTheme from './Input';
import inputGroupTheme from './InputGroup';
import itemTheme from './Item';
import labelTheme from './Label';
import leftTheme from './Left';
import listItemTheme from './ListItem';
import pickerTheme from './Picker';
import radioTheme from './Radio';
import rightTheme from './Right';
import segmentTheme from './Segment';
import separatorTheme from './Separator';
import spinnerTheme from './Spinner';
import subtitleTheme from './Subtitle';
import swipeRowTheme from './SwipeRow';
import switchTheme from './Switch';
import tabTheme from './Tab';
import tabBarTheme from './TabBar';
import tabContainerTheme from './TabContainer';
import tabHeadingTheme from './TabHeading';
import textTheme from './Text';
import textAreaTheme from './Textarea';
import thumbnailTheme from './Thumbnail';
import titleTheme from './Title';
import toastTheme from './Toast';
import viewTheme from './View';

export default (variables /* : * */ = variable) => {
  const theme = {
    variables,
    'NativeBase.Left': {
      ...leftTheme()
    },
    'NativeBase.Right': {
      ...rightTheme()
    },
    'NativeBase.Body': {
      ...bodyTheme()
    },

    'NativeBase.Header': {
      ...headerTheme(variables)
    },

    'NativeBase.Button': {
      ...buttonTheme(variables)
    },

    'NativeBase.Title': {
      ...titleTheme(variables)
    },
    'NativeBase.Subtitle': {
      ...subtitleTheme(variables)
    },

    'NativeBase.InputGroup': {
      ...inputGroupTheme(variables)
    },

    'NativeBase.Input': {
      ...inputTheme(variables)
    },

    'NativeBase.Badge': {
      ...badgeTheme(variables)
    },

    'NativeBase.CheckBox': {
      ...checkBoxTheme(variables)
    },

    'NativeBase.Radio': {
      ...radioTheme(variables)
    },

    'NativeBase.Card': {
      ...cardTheme(variables)
    },

    'NativeBase.CardItem': {
      ...cardItemTheme(variables)
    },

    'NativeBase.Toast': {
      ...toastTheme(variables)
    },

    'NativeBase.H1': {
      ...h1Theme(variables)
    },
    'NativeBase.H2': {
      ...h2Theme(variables)
    },
    'NativeBase.H3': {
      ...h3Theme(variables)
    },
    'NativeBase.Form': {
      ...formTheme()
    },

    'NativeBase.Container': {
      ...containerTheme(variables)
    },
    'NativeBase.Content': {
      ...contentTheme()
    },

    'NativeBase.Footer': {
      ...footerTheme(variables)
    },

    'NativeBase.Tabs': {
      flex: 1
    },

    'NativeBase.FooterTab': {
      ...footerTabTheme(variables)
    },

    'NativeBase.ListItem': {
      ...listItemTheme(variables)
    },

    'NativeBase.ListItem1': {
      ...listItemTheme(variables)
    },

    'NativeBase.Icon': {
      ...iconTheme(variables)
    },
    'NativeBase.IconNB': {
      ...iconTheme(variables)
    },
    'NativeBase.Text': {
      ...textTheme(variables)
    },
    'NativeBase.Spinner': {
      ...spinnerTheme()
    },

    'NativeBase.Fab': {
      ...fabTheme()
    },

    'NativeBase.Item': {
      ...itemTheme(variables)
    },

    'NativeBase.Label': {
      ...labelTheme()
    },

    'NativeBase.Textarea': {
      ...textAreaTheme(variables)
    },

    'NativeBase.PickerNB': {
      ...pickerTheme(),
      'NativeBase.Button': {
        'NativeBase.Text': {}
      }
    },

    'NativeBase.Tab': {
      ...tabTheme()
    },

    'NativeBase.Segment': {
      ...segmentTheme(variables)
    },

    'NativeBase.TabBar': {
      ...tabBarTheme(variables)
    },
    'NativeBase.ViewNB': {
      ...viewTheme(variables)
    },
    'NativeBase.TabHeading': {
      ...tabHeadingTheme(variables)
    },
    'NativeBase.TabContainer': {
      ...tabContainerTheme(variables)
    },
    'NativeBase.Switch': {
      ...switchTheme()
    },
    'NativeBase.Separator': {
      ...separatorTheme(variables)
    },
    'NativeBase.SwipeRow': {
      ...swipeRowTheme()
    },
    'NativeBase.Thumbnail': {
      ...thumbnailTheme()
    }
  };

  const cssifyTheme = (grandparent, parent, parentKey) => {
    _.forEach(parent, (style, styleName) => {
      if (styleName.indexOf('.') === 0 && parentKey && parentKey.indexOf('.') === 0) {
        if (grandparent) {
          if (!grandparent[styleName]) {
            grandparent[styleName] = {};
          } else {
            grandparent[styleName][parentKey] = style;
          }
        }
      }
      if (style && typeof style === 'object' && styleName !== 'fontVariant' && styleName !== 'transform') {
        cssifyTheme(parent, style, styleName);
      }
    });
  };

  cssifyTheme(null, theme, null);

  return theme;
};
