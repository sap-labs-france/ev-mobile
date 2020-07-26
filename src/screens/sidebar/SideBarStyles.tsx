import deepmerge from 'deepmerge';
import { Platform } from 'react-native';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../theme/variables/commonColor';

export default function computeStyleSheet(): any {
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    background: {
      flex: 1
    },
    drawerContent: {
      paddingTop: '5@s',
      flex: 1
    },
    header: {
      flexDirection: 'column',
      borderColor: commonColor.textColor,
      backgroundColor: commonColor.containerBgColor,
      borderBottomWidth: 1,
      height: '120@s',
      marginTop: Platform.OS === 'ios' ? '-5@s' : '10@s'
    },
    logo: {
      resizeMode: 'contain',
      width: '100@s',
      height: '50@s',
      alignSelf: 'center',
      margin: '5@s',
      marginBottom: '10@s',
    },
    tenantName: {
      color: commonColor.textColor,
      fontSize: '14@s',
      margin: '2@s',
      alignSelf: 'center',
      textAlign: 'center',
      width: '90%'
    },
    versionText: {
      color: commonColor.textColor,
      fontSize: '14@s',
      margin: '2@s',
      alignSelf: 'center',
      marginBottom: '10@s',
    },
    versionDate: {
      color: commonColor.textColor,
      fontSize: '14@s',
      alignSelf: 'center',
      marginBottom: '2@s'
    },
    linkContainer: {
      paddingTop: '10@s',
      paddingLeft: '10@s'
    },
    links: {
      borderBottomWidth: '0@s',
      borderBottomColor: 'transparent',
      height: Platform.OS === 'ios' ? undefined : '35@s',
      paddingTop: '10@s',
      paddingBottom: '10@s'
    },
    linkIcon: {
      fontSize: '20@s',
      color: commonColor.textColor
    },
    linkText: {
      color: commonColor.textColor,
      fontSize: '16@s',
      paddingLeft: '10@s'
    },
    logoutContainer: {
      padding: 30,
      paddingTop: '0@s'
    },
    logoutButton: {
      paddingTop: '10@s',
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: commonColor.textColor
    },
    gridLogoutContainer: {
      flex: 1,
      flexDirection: 'row'
    },
    columnAccount: {
      flexDirection: 'column',
      flexGrow: 2,
      flex: 1
    },
    buttonLogout: {
      alignSelf: 'flex-start',
      backgroundColor: 'transparent'
    },
    logoutText: {
      fontWeight: 'bold',
      fontSize: '14@s',
      color: commonColor.textColor
    },
    userName: {
      paddingTop: '5@s',
      fontSize: '14@s',
      color: commonColor.textColor
    },
    columnThumbnail: {
      flex: 1,
      flexDirection: 'column'
    },
    buttonThumbnail: {
      alignSelf: 'flex-end'
    },
    profilePic: {
      width: '40@s',
      height: '40@s',
      borderRadius: '20@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
