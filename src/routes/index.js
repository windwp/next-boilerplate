const routes = require("next-routes")();

module.exports = routes;
const APP_ROUTES = [{
    page: 'home',
    pattern: '/home'
}
]

APP_ROUTES.forEach(route => routes.add(route))