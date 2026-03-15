(function () {
    const body = document.body;
    const DURATION_MS = 250;
    const INCOMING_KEY = 'incoming';
    const SKIP_ENTER_ANIMATION_KEY = 'page-skip-enter-animation';
    const PJAX_CONTAINER_SELECTOR = 'main.container.page-shell';
    const PJAX_SCRIPT_ATTR = 'data-pjax-script';
    const PJAX_SCRIPT_CONTAINER_ID = 'pjax-scripts';
    const ENTER_CLASSES = [
        'page-enter-from-right',
        'page-enter-from-left',
        'page-enter-from-bottom',
        'page-enter-from-top'
    ];

    if (!body) {
        return;
    }

    function applyIncomingTransition() {
        if (sessionStorage.getItem(SKIP_ENTER_ANIMATION_KEY) === '1') {
            sessionStorage.removeItem(SKIP_ENTER_ANIMATION_KEY);
            sessionStorage.removeItem(INCOMING_KEY);
            body.classList.remove(
                'page-enter-none',
                'page-enter-from-right',
                'page-enter-from-left',
                'page-enter-from-bottom',
                'page-enter-from-top'
            );
            body.style.opacity = '1';
            body.style.transform = '';
            return;
        }

        const incoming = sessionStorage.getItem(INCOMING_KEY) || 'right';
        sessionStorage.removeItem(INCOMING_KEY);

        let enterClass = 'page-enter-from-right';
        if (incoming === 'left') {
            enterClass = 'page-enter-from-left';
        } else if (incoming === 'bottom') {
            enterClass = 'page-enter-from-bottom';
        } else if (incoming === 'top') {
            enterClass = 'page-enter-from-top';
        }

        const cleanupEnter = function () {
            body.classList.remove(
                'page-enter-from-right',
                'page-enter-from-left',
                'page-enter-from-bottom',
                'page-enter-from-top'
            );
            body.style.opacity = '1';
            body.style.transform = '';
            body.removeEventListener('animationend', onEnterAnimationEnd);
        };

        const onEnterAnimationEnd = function (event) {
            if (event.target !== body) {
                return;
            }

            if (!ENTER_CLASSES.includes(enterClass)) {
                return;
            }

            cleanupEnter();
        };

        document.documentElement.style.visibility = '';
        
        body.classList.add(enterClass);
        body.addEventListener('animationend', onEnterAnimationEnd);
        window.setTimeout(cleanupEnter, DURATION_MS + 50);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyIncomingTransition, { once: true });
    } else {
        applyIncomingTransition();
    }

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    function resetBodyState() {
        body.classList.remove(
            'page-leaving',
            'page-leaving-right',
            'page-leaving-up',
            'page-leaving-down',
            'page-enter-from-right',
            'page-enter-from-left',
            'page-enter-from-bottom',
            'page-enter-from-top',
            'page-enter-none'
        );
        body.style.opacity = '1';
        body.style.transform = '';
    }

    function applyEnterTransition(transitionType) {
        let enterClass = 'page-enter-from-right';
        if (transitionType === 'back') {
            enterClass = 'page-enter-from-left';
        } else if (transitionType === 'up') {
            enterClass = 'page-enter-from-bottom';
        } else if (transitionType === 'down') {
            enterClass = 'page-enter-from-top';
        }

        const cleanupEnter = function () {
            body.classList.remove(
                'page-enter-from-right',
                'page-enter-from-left',
                'page-enter-from-bottom',
                'page-enter-from-top'
            );
            body.style.opacity = '1';
            body.style.transform = '';
            body.removeEventListener('animationend', onEnterAnimationEnd);
        };

        const onEnterAnimationEnd = function (event) {
            if (event.target !== body) {
                return;
            }

            if (!ENTER_CLASSES.includes(enterClass)) {
                return;
            }

            cleanupEnter();
        };

        document.documentElement.style.visibility = '';
        resetBodyState();
        body.classList.add(enterClass);
        body.addEventListener('animationend', onEnterAnimationEnd);
        window.setTimeout(cleanupEnter, DURATION_MS + 50);
    }

    function shouldSkipPjax(element) {
        return element && element.hasAttribute('data-no-pjax');
    }

    function getRootPrefix() {
        const path = window.location.pathname || '';
        if (path.includes('/src/actions/')) {
            return '../../';
        }
        if (path.includes('/pages/') || path.includes('/auth/')) {
            return '../';
        }
        return '';
    }

    function resolveFormAction(rawAction) {
        const action = (rawAction || '').trim();
        if (!action) {
            return window.location.href;
        }

        if (/^(https?:)?\/\//i.test(action) || action.startsWith('/')) {
            return action;
        }

        if (action.startsWith('./') || action.startsWith('../')) {
            return action;
        }

        if (!action.includes('/')) {
            return action;
        }

        return getRootPrefix() + action;
    }

    function isHashOnlyNavigation(url) {
        try {
            const target = new URL(url, window.location.href);
            const current = new URL(window.location.href);
            return (
                target.origin === current.origin &&
                target.pathname === current.pathname &&
                target.search === current.search &&
                target.hash &&
                target.hash !== current.hash
            );
        } catch (error) {
            return false;
        }
    }

    function normalizeFetchUrl(url) {
        const target = new URL(url, window.location.href);
        target.hash = '';
        return target.toString();
    }

    function updateMetaFromDoc(doc) {
        const newCsrf = doc.querySelector('meta[name="_csrf"]');
        const currentCsrf = document.querySelector('meta[name="_csrf"]');
        if (newCsrf) {
            if (currentCsrf) {
                currentCsrf.setAttribute('content', newCsrf.getAttribute('content') || '');
            } else {
                document.head.appendChild(document.importNode(newCsrf, true));
            }
        } else if (currentCsrf) {
            currentCsrf.remove();
        }
    }

    function syncHeaderFromDoc(doc) {
        const newNav = doc.getElementById('vertical-nav-buttons');
        const currentNav = document.getElementById('vertical-nav-buttons');
        if (newNav && currentNav) {
            currentNav.dataset.loggedIn = newNav.dataset.loggedIn || 'false';
        }

        const newHiddenToggle = doc.getElementById('hidden-theme-toggle');
        const currentHiddenToggle = document.getElementById('hidden-theme-toggle');
        const newHiddenContainer = newHiddenToggle ? newHiddenToggle.parentElement : null;
        const currentHiddenContainer = currentHiddenToggle ? currentHiddenToggle.parentElement : null;

        if (newHiddenContainer && currentHiddenContainer) {
            currentHiddenContainer.innerHTML = '';
            Array.from(newHiddenContainer.children).forEach(child => {
                currentHiddenContainer.appendChild(document.importNode(child, true));
            });
        }
    }

    function appendScriptNode(source, parent) {
        const script = document.createElement('script');
        if (source.type) {
            script.type = source.type;
        }
        if (source.noModule) {
            script.noModule = true;
        }
        if (source.src) {
            const absoluteSrc = new URL(source.src, window.location.href).toString();
            const existingSources = Array.from(document.querySelectorAll('script[src]')).map(tag => tag.src);
            if (existingSources.includes(absoluteSrc)) {
                return;
            }
            script.src = absoluteSrc;
            script.defer = source.defer;
            script.async = source.async;
        } else {
            script.textContent = source.textContent || '';
        }
        script.setAttribute(PJAX_SCRIPT_ATTR, '1');
        parent.appendChild(script);
    }

    function replacePageScripts(doc) {
        const existingContainer = document.getElementById(PJAX_SCRIPT_CONTAINER_ID);
        if (existingContainer) {
            existingContainer.remove();
        }

        const container = document.createElement('div');
        container.id = PJAX_SCRIPT_CONTAINER_ID;

        const page = doc.getElementById('page');
        const scripts = Array.from(doc.body.querySelectorAll('script'));
        scripts.forEach(script => {
            if (script.hasAttribute('data-no-pjax')) {
                return;
            }
            if (page && page.contains(script)) {
                return;
            }
            appendScriptNode(script, container);
        });

        document.body.appendChild(container);
    }

    function swapPageContent(doc) {
        const page = document.getElementById('page');
        const newPage = doc.getElementById('page');
        const currentMain = page ? page.querySelector(PJAX_CONTAINER_SELECTOR) : null;
        const newMain = newPage ? newPage.querySelector(PJAX_CONTAINER_SELECTOR) : null;

        if (!page || !currentMain || !newMain) {
            return false;
        }

        const mainScripts = Array.from(newMain.querySelectorAll('script'));
        mainScripts.forEach(script => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        });

        const importedMain = document.importNode(newMain, true);
        currentMain.replaceWith(importedMain);

        let sibling = importedMain.nextSibling;
        while (sibling) {
            const next = sibling.nextSibling;
            page.removeChild(sibling);
            sibling = next;
        }

        mainScripts.forEach(script => {
            appendScriptNode(script, page);
        });

        let node = newMain.nextSibling;
        while (node) {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SCRIPT') {
                appendScriptNode(node, page);
            } else {
                page.appendChild(document.importNode(node, true));
            }
            node = node.nextSibling;
        }

        return true;
    }

    async function handleResponseSwap(response, transitionType, options, fallbackUrl) {
        const settings = options || {};
        const contentType = response.headers.get('content-type') || '';
        if (!response.ok || !contentType.includes('text/html')) {
            window.location.href = fallbackUrl;
            return;
        }

        const finalUrl = response.url || fallbackUrl;
        if (settings.replaceState) {
            history.replaceState({ pjax: true }, '', finalUrl);
        } else if (settings.pushState !== false) {
            history.pushState({ pjax: true }, '', finalUrl);
        }

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        if (!swapPageContent(doc)) {
            window.location.href = finalUrl;
            return;
        }

        updateMetaFromDoc(doc);
        syncHeaderFromDoc(doc);
        replacePageScripts(doc);

        if (doc.title) {
            document.title = doc.title;
        }

        if (window.initPageWidgets) {
            window.initPageWidgets();
        } else if (window.mountRichTextEffects) {
            window.mountRichTextEffects();
        }

        if (window.initNotifications) {
            window.initNotifications();
        }

        const target = new URL(finalUrl, window.location.href);
        if (target.hash) {
            const el = document.querySelector(target.hash);
            if (el) {
                el.scrollIntoView({ behavior: 'instant', block: 'start' });
            }
        } else {
            window.scrollTo(0, 0);
        }

        applyEnterTransition(transitionType);
    }

    async function fetchAndSwap(url, transitionType, options) {
        const settings = options || {};
        if (isHashOnlyNavigation(url)) {
            window.location.hash = new URL(url, window.location.href).hash;
            return;
        }

        let response;
        try {
            response = await fetch(normalizeFetchUrl(url), {
                headers: { 'X-Requested-With': 'pjax' },
                credentials: 'same-origin'
            });
        } catch (error) {
            window.location.href = url;
            return;
        }

        await handleResponseSwap(response, transitionType, settings, url);
    }

    async function submitWithFetch(form, transitionType) {
        const method = (form.getAttribute('method') || 'GET').toUpperCase();
        const action = resolveFormAction(form.getAttribute('action'));
        const headers = { 'X-Requested-With': 'pjax' };
        let requestUrl = action;
        let fetchOptions = { method, headers, credentials: 'same-origin' };

        if (method === 'GET') {
            const formData = new FormData(form);
            const params = new URLSearchParams(formData);
            const target = new URL(action, window.location.href);
            target.search = params.toString();
            requestUrl = target.toString();
        } else {
            fetchOptions.body = new FormData(form);
        }

        let response;
        try {
            response = await fetch(requestUrl, fetchOptions);
        } catch (error) {
            form.submit();
            return;
        }

        await handleResponseSwap(response, transitionType, { pushState: true }, response.url || requestUrl);
    }

    function canInterceptLink(link) {
        if (!link || !link.href) {
            return false;
        }

        const href = link.getAttribute('href') || '';
        if (href.startsWith('#') || href.startsWith('javascript:')) {
            return false;
        }

        if (link.target === '_blank') {
            return false;
        }

        if (link.hasAttribute('download')) {
            return false;
        }

        let url;
        try {
            url = new URL(link.href, window.location.href);
        } catch (error) {
            return false;
        }

        if (url.origin !== window.location.origin) {
            return false;
        }

        return true;
    }

    function shouldSkipTransition(element) {
        if (!element) {
            return false;
        }

        if (element.hasAttribute('data-no-transition')) {
            return true;
        }

        const transitionValue = (element.getAttribute('data-transition') || '').trim();
        return transitionValue === 'none';
    }

    function getTransitionType(element) {
        if (!element) {
            return '';
        }

        const value = (element.getAttribute('data-transition') || '').trim();
        if (value === 'back' || value === 'up' || value === 'down') {
            return value;
        }

        return '';
    }

    function deriveTransitionType(element, fallbackType) {
        if (fallbackType) {
            return fallbackType;
        }

        if (element instanceof HTMLAnchorElement) {
            try {
                const url = new URL(element.href, window.location.href);
                const isFromEditPage = /post_manage\.php/i.test(window.location.pathname) && /[?&]action=edit/i.test(window.location.search);
                const isToUserPage = /user\.php/i.test(url.pathname);
                if (isFromEditPage && isToUserPage) {
                    return 'down';
                }
            } catch (error) {
                return '';
            }
        }

        return '';
    }

    function setIncomingDirection(transitionType) {
        if (transitionType === 'back') {
            sessionStorage.setItem(INCOMING_KEY, 'left');
        } else if (transitionType === 'up') {
            sessionStorage.setItem(INCOMING_KEY, 'bottom');
        } else if (transitionType === 'down') {
            sessionStorage.setItem(INCOMING_KEY, 'top');
        } else {
            sessionStorage.setItem(INCOMING_KEY, 'right');
        }
    }

    function leaveThen(transitionType, run) {
        if (
            body.classList.contains('page-leaving') ||
            body.classList.contains('page-leaving-right') ||
            body.classList.contains('page-leaving-up') ||
            body.classList.contains('page-leaving-down')
        ) {
            return;
        }

        body.classList.add('page-leaving');
        setIncomingDirection(transitionType);

        if (transitionType === 'back') {
            body.classList.add('page-leaving-right');
        } else if (transitionType === 'up') {
            body.classList.add('page-leaving-up');
        } else if (transitionType === 'down') {
            body.classList.add('page-leaving-down');
        }

        window.setTimeout(run, DURATION_MS);
    }

    document.addEventListener('click', function (event) {
        if (event.defaultPrevented || event.button !== 0) {
            return;
        }

        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        const link = event.target.closest('a');
        if (!canInterceptLink(link)) {
            return;
        }

        if (isHashOnlyNavigation(link.href)) {
            return;
        }

        const usePjax = !shouldSkipPjax(link);

        if (shouldSkipTransition(link) || !usePjax) {
            if (window.__persistLofiState) {
                window.__persistLofiState();
            }
            sessionStorage.setItem(SKIP_ENTER_ANIMATION_KEY, '1');
            sessionStorage.removeItem(INCOMING_KEY);
            return;
        }

        const transitionType = deriveTransitionType(link, getTransitionType(link));
        event.preventDefault();
        leaveThen(transitionType, function () {
            if (window.__persistLofiState) {
                window.__persistLofiState();
            }
            if (usePjax) {
                fetchAndSwap(link.href, transitionType, { pushState: true });
            } else {
                window.location.href = link.href;
            }
        });
    });

    document.addEventListener('submit', function (event) {
        const form = event.target;
        if (!(form instanceof HTMLFormElement)) {
            return;
        }

        if (form.dataset.transitioning === '1') {
            return;
        }

        const usePjax = !shouldSkipPjax(form);

        if (shouldSkipTransition(form) || !usePjax) {
            if (window.__persistLofiState) {
                window.__persistLofiState();
            }
            sessionStorage.setItem(SKIP_ENTER_ANIMATION_KEY, '1');
            sessionStorage.removeItem(INCOMING_KEY);
            return;
        }

        const transitionType = deriveTransitionType(form, getTransitionType(form));
        event.preventDefault();
        form.dataset.transitioning = '1';

        leaveThen(transitionType, function () {
            if (window.__persistLofiState) {
                window.__persistLofiState();
            }
            if (usePjax) {
                submitWithFetch(form, transitionType);
            } else {
                form.submit();
            }
        });
    }, true);

    window.addEventListener('pageshow', function (e) {
        if (!e.persisted) return;
        document.documentElement.classList.remove.apply(document.documentElement.classList, ENTER_CLASSES);
        body.classList.remove('page-leaving', 'page-leaving-right', 'page-leaving-up', 'page-leaving-down');
        body.classList.remove.apply(body.classList, ENTER_CLASSES);
        body.style.opacity = '1';
        body.style.transform = '';
    });

    window.addEventListener('popstate', function () {
        fetchAndSwap(window.location.href, 'back', { pushState: false });
    });
})();
