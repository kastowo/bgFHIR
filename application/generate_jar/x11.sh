if [ -z $DISPLAY ]
then
  cd
  Xvfb :100.0 -screen 0 1280x1024x24 &
  export DISPLAY=:100.0;
fi
