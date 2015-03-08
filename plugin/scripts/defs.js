
/*
 * Background helper script for GitPaid.me - a Chrome extension for GitHub which 
 * helps crowdsource solutions to repository issues 
 *
 * @author Vuk Petrovic
 * Built for HackNY with love! 
*/

function splice(source, str, idx) {
	if(idx > 0) {
		return source.substring(0, idx) + str + source.substring(idx, source.length);
	} else {
		return source + str;
	}
}