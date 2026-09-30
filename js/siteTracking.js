(function () {
    var GA_ID = 'G-0LVRKJGVDT';

    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GA_ID);
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
    }

    // Beacon transport lets the event finish sending when the click navigates away in the same tab.
    function track(name, params) {
        var p = params || {};
        p.transport_type = 'beacon';
        window.gtag('event', name, p);
    }

    function ctaLabel(el) {
        var label = el.getAttribute('data-cta');
        if (label) return label;
        if (el.tagName === 'A') {
            var href = el.getAttribute('href') || '';
            if (href.indexOf('app.conferencecaptioning.com') !== -1 || href.indexOf('app/index.html') !== -1) return 'start-free';
            if (href.indexOf('/portal') !== -1) return 'demo';
            if (href.indexOf('/av-production') !== -1) return 'av-specs';
            if (href.indexOf('/event-organizers') !== -1) return 'organizers';
            if (href.indexOf('mailto:') === 0) return 'email';
        } else if ((el.getAttribute('onclick') || '').indexOf('Tawk_API') !== -1) {
            return 'open-chat';
        }
        return null;
    }

    document.addEventListener('click', function (e) {
        var el = e.target.closest('a, button');
        if (!el) return;
        var label = ctaLabel(el);
        if (!label) return;
        var area = el.closest('[id], section, article, header, footer, nav');
        track('cta_click', {
            cta: label,
            section: area ? (area.id || area.tagName.toLowerCase()) : 'page',
            link_url: el.getAttribute('href') || undefined
        });
    });

    // Vimeo embeds: subscribe to the player's postMessage events (no Vimeo library needed).
    var vimeoFrames = [];
    var vimeoState = {};
    function vimeoId(src) {
        var m = /player\.vimeo\.com\/video\/(\d+)/.exec(src || '');
        return m ? m[1] : null;
    }
    function vimeoSubscribe(frame) {
        ['play', 'playProgress', 'finish'].forEach(function (evt) {
            try {
                frame.contentWindow.postMessage(JSON.stringify({ method: 'addEventListener', value: evt }), 'https://player.vimeo.com');
            } catch (err) {}
        });
    }
    function initVimeo() {
        var frames = document.querySelectorAll('iframe[src*="player.vimeo.com/video/"]');
        Array.prototype.forEach.call(frames, function (frame) {
            var id = vimeoId(frame.src);
            if (!id || vimeoFrames.indexOf(frame) !== -1) return;
            vimeoFrames.push(frame);
            vimeoState[id] = { played: false, ended: false, milestones: {} };
            frame.addEventListener('load', function () { vimeoSubscribe(frame); });
            vimeoSubscribe(frame);
        });
    }
    window.addEventListener('message', function (e) {
        if (e.origin !== 'https://player.vimeo.com') return;
        var data = e.data;
        if (typeof data === 'string') { try { data = JSON.parse(data); } catch (err) { return; } }
        if (!data || !data.event) return;
        var frame = vimeoFrames.filter(function (f) { return f.contentWindow === e.source; })[0];
        if (!frame) return;
        if (data.event === 'ready') { vimeoSubscribe(frame); return; }
        var id = vimeoId(frame.src);
        var st = vimeoState[id];
        var base = { video_provider: 'vimeo', video_id: id, video_title: frame.getAttribute('title') || undefined };
        if (data.event === 'play' && !st.played) {
            st.played = true;
            track('video_start', base);
        } else if (data.event === 'playProgress' && data.data && data.data.percent != null) {
            [25, 50, 75].forEach(function (pct) {
                if (data.data.percent * 100 >= pct && !st.milestones[pct]) {
                    st.milestones[pct] = true;
                    track('video_progress', Object.assign({ video_percent: pct }, base));
                }
            });
        } else if (data.event === 'finish' && !st.ended) {
            st.ended = true;
            track('video_complete', base);
        }
    });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initVimeo);
    else initVimeo();

    window.Tawk_API = window.Tawk_API || {};
    var prevChatStarted = window.Tawk_API.onChatStarted;
    window.Tawk_API.onChatStarted = function () {
        if (prevChatStarted) prevChatStarted.apply(this, arguments);
        track('chat_started');
    };
})();
