<?php
require_once('../includes/config.inc.php');
set_time_limit(20);

// Подключение библиотеки функций ядра
foreach (glob("../includes/core/*.php") as $filename){
    include $filename;
} 
$db = MysqliDb::getInstance();

// Удалить самые старые записи корзин
$db->where("event_time < (NOW() - INTERVAL 30 DAY)");
$db->delete('md_cart');



// Чистка устаревших записей, анонимные логины без действий.
// Слияние корзин, лайков, при регистрации\авторизации (должны появится токены с общим родителем, и пользователи без токенов)

// Удалить токены подтверждения у пользователей, с истекшим сроком действия, и подтвержденным email
// Проверка наличия в каталогах htaccess с запретом доступа




?>
