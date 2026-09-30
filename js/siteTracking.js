(function () {
    var GA_ID = 'G-632LHDVZTW';

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

    function track(name, params) {
        window.gtag('event', name, params || {});
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

    window.Tawk_API = window.Tawk_API || {};
    var prevChatStarted = window.Tawk_API.onChatStarted;
    window.Tawk_API.onChatStarted = function () {
        if (prevChatStarted) prevChatStarted.apply(this, arguments);
        track('chat_started');
    };
})();
