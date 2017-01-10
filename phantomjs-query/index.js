
const assert = require('assert');
const phantom = require('phantom');
const lodash = require('lodash');
const logger = require('winston');
const reduceMetas = require('./reduceMetas')
const propsMeta = require('./meta');

module.exports = params => main(reduceMetas(params, propsMeta));

const onResourceRequestedAllowDomain = function(requestData, networkRequest, allowDomain) {
    console.log('allowDomain', allowDomain);
    var match = (requestData.url.match(/\/\/([^\/]+)\/.*\/([^\/]+)$/) || []);
    var domain = match[1];
    var file = match[2];
    if (!domain.endsWith(allowDomain)) {
        console.log('abort domain', domain);
        networkRequest.abort();
    } else if (file.match(/\.(gif|tif|tiff|png|jpeg|jpg|css|mp[3-4])$/i)) {
        console.log('abort media', file);
        networkRequest.abort();
    } else if (!file.match(/\.(html|htm|js)$/i)) {
        console.log('file', domain, file);
    }
};

const querySelector = function(props) {
    console.log('querySelector', props);
    if (props.query === 'first') {
        var element = document.querySelector(props.selector);
        if (element) {
            if (props.type === 'text') {
                var text = element.textContent.trim();
                if (text.length) {
                    return text;
                }
            } else if (props.type === 'html') {
                return element.innerHTML.trim();
            }
        }
    } else if (props.query === 'all') {
        var elements = document.querySelectorAll(props.selector);
        if (elements) {
            const results = [];
            const limit = props.limit && props.limit > 0?
            Math.min(props.limit, elements.length)
            : elements.length;
            for (var i = 0; i < limit; i++) {
                const element = elements[i];
                if (props.type === 'text') {
                    results.push(element.textContent.trim());
                } else if (props.type === 'html') {
                    results.push(element.innerHTML.trim());
                }
            }
            if (props.limit > 0 && results.length > props.limit) {
                return results.slice(0, props.limit);
            } else {
                return results;
            }
        }
    } else if (props.query === 'last') {
        var elements = document.querySelectorAll(props.selector);
        if (elements) {
            const results = [];
            for (var i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (props.type === 'text') {
                    results.push(element.textContent.trim());
                } else if (props.type === 'html') {
                    results.push(element.innerHTML.trim());
                }
            }
            if (results.length > 0) {
                return results[results.length - 1];
            }
        }
        return [];
    }
};

async function main(props) {
    const instance = await phantom.create([], {
        logger: props.debug? logger: {}
    });
    const page = await instance.createPage();
    try {
        if (props.allowDomain) {
            page.property('onResourceRequested', onResourceRequestedAllowDomain, props.allowDomain);
        }
        const status = await page.open(props.url);
        assert.equal(status, 'success');
        const content = await page.property('content');
        const results = await page.evaluate(querySelector, props);
        if (props.output === 'json') {
            if (props.format === 'indent') {
                console.log(JSON.stringify(results, null, 2));
            } else {
                console.log(JSON.stringify(results));
            }
        } else if (lodash.isArray(results)) {
            results.forEach(result => console.log(result));
        } else {
            console.log(results);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await instance.exit();
    }
}
