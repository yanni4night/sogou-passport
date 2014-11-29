INTERFACE="app.js"

if [ "x$1" == 'xstart' ];then
    forever start $INTERFACE
elif [ "x$1" == 'xdebug' ];then
    forever start -c 'supervisor' $INTERFACE
elif [ "x$1" == 'xstop' ];then
    forever stop $INTERFACE
fi