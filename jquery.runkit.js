(function (modules, root, factory) {
  if (typeof define === "function" && define.amd) {
    define(modules, factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory.apply(root, modules.map(require));
  } else {
    root["mu-jquery-runkit/jquery.runkit"] = factory.apply(root, modules.map(function (m) {
      return this[m] || root[m];
    }, {
        "jquery": root.jQuery,
        "runkit": root.RunKit
      }));
  }
})(["jquery", "runkit"], this, function ($, runkit) {
  return $.fn.runkit = function () {

    return this
      .one("init.runkit", function ($event) {
        var target = $event.target;
        var $target = $(target);

        if ($event.result !== false) {
          $target
            .one("create.runkit", function ($e, notebook) {
              if ($e.result === false) {
                $(notebook.iframe).remove();
              }
            })
            .trigger("create.runkit", runkit.createNotebook({
              "element": $target.parent().get(0),
              "source": runkit.sourceFromElement(target),
              "onLoad": function (notebook) {
                $target
                  .one("ready.runkit", function ($e) {
                    if ($e.result !== false) {
                      $($e.target).remove();
                    }
                  })
                  .trigger("ready.runkit", notebook);
              }
            }));
        }
      })
      .trigger("init.runkit");
  }
});
