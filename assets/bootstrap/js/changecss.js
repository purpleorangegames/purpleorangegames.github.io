function setCookie(cname,cvalue,exdays){var d=new Date();d.setTime(d.getTime()+(exdays*24*60*60*1000));var expires="expires="+d.toUTCString();document.cookie=cname+"="+ cvalue+"; "+ expires+"; path=/; domain=.purpleorangegames.com;";}
function getCookie(cname){var name=cname+"=";var ca=document.cookie.split(';');console.log(ca);for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' ')c=c.substring(1);if(c.indexOf(name)==0)return c.substring(name.length,c.length);}
return"";}
function checkStyle()
{var r=getCookie('pogstylecookie');console.log('style ',r);if(r=='light')
{setStyleLight();}
else
{setStyleDark();}}
function setStyleDark()
{$(function(){$('[data-toggle="tooltip"]').tooltip()})
changeCSS('bootstrap.min.css',false);changeCSS('starlife.css',false);setCookie('pogstylecookie','dark',7);}
function setStyleLight()
{$(function(){$('[data-toggle="tooltip"]').tooltip('destroy')})
changeCSS('bootstrap.min.css',true);changeCSS('starlife.css',true);setCookie('pogstylecookie','light',7);}
function changeCSS(cssIndex,value){for(var i in document.styleSheets){if(document.styleSheets[i].href&&document.styleSheets[i].href.indexOf(cssIndex)>0){document.styleSheets[i].disabled=value;return document.styleSheets[i];break;}}
return"error";}