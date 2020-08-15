module.exports = ({req}) => {
    return `

    <div>
    Your id is ${req.session.userId}
    <form method = "POST">
    <input name="email" placeholder="email">
    <input name = "password" placeholder ="pass">
    <input name = "passwordConfirmation" placeholder ="pass confirm">
    <button type  = "submit">Submit</button>
    </form>
    </div>
    
    `;
}