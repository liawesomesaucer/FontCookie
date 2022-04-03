/* global chrome */
function addStyles() {
  var style = document.createElement('style');
  if (style.styleSheet) {
    style.styleSheet.cssText = `
    @font-face {
      font-family: 'Choco cooky';
      src: url('ChocoCookyRegular.ttf');
    }
    
    * {
      font-family: 'Choco cooky' !important;
    }`;
  } else {
    style.appendChild(
      document.createTextNode(`
    @font-face {
      font-family: 'Choco cooky';
      src: url('ChocoCookyRegular.ttf');
    }
    
    * {
      font-family: 'Choco cooky' !important;
    }`)
    );
  }
  document.getElementsByTagName('head')[0].appendChild(style);
}

function isCurrentHostBlocked(blockedHostList) {
  if (!blockedHostList) {
    return false;
  }

  for (const host of blockedHostList) {
    if (window.location.host.includes(host)) {
      return true;
    }
  }

  return false;
}

/**
 * We insert twice, once to begin with and once at the end. The first insert happens
 * when body is ready, which allows us to start the load with the gray filter. The
 * second load prevents anyone else from creating an element that could exist above
 * the filter (z-index-wise)
 */
var enabled;
const observer = new MutationObserver(function () {
  if (document.body) {
    chrome.storage.local.get(null, function (result) {
      if (
        isCurrentHostBlocked(
          Object.entries(result)
            .filter(([k, v]) => !!v)
            .map(([k, v]) => k)
        )
      ) {
        enabled = true;
        addStyles();
      }
    });
    observer.disconnect();
  }
});
observer.observe(document.documentElement, { childList: true });

document.addEventListener('DOMContentLoaded', () => {
  if (enabled) {
    addStyles();
  }
});

// Handle if the current site gets blocked
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { newValue }] of Object.entries(changes)) {
    if (window.location.host.includes(key) && newValue) {
      addStyles();
    }
  }
});
