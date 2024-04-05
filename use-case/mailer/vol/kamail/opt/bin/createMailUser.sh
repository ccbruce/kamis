$MAIL_USER=ccbruce
$MAIL_PASS=mithra35
echo "${MAIL_USER}|$(doveadm pw -s SHA512-CRYPT -u ${MAIL_USER} -p ${MAIL_PASS})" >> /tmp/docker-mailserver/postfix-accounts.cf