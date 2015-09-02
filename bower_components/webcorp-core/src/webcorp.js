'use strict';
var wc = window.wc = {};
var webcorp = window.webcorp = wc;
//var _=require('lodash');
webcorp.namespace = function (namespaceString) {
    var parts = namespaceString.split('.'), parent = webcorp, i;

    //strip redundant leading global
    if (parts[0] === 'wc' || parts[0] === 'webcorp') {
        parts = parts.slice(1);
    }

    var targetParent = webcorp,
        targetName;

    for (i = 0; i < parts.length; i++) {
        //create a propery if it doesn't exist
        if (typeof parent[parts[i]] === 'undefined') {
            parent[parts[i]] = {};
        }

        if (i === parts.length - 2) {
            targetParent = parent[parts[i]];
        }

        targetName = parts[i];

        parent = parent[parts[i]];
    }

    return {
        targetParent: targetParent,
        targetName: targetName,
        bind: function (target) {
            targetParent[targetName] = target;
        }
    };
};

webcorp.define = function (namespace, fn) {
    webcorp.namespace(namespace).bind(fn);
};