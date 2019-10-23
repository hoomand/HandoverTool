module.exports = {
  aliasIsEmail: false,
  handoverItem: {
    validStatuses: {
      fresh: "fresh issue, no investigation done yet",
      investigated: "did some investigation, but couldn't fully diagnose",
      diagnosed: "clear steps provided to rectify the issue",
      monitor: "diagnosed actions were performed, only monitor to verify"
    },
    mustBeValidURL: true
  }
};
