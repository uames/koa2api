'use strict';
const BUILD_REV = '9f208893f0cac6cf12b178624a501d5d0b0417d7',
      prefetch = [
        '/','/html/test-serviceworker.html'
      ].map((a) => new URL(a, location)), redirect = [[/^\/docs\/4\.(.*)/, '/docs/4.17.4',
            302], [/^\/docs\/4/, '/docs/4.17.4', 302], [/^\/docs\/3\.(.*)/, '/docs/3.10.1', 302], [/^\/docs\/3/,
            '/docs/3.10.1', 302], [/^\/docs\/2\.(.*)/, '/docs/2.4.2', 302], [/^\/docs\/2/, '/docs/2.4.2', 302], [
            /^\/docs\/1\.(.*)/, 'https://github.com/lodash/lodash/blob/1.3.1/doc/README.md', 301], [/^\/docs\/1/,
            'https://github.com/lodash/lodash/blob/1.3.1/doc/README.md', 301], [/^\/docs(?:\/.|\/?$)/, '/docs/4.17.4',
            200], [/^\/license/, 'https://raw.githubusercontent.com/lodash/lodash/4.17.4/LICENSE', 301], [
            /^\/fx_bug_1319846(?:\/.|\/?$)/, '/docs/4.17.4', 200]].map((a) => (a[1] = new URL(a[1], location), a)),
    reHtml = /(?:(\/)index)?\.html$/, reSplat = /:splat\b/;
 
function isRedirect(a) {
    return 301 === a || 302 === a || 303 === a || 307 === a || 308 === a
}
function put(a, b, c) {
    const d = b instanceof Request, e = new URL(d ? b.url : b);
    if (reHtml.test(e.pathname)) {
        const f = new URL(e);
        f.pathname = f.pathname.replace(reHtml, '$1'), a.put(new Request(f, d ? b : void 0), c.clone())
    }
    return a.put(b, c)
}
addEventListener('install', (a) => a.waitUntil(Promise.all([skipWaiting(), caches.open(BUILD_REV).then((a) => Promise
        .all(prefetch.map((b) => fetch(b).then((c) => c.ok && put(a, b, c)).
    catch ((a) => console.log(`prefetch failed: $ {
        b
    }`, a)))))]))), addEventListener('activate', (a) => a.waitUntil(Promise.all([clients.claim(), caches.keys().then((
        a) => Promise.all(a.map((a) => a == BUILD_REV || caches.delete(a))))]))), addEventListener('fetch', (a) => {
    const {
        request: b
    } = a, c = new URL(b.url);
    a.respondWith(caches.open(BUILD_REV).then((a) => a.match(b).then((d) => {
        if (d) return d;
        if (c.origin == location.origin) for (let {
                0: b,
                1: d,
                2: e
            }
            of redirect) {
                const f = b.exec(c.pathname), g = d.search || c.search, h = f ? f[1] : void 0;
                if (e = isRedirect(e) ? e : 302, void 0 === h ? !d.search && g && (d = new URL(d.pathname + g, location)) :
                    d = new URL(d.pathname.replace(reSplat, h) + g, location), f) {
                    if (c.href != d.href) {
                        const b = Response.redirect(d, e);
                        return /fx_bug_1319846/.test(c.href) && put(a, c, b.clone()), b
                    }
                    break
                }
        } else if (!prefetch.find(({
            href: a
        }) => a == c.href)) return fetch(b);
        return fetch(b).then((c) => {
            return c.ok && put(a, b, c.clone()), c
        })
    }).
    catch ((a) => {
        return console.log(`fetch failed: $ {
            c
        }`, a), new Response(new Blob(), {
            status: 400,
            statusText: 'Bad Request'
        })
    })))
});
