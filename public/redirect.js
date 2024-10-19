// on document ready, but with vanilla js
console.log("redirect.js loaded");

document.addEventListener('DOMContentLoaded', function() {
    // Check if we are on the add or edit screen for the 'scrollie' post type
    if (pagenow === 'post' && (typenow === 'scrollie')) {
        // Redirect to the custom admin page
		window.location.href = 'admin.php?page=maestro-scrollie-template';
	}
});
