var Base = requireBaseModule();

var Duplicate = function(bot) {
    Base.call(this, bot);

    var Links = this.registerModel('Links', {
        link: String,
        username: String,
        channel: String
    });
    this.hear(/((https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, (response) => {
        var link = response.match[1];
        var username = response.user.username;
        var channel = response.channel.name;
        var whitelist = ['random', 'general', 'aleatorio', 'r2d3-dev'];
        if (whitelist.indexOf(channel) === -1) {
            response.allowPropagation();
        } else {
            Links.findOne({
                link: link
            }, (err, result) => {
                if (!err) {
                    if (result) {
                        if (username === result.username && channel !== result.channel) {
                            response.reply(`Old! *Você mesmo* já postou este link no #${result.channel}! :snail:`);
                        } else if (username === result.username && channel === result.channel) {
                            response.reply(`Old! *Você mesmo* já postou este link aqui! :snail:`);
                        } else if (username !== result.username && channel === result.channel) {
                            response.reply(`Old! ${this.getMentionTagForUser(result.username)} ja postou este link aqui! :snail:`);
                        } else {
                            response.reply(`Old! ${this.getMentionTagForUser(result.username)} ja postou este link no #${result.channel}! :snail:`);
                        }
                    } else {
                        Links.create({
                            link: link,
                            username: username,
                            channel: channel
                        });
                    }
                }
            });
        }
    });
};

module.exports = Base.setup(Duplicate);
