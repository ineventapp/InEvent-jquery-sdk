// ------------------------------------- INEVENT ------------------------------------- //

define(["jquery", "functions/cookie", "jstz"], function($, cookie) {

	/**
	 * Create InEvent's sender
	 */
    $.fn.inevent = function(action, getAttributes, postAttributes, success, error) {

        // Official URL
        var apiURL = $("meta[name=apiURL]").attr("content") || "https://api.inevent.us/";
        // Action
        var action = { action: action || "" };
        // API Version
        var version = { version: getAttributes.version || 2 };
        // Request format
        var format = { format: getAttributes.format || "json" };
        // User tokenID
        var tokenID = (cookie.read("tokenID")) ? { tokenID: cookie.read("tokenID") } : null;
        // Browser timezone
        var timezone = { timezone: jstz.determine().name() || "America/Sao_Paulo" };
        // Encoded Language
        var lang = { lang: cookie.read("lang") || "en" };

        getAttributes = jQuery.extend(action, tokenID, getAttributes, version, format, timezone, lang);
        var fullURL = apiURL + "?" + $.param(getAttributes);

        if (getAttributes.format == "excel") {
            if (typeof success === "function") {
                success.call(this, {url: fullURL});
            }

        } else {
            // We request the information on the server
            $.ajax({
                url: fullURL,
                dataType: (getAttributes.format == "json") ? "json" : "html",
                type: "POST",
                data: postAttributes,
                success: function(data, textStatus, jqXHR) {
                    if (jqXHR.status == 200) {
                        if (typeof success === "function") {
                            success.call(this, data, textStatus, jqXHR);
                        }
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if (typeof error === "function") {
                        error.call(this, jqXHR, textStatus, errorThrown);
                    }
                },
            });
        }
    }

});
