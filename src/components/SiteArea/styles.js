import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  newsContent: {
    flexDirection: "column",
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#fff"
  },
  newsHeader: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 20
  },
  newsLink: {
    color: "#fff",
    fontSize: 12,
    alignSelf: "flex-start",
    fontWeight: "bold"
  },
  newsTypeView: {
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    alignSelf: "flex-end"
  },
  newsTypeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    paddingBottom: 5
  }
});
