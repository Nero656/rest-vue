const host = 'http://fmn.web.tomtit.tomsk.ru/api/';

let f = async (method, url, body = null, bearerToken = null) => {
    let options = {
        method,
        headers: new Headers(),
    };

    if (bearerToken) {
        options.headers.append('Authorization', 'Bearer ' + bearerToken);
    }


    if (body) {
        options.headers.append('Content-Type', 'application/json');
        options.body = JSON.stringify(body);
    }

    const result = await fetch(host + url, options);
    return await result.json();
}


let app = new Vue({
    el: "#shop",
    data: {
        isAuth: false,
        error: false,
        errorEmail: false,
        successfulAuth: false,
        productList: true,
        authForm: false,
        regForm: false,
        product: false,
        basketList: false,
        orderList: false,
        productPage: '',
        products: [],
        SaveToken: '',
        reg: {
            fio: "",
            email: "",
            password: "",
        },
        auth: {
            email: "",
            password: "",
        },
        token: '',
        username: "",
        // basketList: '',
        basket: [],
        orders: [],
    },
    async mounted() {
        if(localStorage.token) this.token = localStorage.token;
        if(localStorage.name) this.username = localStorage.name;
        if(localStorage.isAuth) this.isAuth = localStorage.isAuth;

        if (localStorage.getItem('basket')) {
            try {
                this.basket = JSON.parse(localStorage.getItem('basket'));
            } catch(e) {
                localStorage.removeItem('basket');
            }
        }
        if (localStorage.getItem('orders')) {
            try {
                this.orders = JSON.parse(localStorage.getItem('orders'));
            } catch(e) {
                localStorage.removeItem('orders');
            }
        }
    },
    methods: {
        mainVoid: function () {
            this.productList = true;
            this.authForm = false;
            this.regForm = false;
            this.product = false
            this.basketList = false;
            this.orderList = false;
        },

        ordersVoid: function () {
            this.productList = false;
            this.authForm = false;
            this.regForm = false;
            this.product = false
            this.basketList = false;
            this.orderList = true;
        },

        basketVoid: function () {
            this.productList = false;
            this.authForm = false;
            this.regForm = false;
            this.product = false;
            this.basketList = true;
            this.orderList = false;
        },

        authVoid: function () {
            this.productList = false;
            this.product = false
            this.authForm = false;
            this.regForm = true;
            this.basketList = false;
            this.orderList = false;
        },

        regVoid: function () {
            this.product = false
            this.productList = false;
            this.regForm = false;
            this.authForm = true;
            this.basketList = false;
            this.orderList = false;
        },


        async authMeth() {
          if (!this.auth.email || !this.auth.password) {
                this.error = true;
            } else {
                this.error = false;
                let authCh = await f('post', 'login', this.auth);

                if (!authCh.message) {
                    this.errorEmail = false;
                    this.token = authCh.api_token;

                    this.productList = true;
                    this.authForm = false;
                    this.isAuth = true;
                    let authUser = await f('get', 'user', '', this.token);

                    localStorage.name = this.username = authUser.fio;
                    localStorage.token = this.token;
                    localStorage.isAuth = this.isAuth;

                    this.orders = await f('get', 'order', '', this.token);

                    this.basket = await f('get', 'cart', '', this.token);
                    this.saveItems()
                } else {
                    this.errorEmail = true;
                }
            }
        },

        async getProduct(index) {
            index += 1;
            this.productPage = await f('get', 'products/' + index);
            this.productList = false;
            this.product = true;
        },

        async regMeth() {
            if (!this.reg.fio || !this.reg.email || !this.reg.password) {
                this.error = true;
            } else {
                this.error = false;
                let result = await f('post', 'signup', this.reg);
                this.productList = true;
            }
        },

        async orderAdd() {
            this.orders = await f('post', 'order', '', this.token);
            this.orders = [];
            this.orders = await f('get', 'order', '', this.token);
        },

        async basketAdd(id) {
            this.basket = await f('post', 'cart/' + id, '', this.token);
            this.basket = [];
            this.basket = await f('get', 'cart', '', this.token);
            console.log(this.basket);
        },

        async basketDelete(id) {
            let de = await f('delete', 'cart/' + id, '', this.token);
            this.basket = [];
            this.basket = await f('get', 'cart', '', this.token);
        },

        async Exit() {
            let result = await f('post', 'logout', '', this.token);
            this.productList = true;
            this.isAuth = false;
            localStorage.name = '';
            localStorage.token = '';
            localStorage.isAuth = '';
        },

        saveItems() {
            const parsed = JSON.stringify(this.basket);
            localStorage.setItem('basket', parsed);
            const orders = JSON.stringify(this.orders);
            localStorage.setItem('orders', orders);
        },
    },

    async created() {
        this.products = await f('get', 'products');
        // this.basket = await f('get', 'cart', '', this.token);
    },
})



