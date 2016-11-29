class RuleTable {
    constructor ($dom, options) {
        this.$el = $dom;
        this.options = options || {};

        this.initElement();
    }

    initElement () {

        this.initEvent();
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