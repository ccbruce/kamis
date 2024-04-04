#LD_LIBRARY_PATH=/usr/lib
#MONO_PATH=/var/www/onlyoffice/WebStudio/bin/
#MONO_IOMAP=all
#MONO_ASPNET_WEBCONFIG_CACHESIZE=2000
#MONO_THREADS_PER_CPU=2000
#MONO_GC_PARAMS=nursery-size=128m,soft-heap-limit=512m,bridge-implementation=tarjan
#MONO_LOG_LEVEL=error
#MONO_THREADS_SUSPEND=preemptive

#cd /var/www/onlyoffice/WebStudio/bin/
#fastcgi-mono-server4 /appconfigdir=/var/www/onlyoffice/WebStudio/conf /socket=tcp:127.0.0.1:9000
#/usr/bin/hyperfastcgi4 /config=/etc/hyperfastcgi/onlyofficeApiSystem /logfile=/var/log/onlyoffice/onlyofficeApiSystem.log /loglevels=Error

MONO_IOMAP=all
MONO_PATH=/var/www/onlyoffice/Services/TeamLabSvc/
/usr/bin/mono-service -d:/var/www/onlyoffice/Services/TeamLabSvc -l:/tmp/onlyofficeBackup /var/www/onlyoffice/Services/TeamLabSvc/TeamLabSvc.exe --service "ASC.Data.Backup.Service.BackupServiceLauncher,ASC.Data.Backup" --log Backup

