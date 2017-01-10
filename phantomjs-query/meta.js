
module.exports = {
    url: {
        description: 'URL to scrape',
        example: 'http://stackoverflow.com',
    },
    selector: {
        description: 'element CSS selector',
        example: '#hlogo'
    },
    query: {
        default: 'first',
        description: 'elements to select',
        options: ['first', 'last', 'all']
    },
    type: {
        default: 'text',
        description: 'element property type',
        options: ['text', 'html']
    },
    allowDomain: {
        required: false,
        description: 'only allowed resource domain',
        example: 'stackoverflow.com'
    },
    output: {
        default: 'plain',
        description: 'output content',
        options: ['plain', 'json']
    },
    format: {
        default: 'plain',
        description: 'output format',
        options: ['plain', 'indent']
    },
    limit: {
        required: false,
        type: 'integer',
        description: 'maximum number of elements',
        example: 10
    },
    level: {
        required: false,
        description: 'logging level',
        options: ['debug', 'info', 'warn', 'error']
    },
    debug: {
        default: false,
        description: 'logging of query in PhantomJS'
    }
};
