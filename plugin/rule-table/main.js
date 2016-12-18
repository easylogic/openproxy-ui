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

    addRule (item) {
        this.rules.push(item);
    }

    load () {
        super.load();

        this.initRules();

        let that = this;
        let groups = this.get('rule_table') || [];

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
            return session.url().match(new RegExp(rule.source, "ig"));
        }

        return false;
    }

    applyRule (rule, session) {
        console.log(rule);
        session.change(rule);
    }

    beforeRequest (session) {

        console.log(session.url());

        for(var i = 0 , len = this.rules.length; i < len; i++) {
            let rule = this.rules[i];

            if (this.matchRule(rule, session)) {
                this.applyRule(rule, session);
                break;
            }
        }

    }

}

module.exports = RuleTable;