const MarkdownItContainer = require('markdown-it-container');

const vueMarkdown = {
    preprocess: (MarkdownIt, source) => {
        return source;
    },
    // 定制自定义块解析器 ::: demo :::
    use: [
        [
            MarkdownItContainer,
            'demo',
            {
                validate: params => params.trim().match(/^demo\s*(.*)$/),

                render: (tokens, idx) => {
                    let m = tokens[idx].info.trim().match(/^demo\s+(.*)$/);

                    if (tokens[idx].nesting === 1) {
                        let content = tokens[idx + 1].content; // :::demo块里的内容
                        let description = m && m.length > 1 ? m[1] : '';
                        return `<demo-block>
                    <div class='demo' slot='demo'>${content}</div>
                    <div class='description' slot='description'>${description}</div>
                    <div class='highlight' slot='source'>`;
                    }
                    return '</div></demo-block>\n';
                }
            }
        ]
    ]
};

module.exports = vueMarkdown;
