(function (modules, root, factory) {
  if (typeof define === "function" && define.amd) {
    define(modules, factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory.apply(root, modules.map(require));
  } else {
    root["mu-jquery-runkit/jquery.runkit"] = factory.apply(root, modules.map(function (m) {
      return this[m] || root[m];
    }, {
        "runkit": root.RunKit
      }));
  }
})(["runkit"], this, function (runkit) {
  var slice = Array.prototype.slice;

  return function () {
    var $ = this.constructor;

    function ready($event) {
      if ($event.result !== false) {
        $($event.target).remove();
      }
    }

    function create($event, notebook) {
      if ($event.result === false) {
        $(notebook.iframe).remove();
      }
    }

    function init($event, config) {
      var target = $event.target;
      var $target = $(target);

      if ($event.result !== false) {
        $target
          .one("create.runkit", create)
          .trigger("create.runkit", runkit.createNotebook($.extend({}, config, {
            "element": config.element || $target.parent().get(0),
            "source": runkit.sourceFromElement(target),
            "onEvaluate": function (uri) {
              $target.trigger("evaluate.runkit", uri);
            },
            "onURLChanged": function (notebook) {
              $target.trigger("url.runkit", notebook);
            },
            "onLoad": function (notebook) {
              $target
                .one("ready.runkit", ready)
                .trigger("ready.runkit", notebook);
            }
          })));
      }
    }

    return this
      .one("init.runkit", init)
      .trigger("init.runkit", argument.lenght ? slice.call(arguments) : {});
  }
});
