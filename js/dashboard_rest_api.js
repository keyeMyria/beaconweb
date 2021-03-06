///////////////////////////////////////
// Utility functions
///////////////////////////////////////

// Add method to Number for radian lookup
if (typeof(Number.prototype.toRad) === "undefined") {
   Number.prototype.toRad = function() {
      return this * Math.PI / 180;
   }
}

// Window.console override for older browsers
if(!window.console)
{
   var __console = function(){
      this.history = [];
   }
   __console.prototype.log = function()
   {
      this.history.push(Array.prototype.slice.call( arguments ));
   }
   window.console = new __console();
}

// Setup getCookie function if not exists
if(typeof getCookie != 'function')
{
   function getCookie(name)
   {
      var cookieValue = null;
      if (document.cookie && document.cookie != '')
      {
         var cookies = document.cookie.split(';');
         for (var i = 0; i < cookies.length; i++)
         {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '='))
            {
               cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
               break;
            }
         }
      }
      return cookieValue;
   }
}

// Adding indexOf method for searching arrays
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

// Get query string parameters
function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

///////////////////////////////////////
// The main Hotspot object
///////////////////////////////////////
var dashboard = (function($){

   // The default dataType for jQuery AJAX calls
   $.ajaxSetup({  dataType: 'json' });

   var module =
   {
      basePath : '',
      username : null,
      history : [],
      cache: {},
      beacon_id: null,
      contact_phone: null,
      restToken: null,

       init: function(basePath, restToken)
          {
             var self = this;
             this.basePath = basePath || this.basePath;
             this.restToken = restToken || this.restToken;


             $(window).unload(function(){
                self = null;
             });
          },

      /* Private methods for making various requests */
      __post: function(url, params, onSuccess, onError)
      {
         this.__makeRequest('POST', url, params, onSuccess, onError);
      },
      __get: function(url, params, onSuccess, onError)
      {
          this.__makeRequest('GET', url, params, onSuccess, onError);
      },
      __put: function(url, params, onSuccess, onError)
      {
         var self = this;
         this.__makeRequest('PUT', url, params, onSuccess, onError, function(xhr, settings){
            self.__beforeSend(xhr, settings);
            xhr.setRequestHeader('X-HTTP-Method-Override', 'PUT');
         });
      },
      __beforeSend: function(xhr, settings)
      {
          if (!(/^http(s)?:.*/.test(settings.url))) {
            xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
            xhr.setRequestHeader('X-Requested-With', 'XML-Http-Request');
            xhr.setRequestHeader('Accept', 'application/json');
         }
      },
      __onError: function(xhr, err, msg)
      {
         console.log("Oops, something went wrong:\n\n"+msg);
      },
      __makeRequest:function(type, url, params, onSuccess, onError, beforeSend)
      {
          var self = this;
	      var beforeSendOverride = beforeSend || this.__beforeSend;
	      var fBeforeSend = function(xhr, settings){
	      beforeSendOverride(xhr, settings);
	      xhr.setRequestHeader('Authorization', 'Token 8c575995189a11e76f49fca27a7fdc3ff7207b5c');
	      }

         $.ajax({
            beforeSend : fBeforeSend,
            url        : self.basePath + url,
            type       : type,
            data       : params || {},
            success    : onSuccess,
            error      : onError || this.__onError
         });
      },


      getDashboard: function ( success )
      {
         var self = this;
         var url = 'api/dashboard/campus_manager/';

         this.__get(url, {}, function( response ){
             if(response)
             {
                 if(success instanceof Function) success.call(self, response);
             }
         });
     }
   };
   return module;
})(jQuery);


/**
 * Created by Jas on 10/1/14.
 */
