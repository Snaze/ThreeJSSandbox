define(["jquery",
        "jquery-ui",
        "text!src/html/template/ModalDialog.html!strip",
        "css!src/html/template/ModalDialog.css",
        "util/Document",
        "css!bower_components/jquery-ui/themes/humanity/jquery-ui.min.css"],
    function ($, jqueryUI, modalDialogHtml, modalDialogCSS, document, jqueryUICSS) {
        "use strict";

        var ModalDialog = function (title, text, closeCallback) {
            this.title = title;
            this.text = text;
            this.closeCallback = closeCallback;

            this._dialog = null;
            this._id = null;
        };

        ModalDialog.id = 0;

        ModalDialog.prototype = {

            _getDialog: function () {
                if (this._dialog === null) {
                    var self = this;

                    var theObject = $(modalDialogHtml);
                    var textDiv = theObject.find('.dialogText');
                    textDiv.html(this.text);
                    this._id = 'ModalDialog_' + ModalDialog.id++;
                    theObject.attr('id', this._id);
                    $(document.body).append(theObject);

                    this._dialog = $('#' + this._id).dialog({
                        dialogClass: "no-close",
                        title: "Play!",

                        buttons: [
                            {
                                text: "OK",
                                click: function() {
                                    if (self.closeCallback) {
                                        self.closeCallback(self);
                                    }

                                    $( this ).dialog( "close" );
                                }
                            }
                        ],
                        autoOpen: true
                    });
                }

                return this._dialog;
            },
            open: function () {
                var theDialog = this._getDialog();

                theDialog.dialog("open");
            }

        };

        return ModalDialog;
    });