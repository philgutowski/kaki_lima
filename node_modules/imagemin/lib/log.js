var colors = require('colors');

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});
var log = {
    wordlist: function(lists) {
        var m = '\n';
        lists.forEach(function(l) {
            m += l + '\n'
        });
        return m;
    },
    log: function(msg) {
        var lines = msg.split(/\n/);
        var reg = /\[(.*?)\]\((.*?)\)/g;
        lines.map(function(line) {
            // console.log(line);
            var m = line.replace(reg, function(match, _1, _2, l) {
                var c = _2.split('.');
                var back = _1;
                c.map(function(v) {
                    back = back[v];
                });
                return back;
            });
            console.log(m)
        });
    },
    write: function(txt) {
        process.stdout.write(txt);
        return this;
    },
    writeln: function(txt) {
        return this.write(txt + '\n');
    },
    error: function(msg) {
        msg = 'imgmin ' + 'ERR!'.error + ' ' + msg;
        return this.writeln(msg);
    },
    note: function(msg) {
        msg = 'imgmin ' + 'note'.info + ' ' + msg;
        return this.writeln(msg);
    },
    
    warn: function(msg) {
        msg = 'imgmin ' + 'WARN'.warn + ' ' + msg;
        return this.writeln(msg);
    }
};

module.exports = log;