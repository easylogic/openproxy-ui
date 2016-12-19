const electron = require('electron');
const app = electron.app;
const MainPlugin = require('../../lib/MainPlugin');

class RuleTable extends MainPlugin {
    constructor (app) {
        super({
            name : 'rule-table'
        })
    }

    initRules () {
        this.rules = [];
    }

    addRule (rule) {

        if (rule.type == 'pattern') {
            rule.pattern = new RegExp(rule.source, "ig");
        }

        this.rules.push(rule);
    }

    load () {
        super.load();

        this.initRules();

        let that = this;
        let groups = this.get('rule_table') || [];

        groups = groups.filter(function (group) {
            return !!group;
        });

        for(var i = 0, len = groups.length; i <len; i++ ) {
            let group = groups[i];

            group.rules.forEach(function (item) {
                that.addRule(item);
            })
        }

    }

    matchRule (rule, session) {
        if (rule.type == 'host') {
            return session.hostnameIs(rule.source);
        } else if (rule.type == 'url') {
            return session.urlContains(rule.source);
        } else if (rule.type == 'pattern') {
            return session.urlMatch(rule.pattern);
        }

        return false;
    }

    applyRule (rule, match, session) {

        session.change(rule, match);
    }

    beforeRequest (session) {
        for(var i = 0 , len = this.rules.length; i < len; i++) {
            let rule = this.rules[i];

            if (rule.checked === false) {
                continue;
            }

            var match =  false;
            if (match = this.matchRule(rule, session)) {
                this.applyRule(rule, match,  session);
                break;
            }
        }

    }

}

module.exports = RuleTable;