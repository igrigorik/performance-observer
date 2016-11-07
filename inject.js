chrome.extension.sendMessage({}, function(response) {

  let entries = [];
  let observer = new PerformanceObserver(list => {
    list.getEntries().forEach(entry => {
      entries.push(entry);
    });
  });
  observer.observe({entryTypes: ['longtask']});

  let groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  function dump() {
    console.group("%cFRAME: ", "color:blue", window.location.href);

    let sorted = groupBy(entries, 'name')
    Object.entries(sorted).forEach(recs => {
      console.group(recs[0]);
      recs[1].forEach(entry => {
        let culprit = entry.culpritWindow;
        if (culprit != null) {
          console.group(culprit.document.location.href);
          console.warn(entry);
          console.groupEnd();
        } else {
          console.log(entry);
        }
      });
      console.groupEnd(); // subtype group
    });

    console.groupEnd(); // window group
  }

  // TODO: be smarter.. :-)
  setTimeout(function() {
    dump();
  }, 8000)

});
