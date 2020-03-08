aws s3 rm --recursive s3://aumt
aws s3 sync build/ s3://aumt

# reupload /static with the same files but uploaded with the gzip content encoding
aws s3 cp \
    --region 'ap-southeast-2' \
    --recursive \
    --content-encoding 'gzip' \
    build/static \
    s3://aumt/static