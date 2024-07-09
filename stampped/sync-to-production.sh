BRANCH_NAME=$(git symbolic-ref --short HEAD)

if [ "$BRANCH_NAME" = "test" ]; then
   DEST_DIR="api_test_stamped_app"
   REMOTE_USERNAME="master_textqnypaa"
   SSHHOST="stamped.app"
else
   echo "Unknown branch name: $BRANCH_NAME"
   exit 1
fi

echo "CURRENT_BRANCH=$BRANCH_NAME"
echo "REMOTE_USERNAME=$REMOTE_USERNAME"
echo "SSHHOST=$SSHHOST"

echo "rsync -av -e ssh --delete --omit-dir-times --exclude-from='.rsyncignore' /first/PhpstormProjects/api.stamped.app/ $REMOTE_USERNAME@$SSHHOST:/home/master/applications/$DEST_DIR/public_html"

rsync -av -e ssh --delete --omit-dir-times --exclude-from='.rsyncignore' /first/PhpstormProjects/api.stamped.app/ $REMOTE_USERNAME@$SSHHOST:/home/master/applications/$DEST_DIR/public_html
