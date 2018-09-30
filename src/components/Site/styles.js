import { StyleSheet } from "react";

export default StyleSheet.create({
  newsContent: {
    flexDirection: "column",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#ddd"
  },
  newsHeader: {
    color: "#fff",
    alignSelf: "flex-start",
    fontWeight: "bold",
    marginRight: 200
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
