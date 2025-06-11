let menuItemColorSelected   = {back: "#00aedb", font: "#a0cee8"};
let menuItemColorHovered    = {back: "#00aedb", font: "#b0dee8"};
let menuItemColorIdle       = {back: "#204080", font: "#408edb"};
let menuItemPrefixes        = ["td_", "a_"];
let menuItemSelected        = 0;

function menuItemRefresh(menuItems, iButton) {
    let menuItemName    = menuItems[iButton];
    let isSelected      = iButton == menuItemSelected;
    for(let prefix in menuItemPrefixes){
        console.log(menuItemPrefixes[prefix] + menuItemName);
        let el          = document.getElementById(menuItemPrefixes[prefix] + menuItemName);
        el.style.backgroundColor    = isSelected ? menuItemColorSelected.back : menuItemColorIdle.back;
        el.style.color              = isSelected ? menuItemColorSelected.font : menuItemColorIdle.font;
    }
}
function menuItemSelect(menuItems, indexSelected) {
    menuItemSelected = indexSelected % menuItems.length;
    for(let iButton in menuItems)
        menuItemRefresh(menuItems, parseInt(iButton));
}
function menuItemHover(menuItems, indexHovered) {
    for(let iButton in menuItems) {
        let indexButton     = parseInt(iButton);
        let isHovered       = indexButton == indexHovered;
        if(false == isHovered) {
            menuItemRefresh(menuItems, indexButton);
            continue;
        }
        let menuItemName    = menuItems[iButton];
        let isSelected      = indexButton == menuItemSelected;
        for(let prefix in menuItemPrefixes){
            console.log(menuItemPrefixes[prefix] + menuItemName);
            let el          = document.getElementById(menuItemPrefixes[prefix] + menuItemName);
            el.style.backgroundColor    = isSelected ? menuItemColorSelected.back : menuItemColorHovered.back;
            el.style.color              = isSelected ? menuItemColorSelected.font : menuItemColorHovered.font;
        }
    }
}
function buildMenuItemRows(targetId, menuItemNames) {
    let menuItemRows = "<script>const MENUITEM_NAMES = ";
    menuItemNames.forEach((element, index) => { menuItemRows += index ? "," : "["; menuItemRows += `${element}`; });
    menuItemRows += "];</script>";
    for(let item in menuItemNames) {
        let                 menuItemName    = menuItemNames[item];
        let                 menuItemActions = `onmouseover="menuItemHover(MENUITEM_NAMES, ${item});" onmouseout="menuItemRefresh(MENUITEM_NAMES, ${item});" `;
        let                 menuItemHTML    = `<a onclick="menuItemSelect(MENUITEM_NAMES, ${item});" id="a_${menuItemName}" ${menuItemActions} target="${targetId}" href="/form/${menuItemName}" >${menuItemName.toUpperCase()}</a>`;
        menuItemRows    += `<tr style="height:24px;"><td onclick="menuItemSelect(MENUITEM_NAMES, ${item}); document.getElementById('a_${menuItemName}').click();" id="td_${menuItemName}" ${menuItemActions} >${menuItemHTML}</td></tr>`;
    }
    return menuItemRows += `<tr style="height:100%;" ><td id="td_${targetId}_menu_spacer_bottom" ></td></tr>`;
}
