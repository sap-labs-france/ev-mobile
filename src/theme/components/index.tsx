import _ from 'lodash';
import ThemeColor from '../variables/ThemeColor';
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

export default class Theme {
  public static getTheme(themeColor: ThemeColor) {
    console.log('getTheme ====================================');
    console.log(themeColor.getCurrentTheme().background);
    console.log('====================================');
    const theme = {
      variables: themeColor,
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
        ...headerTheme(themeColor)
      },

      'NativeBase.Button': {
        ...buttonTheme(themeColor)
      },

      'NativeBase.Title': {
        ...titleTheme(themeColor)
      },
      'NativeBase.Subtitle': {
        ...subtitleTheme(themeColor)
      },

      'NativeBase.InputGroup': {
        ...inputGroupTheme(themeColor)
      },

      'NativeBase.Input': {
        ...inputTheme(themeColor)
      },

      'NativeBase.Badge': {
        ...badgeTheme(themeColor)
      },

      'NativeBase.CheckBox': {
        ...checkBoxTheme(themeColor)
      },

      'NativeBase.Radio': {
        ...radioTheme(themeColor)
      },

      'NativeBase.Card': {
        ...cardTheme(themeColor)
      },

      'NativeBase.CardItem': {
        ...cardItemTheme(themeColor)
      },

      'NativeBase.Toast': {
        ...toastTheme(themeColor)
      },

      'NativeBase.H1': {
        ...h1Theme(themeColor)
      },
      'NativeBase.H2': {
        ...h2Theme(themeColor)
      },
      'NativeBase.H3': {
        ...h3Theme(themeColor)
      },
      'NativeBase.Form': {
        ...formTheme()
      },

      'NativeBase.Container': {
        ...containerTheme(themeColor)
      },
      'NativeBase.Content': {
        ...contentTheme()
      },

      'NativeBase.Footer': {
        ...footerTheme(themeColor)
      },

      'NativeBase.Tabs': {
        flex: 1
      },

      'NativeBase.FooterTab': {
        ...footerTabTheme(themeColor)
      },

      'NativeBase.ListItem': {
        ...listItemTheme(themeColor)
      },

      'NativeBase.ListItem1': {
        ...listItemTheme(themeColor)
      },

      'NativeBase.Icon': {
        ...iconTheme(themeColor)
      },
      'NativeBase.IconNB': {
        ...iconTheme(themeColor)
      },
      'NativeBase.Text': {
        ...textTheme(themeColor)
      },
      'NativeBase.Spinner': {
        ...spinnerTheme()
      },

      'NativeBase.Fab': {
        ...fabTheme()
      },

      'NativeBase.Item': {
        ...itemTheme(themeColor)
      },

      'NativeBase.Label': {
        ...labelTheme()
      },

      'NativeBase.Textarea': {
        ...textAreaTheme(themeColor)
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
        ...segmentTheme(themeColor)
      },

      'NativeBase.TabBar': {
        ...tabBarTheme(themeColor)
      },
      'NativeBase.ViewNB': {
        ...viewTheme(themeColor)
      },
      'NativeBase.TabHeading': {
        ...tabHeadingTheme(themeColor)
      },
      'NativeBase.TabContainer': {
        ...tabContainerTheme(themeColor)
      },
      'NativeBase.Switch': {
        ...switchTheme()
      },
      'NativeBase.Separator': {
        ...separatorTheme(themeColor)
      },
      'NativeBase.SwipeRow': {
        ...swipeRowTheme()
      },
      'NativeBase.Thumbnail': {
        ...thumbnailTheme()
      }
    };

    const cssifyTheme = (grandparent: any, parent: any, parentKey: any) => {
      _.forEach(parent, (style: any, styleName: any) => {
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
  }
};
