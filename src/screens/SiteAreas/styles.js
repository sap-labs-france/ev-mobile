import { StyleSheet, Dimensions, Platform } from "react";
const primary = require("../../theme/variables/commonColor").brandPrimary;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null
  },
  newsContent: {
    flexDirection: "column",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#ddd"
  },
  newsHeader: {
    color: "#222",
    fontWeight: "500",
    fontSize: 14
  },
  newsCommentContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 15,
    borderLeftWidth: 2,
    borderLeftColor: primary
  },
  newsComment: {
    color: primary,
    fontWeight: "500",
    fontSize: 14
  },
  newsLink: {
    color: Platform.OS === "android" ? "#777" : "#666",
    fontSize: 12,
    alignSelf: "flex-start",
    fontWeight: "bold"
  },
  newsTypeView: {
    borderBottomWidth: 1,
    borderBottomColor: Platform.OS === "android" ? "#777" : "#666",
    alignSelf: "flex-end"
  },
  newsTypeText: {
    color: Platform.OS === "android" ? "#777" : "#666",
    fontSize: 12,
    fontWeight: "bold",
    paddingBottom: 2
  },
  newsPoster: {
    width: null,
    flex: 1,
    height: deviceHeight / 2.4
  },
  newsPosterHeader: {
    fontWeight: "900"
  },
  newsPosterContent: {
    marginTop: deviceHeight / 3,
    flexDirection: "column",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1
  },
  timeIcon: {
    fontSize: 20,
    marginLeft: Platform.OS === "android" ? 15 : 0,
    paddingLeft: Platform.OS === "android" ? 0 : 20,
    paddingRight: 5,
    marginTop: Platform.OS === "android" ? -1 : -3,
    color: "#666"
  },
  nightButton: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 30,
    width: 60,
    height: 60,
    alignSelf: "center"
  },
  dayButton: {
    backgroundColor: "#fff",
    borderRadius: 30,
    width: 60,
    height: 60,
    alignSelf: "center"
  },
  modal: {
    backgroundColor: primary,
    position: "absolute",
    width: deviceWidth,
    height: null,
    top: Platform.OS === "android" ? 55 : 60,
    paddingBottom: Platform.OS === "android" ? 20 : 10
  },
  slide: {
    flex: 1,
    width: deviceWidth,
    height: 230,
    backgroundColor: "transparent"
  },
  wrapper: {
    flex: 1
  },
  headerStyle: {
    paddingLeft: 0,
    paddingRight: 0
  },
  headerModalStyle: {
    paddingLeft: 0,
    paddingRight: 0,
    elevation: 0
  },
  headerIcons: {
    fontSize: 30,
    backgroundColor: "transparent"
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -5,
    marginLeft: Platform.OS === "android" ? -5 : undefined
  },
  headerBtns: {
    padding: 10
  },
  headerTextIcon: {
    fontSize: 28,
    paddingTop: 10,
    marginTop: 0
  },
  swiperDot: {
    backgroundColor: "rgba(0,0,0,.8)",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  },
  swiperActiveDot: {
    backgroundColor: "#fff",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  },
  modalContentBox: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.5)"
  },
  modalContentGrid1: {
    padding: 20,
    paddingBottom: 15,
    justifyContent: "center"
  },
  modalContentGridText: {
    fontSize: 12,
    marginTop: 8,
    alignSelf: "center"
  },
  modalContentGrid2: {
    flexDirection: "row",
    paddingTop: 20,
    marginHorizontal: 10
  },
  modalSmallText: {
    alignSelf: "flex-start",
    fontWeight: "700"
  },
  modalLargeText: {
    alignSelf: "flex-end",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 28
  },
  nextStoryBtn: {
    color: primary,
    fontWeight: "900"
  },
  forwardBtn: {
    color: primary,
    fontSize: 26
  },
  imageHeader: {
    height: 25,
    width: 95,
    resizeMode: "contain"
  }
});
