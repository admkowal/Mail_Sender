function AJAX(config) {

  // if invoked without keyword new
  if( !(this instanceof AJAX) ) {
      return new AJAX(config);
  }

  this._req = new XMLHttpRequest();
  this._config = this._extendOptions(config);
  this._assignEvents();

  this._send();
}

AJAX.prototype._defaultConfig = {
  type: "GET",
  url: window.location.href,
  data: {},
  options: {
    async: true,
    timeout: 0,
    username: null,
    password: null
  },
  headers: {}
};

AJAX.prototype._extendOptions = function(config) {

  // avoid overwriting _defaultConfig
  var defaultConfig = JSON.parse(JSON.stringify(this._defaultConfig));

  // extend custom config with default config options
  for(var key in defaultConfig) {

    if(key in config) {
      continue;
    } 

    config[key] = defaultConfig[key];
  }

  return config;
};

AJAX.prototype._response = function(e) {
  if(this._req.readyState === 4 && this._req.status >= 200 && this._req.status < 400) {
    if(typeof this._config.success === "function"){
      this._config.success(this._req.response, this._req.status, this._req);
    }

  } else if(this._req.readyState === 4 && this._req.status >= 400) {
    this._error();
  }

};

AJAX.prototype._error = function(e) {

  if(this._req.readyState === 4 && this._req.status >= 200) {

    if(typeof this._config.failure === "function"){
      this._config.failure(this._req.status);
    }

  }

};

AJAX.prototype._assignEvents = function() {

  this._req.addEventListener("readystatechange", this._response.bind(this), false);
  this._req.addEventListener("abort", this._error.bind(this), false);
  this._req.addEventListener("error", this._error.bind(this), false);
  this._req.addEventListener("timeout", this._error.bind(this), false);

};

AJAX.prototype._open = function() {

  this._req.open(
    this._config.type,
    this._config.url,
    this._config.options.async,
    this._config.options.username,
    this._config.options.password
  );

  this._req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  this._req.timeout = this._config.options.timeout;

};

AJAX.prototype._assignUserHeaders = function() {

  if(Object.keys(this._config.headers).length) {

    for(var key in this._config.headers) {
      this._req.setRequestHeader(key, this._config.headers[key]);
    }

  }

};

AJAX.prototype._prepareSend = function() {

  this._open();
  this._assignUserHeaders();

};

AJAX.prototype._serializeForPost = function(data) {

  var serialized = new FormData();

  for(var key in data) {
    serialized.append(key, data[key]);
  }

  return serialized;

};

AJAX.prototype._serializeForGet = function(data) {
  var serialized = "";

  for(var key in data) {
    serialized += key + "=" + encodeURIComponent(data[key]) + "&";
  }

  return serialized.slice(0, serialized.length - 1);

};

AJAX.prototype._send = function() {

  var isData = Object.keys(this._config.data).length > 0,
    data = null;

  if(this._config.type.toUpperCase() === "POST" && isData) {
    data = this._serializeForPost(this._config.data);
  } else if(this._config.type.toUpperCase() === "GET" && isData) {
    this._config.url += "?" + this._serializeForGet(this._config.data);
  }

  this._prepareSend();
  this._req.send(data);

};