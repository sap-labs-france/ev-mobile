import { StyleSheet } from "react-native";

export default StyleSheet.create({
  content: {
    flexDirection: "column",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#ddd"
  },
  siteName: {
    color: "#fff",
    alignSelf: "flex-start",
    fontWeight: "bold",
    width: 200,
    height: 35
  },
  icon: {
    alignSelf: "flex-end"
  },
  numberChargers: {
    color: "#46f939",
    fontSize: 15,
    alignSelf: "flex-start",
    fontWeight: "bold"
  },
  city: {
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    alignSelf: "flex-end",
    fontSize: 12
  }
});
