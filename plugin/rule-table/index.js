class RuleTable {
    constructor (options) {
        this.options = options || {};

        this.initElement();
    }

    initElement () {

        this.$el = $("<div />").addClass('content-item plugin-rule-table');

        let $group_list = $("<div class='group-list' />");

        this.$group_toolbar = $("<div class='group-toolbar' />");
        $group_list.append(this.$group_toolbar);
        let $policy_table = $("<div class='policy-table' />");

        this.$policy_toolbar = $("<div class='policy-toolbar' />");
        $policy_table.append(this.$policy_toolbar);


        this.$el.append($group_list);
        this.$el.append($policy_table);

        // rule list

        this.initEvent();
    }

    initTitle () {

    }

    initEvent() {
        $(".policy-items").on("click", ".check-status", function (e) {
            e.preventDefault();
            if ($(this).hasClass('icon-checkbox')) {
                $(this).addClass('icon-checkbox2').removeClass('icon-checkbox');
            } else {
                $(this).addClass('icon-checkbox').removeClass('icon-checkbox2');
            }
        });
        $(".policy-items").on("click", ".icon-trashcan", function (e) {
            if (confirm("Delete a rule?")) {
                $(this).parent().parent().remove();
            }
            e.preventDefault();
            return;
        })
        $(".policy-items").on("click", "> .panel .head", function (e) {

            if ($(e.target)[0].tagName == 'I') {

            } else {
                $(".policy-items .panel.selected").removeClass('selected');
                $(this).parent().addClass('selected');
            }


        })
    }

    destroy () {

    }

    remove () {

    }

    refresh () {

    }

    render () {

    }
}

module.exports =  RuleTable;