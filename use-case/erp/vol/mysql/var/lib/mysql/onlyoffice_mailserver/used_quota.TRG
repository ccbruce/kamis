TYPE=TRIGGERS
triggers='CREATE DEFINER=`root`@`%` TRIGGER `after_insert_used_quota` BEFORE INSERT ON `used_quota` FOR EACH ROW\n    BEGIN\n        SET NEW.domain = SUBSTRING_INDEX(NEW.username, \'@\', -1);\n    END'
sql_modes=1411383296
definers='root@%'
client_cs_names='latin1'
connection_cl_names='latin1_swedish_ci'
db_cl_names='utf8mb3_general_ci'
created=1712064114589683
