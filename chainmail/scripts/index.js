document.addEventListener("DOMContentLoaded", function() {
    const chainmailLogic = new ChainmailLogic();
    
    // These numbers are arbitrary but get us to a nice "square" 9x9
    for(var i = 0; i < 9; i++) {
        chainmailLogic.AddColumn();
    }
    
    for(var i = 0; i < 7; i++) {
        chainmailLogic.AddRow();
    }
    
    FormLogic.RegisterEventListeners();
});
