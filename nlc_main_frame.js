function    isMobile            (known_agents)  { let navigatorAgent = navigator.userAgent.toLowerCase(); return known_agents.some(agent => -1 !== navigatorAgent.indexOf(agent.toLowerCase())) || ('ontouchstart' in window); }
function    reloadIFrame        (elementId)     {
    const iframe = document.getElementById(elementId);
    if (iframe)
        iframe.src = iframe.src; // Reloads the iframe by setting its source again
}
function    initPage            () {
    const               MOBILE_USER_AGENTS      = ['Mobile', 'Android', 'iPhone', 'iPad'];
    console.log(isMobile(MOBILE_USER_AGENTS));
    let                 menu_action_iframe      = "iframe_main";
    menuItemRows    = buildMenuItemRows(menu_action_iframe, MAIN_FRAME_FORMS);
    document.getElementById("menu_table").innerHTML += menuItemRows;
    menuItemSelect(MAIN_FRAME_FORMS, 0);
}