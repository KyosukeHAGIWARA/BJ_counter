function template(strings, ...keys) {
    return (function (...values) {
        let result = [strings[0]];
        keys.forEach(function (key, i) {
            let value = values[key];
            result.push(value, strings[i + 1]);
        });
        return result.join('');
    });
}

const irc_list = [0, 0, -4, 0, -12, 0, -20, 0, -28];
const key_count_list = [0, 2, 1, 0, -2, 0, -4, 0, -6];
const app = new Vue({
    el: '#app',
    data: {
        message: 'So-So',
        card_counter: 0,
        running_counter: 0,
        key_count: 0,
        card_num: 0,
        deck_num: 4,
        use_amount: 0.5,
        x1: 10,
        w_tick: 1,
        indicator_end: 10,
        indicator_d: "M 10 10 H 10 10",
        fill_rgba: "rgba(255, 0, 0, 0.5)",
    },
    methods: {
        init_counter: function (deck_num) {
            // alert("aaa");
            this.running_counter = irc_list[deck_num];
            this.key_count = key_count_list[deck_num];

            this.card_counter = 0;
            this.card_num = 52 * deck_num * this.use_amount + 20;
            this.deck_num = deck_num;

            this.indicator_end = 3 * deck_num + 2;
            this.w_tick = Math.floor(100 / this.indicator_end);

            this.judge();
            this.indicator_draw();
        },
        card_draw: function (cnt) {
            this.card_counter += 1;
            this.card_num -= 1;
            this.running_counter += cnt;
            this.judge();
            this.indicator_draw();

            if (this.card_num === 0) {
                this.init_counter(this.deck_num);
            }

        },
        judge: function () {
            const diff = this.running_counter - this.key_count;
            if (diff < -1) this.message = "Wait! Wait!";
            else if (diff > 1) this.message = "Bet!! Bet!!";
            else this.message = "So-So";
        },
        indicator_draw: function () {
            const diff = this.running_counter - this.key_count;
            this.indicator_d = "M 100 10 L " + (100 + this.w_tick * diff) + " 10";

            let ind_color = diff < 0 ? template `rgba(255, 99, 71, ${0})` : template `rgba(60, 179, 113, ${0})`;
            this.fill_rgba = ind_color(0.5 + Math.abs(diff) / (2 * this.indicator_end));
        }
    }
});

// キー入力検知
document.onkeydown = function (e) {
    console.log(e.key);
    if (e.key === 'a') app.card_draw(1); //up
    else if (e.key === 's') app.card_draw(0); //up
    else if (e.key === 'd') app.card_draw(-1); //up
    else if (e.key === 'Enter') {
        const dn = app.deck_num;
        console.log(dn);
        app.init_counter(dn); //up
    }
    // else if (e.keyCode == 37) vm.keydownFn(false, -1, 0); //left
    // else if (e.keyCode == 40) vm.keydownFn(false, 0, 1); //down
    // else if (e.keyCode == 39) vm.keydownFn(false, 1, 0); //right
};

//ロード時にカウンターをイニシャライズ
document.onload = app.init_counter(4);

// /* ピッチインピッチアウトによる拡大縮小を禁止 */
// document.documentElement.addEventListener('touchstart', function (e) {
//     if (e.touches.length >= 2) {e.preventDefault();}
// }, {passive: false});
/* ダブルタップによる拡大を禁止 */
var t = 0;
document.documentElement.addEventListener('touchend', function (e) {
    var now = new Date().getTime();
    if ((now - t) < 150) {
        e.preventDefault();
    }
    t = now;
}, false);