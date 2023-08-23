class StringFormatter {
    static format(template, ...args) {
        return template.replace(/\{\}/g, () => args.shift());
    }
}

module.exports = StringFormatter;