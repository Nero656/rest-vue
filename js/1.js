let f = async (path, method = 'get', data = [], useToken = true, form = false)=>{
    mathod = method.toUpperCase();
    let options = {
        method: method,
        headers:{}
    }
    if (useToken)
    {
        options.headers['Authorization'] = `Bearer ${app.user.api_token}`;
    }
    if(!form){
        options.headers['Content-Type']='application/json';
        if(method === 'POST'){
            options.body = JSON.stringify(data)
        }
    }else{
        let formData = new FormData();

        for (let name in data){
            formData.append(name, data[name]);
        }
        options.body = formData;
    }
    let result = await fetch(`${host}${path}`, options);

    if (method === "DELETE"){
        return true;
    }else {
        return await result.json();
    }
}
let app = new Vue({
    el : "#shop",

    signup: {
        errors: [],
        fields: {
            fio: '',
            email: '',
            password: '',
        }
    },
    data: {
        regForm: true,
        products: [],

    },

    methods:{
        StorePage(){
            localStorage.setItem('page',this.page);
        },
        StoreToken()
        {
            localStorage.setItem('api_token', this.user.api_token);
        },
        async loadStore() {
            this.user.api_token = localStorage.getItem('api_token') || null;
            this.page = localStorage.getItem('page') || 'home';
            if (!this.user.api_token && !['login', 'signup'].includes(this.page)) {
                this.page('login');
            }else{
                await this.getAll();
                if (!this.updatePanel.id && this.page === 'update'){
                    this.go('home');
                }
            }
            if (this.home.select_products.lenght === 0 && this.page === "share"){
                this.go('home');
            }
        },
        async signIn(){
            let result = await f('/','post', this.login.fields, false);
            if (result.api_token){
                this.user.api_token = result.api_token;
                this.StorePage();
                await this.getAll();
                this.go('home');
            }else{
                this.login.errors = result;
            }
        }
    },
     async mounted() {
         this.products = await f('get','products');
    },
})
app.loadStore();




























const host = 'http://fmn.web.tomtit.tomsk.ru/api/';
const bearerToken = '';

let f = async(method,url,body = null)=>
{
    let options={
        method,
        headers: new Headers(),
    };

    if(bearerToken){
        options.headers.append('Content-Type','Aplication/json');
        options.body= JSON.stringify(body);
    }

    const result = await fetch(host+url, options);
    return await result.json();
}


let app = new Vue({
    el : "#shop",

    data: {
        regForm: true,
        products: [],
        reg:{
            errors: [],
            fields: {
                fio: '',
                email: '',
                password: '',
            }
        }
    },

    methods:{
        async Reg() {
            let result = await f('/login', 'post', this.reg)
        },
    },
    async mounted() {
        this.products = await f('get','products');
        // this.user = await  f('get','signup')
    },
})



