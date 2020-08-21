const layout = require("../layout");

const {getError} = require('../../helpers');

module.exports = (errors)=>{
    return layout({content:`
    <div>
    <form method = "POST">
    <input name="email" placeholder="email">
    ${getError(errors,'email')}
    <input name = "password" placeholder ="pass">
    ${getError(errors,'password')}
    <button type  = "submit">Sign In</button>
    </form>
    </div>
    `});
}

