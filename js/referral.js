// Partner referral attribution. A visit with ?ref=<code> stores the code for 180 days (the most recent partner link wins)
// and adds ?ref=<code> to links into the app, so the portal's sign-up page can attach it to the new account.
// The visit itself is counted by analyticsLite.js, which already sends the full page URL.
(function () {
    "use strict";
    var KEY = "cc_ref", DAYS = 180;

    function valid(code) { return /^[A-Za-z0-9_-]{2,40}$/.test(code || ""); }

    function readCookie() {
        var m = document.cookie.match(/(?:^|; )cc_ref=([^;]*)/);
        return m ? decodeURIComponent(m[1]) : null;
    }

    function readStorage() {
        try {
            var o = JSON.parse(localStorage.getItem(KEY));
            if (o && valid(o.c) && Date.now() - o.t < DAYS * 86400000) return o.c;
        } catch (e) {}
        return null;
    }

    function store(code) {
        // Shared across conferencecaptioning.com and app.conferencecaptioning.com.
        var domain = /(^|\.)conferencecaptioning\.com$/.test(location.hostname) ? "; domain=.conferencecaptioning.com" : "";
        document.cookie = KEY + "=" + encodeURIComponent(code) + "; max-age=" + DAYS * 86400 + "; path=/; SameSite=Lax" + domain;
        try { localStorage.setItem(KEY, JSON.stringify({ c: code, t: Date.now() })); } catch (e) {}
    }

    var fromUrl = null;
    try { fromUrl = new URLSearchParams(location.search).get("ref"); } catch (e) {}
    if (valid(fromUrl)) store(fromUrl);
    var code = valid(fromUrl) ? fromUrl : (readCookie() || readStorage());
    if (!valid(code)) return;

    function tagLinks() {
        var links = document.querySelectorAll('a[href^="https://app.conferencecaptioning.com"]');
        for (var i = 0; i < links.length; i++) {
            try {
                var u = new URL(links[i].href);
                u.searchParams.set("ref", code);
                links[i].href = u.toString();
            } catch (e) {}
        }
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tagLinks);
    else tagLinks();
})();
