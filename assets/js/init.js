
var mobileMessage;
var mobileMessageTwo;
var addToHomescreen = false;
var pwa = window.matchMedia('(display-mode: standalone)').matches;
var mobile = window.bowser.parse(window.navigator.userAgent).platform.type === 'mobile';
var iosPermissionWarning = false;
var firstOrientation;

var root = document.getElementById('root');
var mobile_warning = document.getElementById('mobile_warning');
var browser_warning = document.getElementById('browser_warning');
var mobileMessageEl = document.getElementById('mobileMessageEl');
var mobileMessageTwoEl = document.getElementById('mobileMessageTwoEl');
var mobile_warning_info = document.getElementById('mobile_warning_info');
var browser_warning_info = document.getElementById('browser_warning_info');
var orientation_warning = document.getElementById('orientation_warning');
var orientation_warning_btn = document.getElementById('orientation_warning_btn');
var bowser = window.bowser.parse(window.navigator.userAgent);

function checkOrientation() {

  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          window.location.reload();
          window.addEventListener('deviceorientation', function (e) {
            if (firstOrientation === undefined) {
              firstOrientation = e;
            }
          });
        } else {
          alert('You have chosen “NO” To use our site, you need to give access “Device Motion and Orientation”, for this you need to clear the Safari cache, and then click “Accept”')
        }
      })
      .catch(console.error);
  } else {
    // handle regular non iOS 13+ devices
  }
}

const reloadApp = function () {
  checkOrientation();
};

if (!pwa && mobile) {
  if (bowser.os.name === 'iOS' && !(bowser.browser.name === 'Safari')) {
    mobileMessage = 'Switch to Safari';
    mobileMessageTwo = 'and save this page on your home screen';
  }
  if (bowser.os.name === 'Android' && !(bowser.browser.name === 'Chrome')) {
    mobileMessage = 'Switch to Chrome and save this page on your home screen';
  }
  if (bowser.os.name === 'iOS' && bowser.browser.name === 'Safari') {
    mobileMessage = 'Add this page to your home screen.';
    addToHomescreen = true;
  }
  if (bowser.os.name === 'Android' && bowser.browser.name === 'Chrome') {
    mobileMessage = 'Add this page to your home screen.';
    addToHomescreen = true;
  }
}


window.addEventListener('deviceorientation', function (e) {
  if (firstOrientation === undefined) {
    firstOrientation = e;
  }
});

setTimeout(function () {
  if (firstOrientation === undefined && ('ontouchstart' in window) === true) {
    iosPermissionWarning = true;
  }

  if (!iosPermissionWarning) {
    removeNode(orientation_warning);
  } else {
    orientation_warning.style.opacity = 1;
  }
}, 300);

function removeNode(node) {
  node.parentNode.removeChild(node);
}

if (!pwa) {
  removeNode(mobile_warning);
}

if (!mobile || pwa) {
  removeNode(browser_warning);
}

if (addToHomescreen) {
  removeNode(mobile_warning_info);
}

if (!addToHomescreen) {
  removeNode(browser_warning_info);
}

orientation_warning_btn.addEventListener('click', function () {
  reloadApp();
});

mobileMessageEl.textContent = mobileMessage;
mobileMessageTwoEl.textContent = mobileMessageTwo;

var loadScript = function(url) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
};

var loadLink = function(url) {
  const link = document.createElement('link');
  link.href = url;
  link.type = "text/css";
  link.rel = "stylesheet";
  link.media = "screen,print";
  document.getElementsByTagName('head')[0].appendChild(link);
};

if (mobile && !pwa) {
  removeNode(root);
} else {
  loadScript('/runtime.js');
  loadScript('/polyfills.js');
  loadScript('/scripts.js');
  loadScript('/main.js');

  loadLink('/styles.css');
}

mobile_warning.style.opacity = 1;
browser_warning.style.opacity = 1;
