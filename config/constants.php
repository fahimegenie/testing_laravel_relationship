<?php

define('SUPER_ADMIN_ROLE_ID', 1);
define('HAPITY_USER_ROLE_ID', 2);
define('CONTACTUS_SEND_TO_EMAIL', ["masteruser@hapity.com","gohapity@gmail.com"]);
define('MAIL_FROM_ADDRESS','do-not-reply@hapity.com');
define('MAIL_FROM_NAME', 'Hapity');


switch (env('APP_URL')) {
	case 'http://localhost' || 'http://dev.hapity.local':
		define('STORAGE_PATH', storage_path('user_media'));
		break;
	case 'https://www.hapity.com':
		define('STORAGE_PATH', '');
		break;
	default:
		# code...
		break;
}