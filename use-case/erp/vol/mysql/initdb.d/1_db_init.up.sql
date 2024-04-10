
CREATE DATABASE IF NOT EXISTS onlyoffice_cs CHARACTER SET "utf8" COLLATE "utf8_general_ci";
CREATE DATABASE IF NOT EXISTS onlyoffice_mailserver CHARACTER SET "utf8" COLLATE "utf8_general_ci";

--  ALTER USER 'root'@'%' IDENTIFIED BY 'mithra35';
CREATE USER IF NOT EXISTS 'onlyoffice_user'@'%' IDENTIFIED BY 'mithra35';
CREATE USER IF NOT EXISTS 'mail_admin'@'%' IDENTIFIED BY 'mithra35';
CREATE USER IF NOT EXISTS 'ccbruce'@'%' IDENTIFIED BY 'mithra35';

-- GRANT ALL PRIVILEGES ON *.* TO 'ccbrue'@'%';
-- GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON *.* TO 'onlyoffice_user'@'%';
GRANT ALL PRIVILEGES ON *.* TO 'mail_admin'@'%';

FLUSH PRIVILEGES;
